package com.ecommerce.milicon.orderservice.application.service;

import java.util.UUID;

import com.ecommerce.milicon.orderservice.application.dto.cart.CartItemRequest;
import com.ecommerce.milicon.orderservice.application.dto.cart.CartResponse;
import com.ecommerce.milicon.orderservice.domain.model.Cart;

public interface CartService {
    CartResponse getCart(UUID userId);

    CartResponse addItemToCart(UUID userId, CartItemRequest request);

    CartResponse updateCartItem(UUID userId, UUID productId, CartItemRequest request);

    CartResponse removeItemFromCart(UUID userId, UUID productId);

    void clearCart(UUID userId);

    Cart findCartByUserId(UUID userId);
}