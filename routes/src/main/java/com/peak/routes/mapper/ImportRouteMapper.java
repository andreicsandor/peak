package com.peak.routes.mapper;

import com.peak.routes.dto.ImportRouteDTO;
import com.peak.routes.model.ImportRoute;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.WKTWriter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ImportRouteMapper {

    private final WKTWriter wktWriter = new WKTWriter();
    private final WKTReader wktReader = new WKTReader(new GeometryFactory());

    public ImportRouteDTO toImportRouteDTO(ImportRoute importRoute) {
        ImportRouteDTO importRouteDTO = new ImportRouteDTO();
        importRouteDTO.setId(importRoute.getId());
        importRouteDTO.setName(importRoute.getName());
        if (importRoute.getWaypoints() != null) {
            importRouteDTO.setWaypoints(wktWriter.write(importRoute.getWaypoints()));
        }
        if (importRoute.getGeoCoordinates() != null) {
            importRouteDTO.setGeoCoordinates(wktWriter.write(importRoute.getGeoCoordinates()));
        }
        importRouteDTO.setCreatedTime(importRoute.getCreatedTime());
        importRouteDTO.setPersonId(importRoute.getPersonId());
        importRouteDTO.setRouteId(importRoute.getRouteId());
        return importRouteDTO;
    }

    public List<ImportRouteDTO> toImportRouteDTOs(List<ImportRoute> importRoutes) {
        List<ImportRouteDTO> importRouteDTOS = new ArrayList<>();
        for (ImportRoute importRoute : importRoutes) {
            importRouteDTOS.add(toImportRouteDTO(importRoute));
        }
        return importRouteDTOS;
    }

    public ImportRoute toImportRouteObject(ImportRouteDTO importRouteDTO) {
        ImportRoute importRoute = new ImportRoute();
        importRoute.setId(importRouteDTO.getId());
        importRoute.setName(importRouteDTO.getName());
        if (importRouteDTO.getWaypoints() != null && !importRouteDTO.getWaypoints().isEmpty()) {
            try {
                LineString lineString = (LineString) wktReader.read(importRouteDTO.getWaypoints());
                lineString.setSRID(4326);
                importRoute.setWaypoints(lineString);
            } catch (ParseException e) {
                throw new RuntimeException("Error parsing waypoints WKT", e);
            }
        }
        if (importRouteDTO.getGeoCoordinates() != null && !importRouteDTO.getGeoCoordinates().isEmpty()) {
            try {
                LineString lineString = (LineString) wktReader.read(importRouteDTO.getGeoCoordinates());
                lineString.setSRID(4326); // Ensure SRID is set to 4326
                importRoute.setGeoCoordinates(lineString);
            } catch (ParseException e) {
                throw new RuntimeException("Error parsing geoCoordinates WKT", e);
            }
        }
        importRoute.setCreatedTime(importRouteDTO.getCreatedTime());
        importRoute.setPersonId(importRouteDTO.getPersonId());
        importRoute.setRouteId(importRouteDTO.getRouteId());
        return importRoute;
    }
}
