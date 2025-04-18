package com.miliconstore.orderservice.service;

import com.miliconstore.orderservice.dto.PaymentDto;
import com.miliconstore.orderservice.entity.Order;
import com.miliconstore.orderservice.entity.OrderStatus;
import com.miliconstore.orderservice.entity.Payment;
import com.miliconstore.orderservice.entity.PaymentStatus;
import com.miliconstore.orderservice.repository.OrderRepository;
import com.miliconstore.orderservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final NotificationServiceClient notificationServiceClient;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            OrderService orderService,
            NotificationServiceClient notificationServiceClient) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Transactional
    public Payment processPayment(PaymentDto paymentDto) {
        Order order = orderRepository.findById(paymentDto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + paymentDto.getOrderId()));

        if (!order.getUserId().equals(paymentDto.getUserId())) {
            throw new RuntimeException("User is not authorized to process payment for this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot process payment for an order that is not in PENDING status");
        }

        // In a real application, you would integrate with a payment gateway here
        boolean paymentSuccessful = simulatePaymentGateway(paymentDto);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentDto.getPaymentMethod());
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());

        if (paymentSuccessful) {
            payment.setStatus(PaymentStatus.COMPLETED);
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            // Send order confirmation notification
            notificationServiceClient.sendOrderConfirmation(order);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        return paymentRepository.save(payment);
    }

    private boolean simulatePaymentGateway(PaymentDto paymentDto) {
        // In a real application, this would call an actual payment gateway
        // For now, we'll simulate a successful payment
        return true;
    }

    public Payment getPaymentByOrderId(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("User is not authorized to view payment for this order");
        }

        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order ID: " + orderId));
    }
}