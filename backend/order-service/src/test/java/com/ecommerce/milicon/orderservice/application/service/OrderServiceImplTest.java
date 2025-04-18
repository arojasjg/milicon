package com.ecommerce.milicon.orderservice.application.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.ecommerce.milicon.orderservice.application.dto.order.OrderRequest;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderResponse;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderStatusUpdateRequest;
import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentRequest;
import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressRequest;
import com.ecommerce.milicon.orderservice.application.exception.EmptyCartException;
import com.ecommerce.milicon.orderservice.application.exception.OrderNotFoundException;
import com.ecommerce.milicon.orderservice.application.exception.UnauthorizedOperationException;
import com.ecommerce.milicon.orderservice.application.mapper.OrderMapper;
import com.ecommerce.milicon.orderservice.application.mapper.ShippingAddressMapper;
import com.ecommerce.milicon.orderservice.application.service.CartService;
import com.ecommerce.milicon.orderservice.application.service.PaymentService;
import com.ecommerce.milicon.orderservice.domain.model.*;
import com.ecommerce.milicon.orderservice.domain.repository.OrderRepository;
import com.ecommerce.milicon.orderservice.infrastructure.client.ProductClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

        @Mock
        private OrderRepository orderRepository;

        @Mock
        private CartService cartService;

        @Mock
        private PaymentService paymentService;

        @Mock
        private OrderMapper orderMapper;

        @Mock
        private ShippingAddressMapper shippingAddressMapper;

        @Mock
        private ProductClient productClient;

        @InjectMocks
        private OrderServiceImpl orderService;

        private UUID userId;
        private UUID orderId;
        private Cart cart;
        private Order order;
        private OrderResponse orderResponse;
        private OrderRequest orderRequest;
        private ShippingAddressRequest shippingAddressRequest;
        private PaymentRequest paymentRequest;
        private ShippingAddress shippingAddress;
        private Payment payment;

        @BeforeEach
        void setUp() {
                userId = UUID.randomUUID();
                orderId = UUID.randomUUID();

                // Setup cart with items
                CartItem cartItem = CartItem.builder()
                                .id(UUID.randomUUID())
                                .productId(UUID.randomUUID())
                                .productName("Basketball")
                                .price(new BigDecimal("29.99"))
                                .quantity(2)
                                .build();

                cart = Cart.builder()
                                .id(UUID.randomUUID())
                                .userId(userId)
                                .items(Collections.singletonList(cartItem))
                                .build();

                // Setup shipping address
                shippingAddress = ShippingAddress.builder()
                                .id(UUID.randomUUID())
                                .recipientName("John Doe")
                                .streetAddress("123 Main St")
                                .city("New York")
                                .state("NY")
                                .postalCode("10001")
                                .country("USA")
                                .build();

                // Setup payment
                payment = Payment.builder()
                                .id(UUID.randomUUID())
                                .amount(new BigDecimal("59.98"))
                                .paymentMethod(PaymentMethod.CREDIT_CARD)
                                .status(PaymentStatus.COMPLETED)
                                .transactionId("TRX-12345")
                                .build();

                // Setup order
                OrderItem orderItem = OrderItem.builder()
                                .id(UUID.randomUUID())
                                .productId(UUID.randomUUID())
                                .productName("Basketball")
                                .price(new BigDecimal("29.99"))
                                .quantity(2)
                                .build();

                order = Order.builder()
                                .id(orderId)
                                .userId(userId)
                                .userEmail("user@example.com")
                                .totalAmount(new BigDecimal("59.98"))
                                .status(OrderStatus.PENDING)
                                .shippingAddress(shippingAddress)
                                .payment(payment)
                                .items(Collections.singletonList(orderItem))
                                .createdAt(LocalDateTime.now())
                                .build();

                // Setup DTOs
                shippingAddressRequest = ShippingAddressRequest.builder()
                                .recipientName("John Doe")
                                .streetAddress("123 Main St")
                                .city("New York")
                                .state("NY")
                                .postalCode("10001")
                                .country("USA")
                                .build();

                paymentRequest = PaymentRequest.builder()
                                .paymentMethod(PaymentMethod.CREDIT_CARD)
                                .cardNumber("4111111111111111")
                                .cardHolderName("John Doe")
                                .expirationDate("12/25")
                                .cvv("123")
                                .build();

                orderRequest = OrderRequest.builder()
                                .shippingAddress(shippingAddressRequest)
                                .payment(paymentRequest)
                                .notes("Please deliver ASAP")
                                .build();

                orderResponse = OrderResponse.builder()
                                .id(orderId)
                                .userId(userId)
                                .userEmail("user@example.com")
                                .totalAmount(new BigDecimal("59.98"))
                                .status(OrderStatus.PENDING)
                                .items(Collections.emptyList()) // Simplified for test
                                .createdAt(LocalDateTime.now())
                                .build();
        }

        @Test
        void createOrder_ValidRequest_ReturnsOrderResponse() {
                // Arrange
                when(cartService.findCartByUserId(userId)).thenReturn(cart);
                when(shippingAddressMapper.toShippingAddress(shippingAddressRequest)).thenReturn(shippingAddress);
                when(paymentService.processPayment(eq(paymentRequest), any(BigDecimal.class), any(UUID.class)))
                                .thenReturn(payment);
                when(orderRepository.save(any(Order.class))).thenReturn(order);
                when(orderMapper.toOrderResponse(order)).thenReturn(orderResponse);

                // Act
                OrderResponse result = orderService.createOrder(userId, "user@example.com", orderRequest);

                // Assert
                assertNotNull(result);
                assertEquals(orderId, result.getId());
                assertEquals(userId, result.getUserId());
                assertEquals(new BigDecimal("59.98"), result.getTotalAmount());
                assertEquals(OrderStatus.PENDING, result.getStatus());
                verify(cartService).findCartByUserId(userId);
                verify(shippingAddressMapper).toShippingAddress(shippingAddressRequest);
                verify(paymentService).processPayment(eq(paymentRequest), any(BigDecimal.class), any(UUID.class));
                verify(orderRepository).save(any(Order.class));
                verify(orderMapper).toOrderResponse(order);
                verify(cartService).clearCart(userId);
        }

        @Test
        void createOrder_EmptyCart_ThrowsEmptyCartException() {
                // Arrange
                Cart emptyCart = Cart.builder()
                                .id(UUID.randomUUID())
                                .userId(userId)
                                .items(Collections.emptyList())
                                .build();

                when(cartService.findCartByUserId(userId)).thenReturn(emptyCart);

                // Act & Assert
                assertThrows(EmptyCartException.class,
                                () -> orderService.createOrder(userId, "user@example.com", orderRequest));
                verify(cartService).findCartByUserId(userId);
                verify(shippingAddressMapper, never()).toShippingAddress(any());
                verify(paymentService, never()).processPayment(any(), any(), any());
                verify(orderRepository, never()).save(any());
                verify(orderMapper, never()).toOrderResponse(any());
                verify(cartService, never()).clearCart(any());
        }

        @Test
        void getOrderById_ExistingOrder_ReturnsOrderResponse() {
                // Arrange
                when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
                when(orderMapper.toOrderResponse(order)).thenReturn(orderResponse);

                // Act
                OrderResponse result = orderService.getOrderById(orderId);

                // Assert
                assertNotNull(result);
                assertEquals(orderId, result.getId());
                verify(orderRepository).findById(orderId);
                verify(orderMapper).toOrderResponse(order);
        }

        @Test
        void getOrderById_NonExistingOrder_ThrowsOrderNotFoundException() {
                // Arrange
                when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

                // Act & Assert
                assertThrows(OrderNotFoundException.class, () -> orderService.getOrderById(orderId));
                verify(orderRepository).findById(orderId);
                verify(orderMapper, never()).toOrderResponse(any());
        }

        @Test
        void getOrdersByUserId_ReturnsPageOfOrderResponses() {
                // Arrange
                Pageable pageable = Pageable.unpaged();
                List<Order> orders = Collections.singletonList(order);
                Page<Order> orderPage = new PageImpl<>(orders);

                when(orderRepository.findByUserId(userId, pageable)).thenReturn(orderPage);
                when(orderMapper.toOrderResponse(order)).thenReturn(orderResponse);

                // Act
                Page<OrderResponse> result = orderService.getOrdersByUserId(userId, pageable);

                // Assert
                assertNotNull(result);
                assertEquals(1, result.getTotalElements());
                assertEquals(orderResponse, result.getContent().get(0));
                verify(orderRepository).findByUserId(userId, pageable);
                verify(orderMapper).toOrderResponse(order);
        }

        @Test
        void updateOrderStatus_ExistingOrder_ReturnsUpdatedOrderResponse() {
                // Arrange
                OrderStatusUpdateRequest updateRequest = new OrderStatusUpdateRequest(OrderStatus.SHIPPED, "TRK-12345",
                                "Order shipped");
                Order updatedOrder = Order.builder()
                                .id(orderId)
                                .userId(userId)
                                .userEmail("user@example.com")
                                .totalAmount(new BigDecimal("59.98"))
                                .status(OrderStatus.SHIPPED)
                                .trackingNumber("TRK-12345")
                                .notes("Order shipped")
                                .shippingAddress(shippingAddress)
                                .payment(payment)
                                .items(order.getItems())
                                .createdAt(order.getCreatedAt())
                                .updatedAt(LocalDateTime.now())
                                .build();

                OrderResponse updatedResponse = OrderResponse.builder()
                                .id(orderId)
                                .userId(userId)
                                .userEmail("user@example.com")
                                .totalAmount(new BigDecimal("59.98"))
                                .status(OrderStatus.SHIPPED)
                                .trackingNumber("TRK-12345")
                                .notes("Order shipped")
                                .createdAt(order.getCreatedAt())
                                .updatedAt(LocalDateTime.now())
                                .build();

                when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
                when(orderRepository.save(any(Order.class))).thenReturn(updatedOrder);
                when(orderMapper.toOrderResponse(updatedOrder)).thenReturn(updatedResponse);

                // Act
                OrderResponse result = orderService.updateOrderStatus(orderId, updateRequest);

                // Assert
                assertNotNull(result);
                assertEquals(orderId, result.getId());
                assertEquals(OrderStatus.SHIPPED, result.getStatus());
                assertEquals("TRK-12345", result.getTrackingNumber());
                assertEquals("Order shipped", result.getNotes());
                verify(orderRepository).findById(orderId);
                verify(orderRepository).save(any(Order.class));
                verify(orderMapper).toOrderResponse(updatedOrder);
        }

        @Test
        void cancelOrder_AuthorizedUser_CancelsOrder() {
                // Arrange
                when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

                // Act
                orderService.cancelOrder(orderId, userId);

                // Assert
                verify(orderRepository).findById(orderId);
                verify(orderRepository).save(any(Order.class));
        }

        @Test
        void cancelOrder_UnauthorizedUser_ThrowsUnauthorizedOperationException() {
                // Arrange
                UUID differentUserId = UUID.randomUUID();
                when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

                // Act & Assert
                assertThrows(UnauthorizedOperationException.class,
                                () -> orderService.cancelOrder(orderId, differentUserId));
                verify(orderRepository).findById(orderId);
                verify(orderRepository, never()).save(any());
        }
}