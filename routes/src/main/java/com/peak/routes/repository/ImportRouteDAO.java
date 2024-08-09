package com.peak.routes.repository;

import com.peak.routes.model.ImportRoute;
import com.peak.routes.model.Route;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImportRouteDAO extends CrudRepository<ImportRoute, Long> {
    Iterable<ImportRoute> findAll();
    Optional<ImportRoute> findById(Long id);
    List<ImportRoute> findByPersonId(Long personId);
}
