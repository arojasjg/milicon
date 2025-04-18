package com.ecommerce.milicons.notificationservice.service;

import com.ecommerce.milicons.notificationservice.dto.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendEmail(EmailRequest request) {
        if (request.getTemplate() != null) {
            sendHtmlEmail(request);
        } else {
            sendPlainTextEmail(request);
        }
    }

    private void sendPlainTextEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getPlainText());

        mailSender.send(message);
        log.info("Plain text email sent to: {}", request.getTo());
    }

    private void sendHtmlEmail(EmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            Context context = new Context();
            if (request.getTemplateVariables() != null) {
                request.getTemplateVariables().forEach(context::setVariable);
            }

            String htmlContent = templateEngine.process(request.getTemplate(), context);

            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("HTML email sent to: {}", request.getTo());
        } catch (MessagingException e) {
            log.error("Error sending HTML email: {}", e.getMessage());
            throw new RuntimeException("Error sending HTML email", e);
        }
    }
}