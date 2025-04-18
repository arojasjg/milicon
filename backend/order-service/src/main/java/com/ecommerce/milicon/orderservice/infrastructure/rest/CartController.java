package com.ecommerce.milicon.orderservice.infrastructure.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.milicon.orderservice.application.dto.cart.CartItemRequest;
import com.ecommerce.milicon.orderservice.application.dto.cart.CartResponse;
import com.ecommerce.milicon.orderservice.application.service.CartService;

import java.util.UUID;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @RequestHeader("X-User-ID") UUID userId,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @RequestHeader("X-User-ID") UUID userId,
            @PathVariable UUID productId,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(userId, productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @RequestHeader("X-User-ID") UUID userId,
            @PathVariable UUID productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-ID") UUID userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}