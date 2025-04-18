
package com.ecommerce.milicon.productservice.application.service.impl;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.exception.CategoryNotFoundException;
import com.ecommerce.milicons.productservice.application.exception.ProductNotFoundException;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
import com.ecommerce.milicons.productservice.application.service.ProductService;
import com.ecommerce.milicons.productservice.domain.model.Category;
import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.repository.CategoryRepository;
import com.ecommerce.milicons.productservice.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;
        private final ProductMapper productMapper;

        @Override
        @Transactional
        public ProductResponse createProduct(ProductRequest productRequest) {
                Category category = categoryRepository.findById(productRequest.getCategoryId())
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + productRequest.getCategoryId()));

                Product product = Product.builder()
                                .name(productRequest.getName())
                                .description(productRequest.getDescription())
                                .price(productRequest.getPrice())
                                .stock(productRequest.getStock())
                                .imageUrl(productRequest.getImageUrl())
                                .active(true) // Siempre activo al crear
                                .category(category)
                                .build();

                Product savedProduct = productRepository.save(product);
                return productMapper.toProductResponse(savedProduct);
        }

        @Override
        @Transactional(readOnly = true)
        public ProductResponse getProductById(UUID id) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
                return productMapper.toProductResponse(product);
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProductResponse> getAllProducts() {
                return productRepository.findAll().stream()
                                .map(productMapper::toProductResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public Page<ProductResponse> getAllProducts(Pageable pageable) {
                return productRepository.findAll(pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> getAllActiveProducts(Pageable pageable) {
                return productRepository.findByActiveTrue(pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProductResponse> getProductsByCategory(UUID categoryId) {
                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + categoryId));

                return productRepository.findByCategory(category).stream()
                                .map(productMapper::toProductResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public Page<ProductResponse> getProductsByCategory(UUID categoryId, Pageable pageable) {
                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + categoryId));

                return productRepository.findByCategory(category, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
                return productRepository.findByNameContainingIgnoreCase(query, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> searchProductsByCategory(UUID categoryId, String query, Pageable pageable) {
                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + categoryId));

                return productRepository.findByCategoryAndNameContainingIgnoreCase(category, query, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice,
                        Pageable pageable) {
                return productRepository.findByPriceBetween(minPrice, maxPrice, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> getProductsInStock(Pageable pageable) {
                return productRepository.findByStockGreaterThan(0, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> getProductsByCategoryAndInStock(UUID categoryId, Pageable pageable) {
                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + categoryId));

                return productRepository.findByCategoryAndStockGreaterThan(category, 0, pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        public Page<ProductResponse> getTopRatedProducts(Pageable pageable) {
                return productRepository.findByOrderByAverageRatingDesc(pageable)
                                .map(productMapper::toProductResponse);
        }

        @Override
        @Transactional
        public ProductResponse updateProduct(UUID id, ProductUpdateRequest request) {
                Product existingProduct = productRepository.findById(id)
                                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

                Category category = categoryRepository.findById(request.getCategoryId())
                                .orElseThrow(() -> new CategoryNotFoundException(
                                                "Category not found with id: " + request.getCategoryId()));

                existingProduct.setName(request.getName());
                existingProduct.setDescription(request.getDescription());
                existingProduct.setPrice(request.getPrice());
                existingProduct.setStock(request.getStock());
                existingProduct.setCategory(category);
                existingProduct.setImageUrl(request.getImageUrl());

                Product updatedProduct = productRepository.save(existingProduct);
                return productMapper.toProductResponse(updatedProduct);
        }

        @Override
        @Transactional
        public void deleteProduct(UUID id) {
                if (!productRepository.existsById(id)) {
                        throw new ProductNotFoundException("Product not found with id: " + id);
                }
                productRepository.deleteById(id);
        }

        @Override
        public Product findProductEntityById(UUID id) {
                return productRepository.findById(id)
                                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        }

        @Override
        @Transactional
        public boolean reduceStock(UUID id, int quantity) {
                Product product = findProductEntityById(id);

                if (product.getStock() < quantity) {
                        return false;
                }

                product.setStock(product.getStock() - quantity);
                productRepository.save(product);
                return true;
        }
}