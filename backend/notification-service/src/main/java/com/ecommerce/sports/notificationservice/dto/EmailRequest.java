package com.ecommerce.milicons.notificationservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {

    @NotBlank(message = "El destinatario es obligatorio")
    @Email(message = "El destinatario debe ser una dirección de correo válida")
    private String to;

    @NotBlank(message = "El asunto es obligatorio")
    private String subject;

    private String template;

    private Map<String, Object> templateVariables;

    private String plainText;
}