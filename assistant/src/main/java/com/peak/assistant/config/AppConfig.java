package com.peak.assistant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Configuration
@Component("assistantAppConfig")
public class AppConfig {
    @Bean(name = "restTemplateAssistant")
    public RestTemplate restTemplateAssistant() {
        return new RestTemplate();
    }

}
