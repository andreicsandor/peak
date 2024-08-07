package com.peak.routes.repository;

import com.peak.routes.model.ImportRoute;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImportRouteDAO extends CrudRepository<ImportRoute, Long> {
    Iterable<ImportRoute> findAll();
    Optional<ImportRoute> findById(Long id);
}
