package com.certaint.curevo.service;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.ai.inference.models.*;
import com.azure.core.credential.AzureKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeepSeekService {

    @Value("${GITHUB_AI_API_KEY}")
    private String apiKey;

    private static final String DEEPSEEK_V3_MODEL = "deepseek/DeepSeek-V3-0324";
    private static final String SYSTEM_PROMPT =
            "You are a healthcare assistant. Only respond to health-related queries. Be brief, give mild advice, and suggest a doctor specialization. " +
                    "Tell users to click the 'See Doctors' button for more help.";

    private final Deque<ChatRequestMessage> messageHistory = new LinkedList<>();
    private static final int MAX_CONTEXT_MESSAGES = 4;

    public String getHealthResponse(String userQuery) {
        messageHistory.addLast(new ChatRequestUserMessage(userQuery));


        while (messageHistory.size() > MAX_CONTEXT_MESSAGES) {
            messageHistory.pollFirst();
        }


        List<ChatRequestMessage> messagesToSend = new ArrayList<>();
        messagesToSend.add(new ChatRequestSystemMessage(SYSTEM_PROMPT));
        messagesToSend.addAll(messageHistory);


        String assistantReply = callDeepSeekAPI(messagesToSend);


        messageHistory.addLast(new ChatRequestAssistantMessage(assistantReply));

        return assistantReply;
    }

    public String summarizeResponse(String longResponse) {
        List<ChatRequestMessage> summaryMessages = Arrays.asList(
                new ChatRequestSystemMessage("You are a summarizer for healthcare responses. Be short and clear."),
                new ChatRequestUserMessage("Summarize this healthcare response in 3 short sentences:\n\n" + longResponse)
        );

        return callDeepSeekAPI(summaryMessages);
    }

    private String callDeepSeekAPI(List<ChatRequestMessage> messages) {
        ChatCompletionsClient client = new ChatCompletionsClientBuilder()
                .credential(new AzureKeyCredential(apiKey))
                .endpoint("https://models.github.ai/inference")
                .buildClient();

        ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
        options.setModel(DEEPSEEK_V3_MODEL);

        ChatCompletions completions = client.complete(options);
        return completions.getChoice().getMessage().getContent();
    }
}
