package com.peak.authentication.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Configuration
@Component("authAppConfig")
public class AppConfig {
    @Bean(name = "restTemplateAuth")
    public RestTemplate restTemplateAuth() {
        return new RestTemplate();
    }

}
