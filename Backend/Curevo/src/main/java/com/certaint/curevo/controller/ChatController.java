package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
// import com.certaint.curevo.dto.ChatRequest; // No longer strictly needed for this endpoint's direct map handling
import com.certaint.curevo.service.ChatService;
import jakarta.validation.Valid; // Keep if you plan to validate map content, though it's trickier
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // Import for Map type

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor // Lombok: auto-injects dependencies
public class ChatController {

    private final ChatService chatService;


    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleChatQuery(
            @RequestBody Map<String, Object> requestPayload) { // Changed request type to Map

        // Basic validation: ensure 'message' field is present
        if (requestPayload == null || !requestPayload.containsKey("message") ||
                ((String) requestPayload.get("message")).trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Message field is required in the request payload.", null));
        }

        try {
            // Pass the entire payload to the ChatService for processing
            Map<String, Object> botResponse = chatService.processUserQuery(requestPayload);

            // Wrap the structured botResponse in ApiResponse
            return ResponseEntity.ok(new ApiResponse<>(true, "Query processed successfully", botResponse));

        } catch (Exception ex) {
            // Log the exception for debugging
            System.err.println("Error processing chat query: " + ex.getMessage());
            ex.printStackTrace(); // Good for development, remove/replace with proper logging in production

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected internal server error occurred", null));
        }
    }

}