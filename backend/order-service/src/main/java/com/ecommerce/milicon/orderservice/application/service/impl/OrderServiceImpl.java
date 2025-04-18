package com.ecommerce.milicon.orderservice.application.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.milicon.orderservice.application.dto.order.OrderRequest;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderResponse;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderStatusUpdateRequest;
import com.ecommerce.milicon.orderservice.application.exception.EmptyCartException;
import com.ecommerce.milicon.orderservice.application.exception.OrderNotFoundException;
import com.ecommerce.milicon.orderservice.application.exception.UnauthorizedOperationException;
import com.ecommerce.milicon.orderservice.application.mapper.OrderMapper;
import com.ecommerce.milicon.orderservice.application.mapper.ShippingAddressMapper;
import com.ecommerce.milicon.orderservice.application.service.CartService;
import com.ecommerce.milicon.orderservice.application.service.OrderService;
import com.ecommerce.milicon.orderservice.application.service.PaymentService;
import com.ecommerce.milicon.orderservice.domain.model.*;
import com.ecommerce.milicon.orderservice.domain.repository.OrderRepository;
import com.ecommerce.milicon.orderservice.infrastructure.client.ProductClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ShippingAddressMapper shippingAddressMapper;
    private final CartService cartService;
    private final PaymentService paymentService;
    private final ProductClient productClient;

    @Override
    @Transactional
    public OrderResponse createOrder(UUID userId, String userEmail, OrderRequest request) {
        Cart cart = cartService.findCartByUserId(userId);

        if (cart.getItems().isEmpty()) {
            throw new EmptyCartException("No se puede crear una orden con un carrito vacío");
        }

        ShippingAddress shippingAddress = shippingAddressMapper.toShippingAddress(request.getShippingAddress());

        Order order = Order.builder()
                .userId(userId)
                .userEmail(userEmail)
                .totalAmount(cart.calculateTotal())
                .status(OrderStatus.PENDING)
                .shippingAddress(shippingAddress)
                .notes(request.getNotes())
                .build();

        shippingAddress.setOrder(order);

        // Convertir items del carrito a items de la orden
        cart.getItems().forEach(cartItem -> {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(cartItem.getProductId())
                    .productName(cartItem.getProductName())
                    .price(cartItem.getPrice())
                    .quantity(cartItem.getQuantity())
                    .imageUrl(cartItem.getImageUrl())
                    .build();

            order.addOrderItem(orderItem);

            // Reducir el stock del producto
            productClient.reduceProductStock(cartItem.getProductId(), cartItem.getQuantity());
        });

        // Guardar la orden
        Order savedOrder = orderRepository.save(order);

        // Procesar el pago
        Payment payment = paymentService.processPayment(request.getPayment(), order.getTotalAmount(),
                savedOrder.getId());
        savedOrder.setPayment(payment);
        savedOrder = orderRepository.save(savedOrder);

        // Limpiar el carrito después de crear la orden
        cartService.clearCart(userId);

        return orderMapper.toOrderResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID id) {
        Order order = findOrderById(id);
        return orderMapper.toOrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUserId(UUID userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(orderMapper::toOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getRecentOrdersByUserId(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable)
                .map(orderMapper::toOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate, pageable)
                .map(orderMapper::toOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUserIdAndStatus(UUID userId, OrderStatus status, Pageable pageable) {
        return orderRepository.findByUserIdAndStatus(userId, status, pageable)
                .map(orderMapper::toOrderResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(UUID id, OrderStatusUpdateRequest request) {
        Order order = findOrderById(id);

        order.setStatus(request.getStatus());

        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }

        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    @Override
    @Transactional
    public void cancelOrder(UUID id, UUID userId) {
        Order order = findOrderById(id);

        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedOperationException("No está autorizado para cancelar esta orden");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PROCESSING) {
            throw new IllegalStateException("No se puede cancelar una orden que ya ha sido enviada o entregada");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Actualizar el estado del pago a reembolsado si ya estaba completado
        Payment payment = order.getPayment();
        if (payment != null && payment.getStatus() == PaymentStatus.COMPLETED) {
            paymentService.updatePaymentStatus(payment.getId(), PaymentStatus.REFUNDED);
        }
    }

    private Order findOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Orden no encontrada con ID: " + id));
    }
}