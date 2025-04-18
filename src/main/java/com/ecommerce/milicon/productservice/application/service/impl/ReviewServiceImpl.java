package com.ecommerce.milicons.productservice.application.service.impl;

import com.ecommerce.milicons.productservice.application.dto.review.ReviewRequest;
import com.ecommerce.milicons.productservice.application.dto.review.ReviewResponse;
import com.ecommerce.milicons.productservice.application.mapper.ReviewMapper;
import com.ecommerce.milicons.productservice.application.service.ReviewService;
import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.model.Review;
import com.ecommerce.milicons.productservice.domain.repository.ProductRepository;
import com.ecommerce.milicons.productservice.domain.repository.ReviewRepository;
import com.ecommerce.milicons.productservice.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewResponse createReview(UUID productId, ReviewRequest request) {
        // Verify that request has all required fields
        if (request.getUsername() == null || request.getRating() == null) {
            throw new IllegalArgumentException("Username and rating are required");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Review review = Review.builder()
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .username(request.getUsername())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update product rating
        updateProductRating(product);

        return reviewMapper.toReviewResponse(savedReview);
    }

    private void updateProductRating(Product product) {
        Double averageRating = reviewRepository.findAverageRatingByProduct(product);
        if (averageRating != null) {
            product.setAverageRating(averageRating);
            productRepository.save(product);
        }
    }
}