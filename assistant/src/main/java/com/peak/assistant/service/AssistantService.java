package com.peak.assistant.service;

import com.peak.assistant.dto.AssistantRequestDTO;
import com.peak.assistant.dto.AssistantResponseDTO;

public interface AssistantService {
    AssistantResponseDTO getRecommendation(AssistantRequestDTO request);
}
