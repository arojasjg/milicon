package com.ecommerce.milicon.orderservice.infrastructure.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.milicon.orderservice.application.dto.order.OrderRequest;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderResponse;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderStatusUpdateRequest;
import com.ecommerce.milicon.orderservice.application.service.OrderService;
import com.ecommerce.milicon.orderservice.domain.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader("X-User-ID") UUID userId,
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(userId, userEmail, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<Page<OrderResponse>> getOrdersByUserId(
            @RequestHeader("X-User-ID") UUID userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId, pageable));
    }

    @GetMapping("/user/recent")
    public ResponseEntity<List<OrderResponse>> getRecentOrdersByUserId(
            @RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(orderService.getRecentOrdersByUserId(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<OrderResponse>> getOrdersByStatus(
            @PathVariable OrderStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status, pageable));
    }

    @GetMapping("/date-range")
    public ResponseEntity<Page<OrderResponse>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByDateRange(startDate, endDate, pageable));
    }

    @GetMapping("/user/status")
    public ResponseEntity<Page<OrderResponse>> getOrdersByUserIdAndStatus(
            @RequestHeader("X-User-ID") UUID userId,
            @RequestParam OrderStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrdersByUserIdAndStatus(userId, status, pageable));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable UUID id,
            @RequestHeader("X-User-ID") UUID userId) {
        orderService.cancelOrder(id, userId);
        return ResponseEntity.noContent().build();
    }
}