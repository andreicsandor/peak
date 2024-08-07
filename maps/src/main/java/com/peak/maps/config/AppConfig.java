package com.peak.maps.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Configuration
@Component("mapsAppConfig")
public class AppConfig {

    @Bean(name = "restTemplateMaps")
    public RestTemplate restTemplateMaps() {
        return new RestTemplate();
    }
}
