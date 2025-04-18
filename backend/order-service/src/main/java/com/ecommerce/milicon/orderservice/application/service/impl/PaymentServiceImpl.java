package com.ecommerce.milicon.orderservice.application.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentRequest;
import com.ecommerce.milicon.orderservice.application.exception.PaymentProcessingException;
import com.ecommerce.milicon.orderservice.application.service.PaymentService;
import com.ecommerce.milicon.orderservice.domain.model.Payment;
import com.ecommerce.milicon.orderservice.domain.model.PaymentStatus;
import com.ecommerce.milicon.orderservice.domain.repository.PaymentRepository;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public Payment processPayment(PaymentRequest request, BigDecimal amount, UUID orderId) {
        // Aquí normalmente se integraría con un procesador de pagos real como Stripe,
        // PayPal, etc.
        // Por ahora, simulamos el proceso de pago

        try {
            String transactionId = generateTransactionId();

            Payment payment = Payment.builder()
                    .amount(amount)
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.COMPLETED) // Simulamos que todos los pagos son exitosos
                    .transactionId(transactionId)
                    .build();

            return paymentRepository.save(payment);
        } catch (Exception e) {
            throw new PaymentProcessingException("Error al procesar el pago: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getPaymentByOrderId(UUID orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    @Override
    @Transactional
    public void updatePaymentStatus(UUID paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con ID: " + paymentId));

        payment.setStatus(status);
        paymentRepository.save(payment);
    }

    @Override
    public String generateTransactionId() {
        return "TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}