package com.ecommerce.milicon.orderservice.application.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.ecommerce.milicon.orderservice.application.dto.order.OrderItemResponse;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderResponse;
import com.ecommerce.milicon.orderservice.domain.model.Order;
import com.ecommerce.milicon.orderservice.domain.model.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final PaymentMapper paymentMapper;
    private final ShippingAddressMapper shippingAddressMapper;

    public OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userEmail(order.getUserEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(shippingAddressMapper.toShippingAddressResponse(order.getShippingAddress()))
                .payment(paymentMapper.toPaymentResponse(order.getPayment()))
                .items(mapOrderItems(order.getItems()))
                .trackingNumber(order.getTrackingNumber())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private List<OrderItemResponse> mapOrderItems(List<OrderItem> items) {
        return items.stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList());
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .imageUrl(item.getImageUrl())
                .build();
    }
}