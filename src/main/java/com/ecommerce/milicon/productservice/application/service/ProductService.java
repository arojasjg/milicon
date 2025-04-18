package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;

import java.util.UUID;

public interface ProductService {
    ProductResponse updateProduct(UUID id, ProductUpdateRequest updateRequest);

    ProductResponse createProduct(ProductUpdateRequest createRequest);
}