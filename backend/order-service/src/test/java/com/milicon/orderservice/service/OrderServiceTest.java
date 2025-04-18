package com.milicon.orderservice.service;

import com.miliconstore.orderservice.dto.OrderDto;
import com.miliconstore.orderservice.dto.OrderItemDto;
import com.miliconstore.orderservice.entity.Order;
import com.miliconstore.orderservice.entity.OrderItem;
import com.miliconstore.orderservice.entity.OrderStatus;
import com.miliconstore.orderservice.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductServiceClient productServiceClient;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrder_Success() {
        // Arrange
        OrderDto orderDto = new OrderDto();
        orderDto.setUserId(1L);

        OrderItemDto item1 = new OrderItemDto();
        item1.setProductId(1L);
        item1.setQuantity(2);
        item1.setUnitPrice(new BigDecimal("49.99"));

        OrderItemDto item2 = new OrderItemDto();
        item2.setProductId(2L);
        item2.setQuantity(1);
        item2.setUnitPrice(new BigDecimal("29.99"));

        orderDto.setItems(Arrays.asList(item1, item2));

        // Mock product service client to verify stock
        when(productServiceClient.checkProductAvailability(1L, 2)).thenReturn(true);
        when(productServiceClient.checkProductAvailability(2L, 1)).thenReturn(true);

        // Mock order repository
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order order = i.getArgument(0);
            order.setId(1L);
            return order;
        });

        // Act
        Order result = orderService.createOrder(orderDto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(2, result.getItems().size());
        assertEquals(0, new BigDecimal("129.97").compareTo(result.getTotalAmount()));

        verify(productServiceClient).checkProductAvailability(1L, 2);
        verify(productServiceClient).checkProductAvailability(2L, 1);
        verify(productServiceClient).updateProductStock(1L, 2);
        verify(productServiceClient).updateProductStock(2L, 1);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_ProductNotAvailable() {
        // Arrange
        OrderDto orderDto = new OrderDto();
        orderDto.setUserId(1L);

        OrderItemDto item = new OrderItemDto();
        item.setProductId(1L);
        item.setQuantity(10);
        item.setUnitPrice(new BigDecimal("49.99"));

        orderDto.setItems(List.of(item));

        // Mock product service client to return false for availability
        when(productServiceClient.checkProductAvailability(1L, 10)).thenReturn(false);

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            orderService.createOrder(orderDto);
        });

        assertTrue(exception.getMessage().contains("Product with ID 1 is not available in the requested quantity"));

        verify(productServiceClient).checkProductAvailability(1L, 10);
        verify(productServiceClient, never()).updateProductStock(anyLong(), anyInt());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void findOrdersByUserId_Success() {
        // Arrange
        Long userId = 1L;

        Order order1 = new Order();
        order1.setId(1L);
        order1.setUserId(userId);
        order1.setStatus(OrderStatus.COMPLETED);
        order1.setOrderDate(LocalDateTime.now().minusDays(1));

        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(userId);
        order2.setStatus(OrderStatus.PENDING);
        order2.setOrderDate(LocalDateTime.now());

        List<Order> orders = Arrays.asList(order1, order2);

        when(orderRepository.findByUserIdOrderByOrderDateDesc(userId)).thenReturn(orders);

        // Act
        List<Order> result = orderService.findOrdersByUserId(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(2L, result.get(0).getId());
        assertEquals(1L, result.get(1).getId());

        verify(orderRepository).findByUserIdOrderByOrderDateDesc(userId);
    }

    @Test
    void updateOrderStatus_Success() {
        // Arrange
        Long orderId = 1L;
        OrderStatus newStatus = OrderStatus.SHIPPED;

        Order existingOrder = new Order();
        existingOrder.setId(orderId);
        existingOrder.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(existingOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Order result = orderService.updateOrderStatus(orderId, newStatus);

        // Assert
        assertNotNull(result);
        assertEquals(orderId, result.getId());
        assertEquals(OrderStatus.SHIPPED, result.getStatus());

        verify(orderRepository).findById(orderId);
        verify(orderRepository).save(existingOrder);
    }

    @Test
    void updateOrderStatus_OrderNotFound() {
        // Arrange
        Long orderId = 999L;
        OrderStatus newStatus = OrderStatus.SHIPPED;

        when(orderRepository.findById(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus(orderId, newStatus);
        });

        assertTrue(exception.getMessage().contains("Order not found"));

        verify(orderRepository).findById(orderId);
        verify(orderRepository, never()).save(any(Order.class));
    }
}