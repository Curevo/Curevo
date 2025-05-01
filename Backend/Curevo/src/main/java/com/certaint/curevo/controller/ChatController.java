package com.certaint.curevo.controller;


import com.certaint.curevo.dto.ChatRequest;
import com.certaint.curevo.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor // Lombok: auto-injects dependencies
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public String handleChatQuery(@Valid @RequestBody ChatRequest request) {
        // Extract the first user message
        String userQuery = request.getMessages().stream()
                .filter(msg -> "user".equals(msg.getRole()))
                .findFirst()
                .map(ChatRequest.Message::getContent)
                .orElseThrow(() -> new IllegalArgumentException("No user message found"));

        return chatService.processUserQuery(userQuery);
    }
}