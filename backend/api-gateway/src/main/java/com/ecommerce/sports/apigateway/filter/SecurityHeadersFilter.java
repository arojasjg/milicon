package com.ecommerce.milicons.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class SecurityHeadersFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange)
                .then(Mono.defer(() -> {
                    ServerHttpResponse response = exchange.getResponse();

                    // Añadir encabezados de seguridad
                    response.getHeaders().add("X-Content-Type-Options", "nosniff");
                    response.getHeaders().add("X-Frame-Options", "DENY");
                    response.getHeaders().add("X-XSS-Protection", "1; mode=block");
                    response.getHeaders().add("Strict-Tranmilicon-Security", "max-age=31536000; includeSubDomains");
                    response.getHeaders().add("Content-Security-Policy",
                            "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; connect-src 'self'");
                    response.getHeaders().add("Referrer-Policy", "no-referrer-when-downgrade");
                    response.getHeaders().add("Feature-Policy", "camera 'none'; microphone 'none'; geolocation 'none'");

                    return Mono.empty();
                }));
    }
}