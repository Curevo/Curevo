package com.certaint.curevo.controller;


import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.ChatRequest;
import com.certaint.curevo.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor // Lombok: auto-injects dependencies
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> handleChatQuery(@Valid @RequestBody ChatRequest request) {
        try {
            String userQuery = request.getMessages().stream()
                    .filter(msg -> "user".equalsIgnoreCase(msg.getRole()))
                    .findFirst()
                    .map(ChatRequest.Message::getContent)
                    .orElseThrow(() -> new IllegalArgumentException("No user message found"));

            String response = chatService.processUserQuery(userQuery);
            return ResponseEntity.ok(new ApiResponse<>(true, "Query processed successfully", response));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred", null));
        }
    }

}