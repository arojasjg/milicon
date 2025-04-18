package com.ecommerce.milicons.productservice.application.service.impl;

import com.ecommerce.milicons.productservice.application.dto.review.ReviewRequest;
import com.ecommerce.milicons.productservice.application.dto.review.ReviewResponse;
import com.ecommerce.milicons.productservice.application.exception.ReviewAlreadyExistsException;
import com.ecommerce.milicons.productservice.application.exception.ReviewNotFoundException;
import com.ecommerce.milicons.productservice.application.exception.UnauthorizedOperationException;
import com.ecommerce.milicons.productservice.application.mapper.ReviewMapper;
import com.ecommerce.milicons.productservice.application.service.ProductService;
import com.ecommerce.milicons.productservice.application.service.ReviewService;
import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.model.Review;
import com.ecommerce.milicons.productservice.domain.repository.ProductRepository;
import com.ecommerce.milicons.productservice.domain.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(
                        () -> new ProductNotFoundException("Product not found with id: " + request.getProductId()));

        Optional<Review> existingReview = reviewRepository.findByProductAndUserId(product, request.getUserId());
        if (existingReview.isPresent()) {
            throw new ReviewAlreadyExistsException("Ya has dejado una reseña para este producto");
        }

        Review review = Review.builder()
                .product(product)
                .userId(request.getUserId())
                .username(request.getUsername())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        product.addReview(review);
        Review savedReview = reviewRepository.save(review);

        // Actualizar la calificación promedio del producto
        updateProductAverageRating(product);

        return reviewMapper.toReviewResponse(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(UUID reviewId, UUID userId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Reseña no encontrada con ID: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new UnauthorizedOperationException("No estás autorizado para actualizar esta reseña");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);

        // Actualizar la calificación promedio del producto
        updateProductAverageRating(updatedReview.getProduct());

        return reviewMapper.toReviewResponse(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId, UUID userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Reseña no encontrada con ID: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new UnauthorizedOperationException("No estás autorizado para eliminar esta reseña");
        }

        Product product = review.getProduct();
        product.removeReview(review);

        reviewRepository.delete(review);

        // Actualizar la calificación promedio del producto
        updateProductAverageRating(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Reseña no encontrada con ID: " + reviewId));

        return reviewMapper.toReviewResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByProduct(UUID productId, Pageable pageable) {
        Product product = productService.findProductEntityById(productId);

        return reviewRepository.findByProduct(product, pageable)
                .map(reviewMapper::toReviewResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUser(UUID userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProductId(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }

        return reviewRepository.findByProductId(productId).stream()
                .map(reviewMapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    private void updateProductAverageRating(Product product) {
        Double averageRating = reviewRepository.findAverageRatingByProduct(product);

        if (averageRating == null) {
            averageRating = 0.0;
        }

        product.setAverageRating(averageRating);
        productRepository.save(product);
    }
}