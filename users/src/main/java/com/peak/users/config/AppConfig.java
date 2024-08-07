package com.peak.users.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Configuration
@Component("usersAppConfig")
public class AppConfig {

    @Bean(name = "restTemplateUsers")
    public RestTemplate restTemplateUsers() {
        return new RestTemplate();
    }
}
