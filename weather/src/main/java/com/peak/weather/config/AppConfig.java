package com.peak.weather.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Configuration
@Component("weatherAppConfig")
public class AppConfig {
    @Bean(name = "restTemplateWeather")
    public RestTemplate restTemplateWeather() {
        return new RestTemplate();
    }

}

