package com.certaint.curevo.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
@ConfigurationProperties(prefix = "mailjet")
public class MailjetProperties {
    @Value("${MAILJET_API_KEY}")
    private String apiKey;
    @Value("${MAILJET_API_SECRET_KEY}")
    private String secretKey;
    private String senderEmail="curevoapp@gmail.com";
    private String senderName="Curevo";

}
