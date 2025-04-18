package com.ecommerce.milicons.productservice.infrastructure.rest;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.service.ProductService;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductUpdateRequest updateRequest = productMapper.toProductUpdateRequest(request);
        return ResponseEntity.ok(productService.createProduct(updateRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateRequest updateRequest) {
        return ResponseEntity.ok(productService.updateProduct(id, updateRequest));
    }
}