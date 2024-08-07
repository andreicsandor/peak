package com.peak.users.service;

import com.peak.users.dto.NewPersonDTO;
import com.peak.users.dto.PersonDTO;
import com.peak.users.dto.PersonPatchDTO;

import java.util.List;

public interface PersonService {
    PersonDTO createPerson(NewPersonDTO newPersonDTO);
    Boolean updatePerson(PersonPatchDTO personPatchDTO);
    Boolean deletePerson(Long id);
    List<PersonDTO> findPersons();
    List<PersonDTO> findPersonById(Long id);
    List<PersonDTO> findPersonByUsername(String username);
}
