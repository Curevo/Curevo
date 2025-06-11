package com.certaint.curevo.service;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.models.*;
import org.springframework.stereotype.Service;

import java.io.IOException; // Keep if other parts of the code use it, otherwise can remove
import java.util.*;
import java.util.stream.Collectors;
// import com.certaint.curevo.enums.Specialization; // Not needed here anymore if extractSpecializationFromHealthQuery is removed

@Service
public class DeepSeekService {

    private final ChatCompletionsClient chatCompletionsClient;

    private static final String DEEPSEEK_V3_MODEL = "deepseek/DeepSeek-V3-0324";
    private static final String SYSTEM_PROMPT =
            "You are a healthcare assistant. Only respond to health-related queries. Be brief, give mild advice, and suggest a relevant doctor specialization (e.g., a dermatologist for skin issues).";

    public DeepSeekService(ChatCompletionsClient chatCompletionsClient) {
        this.chatCompletionsClient = chatCompletionsClient;
        System.out.println("DeepSeekService initialized successfully with ChatCompletionsClient.");
    }


    public String getHealthResponse(String userQuery) {
        System.out.println("DeepSeekService: Processing general health response for query: '" + userQuery + "'");

        List<ChatRequestMessage> messagesToSend = new ArrayList<>();
        messagesToSend.add(new ChatRequestSystemMessage(SYSTEM_PROMPT));
        messagesToSend.add(new ChatRequestUserMessage(userQuery));

        String assistantReply = callDeepSeekAPI(messagesToSend);
        System.out.println("DeepSeekService: Received general health assistant reply.");

        return assistantReply;
    }

    /**
     * Summarizes a given long response using the DeepSeek AI.
     *
     * @param longResponse The text to be summarized.
     * @return A summarized version of the input text.
     */
    public String summarizeResponse(String longResponse) {
        System.out.println("DeepSeekService: Requesting summary for a response.");
        List<ChatRequestMessage> summaryMessages = Arrays.asList(
                new ChatRequestSystemMessage("You are a summarizer for healthcare responses. Be short and clear."),
                new ChatRequestUserMessage("Summarize this healthcare response in 3 short sentences:\n\n" + longResponse)
        );

        return callDeepSeekAPI(summaryMessages);
    }

    /**
     * Makes a call to the DeepSeek AI API with the given list of chat messages.
     * Includes a retry mechanism for robustness.
     *
     * @param messages A list of ChatRequestMessage objects to send to the AI.
     * @return The content of the AI's response message, or an error message if the call fails.
     */
    private String callDeepSeekAPI(List<ChatRequestMessage> messages) {
        System.out.println("DeepSeekService: Calling DeepSeek API with " + messages.size() + " messages.");
        messages.forEach(msg -> {
            if (msg instanceof ChatRequestUserMessage) {
                System.out.println("  DeepSeek API Message -> Role: " + msg.getRole() + ", Content: '" + ((ChatRequestUserMessage) msg).getContent() + "'");
            } else if (msg instanceof ChatRequestSystemMessage) {
                System.out.println("  DeepSeek API Message -> Role: " + msg.getRole() + ", Content: '" + ((ChatRequestSystemMessage) msg).getContent() + "'");
            } else if (msg instanceof ChatRequestAssistantMessage) {
                System.out.println("  DeepSeek API Message -> Role: " + msg.getRole() + ", Content: '" + ((ChatRequestAssistantMessage) msg).getContent() + "'");
            } else {
                System.out.println("  DeepSeek API Message -> Role: " + msg.getRole() + ", Content: [Unable to retrieve content or content is null]");
            }
        });

        ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
        options.setModel(DEEPSEEK_V3_MODEL);

        int maxRetries = 3;
        long initialDelayMs = 500;
        for (int i = 0; i < maxRetries; i++) {
            try {
                System.out.println("DeepSeekService: Executing chatCompletionsClient.complete() call (Attempt " + (i + 1) + ")...");
                ChatCompletions completions = chatCompletionsClient.complete(options);
                System.out.println("DeepSeekService: ChatCompletionsClient.complete() call finished.");

                if (completions != null && completions.getChoice() != null && completions.getChoice().getMessage() != null) {
                    String content = completions.getChoice().getMessage().getContent();
                    System.out.println("DeepSeekService: DeepSeek response content received. Length: " + content.length());
                    return content;
                } else {
                    System.err.println("DeepSeekService: Received an empty or malformed response from DeepSeek API. Retrying if possible.");
                }
            } catch (IllegalStateException e) { // Keep IOException as it's a common network error
                System.err.println("DeepSeekService: EXCEPTION caught during DeepSeek API call (Attempt " + (i + 1) + "): " + e.getClass().getName() + " - " + e.getMessage());
                e.printStackTrace();

                if (i < maxRetries - 1) {
                    long delay = initialDelayMs * (long) Math.pow(2, i);
                    System.out.println("DeepSeekService: Retrying in " + delay + "ms...");
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        System.err.println("DeepSeekService: Interrupted during retry delay.");
                        break;
                    }
                } else {
                    System.err.println("DeepSeekService: Max retries reached for DeepSeek API call.");
                }
            } catch (Exception e) {
                System.err.println("DeepSeekService: UNEXPECTED EXCEPTION caught during DeepSeek API call: " + e.getClass().getName() + " - " + e.getMessage());
                e.printStackTrace();
                return "I apologize, I couldn't get a response from the AI right now. This might be due to an unexpected error. Please try again later.";
            }
        }
        return "I apologize, I couldn't get a response from the AI after multiple attempts. Please try again later.";
    }
}