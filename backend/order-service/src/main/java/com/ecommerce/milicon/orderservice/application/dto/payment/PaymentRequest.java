package com.ecommerce.milicon.orderservice.application.dto.payment;

import com.ecommerce.milicon.orderservice.domain.model.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "El método de pago es obligatorio")
    private PaymentMethod paymentMethod;

    private String cardNumber;

    private String cardHolderName;

    private String expirationDate;

    private String cvv;

    private String paypalEmail;
}