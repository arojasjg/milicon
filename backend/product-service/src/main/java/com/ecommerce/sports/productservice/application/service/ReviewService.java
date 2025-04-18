package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.review.ReviewRequest;
import com.ecommerce.milicons.productservice.application.dto.review.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewResponse createReview(UUID productId, UUID userId, String userName, ReviewRequest request);

    ReviewResponse updateReview(UUID reviewId, UUID userId, ReviewRequest request);

    void deleteReview(UUID reviewId, UUID userId);

    ReviewResponse getReviewById(UUID reviewId);

    Page<ReviewResponse> getReviewsByProduct(UUID productId, Pageable pageable);

    List<ReviewResponse> getReviewsByUser(UUID userId);
}