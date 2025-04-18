package com.ecommerce.milicon.orderservice;

import com.ecommerce.milicon.orderservice.application.dto.cart.CartItemRequest;
import com.ecommerce.milicon.orderservice.application.dto.order.OrderRequest;
import com.ecommerce.milicon.orderservice.application.dto.payment.PaymentRequest;
import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressRequest;
import com.ecommerce.milicon.orderservice.domain.model.PaymentMethod;
import com.ecommerce.milicon.orderservice.infrastructure.client.ProductClient;
import com.ecommerce.milicon.orderservice.infrastructure.client.dto.ProductDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class OrderServiceE2ETest {

        @Container
        static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0")
                        .withDatabaseName("testdb")
                        .withUsername("test")
                        .withPassword("test");

        @DynamicPropertySource
        static void registerMySQLProperties(DynamicPropertyRegistry registry) {
                registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
                registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
                registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        }

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private ProductClient productClient;

        @Test
        public void testCartAndOrderFlow() throws Exception {
                // Mock product client
                UUID productId = UUID.randomUUID();
                ProductDto productDto = ProductDto.builder()
                                .id(productId)
                                .name("Basketball")
                                .description("Professional basketball")
                                .price(new BigDecimal("29.99"))
                                .stock(10)
                                .imageUrl("http://example.com/basketball.jpg")
                                .active(true)
                                .build();
                when(productClient.getProduct(any(UUID.class))).thenReturn(productDto);

                // Set user ID in header
                UUID userId = UUID.randomUUID();
                String userEmail = "test@example.com";

                // Add item to cart
                CartItemRequest cartItemRequest = CartItemRequest.builder()
                                .productId(productId)
                                .quantity(2)
                                .build();

                mockMvc.perform(post("/carts/items")
                                .header("X-User-ID", userId.toString())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(cartItemRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.items", hasSize(1)))
                                .andExpect(jsonPath("$.items[0].productId").value(productId.toString()))
                                .andExpect(jsonPath("$.items[0].quantity").value(2));

                // Get cart
                mockMvc.perform(get("/carts")
                                .header("X-User-ID", userId.toString()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.items", hasSize(1)));

                // Create order
                ShippingAddressRequest shippingAddressRequest = ShippingAddressRequest.builder()
                                .recipientName("John Doe")
                                .streetAddress("123 Main St")
                                .city("New York")
                                .state("NY")
                                .postalCode("10001")
                                .country("USA")
                                .phoneNumber("123-456-7890")
                                .build();

                PaymentRequest paymentRequest = PaymentRequest.builder()
                                .paymentMethod(PaymentMethod.CREDIT_CARD)
                                .cardNumber("4111111111111111")
                                .cardHolderName("John Doe")
                                .expirationDate("12/25")
                                .cvv("123")
                                .build();

                OrderRequest orderRequest = OrderRequest.builder()
                                .shippingAddress(shippingAddressRequest)
                                .payment(paymentRequest)
                                .notes("Please deliver in the morning")
                                .build();

                MvcResult orderResult = mockMvc.perform(post("/orders")
                                .header("X-User-ID", userId.toString())
                                .header("X-User-Email", userEmail)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(orderRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").exists())
                                .andExpect(jsonPath("$.userId").value(userId.toString()))
                                .andExpect(jsonPath("$.userEmail").value(userEmail))
                                .andExpect(jsonPath("$.items", hasSize(1)))
                                .andReturn();

                // Extract order ID
                String orderResponse = orderResult.getResponse().getContentAsString();
                String orderId = objectMapper.readTree(orderResponse).get("id").asText();

                // Get order by ID
                mockMvc.perform(get("/orders/" + orderId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(orderId));

                // Get orders by user
                mockMvc.perform(get("/orders/user")
                                .header("X-User-ID", userId.toString()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content", hasSize(1)));

                // Verify cart is empty after order creation
                mockMvc.perform(get("/carts")
                                .header("X-User-ID", userId.toString()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.items", hasSize(0)));
        }
}