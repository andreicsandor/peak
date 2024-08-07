package com.peak.users.mapper;

import com.peak.users.dto.PersonDTO;
import com.peak.users.model.Person;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PersonMapper {
    public PersonDTO convertDTO(Person person) {
        PersonDTO personDTO = new PersonDTO();
        personDTO.setPersonId(String.valueOf(person.getId()));
        personDTO.setUsername(person.getUsername());
        personDTO.setPassword(person.getPassword());

        return personDTO;
    }

    public List<PersonDTO> convertDTOs(List<Person> persons) {
        List<PersonDTO> personDTOs = new ArrayList<>();

        for (Person person : persons) {
            personDTOs.add(convertDTO(person));
        }

        return personDTOs;
    }
}
