package com.peak.routes.service;

import com.peak.routes.dto.ImportRouteDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImportRouteService {
    List<ImportRouteDTO> processImportRoute(MultipartFile file, Long routeId);
    ImportRouteDTO createImportRoute(ImportRouteDTO importRouteDTO);
    List<ImportRouteDTO> findImportRoutes();
    List<ImportRouteDTO> findImportRouteById(Long id);
    Boolean deleteImportRoute(Long id);
}
