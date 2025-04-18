package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponse createProduct(ProductRequest productRequest);

    ProductResponse getProductById(UUID id);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getProductsByCategory(UUID categoryId);

    ProductResponse updateProduct(UUID id, ProductUpdateRequest productUpdateRequest);

    void deleteProduct(UUID id);

    Page<ProductResponse> getAllActiveProducts(Pageable pageable);

    Page<ProductResponse> getProductsByCategory(UUID categoryId, Pageable pageable);

    Page<ProductResponse> searchProducts(String query, Pageable pageable);

    Page<ProductResponse> searchProductsByCategory(UUID categoryId, String query, Pageable pageable);

    Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    Page<ProductResponse> getProductsInStock(Pageable pageable);

    Page<ProductResponse> getProductsByCategoryAndInStock(UUID categoryId, Pageable pageable);

    Page<ProductResponse> getTopRatedProducts(Pageable pageable);

    Product findProductEntityById(UUID id);

    boolean reduceStock(UUID id, int quantity);
}