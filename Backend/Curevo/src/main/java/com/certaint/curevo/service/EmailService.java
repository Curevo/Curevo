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


    public void sendCustomerRegistrationOtpEmail(String toEmail, String otp, String customerName) {
        String subject = "Curevo Customer Registration OTP";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #4CAF50;'>Welcome to Curevo!</h2>"
                + "<p>Dear " + customerName + ",</p>"
                + "<p>Thank you for registering with Curevo. To complete your registration, please use the following One-Time Password (OTP):</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;'>" + otp + "</p>"
                + "<p>This OTP is valid for **3 minutes**.</p>"
                + "<p>Please do not share this OTP with anyone for security reasons.</p>"
                + "<p>If you did not initiate this request, please ignore this email.</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + customerName + ",\n\n"
                + "Thank you for registering with Curevo. Your OTP for registration is: " + otp + "\n"
                + "This OTP is valid for 3 minutes. Do not share it with anyone.\n\n"
                + "If you did not initiate this request, please ignore this email.\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, customerName, subject, textContent, htmlContent);
            logger.info("Customer registration OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send customer registration OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send customer registration OTP email", e);
        }
    }

    public void sendExecutiveRegistrationOtpEmail(String toEmail, String otp, String executiveName) {
        String subject = "Curevo Delivery Executive Registration OTP";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #FFA500;'>Welcome to the Curevo Delivery Team!</h2>"
                + "<p>Dear " + executiveName + ",</p>"
                + "<p>Thank you for your interest in becoming a Curevo Delivery Executive. To finalize your registration, please use the following One-Time Password (OTP):</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;'>" + otp + "</p>"
                + "<p>This OTP is valid for **3 minutes**.</p>"
                + "<p>Please do not share this OTP with anyone for security reasons.</p>"
                + "<p>If you did not initiate this request, please ignore this email.</p>"
                + "<p>We look forward to having you on board!</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + executiveName + ",\n\n"
                + "Thank you for your interest in becoming a Curevo Delivery Executive. Your OTP for registration is: " + otp + "\n"
                + "This OTP is valid for 3 minutes. Do not share it with anyone.\n\n"
                + "If you did not initiate this request, please ignore this email.\n\n"
                + "We look forward to having you on board!\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, executiveName, subject, textContent, htmlContent);
            logger.info("Executive registration OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send executive registration OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send executive registration OTP email", e);
        }
    }

    public void sendPasswordResetOtpEmail(String toEmail, String otp, String userName) {
        String subject = "Curevo Password Reset OTP";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #DC3545;'>Password Reset Request</h2>"
                + "<p>Dear " + userName + ",</p>"
                + "<p>We received a request to reset your password for your Curevo account. Please use the following One-Time Password (OTP) to proceed:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;'>" + otp + "</p>"
                + "<p>This OTP is valid for **3 minutes**.</p>"
                + "<p>If you did not request a password reset, please ignore this email or contact support immediately.</p>"
                + "<p>Do not share this OTP with anyone.</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + userName + ",\n\n"
                + "We received a request to reset your password for your Curevo account. Your OTP for password reset is: " + otp + "\n"
                + "This OTP is valid for 3 minutes. Do not share it with anyone.\n\n"
                + "If you did not request a password reset, please ignore this email or contact support immediately.\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, userName, subject, textContent, htmlContent);
            logger.info("Password reset OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send password reset OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset OTP email", e);
        }
    }

    public void sendDeliveryCompletionOtpEmail(String toEmail, String otp, String recipientName) {
        String subject = "Curevo Delivery Verification OTP";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #28A745;'>Curevo Delivery Verification</h2>"
                + "<p>Dear " + recipientName + ",</p>"
                + "<p>Your Curevo delivery has arrived! Please provide the following One-Time Password (OTP) to the delivery executive to complete your order:</p>"
                + "<p style='font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;'>" + otp + "</p>"
                + "<p>This OTP is valid for **2 minutes**.</p>"
                + "<p>Please ensure you only provide this OTP to your Curevo delivery executive.</p>"
                + "<p>If you did not receive a delivery, please contact Curevo support.</p>"
                + "<p>Thank you for choosing Curevo!</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + recipientName + ",\n\n"
                + "Your Curevo delivery has arrived! Your One-Time Password (OTP) for delivery verification is: " + otp + "\n"
                + "This OTP is valid for 2 minutes. Please provide this OTP to your delivery executive.\n\n"
                + "If you did not receive a delivery, please contact Curevo support.\n\n"
                + "Thank you for choosing Curevo!\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, recipientName, subject, textContent, htmlContent);
            logger.info("Delivery completion OTP email sent successfully to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send delivery completion OTP email to {}", toEmail, e);
            throw new RuntimeException("Failed to send delivery completion OTP email", e);
        }
    }

    public void sendCustomerRegistrationSuccessEmail(String toEmail, String customerName) {
        String subject = "Welcome to Curevo - Your Registration is Complete!";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #4CAF50;'>Registration Successful!</h2>"
                + "<p>Dear " + customerName + ",</p>"
                + "<p>Great news! Your Curevo account has been successfully created and verified.</p>"
                + "<p>You can now log in to your account and start ordering your favorite meals.</p>"
                + "<p>We're excited to have you as part of the Curevo community!</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + customerName + ",\n\n"
                + "Great news! Your Curevo account has been successfully created and verified.\n\n"
                + "You can now log in to your account and start ordering your favorite meals.\n\n"
                + "We're excited to have you as part of the Curevo community!\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, customerName, subject, textContent, htmlContent);
            logger.info("Customer registration success email sent to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send customer registration success email to {}", toEmail, e);
            throw new RuntimeException("Failed to send customer registration success email", e);
        }
    }

    public void sendExecutiveApplicationReceivedEmail(String toEmail, String executiveName) {
        String subject = "Curevo Delivery Executive - Application Received!";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #20B2AA;'>Application Received!</h2>"
                + "<p>Dear " + executiveName + ",</p>"
                + "<p>Thank you for completing your registration as a Curevo Delivery Executive!</p>"
                + "<p>Your application is now under review. We're carefully assessing all details to ensure the best fit for our team.</p>"
                + "<p>We aim to process all applications within approximately *15 business days*.</p>"
                + "<p>Please keep an eye on your inbox for updates regarding your application status. If you don't hear back from us within this timeframe, or if your application is not approved, you are welcome to reapply.</p>"
                + "<p>We appreciate your patience and interest in Curevo!</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + executiveName + ",\n\n"
                + "Thank you for completing your registration as a Curevo Delivery Executive!\n\n"
                + "Your application is now under review. We're carefully assessing all details to ensure the best fit for our team.\n\n"
                + "We aim to process all applications within approximately 15 business days. Please keep an eye on your inbox for updates regarding your application status.\n\n"
                + "If you don't hear back from us within this timeframe, or if your application is not approved, you are welcome to reapply.\n\n"
                + "We appreciate your patience and interest in Curevo!\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, executiveName, subject, textContent, htmlContent);
            logger.info("Executive application received email sent to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send executive application received email to {}", toEmail, e);
            throw new RuntimeException("Failed to send executive application received email", e);
        }
    }

    public void sendExecutiveApprovalEmail(String toEmail, String executiveName) {
        String subject = "Curevo Delivery Executive - Your Application is Approved!";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #28A745;'>Congratulations, " + executiveName + "!</h2>"
                + "<p>We're thrilled to inform you that your application to become a Curevo Delivery Executive has been approved.</p>"
                + "<p>You can now log in to your account and start accepting delivery assignments.</p>"
                + "<p>Welcome to the team!</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Congratulations, " + executiveName + "!\n\n"
                + "We're thrilled to inform you that your application to become a Curevo Delivery Executive has been approved.\n\n"
                + "You can now log in to your account and start accepting delivery assignments.\n\n"
                + "Welcome to the team!\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, executiveName, subject, textContent, htmlContent);
            logger.info("Executive approval email sent to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send executive approval email to {}", toEmail, e);
            throw new RuntimeException("Failed to send executive approval email", e);
        }
    }
    public void sendExecutiveRejectionEmail(String toEmail, String executiveName) {
        String subject = "Curevo Delivery Executive Application Update";
        String htmlContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
                + "<h2 style='color: #DC3545;'>Regarding Your Application</h2>"
                + "<p>Dear " + executiveName + ",</p>"
                + "<p>Thank you for your interest in becoming a Curevo Delivery Executive. We have carefully reviewed your application.</p>"
                + "<p>At this time, we regret to inform you that we are unable to proceed with your application.</p>"
                + "<p>We wish you the best in your future endeavors. You are welcome to reapply after 6 months if you believe there are changes to your profile that meet our requirements.</p>"
                + "<p>Best regards,<br>The Curevo Team</p>"
                + "</div>";
        String textContent = "Dear " + executiveName + ",\n\n"
                + "Thank you for your interest in becoming a Curevo Delivery Executive. We have carefully reviewed your application.\n\n"
                + "At this time, we regret to inform you that we are unable to proceed with your application.\n\n"
                + "We wish you the best in your future endeavors. You are welcome to reapply after 6 months if you believe there are changes to your profile that meet our requirements.\n\n"
                + "Best regards,\nThe Curevo Team";

        try {
            mailjetEmailService.sendEmail(fromEmail, fromName, toEmail, executiveName, subject, textContent, htmlContent);
            logger.info("Executive rejection email sent to {}", toEmail);
        } catch (MailjetException e) {
            logger.error("Failed to send executive rejection email to {}", toEmail, e);
            throw new RuntimeException("Failed to send executive rejection email", e);
        }
    }
}
