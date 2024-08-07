package com.peak.routes.service.impl;

import com.peak.routes.dto.ImportRouteDTO;
import com.peak.routes.mapper.ImportRouteMapper;
import com.peak.routes.model.ImportRoute;
import com.peak.routes.repository.ImportRouteDAO;
import com.peak.routes.service.ImportRouteService;
import io.jenetics.jpx.GPX;
import io.jenetics.jpx.Track;
import io.jenetics.jpx.TrackSegment;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImportRouteServiceImpl implements ImportRouteService {

    @Autowired
    private ImportRouteDAO importRouteDAO;

    @Autowired
    private ImportRouteMapper importRouteMapper;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public List<ImportRouteDTO> processImportRoute(MultipartFile file, Long routeId) {
        try {
            GPX gpx = GPX.read(file.getInputStream());
            List<ImportRouteDTO> importRouteDTOs = new ArrayList<>();

            for (Track track : gpx.tracks().collect(Collectors.toList())) {
                LineString lineString = geometryFactory.createLineString(
                        track.segments().flatMap(TrackSegment::points)
                                .map(point -> new Coordinate(point.getLongitude().doubleValue(), point.getLatitude().doubleValue()))
                                .toArray(Coordinate[]::new)
                );

                lineString.setSRID(4326);

                ImportRouteDTO importRouteDTO = new ImportRouteDTO();
                importRouteDTO.setWaypoints(lineString.toText());
                importRouteDTO.setGeoCoordinates(lineString.toText());
                importRouteDTO.setName("Imported GPX Route");
                importRouteDTO.setCreatedTime(LocalDateTime.now());
                importRouteDTO.setRouteId(routeId);

                importRouteDTOs.add(importRouteDTO);
            }

            return importRouteDTOs;
        } catch (IOException e) {
            throw new RuntimeException("Error processing GPX file", e);
        }
    }

    @Override
    public ImportRouteDTO createImportRoute(ImportRouteDTO importRouteDTO) {
        ImportRoute importRoute = importRouteMapper.toImportRouteObject(importRouteDTO);
        importRoute = importRouteDAO.save(importRoute);
        return importRouteMapper.toImportRouteDTO(importRoute);
    }

    @Override
    public List<ImportRouteDTO> findImportRoutes() {
        List<ImportRoute> importRoutes = (List<ImportRoute>) importRouteDAO.findAll();
        return importRouteMapper.toImportRouteDTOs(importRoutes);
    }

    @Override
    public List<ImportRouteDTO> findImportRouteById(Long id) {
        Optional<ImportRoute> importRouteEntity = importRouteDAO.findById(id);

        if (!importRouteEntity.isPresent()) {
            return Collections.emptyList();
        }

        ImportRoute route = importRouteEntity.get();
        List<ImportRouteDTO> importRouteDTOs = new ArrayList<>();
        importRouteDTOs.add(importRouteMapper.toImportRouteDTO(route));

        return importRouteDTOs;
    }

    @Override
    public Boolean deleteImportRoute(Long id) {
        Optional<ImportRoute> importRouteEntity = importRouteDAO.findById(id);

        if (!importRouteEntity.isPresent()) {
            return false;
        }

        ImportRoute device = importRouteEntity.get();
        importRouteDAO.delete(device);

        return true;
    }
}
