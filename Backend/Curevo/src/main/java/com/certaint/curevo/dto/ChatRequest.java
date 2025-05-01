package com.certaint.curevo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ChatRequest {
    @NotEmpty private List<Message> messages;

    @Getter @Setter
    public static class Message {
        @NotBlank private String role;
        @NotBlank private String content;
    }
}