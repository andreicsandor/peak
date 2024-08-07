package com.peak.users.service.impl;

import com.peak.users.dto.NewPersonDTO;
import com.peak.users.dto.PersonDTO;
import com.peak.users.dto.PersonPatchDTO;
import com.peak.users.mapper.PersonMapper;
import com.peak.users.model.Person;
import com.peak.users.repository.PersonDAO;
import com.peak.users.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PersonServiceImpl implements PersonService {

    @Autowired
    private PersonDAO personDAO;
    @Autowired
    private PersonMapper personMapper;
    @Autowired
    @Qualifier("restTemplateUsers")
    private RestTemplate restTemplate;

//    private String devicesServiceUrl = "http://localhost:8080";

    @Override
    public PersonDTO createPerson(NewPersonDTO newPersonDTO) {
        String username = newPersonDTO.getUsername();
        String password = newPersonDTO.getPassword();

        Person person = new Person();
        person.setUsername(username);
        person.setPassword(password);

        person = personDAO.save(person);

        if(person == null) {
            return null;
        }

        PersonDTO personDTO = personMapper.convertDTO(person);
        return personDTO;
    }

    @Override
    public Boolean updatePerson(PersonPatchDTO personPatchDTO) {
        Long personId = Long.valueOf(personPatchDTO.getId());
        String username = personPatchDTO.getUsername();
        String password = personPatchDTO.getPassword();

        Optional<Person> personEntity = personDAO.findById(personId);

        if (!personEntity.isPresent()) {
            return false;
        }

        Person person = personEntity.get();
        person.setUsername(username);
        person.setPassword(password);

        personDAO.save(person);

        return true;
    }

    @Override
    public Boolean deletePerson(Long id) {
        Optional<Person> personEntity = personDAO.findById(id);

        if (!personEntity.isPresent()) {
            return false;
        }

//        restTemplate.delete(devicesServiceUrl + "/delete-devices/person/" + id);

        Person person = personEntity.get();
        personDAO.delete(person);

        return true;
    }

    @Override
    public List<PersonDTO> findPersons() {
        List<Person> persons = personDAO.findAll();
        return personMapper.convertDTOs(persons);
    }

    @Override
    public List<PersonDTO> findPersonById(Long id) {
        Optional<Person> personEntity = personDAO.findById(id);

        if (!personEntity.isPresent()) {
            return Collections.emptyList();
        }

        Person person = personEntity.get();
        List<PersonDTO> personsDTOs = new ArrayList<>();
        personsDTOs.add(personMapper.convertDTO(person));

        return personsDTOs;
    }

    @Override
    public List<PersonDTO> findPersonByUsername(String username) {
        List<Person> persons = personDAO.findByUsername(username);
        return personMapper.convertDTOs(persons);
    }
}
