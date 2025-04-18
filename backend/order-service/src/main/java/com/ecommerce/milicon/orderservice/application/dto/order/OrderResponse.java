package com.ecommerce.milicon.orderservice.application.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentResponse;
import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressResponse;
import com.ecommerce.milicon.orderservice.domain.model.OrderStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private ShippingAddressResponse shippingAddress;
    private PaymentResponse payment;
    private List<OrderItemResponse> items;
    private String trackingNumber;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}