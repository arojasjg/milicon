package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.exception.CategoryNotFoundException;
import com.ecommerce.milicons.productservice.application.exception.ProductNotFoundException;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return productMapper.toProductResponse(product);
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(UUID categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + categoryId));

        Page<Product> products = productRepository.findByCategory(category, pageable);
        return products.map(productMapper::toProductResponse);
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest) {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(
                        "Category not found with id: " + productRequest.getCategoryId()));

        Product product = productMapper.toProduct(productRequest);
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(
                        "Category not found with id: " + productRequest.getCategoryId()));

        productMapper.updateProductFromRequest(existingProduct, productRequest);
        existingProduct.setCategory(category);

        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toProductResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
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
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(query, pageable)
                .map(productMapper::toProductResponse);
    }

    @Override
    public Page<ProductResponse> searchProductsByCategory(UUID categoryId, String query, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + categoryId));

        return productRepository.findByCategoryAndNameContainingIgnoreCase(category, query, pageable)
                .map(productMapper::toProductResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
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
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + categoryId));

        return productRepository.findByCategoryAndStockGreaterThan(category, 0, pageable)
                .map(productMapper::toProductResponse);
    }

    @Override
    public Page<ProductResponse> getTopRatedProducts(Pageable pageable) {
        return productRepository.findByOrderByAverageRatingDesc(pageable)
                .map(productMapper::toProductResponse);
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