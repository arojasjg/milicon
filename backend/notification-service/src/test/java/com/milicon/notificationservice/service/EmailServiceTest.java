package com.milicon.notificationservice.service;

import com.miliconstore.notificationservice.dto.EmailRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailServiceImpl emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendOrderConfirmationEmail_Success() {
        // Arrange
        EmailRequest request = new EmailRequest();
        request.setTo("customer@example.com");
        request.setSubject("Order Confirmation");

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("orderNumber", "ORD-12345");
        templateModel.put("customerName", "John Doe");
        templateModel.put("totalAmount", "$129.99");
        request.setTemplateModel(templateModel);
        request.setTemplateName("order-confirmation");

        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Email content</html>");
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(mailSender).send(any(MimeMessagePreparator.class));

        // Act
        boolean result = emailService.sendTemplatedEmail(request);

        // Assert
        assertTrue(result);

        verify(templateEngine).process(eq("order-confirmation"), any(Context.class));
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(any(MimeMessagePreparator.class));
    }

    @Test
    void sendOrderConfirmationEmail_TemplateProcessingFails() {
        // Arrange
        EmailRequest request = new EmailRequest();
        request.setTo("customer@example.com");
        request.setSubject("Order Confirmation");
        request.setTemplateName("non-existent-template");
        request.setTemplateModel(new HashMap<>());

        when(templateEngine.process(anyString(), any(Context.class)))
                .thenThrow(new RuntimeException("Template not found"));

        // Act
        boolean result = emailService.sendTemplatedEmail(request);

        // Assert
        assertFalse(result);

        verify(templateEngine).process(eq("non-existent-template"), any(Context.class));
        verify(mailSender, never()).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessagePreparator.class));
    }

    @Test
    void sendOrderConfirmationEmail_EmailSendingFails() {
        // Arrange
        EmailRequest request = new EmailRequest();
        request.setTo("customer@example.com");
        request.setSubject("Order Confirmation");
        request.setTemplateName("order-confirmation");
        request.setTemplateModel(new HashMap<>());

        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Email content</html>");
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new RuntimeException("Failed to send email")).when(mailSender).send(any(MimeMessagePreparator.class));

        // Act
        boolean result = emailService.sendTemplatedEmail(request);

        // Assert
        assertFalse(result);

        verify(templateEngine).process(eq("order-confirmation"), any(Context.class));
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(any(MimeMessagePreparator.class));
    }
}