package com.ecommerce.milicon.orderservice.application.service;

import java.math.BigDecimal;
import java.util.UUID;

import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentRequest;
import com.ecommerce.milicon.orderservice.domain.model.Payment;
import com.ecommerce.milicon.orderservice.domain.model.PaymentStatus;

public interface PaymentService {
    Payment processPayment(PaymentRequest request, BigDecimal amount, UUID orderId);

    Payment getPaymentByOrderId(UUID orderId);

    void updatePaymentStatus(UUID paymentId, PaymentStatus status);

    String generateTransactionId();
}