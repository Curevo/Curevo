package com.certaint.curevo.service;


import com.mailjet.client.errors.MailjetException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final MailjetEmailService mailjetEmailService;

    @Value("${spring.mail.from:curevoapp@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.from-name:Curevo App}")
    private String fromName;

//    public EmailService(MailjetEmailService mailjetEmailService) {
//        this.mailjetEmailService = mailjetEmailService;
//    }

    public void sendOtpEmail(String toEmail, String otp, String toName) {
        String subject = "Curevo OTP for Registration";
        String htmlContent = "<h3>Your OTP is: <span style='color:#4a90e2;'>" + otp + "</span></h3>"
                + "<p>This OTP will expire in 2 minutes. Do not share it with anyone.</p>";
        String textContent = "Your OTP is: " + otp + ". This OTP will expire in 2 minutes. Do not share it with anyone.";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, toName, subject, textContent, htmlContent);
            logger.info("OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
