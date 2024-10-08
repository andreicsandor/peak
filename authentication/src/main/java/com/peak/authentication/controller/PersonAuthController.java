package com.peak.authentication.controller;

import com.peak.users.dto.NewPersonDTO;
import com.peak.users.dto.PersonDTO;
import com.peak.users.dto.PersonPatchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RequestMapping("/auth/users")
@RestController
public class PersonAuthController {

    @Autowired
    @Qualifier("restTemplateAuth")
    private final RestTemplate restTemplate;

    public PersonAuthController(@Qualifier("restTemplateAuth") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/get-persons")
    @ResponseBody
    public List<PersonDTO> getPersons(
            @RequestParam(value = "personId", required = false) Long personId,
            @RequestParam(value = "username", required = false) String username) {
        StringBuilder urlBuilder = new StringBuilder("http://localhost:8080/api/users/persons");
        
        if (personId != null || username != null) {
            urlBuilder.append("?");
            if (personId != null) {
                urlBuilder.append("personId=").append(personId);
            }
            if (username != null) {
                if (personId != null) {
                    urlBuilder.append("&");
                }
                urlBuilder.append("username=").append(username);
            }
        }

        PersonDTO[] persons = restTemplate.exchange(urlBuilder.toString(), HttpMethod.GET, null, PersonDTO[].class).getBody();
        return List.of(persons);
    }

    @PostMapping("/save-person")
    public ResponseEntity<?> createPerson(@RequestBody NewPersonDTO newPersonDTO) {
        HttpEntity<NewPersonDTO> request = new HttpEntity<>(newPersonDTO);
        return restTemplate.exchange("http://localhost:8080/api/users/create-person", HttpMethod.POST, request, PersonDTO.class);
    }

    @PutMapping("/update-person")
    public ResponseEntity<?> updatePerson(@RequestBody PersonPatchDTO personPatchDTO) {
        HttpEntity<PersonPatchDTO> request = new HttpEntity<>(personPatchDTO);
        return restTemplate.exchange("http://localhost:8080/api/users/update-person", HttpMethod.PUT, request, String.class);
    }

    @DeleteMapping("/delete-person/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        return restTemplate.exchange("http://localhost:8080/api/users/delete-person/{id}", HttpMethod.DELETE, null, String.class, id);
    }
}
