package com.ecommerce.milicon.orderservice.application.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ecommerce.milicon.orderservice.application.dto.order.OrderRequest;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderResponse;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderStatusUpdateRequest;
import com.ecommerce.milicon.orderservice.domain.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponse createOrder(UUID userId, String userEmail, OrderRequest request);

    OrderResponse getOrderById(UUID id);

    Page<OrderResponse> getOrdersByUserId(UUID userId, Pageable pageable);

    List<OrderResponse> getRecentOrdersByUserId(UUID userId);

    Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable);

    Page<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    Page<OrderResponse> getOrdersByUserIdAndStatus(UUID userId, OrderStatus status, Pageable pageable);

    OrderResponse updateOrderStatus(UUID id, OrderStatusUpdateRequest request);

    void cancelOrder(UUID id, UUID userId);
}