package com.miliconstore.productservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miliconstore.productservice.dto.ProductDto;
import com.miliconstore.productservice.entity.Category;
import com.miliconstore.productservice.entity.Product;
import com.miliconstore.productservice.repository.CategoryRepository;
import com.miliconstore.productservice.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private ObjectMapper objectMapper;

        private Category footwearCategory;
        private Product runningShoes;

        @BeforeEach
        void setUp() {
                // Clean up repositories
                productRepository.deleteAll();
                categoryRepository.deleteAll();

                // Create test data
                footwearCategory = new Category();
                footwearCategory.setName("Footwear");
                footwearCategory = categoryRepository.save(footwearCategory);

                runningShoes = new Product();
                runningShoes.setName("Running Shoes");
                runningShoes.setDescription("Professional running shoes");
                runningShoes.setPrice(new BigDecimal("99.99"));
                runningShoes.setStock(50);
                runningShoes.setCategory(footwearCategory);
                runningShoes = productRepository.save(runningShoes);
        }

        @Test
        void getAllProducts_ReturnsProducts() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/products")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content", hasSize(1)))
                                .andExpect(jsonPath("$.content[0].id", is(runningShoes.getId().intValue())))
                                .andExpect(jsonPath("$.content[0].name", is("Running Shoes")))
                                .andExpect(jsonPath("$.content[0].price", is(99.99)))
                                .andExpect(jsonPath("$.content[0].stock", is(50)))
                                .andExpect(jsonPath("$.content[0].category.name", is("Footwear")));
        }

        @Test
        void getProductById_ExistingProduct_ReturnsProduct() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/products/{id}", runningShoes.getId())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(runningShoes.getId().intValue())))
                                .andExpect(jsonPath("$.name", is("Running Shoes")))
                                .andExpect(jsonPath("$.price", is(99.99)))
                                .andExpect(jsonPath("$.stock", is(50)))
                                .andExpect(jsonPath("$.category.name", is("Footwear")));
        }

        @Test
        void getProductById_NonExistingProduct_ReturnsNotFound() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/products/{id}", 999)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound());
        }

        @Test
        void createProduct_ValidData_ReturnsCreatedProduct() throws Exception {
                // Arrange
                ProductDto productDto = new ProductDto();
                productDto.setName("Tennis Racket");
                productDto.setDescription("Professional tennis racket");
                productDto.setPrice(new BigDecimal("129.99"));
                productDto.setStock(30);
                productDto.setCategoryId(footwearCategory.getId());

                // Act
                ResultActions result = mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(productDto)));

                // Assert
                result.andExpect(status().isCreated())
                                .andExpect(jsonPath("$.name", is("Tennis Racket")))
                                .andExpect(jsonPath("$.description", is("Professional tennis racket")))
                                .andExpect(jsonPath("$.price", is(129.99)))
                                .andExpect(jsonPath("$.stock", is(30)))
                                .andExpect(jsonPath("$.category.id", is(footwearCategory.getId().intValue())));
        }

        @Test
        void updateProduct_ValidData_ReturnsUpdatedProduct() throws Exception {
                // Arrange
                ProductDto updateDto = new ProductDto();
                updateDto.setName("Updated Running Shoes");
                updateDto.setPrice(new BigDecimal("109.99"));
                updateDto.setStock(40);

                // Act
                ResultActions result = mockMvc.perform(put("/api/products/{id}", runningShoes.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateDto)));

                // Assert
                result.andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(runningShoes.getId().intValue())))
                                .andExpect(jsonPath("$.name", is("Updated Running Shoes")))
                                .andExpect(jsonPath("$.price", is(109.99)))
                                .andExpect(jsonPath("$.stock", is(40)))
                                .andExpect(jsonPath("$.category.name", is("Footwear")));
        }

        @Test
        void deleteProduct_ExistingProduct_ReturnsNoContent() throws Exception {
                // Act & Assert
                mockMvc.perform(delete("/api/products/{id}", runningShoes.getId())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNoContent());

                // Verify product is deleted
                mockMvc.perform(get("/api/products/{id}", runningShoes.getId())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound());
        }

        @Test
        void searchProducts_ByName_ReturnsMatchingProducts() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/products/search")
                                .param("name", "Running")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content", hasSize(1)))
                                .andExpect(jsonPath("$.content[0].name", is("Running Shoes")));
        }

        @Test
        void searchProducts_ByCategoryId_ReturnsMatchingProducts() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/api/products/search")
                                .param("categoryId", footwearCategory.getId().toString())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content", hasSize(1)))
                                .andExpect(jsonPath("$.content[0].category.id",
                                                is(footwearCategory.getId().intValue())));
        }
}