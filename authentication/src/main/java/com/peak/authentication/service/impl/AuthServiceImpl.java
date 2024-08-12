package com.peak.authentication.service.impl;

import com.peak.authentication.service.AuthService;
import com.peak.users.dto.PersonDTO;
import com.peak.users.mapper.PersonMapper;
import com.peak.users.model.Person;
import com.peak.users.repository.PersonDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private PersonDAO personDAO;

    @Autowired
    private PersonMapper personMapper;

    @Override
    public PersonDTO authenticatePerson(String username, String password, HttpSession session) {
        List<Person> personList = personDAO.findByUsername(username);

        if (!personList.isEmpty()) {
            Person person = personList.get(0);

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            if (passwordEncoder.matches(password, person.getPassword())) {
                session.setAttribute("loggedInUser", person);
                return personMapper.convertDTO(person);
            }
        }
        throw new IllegalArgumentException("Invalid username or password");
    }

    @Override
    public void logoutPerson(HttpSession session) {
        session.invalidate();
    }

    @Override
    public boolean isPersonLoggedIn(HttpSession session) {
        return session.getAttribute("loggedInUser") != null;
    }
}
