package com.peak.users.repository;

import com.peak.users.model.Person;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonDAO extends CrudRepository<Person, Long> {
    List<Person> findAll();
    Optional<Person> findById(Long id);
    List<Person> findByUsername(String username);
}
