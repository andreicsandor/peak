package com.peak.routes.repository;

import com.peak.routes.model.Route;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteDAO extends CrudRepository<Route, Long> {
    Iterable<Route> findAll();
    Optional<Route> findById(Long id);
    List<Route> findByName(String name);
}
