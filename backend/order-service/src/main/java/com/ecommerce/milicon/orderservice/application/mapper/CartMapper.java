package com.ecommerce.milicon.orderservice.application.mapper;

import org.springframework.stereotype.Component;

import com.ecommerce.milicon.orderservice.application.dto.cart.CartItemResponse;
import com.ecommerce.milicon.orderservice.application.dto.cart.CartResponse;
import com.ecommerce.milicon.orderservice.domain.model.Cart;
import com.ecommerce.milicon.orderservice.domain.model.CartItem;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponse toCartResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .items(mapCartItems(cart.getItems()))
                .totalAmount(cart.calculateTotal())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    private List<CartItemResponse> mapCartItems(List<CartItem> items) {
        return items.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .imageUrl(item.getImageUrl())
                .addedAt(item.getAddedAt())
                .build();
    }
}