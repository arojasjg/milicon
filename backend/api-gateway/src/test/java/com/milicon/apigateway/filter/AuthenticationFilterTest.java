package com.milicon.apigateway.filter;

import com.miliconstore.apigateway.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private GatewayFilterChain filterChain;

    @InjectMocks
    private AuthenticationFilter authenticationFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void filter_NoAuthorizationHeader_ReturnUnauthorized() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/products")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        // Act
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
        verify(filterChain, never()).filter(exchange);
    }

    @Test
    void filter_InvalidAuthorizationHeader_ReturnUnauthorized() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/products")
                .header("Authorization", "Invalid")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        // Act
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
        verify(filterChain, never()).filter(exchange);
    }

    @Test
    void filter_InvalidToken_ReturnUnauthorized() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/products")
                .header("Authorization", "Bearer invalidToken")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        when(jwtUtil.validateToken("invalidToken")).thenReturn(false);

        // Act
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.UNAUTHORIZED, exchange.getResponse().getStatusCode());
        verify(jwtUtil).validateToken("invalidToken");
        verify(filterChain, never()).filter(exchange);
    }

    @Test
    void filter_ValidToken_ContinueFilterChain() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/products")
                .header("Authorization", "Bearer validToken")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        when(jwtUtil.validateToken("validToken")).thenReturn(true);
        when(jwtUtil.extractUserId("validToken")).thenReturn("1");
        when(filterChain.filter(exchange)).thenReturn(Mono.empty());

        // Act
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Assert
        assertNotNull(result);
        verify(jwtUtil).validateToken("validToken");
        verify(jwtUtil).extractUserId("validToken");
        verify(filterChain).filter(exchange);
    }

    @Test
    void filter_PublicEndpoint_SkipAuthentication() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/api/auth/login")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        when(filterChain.filter(exchange)).thenReturn(Mono.empty());

        // Act
        Mono<Void> result = authenticationFilter.filter(exchange, filterChain);

        // Assert
        assertNotNull(result);
        verify(jwtUtil, never()).validateToken(anyString());
        verify(filterChain).filter(exchange);
    }
}