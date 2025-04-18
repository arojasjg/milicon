package com.ecommerce.milicon.orderservice.infrastructure.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidationError {
    private int status;
    private String message;
    private Map<String, String> errors;
    private LocalDateTime timestamp;
}