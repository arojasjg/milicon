package com.ecommerce.milicon.orderservice.application.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.milicon.orderservice.application.dto.cart.CartItemRequest;
import com.ecommerce.milicon.orderservice.application.dto.cart.CartResponse;
import com.ecommerce.milicon.orderservice.application.exception.CartItemNotFoundException;
import com.ecommerce.milicon.orderservice.application.exception.CartNotFoundException;
import com.ecommerce.milicon.orderservice.application.mapper.CartMapper;
import com.ecommerce.milicon.orderservice.application.service.CartService;
import com.ecommerce.milicon.orderservice.domain.model.Cart;
import com.ecommerce.milicon.orderservice.domain.model.CartItem;
import com.ecommerce.milicon.orderservice.domain.repository.CartItemRepository;
import com.ecommerce.milicon.orderservice.domain.repository.CartRepository;
import com.ecommerce.milicon.orderservice.infrastructure.client.ProductClient;
import com.ecommerce.milicon.orderservice.infrastructure.client.dto.ProductDto;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;
    private final ProductClient productClient;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        Cart cart = findCartByUserId(userId);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(UUID userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        ProductDto product = productClient.getProduct(request.getProductId());

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProductId(cart, request.getProductId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(request.getQuantity())
                    .imageUrl(product.getImageUrl())
                    .build();

            cart.addCartItem(newItem);
        }

        cart = cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(UUID userId, UUID productId, CartItemRequest request) {
        Cart cart = findCartByUserId(userId);

        CartItem item = cartItemRepository.findByCartAndProductId(cart, productId)
                .orElseThrow(() -> new CartItemNotFoundException("Item no encontrado en el carrito"));

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        cart = cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItemFromCart(UUID userId, UUID productId) {
        Cart cart = findCartByUserId(userId);

        cartItemRepository.deleteByCartAndProductId(cart, productId);

        cart = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new CartNotFoundException("Carrito no encontrado"));

        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = findCartByUserId(userId);
        cart.clear();
        cartRepository.save(cart);
    }

    @Override
    @Transactional(readOnly = true)
    public Cart findCartByUserId(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartNotFoundException("Carrito no encontrado para el usuario: " + userId));
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }
}