package com.ecommerce.milicons.productservice.application.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private Integer rating;
    private String comment;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}