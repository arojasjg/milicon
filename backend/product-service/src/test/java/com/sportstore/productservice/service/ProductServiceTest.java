package com.miliconstore.productservice.service;

import com.miliconstore.productservice.dto.ProductDto;
import com.miliconstore.productservice.entity.Category;
import com.miliconstore.productservice.entity.Product;
import com.miliconstore.productservice.repository.CategoryRepository;
import com.miliconstore.productservice.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProduct_Success() {
        // Arrange
        ProductDto productDto = new ProductDto();
        productDto.setName("Running Shoes");
        productDto.setDescription("Professional running shoes");
        productDto.setPrice(new BigDecimal("99.99"));
        productDto.setStock(50);
        productDto.setCategoryId(1L);

        Category category = new Category();
        category.setId(1L);
        category.setName("Footwear");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> {
            Product p = i.getArgument(0);
            p.setId(1L);
            return p;
        });

        // Act
        Product result = productService.createProduct(productDto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Running Shoes", result.getName());
        assertEquals("Professional running shoes", result.getDescription());
        assertEquals(0, new BigDecimal("99.99").compareTo(result.getPrice()));
        assertEquals(50, result.getStock());
        assertEquals(category, result.getCategory());

        verify(categoryRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_CategoryNotFound() {
        // Arrange
        ProductDto productDto = new ProductDto();
        productDto.setName("Running Shoes");
        productDto.setCategoryId(999L);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.createProduct(productDto);
        });

        assertTrue(exception.getMessage().contains("Category not found"));
        verify(categoryRepository).findById(999L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void findAllProducts_Success() {
        // Arrange
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Running Shoes");

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Tennis Racket");

        List<Product> products = Arrays.asList(product1, product2);
        Page<Product> productPage = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 10);

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        // Act
        Page<Product> result = productService.findAllProducts(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(products, result.getContent());

        verify(productRepository).findAll(pageable);
    }

    @Test
    void findProductById_Success() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Running Shoes");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        Optional<Product> result = productService.findProductById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Running Shoes", result.get().getName());

        verify(productRepository).findById(1L);
    }

    @Test
    void updateProduct_Success() {
        // Arrange
        Long productId = 1L;

        Product existingProduct = new Product();
        existingProduct.setId(productId);
        existingProduct.setName("Old Name");
        existingProduct.setPrice(new BigDecimal("79.99"));
        existingProduct.setStock(10);

        ProductDto updateDto = new ProductDto();
        updateDto.setName("New Name");
        updateDto.setPrice(new BigDecimal("89.99"));
        updateDto.setStock(20);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        Product result = productService.updateProduct(productId, updateDto);

        // Assert
        assertNotNull(result);
        assertEquals(productId, result.getId());
        assertEquals("New Name", result.getName());
        assertEquals(0, new BigDecimal("89.99").compareTo(result.getPrice()));
        assertEquals(20, result.getStock());

        verify(productRepository).findById(productId);
        verify(productRepository).save(existingProduct);
    }
}