package com.miliconstore.productservice.service;

import com.miliconstore.productservice.dto.ReviewDto;
import com.miliconstore.productservice.entity.Product;
import com.miliconstore.productservice.entity.Review;
import com.miliconstore.productservice.repository.ProductRepository;
import com.miliconstore.productservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Review createReview(ReviewDto reviewDto) {
        Product product = productRepository.findById(reviewDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + reviewDto.getProductId()));

        Review review = new Review();
        review.setProduct(product);
        review.setUserId(reviewDto.getUserId());
        review.setUserName(reviewDto.getUserName());
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        // Update product average rating
        updateProductAverageRating(product.getId());

        return savedReview;
    }

    public Page<Review> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("User is not authorized to delete this review");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);

        // Update product average rating
        updateProductAverageRating(productId);
    }

    private void updateProductAverageRating(Long productId) {
        Double averageRating = reviewRepository.calculateAverageRatingByProductId(productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        product.setAverageRating(averageRating != null ? averageRating : 0.0);
        productRepository.save(product);
    }
}