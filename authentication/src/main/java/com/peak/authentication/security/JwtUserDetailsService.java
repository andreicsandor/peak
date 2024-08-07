package com.peak.authentication.security;

import com.peak.users.dto.PersonDTO;
import com.peak.users.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    PersonService personService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<PersonDTO> personDTOs = personService.findPersonByUsername(username);

        if (!personDTOs.isEmpty()) {
            PersonDTO person = personDTOs.get(0);
            User user = new User(person.getUsername(), "", new ArrayList<>());
            return user;
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
