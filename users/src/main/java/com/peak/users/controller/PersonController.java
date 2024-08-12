package com.peak.users.controller;

import com.peak.users.dto.NewPersonDTO;
import com.peak.users.dto.PersonDTO;
import com.peak.users.dto.PersonPatchDTO;
import com.peak.users.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/persons")
    public List<PersonDTO> getPersons(@RequestParam(value = "personId", required = false) Long id,
                                      @RequestParam(value = "username", required = false) String username) {
        List<PersonDTO> persons;

        System.out.println(id);

        if (id != null) {
            persons = personService.findPersonById(id);
        } else if (username != null) {
            persons = personService.findPersonByUsername(username);
        } else {
            persons = personService.findPersons();
        }

        if (persons.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No persons found");
        }

        return persons;
    }

    @PostMapping("/create-person")
    public ResponseEntity<?> createPerson(@RequestBody NewPersonDTO newPersonDTO) {
        PersonDTO personDTO = personService.createPerson(newPersonDTO);

        if (personDTO != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(personDTO);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to create person.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update-person")
    public ResponseEntity<?> updatePerson(@RequestBody PersonPatchDTO personPatchDTO) {
        Boolean result = personService.updatePerson(personPatchDTO);

        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Person updated successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update person.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/delete-person/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        Boolean result = personService.deletePerson(id);

        if (result) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Person deleted successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete person.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
