package com.ecommerce.milicon.orderservice.application.dto.order;

import com.ecommerce.milicon.orderservice.domain.model.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {

    @NotNull(message = "El estado de la orden es obligatorio")
    private OrderStatus status;

    private String trackingNumber;

    private String notes;
}