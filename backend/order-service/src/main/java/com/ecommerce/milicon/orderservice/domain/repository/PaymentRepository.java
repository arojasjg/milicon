package com.ecommerce.milicon.orderservice.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.milicon.orderservice.domain.model.Payment;
import com.ecommerce.milicon.orderservice.domain.model.PaymentStatus;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByStatus(PaymentStatus status);

    Payment findByOrderId(UUID orderId);

    Payment findByTransactionId(String transactionId);
}