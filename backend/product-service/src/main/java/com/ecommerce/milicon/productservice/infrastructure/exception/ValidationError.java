package com.ecommerce.milicon.productservice.infrastructure.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
public class ValidationError extends ApiError {
    private Map<String, String> errors;

    // Default no-args constructor
    public ValidationError() {
        super();
    }

    // Constructor with all fields
    public ValidationError(int status, String message, Map<String, String> errors, LocalDateTime timestamp) {
        super(status, message, timestamp);
        this.errors = errors;
    }
}