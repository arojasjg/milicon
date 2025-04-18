package com.ecommerce.milicon.orderservice.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.milicon.orderservice.domain.model.Cart;
import com.ecommerce.milicon.orderservice.domain.model.CartItem;

import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCartAndProductId(Cart cart, UUID productId);

    void deleteByCartAndProductId(Cart cart, UUID productId);
}