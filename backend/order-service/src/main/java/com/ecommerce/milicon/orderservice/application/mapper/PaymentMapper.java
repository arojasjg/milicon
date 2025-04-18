package com.ecommerce.milicon.orderservice.application.mapper;

import org.springframework.stereotype.Component;

import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentResponse;
import com.ecommerce.milicon.orderservice.domain.model.Payment;

@Component
public class PaymentMapper {

    public PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}