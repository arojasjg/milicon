package com.ecommerce.milicons.productservice.application.service.impl;

import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.service.ProductService;
import com.ecommerce.milicons.productservice.domain.model.Category;
import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.repository.CategoryRepository;
import com.ecommerce.milicons.productservice.domain.repository.ProductRepository;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
import com.ecommerce.milicons.productservice.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(ProductUpdateRequest createRequest) {
        Category category = null;
        if (createRequest.getCategoryId() != null) {
            category = categoryRepository.findById(createRequest.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + createRequest.getCategoryId()));
        }

        Product product = Product.builder()
                .name(createRequest.getName())
                .description(createRequest.getDescription())
                .price(createRequest.getPrice())
                .stock(createRequest.getStock())
                .category(category)
                .imageUrl(createRequest.getImageUrl())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest updateRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = null;
        if (updateRequest.getCategoryId() != null) {
            category = categoryRepository.findById(updateRequest.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + updateRequest.getCategoryId()));
        }

        // Update only the fields that are provided in the update request
        if (updateRequest.getName() != null) {
            existingProduct.setName(updateRequest.getName());
        }
        if (updateRequest.getDescription() != null) {
            existingProduct.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getPrice() != null) {
            existingProduct.setPrice(updateRequest.getPrice());
        }
        if (updateRequest.getStock() != null) {
            existingProduct.setStock(updateRequest.getStock());
        }
        if (category != null) {
            existingProduct.setCategory(category);
        }
        if (updateRequest.getImageUrl() != null) {
            existingProduct.setImageUrl(updateRequest.getImageUrl());
        }

        existingProduct.setUpdatedAt(LocalDateTime.now());
        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toProductResponse(updatedProduct);
    }
}