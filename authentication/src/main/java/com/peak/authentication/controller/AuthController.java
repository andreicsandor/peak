package com.peak.authentication.controller;

import com.peak.authentication.security.JwtTokenUtil;
import com.peak.authentication.service.AuthService;
import com.peak.users.dto.NewPersonDTO;
import com.peak.users.dto.PersonDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;
    private final RestTemplate restTemplate;

    @Autowired
    public AuthController(AuthService authService, JwtTokenUtil jwtTokenUtil, @Qualifier("restTemplateAuth") RestTemplate restTemplate) {
        this.authService = authService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody NewPersonDTO newPersonDTO, HttpServletResponse response) {
        try {
            HttpEntity<NewPersonDTO> request = new HttpEntity<>(newPersonDTO);
            ResponseEntity<PersonDTO> personResponse = restTemplate.exchange(
                    "http://localhost:8080/api/users/create-person",
                    HttpMethod.POST,
                    request,
                    PersonDTO.class
            );

            if (personResponse.getStatusCode() == HttpStatus.CREATED) {
                PersonDTO personDTO = personResponse.getBody();
                final String jwtToken = jwtTokenUtil.generateToken(personDTO);

                String userToken = personDTO.getPersonId() + ":" + ":" + personDTO.getUsername();
                String encodedToken = Base64.getEncoder().encodeToString(userToken.getBytes());

                Cookie cookie = new Cookie("userToken", encodedToken);
                cookie.setHttpOnly(false);
                cookie.setPath("/");
                response.addCookie(cookie);

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("jwtToken", "Bearer " + jwtToken);
                responseBody.put("person", personDTO);

                return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PersonDTO personDTO, HttpSession session, HttpServletResponse response) {
        try {
            PersonDTO authenticatedPerson = authService.authenticatePerson(personDTO.getUsername(), personDTO.getPassword(), session);
            final String jwtToken = jwtTokenUtil.generateToken(authenticatedPerson);

            String userToken = authenticatedPerson.getPersonId() + ":" + ":" + authenticatedPerson.getUsername();
            String encodedToken = Base64.getEncoder().encodeToString(userToken.getBytes());

            Cookie cookie = new Cookie("userToken", encodedToken);
            cookie.setHttpOnly(false);
            cookie.setPath("/");
            response.addCookie(cookie);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("jwtToken", "Bearer " + jwtToken);

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
}
