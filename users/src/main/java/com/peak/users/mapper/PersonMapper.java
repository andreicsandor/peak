package com.peak.users.mapper;

import com.peak.users.dto.PersonDTO;
import com.peak.users.dto.NewPersonDTO;
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
        personDTO.setFirstName(person.getFirstName());
        personDTO.setLastName(person.getLastName());
        personDTO.setBirthdate(person.getBirthdate());
        personDTO.setGender(person.getGender());
        personDTO.setWeight(person.getWeight());
        personDTO.setHeight(person.getHeight());
        personDTO.setWeeklyWorkouts(person.getWeeklyWorkouts());

        return personDTO;
    }

    public Person convertNewPersonDTOToEntity(NewPersonDTO newPersonDTO) {
        Person person = new Person();
        person.setUsername(newPersonDTO.getUsername());
        person.setPassword(newPersonDTO.getPassword());
        person.setFirstName(newPersonDTO.getFirstName());
        person.setLastName(newPersonDTO.getLastName());
        person.setBirthdate(newPersonDTO.getBirthdate());
        person.setGender(newPersonDTO.getGender());
        person.setWeight(newPersonDTO.getWeight());
        person.setHeight(newPersonDTO.getHeight());
        person.setWeeklyWorkouts(newPersonDTO.getWeeklyWorkouts());

        return person;
    }

    public List<PersonDTO> convertDTOs(List<Person> persons) {
        List<PersonDTO> personDTOs = new ArrayList<>();

        for (Person person : persons) {
            personDTOs.add(convertDTO(person));
        }

        return personDTOs;
    }
}
