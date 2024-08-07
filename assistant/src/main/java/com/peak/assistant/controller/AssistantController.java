package com.peak.assistant.controller;

import com.peak.assistant.dto.AssistantRequestDTO;
import com.peak.assistant.dto.AssistantResponseDTO;
import com.peak.assistant.service.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    @Autowired
    private AssistantService assistantService;

    @PostMapping("/get-tips")
    public ResponseEntity<AssistantResponseDTO> getRecommendation(@RequestBody AssistantRequestDTO request) {
        AssistantResponseDTO response = assistantService.getRecommendation(request);
        return ResponseEntity.ok(response);
    }
}
