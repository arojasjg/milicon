package com.ecommerce.milicons.productservice;

import com.ecommerce.milicons.productservice.application.dto.category.CategoryRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class ProductServiceE2ETest {

        @Container
        static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0")
                        .withDatabaseName("testdb")
                        .withUsername("test")
                        .withPassword("test");

        @DynamicPropertySource
        static void registerMySQLProperties(DynamicPropertyRegistry registry) {
                registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
                registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
                registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        }

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        public void testCategoryAndProductCRUD() throws Exception {
                // Create a category
                CategoryRequest categoryRequest = CategoryRequest.builder()
                                .name("milicons Equipment")
                                .description("All milicons equipment")
                                .build();

                MvcResult categoryResult = mockMvc.perform(post("/categories")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(categoryRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").exists())
                                .andExpect(jsonPath("$.name").value("milicons Equipment"))
                                .andReturn();

                // Extract category ID
                String categoryResponse = categoryResult.getResponse().getContentAsString();
                String categoryId = objectMapper.readTree(categoryResponse).get("id").asText();

                // Create a product in the category
                ProductRequest productRequest = ProductRequest.builder()
                                .name("Basketball")
                                .description("Professional basketball")
                                .price(new BigDecimal("29.99"))
                                .stock(10)
                                .categoryId(categoryId)
                                .build();

                MvcResult productResult = mockMvc.perform(post("/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(productRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.id").exists())
                                .andExpect(jsonPath("$.name").value("Basketball"))
                                .andExpect(jsonPath("$.price").value(29.99))
                                .andReturn();

                // Extract product ID
                String productResponse = productResult.getResponse().getContentAsString();
                String productId = objectMapper.readTree(productResponse).get("id").asText();

                // Get the product by ID
                mockMvc.perform(get("/products/" + productId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(productId))
                                .andExpect(jsonPath("$.name").value("Basketball"));

                // Update the product
                ProductRequest updateRequest = ProductRequest.builder()
                                .name("Premium Basketball")
                                .description("Professional basketball")
                                .price(new BigDecimal("39.99"))
                                .stock(15)
                                .categoryId(categoryId)
                                .build();

                mockMvc.perform(put("/products/" + productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Premium Basketball"))
                                .andExpect(jsonPath("$.price").value(39.99));

                // Get products by category
                mockMvc.perform(get("/products/category/" + categoryId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.content", hasSize(1)))
                                .andExpect(jsonPath("$.content[0].name").value("Premium Basketball"));

                // Delete the product
                mockMvc.perform(delete("/products/" + productId))
                                .andExpect(status().isNoContent());

                // Verify product is deleted
                mockMvc.perform(get("/products/" + productId))
                                .andExpect(status().isNotFound());
        }
}