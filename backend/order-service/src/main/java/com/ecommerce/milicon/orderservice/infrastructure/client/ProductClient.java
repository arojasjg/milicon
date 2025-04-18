package com.ecommerce.milicon.orderservice.infrastructure.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.ecommerce.milicon.orderservice.infrastructure.client.dto.ProductDto;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class ProductClient {

    private static final Logger logger = LoggerFactory.getLogger(ProductClient.class);
    private final RestTemplate restTemplate;

    public ProductClient(@LoadBalanced RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @CircuitBreaker(name = "productService", fallbackMethod = "getProductFallback")
    @Retry(name = "productService")
    public ProductDto getProduct(UUID productId) {
        logger.info("Calling product service to get product with ID: {}", productId);
        String url = "http://product-service/api/products/" + productId;
        return restTemplate.getForObject(url, ProductDto.class);
    }

    @CircuitBreaker(name = "productService", fallbackMethod = "reduceProductStockFallback")
    @Retry(name = "productService")
    public void reduceProductStock(UUID productId, int quantity) {
        logger.info("Calling product service to reduce stock for product with ID: {}", productId);
        String url = "http://product-service/api/products/" + productId + "/stock/reduce?quantity=" + quantity;
        restTemplate.put(url, null);
    }

    // Métodos de fallback
    private ProductDto getProductFallback(UUID productId, Exception ex) {
        logger.error("Fallback for getProduct. Error: {}", ex.getMessage());
        // Devolver un producto por defecto o lanzar una excepción personalizada
        return ProductDto.builder()
                .id(productId)
                .name("Producto no disponible")
                .description("El servicio de productos no está disponible en este momento")
                .price(BigDecimal.ZERO)
                .stock(0)
                .active(false)
                .build();
    }

    private void reduceProductStockFallback(UUID productId, int quantity, Exception ex) {
        logger.error("Fallback for reduceProductStock. Error: {}", ex.getMessage());
        // Aquí podríamos implementar una lógica para registrar la operación fallida
        // y procesarla más tarde cuando el servicio esté disponible
    }
}