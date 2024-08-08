package com.peak.authentication.controller;

import com.peak.assistant.dto.AssistantRequestDTO;
import com.peak.assistant.dto.AssistantResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/auth/assistant")
public class AssistantAuthController {

    @Autowired
    @Qualifier("restTemplateAuth")
    private final RestTemplate restTemplate;

    public AssistantAuthController(@Qualifier("restTemplateAuth") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/get-tips")
    public ResponseEntity<AssistantResponseDTO> getRecommendation(@RequestBody AssistantRequestDTO request) {
        HttpEntity<AssistantRequestDTO> httpEntity = new HttpEntity<>(request);
        String url = "http://localhost:8084/api/assistant/get-tips";
        return restTemplate.exchange(url, HttpMethod.POST, httpEntity, AssistantResponseDTO.class);
    }
}
