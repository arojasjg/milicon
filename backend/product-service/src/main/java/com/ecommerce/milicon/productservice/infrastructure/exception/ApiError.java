package com.ecommerce.milicon.productservice.infrastructure.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;

    // Default no-args constructor
    public ApiError() {
    }

    // Constructor with all fields
    public ApiError(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }
}