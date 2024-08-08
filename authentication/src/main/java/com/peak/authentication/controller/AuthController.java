package com.peak.authentication.controller;

import com.peak.authentication.security.JwtTokenUtil;
import com.peak.authentication.service.AuthService;
import com.peak.users.dto.PersonDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    private AuthService authService;
    private JwtTokenUtil jwtTokenUtil;

    public AuthController(AuthService authService, JwtTokenUtil jwtTokenUtil) {
        this.authService = authService;
        this.jwtTokenUtil = jwtTokenUtil;
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
