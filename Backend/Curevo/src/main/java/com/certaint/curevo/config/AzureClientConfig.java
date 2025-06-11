package com.certaint.curevo.config;

import com.azure.ai.inference.ChatCompletionsClient;
import com.azure.ai.inference.ChatCompletionsClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.http.HttpClient;
import com.azure.core.http.netty.NettyAsyncHttpClientBuilder;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class AzureClientConfig implements DisposableBean {

    @Value("${github.api.key}")
    private String apiKey;

    private static final String GITHUB_AI_INFERENCE_ENDPOINT = "https://models.github.ai/inference";


    // 1. Define EventLoopGroup as a Spring Bean (singleton)
    @Bean(destroyMethod = "shutdownGracefully")
    public EventLoopGroup nettyEventLoopGroup() {
        EventLoopGroup group = new NioEventLoopGroup();
        System.out.println("AzureClientConfig: Netty EventLoopGroup initialized.");
        return group;
    }

    // 2. Define HttpClient as a Spring Bean (singleton)
    @Bean
    public HttpClient azureHttpClient(EventLoopGroup nettyEventLoopGroup) {
        // Ensure the EventLoopGroup is not shut down before building HttpClient
        if (nettyEventLoopGroup.isShuttingDown() || nettyEventLoopGroup.isShutdown()) {
            throw new IllegalStateException("Netty EventLoopGroup is shutting down or already shut down. Cannot build HttpClient.");
        }

        HttpClient httpClient = new NettyAsyncHttpClientBuilder()
                .eventLoopGroup(nettyEventLoopGroup) // Use the injected, shared event loop group
                .responseTimeout(Duration.ofSeconds(60)) // Response timeout
                .connectTimeout(Duration.ofSeconds(10))  // Connection timeout
                .build();
        System.out.println("AzureClientConfig: Azure HttpClient configured as a Spring Bean.");
        return httpClient;
    }

    // 3. Define ChatCompletionsClient as a Spring Bean (singleton), injecting the HttpClient
    @Bean
    public ChatCompletionsClient chatCompletionsClient(HttpClient azureHttpClient) {
        // No longer assign to 'this.eventLoopGroup' here to avoid the 'proxy' method issue.
        // Spring's @Bean(destroyMethod) will handle the EventLoopGroup's lifecycle.

        System.out.println("AzureClientConfig: Building ChatCompletionsClient with endpoint: " + GITHUB_AI_INFERENCE_ENDPOINT);

        return new ChatCompletionsClientBuilder()
                .credential(new AzureKeyCredential(apiKey))
                .endpoint(GITHUB_AI_INFERENCE_ENDPOINT)
                .httpClient(azureHttpClient) // Use the injected HttpClient bean
                .buildClient();
    }

    // This DisposableBean method is now primarily a fallback/logging mechanism.
    // The EventLoopGroup shutdown is correctly handled by @Bean(destroyMethod="shutdownGracefully").
    @Override
    public void destroy() throws Exception {
        System.out.println("AzureClientConfig: Entering DisposableBean.destroy() method.");
        // If you need to explicitly shut down the eventLoopGroup here for some reason,
        // you would need to get a reference to the bean again or manage it differently.
        // For standard Spring contexts, the @Bean(destroyMethod) is sufficient.
        System.out.println("AzureClientConfig: Exiting DisposableBean.destroy() method.");
    }
}