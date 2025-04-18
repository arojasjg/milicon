package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicon.productservice.application.service.ProductServiceImpl;
import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.application.exception.CategoryNotFoundException;
import com.ecommerce.milicons.productservice.application.exception.ProductNotFoundException;
import com.ecommerce.milicons.productservice.application.mapper.ProductMapper;
import com.ecommerce.milicons.productservice.domain.model.Category;
import com.ecommerce.milicons.productservice.domain.model.Product;
import com.ecommerce.milicons.productservice.domain.repository.CategoryRepository;
import com.ecommerce.milicons.productservice.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private ProductResponse productResponse;
    private ProductRequest productRequest;
    private Category category;
    private UUID productId;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        productId = UUID.randomUUID();
        categoryId = UUID.randomUUID();

        category = Category.builder()
                .id(categoryId)
                .name("milicons")
                .build();

        product = Product.builder()
                .id(productId)
                .name("Basketball")
                .description("Professional basketball")
                .price(new BigDecimal("29.99"))
                .stock(10)
                .category(category)
                .active(true)
                .build();

        productResponse = ProductResponse.builder()
                .id(productId)
                .name("Basketball")
                .description("Professional basketball")
                .price(new BigDecimal("29.99"))
                .stock(10)
                .categoryId(categoryId)
                .categoryName("milicons")
                .active(true)
                .build();

        productRequest = ProductRequest.builder()
                .name("Basketball")
                .description("Professional basketball")
                .price(new BigDecimal("29.99"))
                .stock(10)
                .categoryId(categoryId)
                .build();
    }

    @Test
    void getProductById_ExistingProduct_ReturnsProductResponse() {
        // Arrange
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);

        // Act
        ProductResponse result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Basketball", result.getName());
        assertEquals(new BigDecimal("29.99"), result.getPrice());
        verify(productRepository).findById(productId);
        verify(productMapper).toProductResponse(product);
    }

    @Test
    void getProductById_NonExistingProduct_ThrowsProductNotFoundException() {
        // Arrange
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProductNotFoundException.class, () -> productService.getProductById(productId));
        verify(productRepository).findById(productId);
        verify(productMapper, never()).toProductResponse(any());
    }

    @Test
    void createProduct_ValidRequest_ReturnsProductResponse() {
        // Arrange
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(productMapper.toProduct(productRequest, category)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);

        // Act
        ProductResponse result = productService.createProduct(productRequest);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("Basketball", result.getName());
        assertEquals(new BigDecimal("29.99"), result.getPrice());
        verify(categoryRepository).findById(categoryId);
        verify(productMapper).toProduct(productRequest, category);
        verify(productRepository).save(product);
        verify(productMapper).toProductResponse(product);
    }

    @Test
    void createProduct_InvalidCategory_ThrowsCategoryNotFoundException() {
        // Arrange
        when(categoryRepository.findById(categoryId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CategoryNotFoundException.class, () -> productService.createProduct(productRequest));
        verify(categoryRepository).findById(categoryId);
        verify(productMapper, never()).toProduct(any(), any());
        verify(productRepository, never()).save(any());
        verify(productMapper, never()).toProductResponse(any());
    }

    @Test
    void getAllProducts_ReturnsPageOfProductResponses() {
        // Arrange
        Pageable pageable = Pageable.unpaged();
        List<Product> products = Arrays.asList(product);
        Page<Product> productPage = new PageImpl<>(products);
        Page<ProductResponse> expectedPage = new PageImpl<>(Arrays.asList(productResponse));

        when(productRepository.findAll(pageable)).thenReturn(productPage);
        when(productMapper.toProductResponse(product)).thenReturn(productResponse);

        // Act
        Page<ProductResponse> result = productService.getAllProducts(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(productResponse, result.getContent().get(0));
        verify(productRepository).findAll(pageable);
        verify(productMapper).toProductResponse(product);
    }
}