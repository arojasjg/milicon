package com.ecommerce.milicon.orderservice.application.dto.order;

import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentRequest;
import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "La dirección de envío es obligatoria")
    @Valid
    private ShippingAddressRequest shippingAddress;

    @NotNull(message = "La información de pago es obligatoria")
    @Valid
    private PaymentRequest payment;

    private String notes;
}