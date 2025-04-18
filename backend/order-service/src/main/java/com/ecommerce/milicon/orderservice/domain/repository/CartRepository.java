package com.ecommerce.milicon.orderservice.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.milicon.orderservice.domain.model.Cart;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);
}