package com.peak.authentication.service;

import com.peak.users.dto.PersonDTO;
import jakarta.servlet.http.HttpSession;

public interface AuthService {
    PersonDTO authenticatePerson(String username, String password, HttpSession session);

    void logoutPerson(HttpSession session);

    boolean isPersonLoggedIn(HttpSession session);
}

