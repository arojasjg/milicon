package com.ecommerce.milicons.productservice.domain.repository;

import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByProduct(Product product, Pageable pageable);

    Optional<Review> findByProductAndUserId(Product product, UUID userId);

    List<Review> findByUserId(UUID userId);

    void deleteByProductAndUserId(Product product, UUID userId);

    List<Review> findByProductId(UUID productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product")
    Double findAverageRatingByProduct(Product product);
}