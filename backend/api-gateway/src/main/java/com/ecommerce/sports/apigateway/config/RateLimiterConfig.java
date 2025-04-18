package com.ecommerce.milicons.apigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(exchange.getRequest().getRemoteAddress().getHostName());
    }

    @Bean
    public RedisRateLimiter authRateLimiter() {
        // Permitir 5 solicitudes por segundo con un burst de 10 solicitudes
        return new RedisRateLimiter(5, 10);
    }

    @Bean
    public RedisRateLimiter defaultRateLimiter() {
        // Permitir 20 solicitudes por segundo con un burst de 40 solicitudes
        return new RedisRateLimiter(20, 40);
    }
}