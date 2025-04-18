package com.ecommerce.milicons.productservice.infrastructure.rest;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.service.ProductService;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
import com.ecommerce.milicons.productservice.domain.model.Product;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        ProductResponse productResponse = productService.createProduct(productRequest);
        return new ResponseEntity<>(productResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID id) {
        ProductResponse productResponse = productService.getProductById(id);
        return ResponseEntity.ok(productResponse);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable UUID categoryId) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/active")
    public ResponseEntity<Page<ProductResponse>> getAllActiveProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllActiveProducts(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String query, Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(query, pageable));
    }

    @GetMapping("/category/{categoryId}/search")
    public ResponseEntity<Page<ProductResponse>> searchProductsByCategory(
            @PathVariable UUID categoryId, @RequestParam String query, Pageable pageable) {
        return ResponseEntity.ok(productService.searchProductsByCategory(categoryId, query, pageable));
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductResponse>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByPriceRange(minPrice, maxPrice, pageable));
    }

    @GetMapping("/in-stock")
    public ResponseEntity<Page<ProductResponse>> getProductsInStock(Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsInStock(pageable));
    }

    @GetMapping("/category/{categoryId}/in-stock")
    public ResponseEntity<Page<ProductResponse>> getProductsByCategoryAndInStock(
            @PathVariable UUID categoryId, Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategoryAndInStock(categoryId, pageable));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<Page<ProductResponse>> getTopRatedProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getTopRatedProducts(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse productResponse = productService.updateProduct(id, request);
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}