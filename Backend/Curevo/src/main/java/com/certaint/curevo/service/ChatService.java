package com.certaint.curevo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.commons.text.similarity.LevenshteinDistance;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@RequiredArgsConstructor
@Service
public class ChatService {


    private final DeepSeekService deepSeekService;

    // Define more comprehensive health-related terms
    private static final List<String> HEALTH_KEYWORDS = List.of(
            "doctor", "symptom", "pain", "fever", "headache", "nausea", "cough", "vomiting",
            "appointment", "medicine", "sick", "health", "clinic", "injury", "infection", "rash"
    );

    public String processUserQuery(String userQuery) {
        if (!isHealthRelated(userQuery)) {
            return "I'm only able to assist with health-related questions. Please rephrase or ask about a health issue.";
        }

        return deepSeekService.getHealthResponse(userQuery);
    }



    private boolean isHealthRelated(String query) {
        String lowerQuery = query.toLowerCase(Locale.ROOT);
        LevenshteinDistance distance = LevenshteinDistance.getDefaultInstance();

        return HEALTH_KEYWORDS.stream().anyMatch(keyword ->
                Arrays.stream(lowerQuery.split("\\s+"))
                        .anyMatch(word -> distance.apply(word, keyword) <= 2) // Allow small typos
        );
    }

}
