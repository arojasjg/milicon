package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.review.ReviewRequest;
import com.ecommerce.milicons.productservice.application.dto.review.ReviewResponse;

import java.util.UUID;

public interface ReviewService {
    ReviewResponse createReview(UUID productId, ReviewRequest request);
    // Other methods...
}