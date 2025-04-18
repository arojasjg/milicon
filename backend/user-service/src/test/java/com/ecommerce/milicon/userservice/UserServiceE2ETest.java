package com.ecommerce.milicon.userservice;

import com.ecommerce.milicons.userservice.application.dto.auth.LoginRequest;
import com.ecommerce.milicons.userservice.application.dto.auth.RegisterRequest;
import com.ecommerce.milicons.userservice.application.dto.user.UserResponse;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class UserServiceE2ETest {

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
        public void testUserRegistrationLoginAndProfileAccess() throws Exception {
                // Register a new user
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .name("Test User")
                                .email("test@example.com")
                                .password("password123")
                                .build();

                mockMvc.perform(post("/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isCreated());

                // Login with the registered user
                LoginRequest loginRequest = LoginRequest.builder()
                                .email("test@example.com")
                                .password("password123")
                                .build();

                MvcResult loginResult = mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").exists())
                                .andReturn();

                // Extract token from login response
                String response = loginResult.getResponse().getContentAsString();
                String token = objectMapper.readTree(response).get("token").asText();
                assertNotNull(token);

                // Get user profile with token
                MvcResult profileResult = mockMvc.perform(get("/users/me")
                                .header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk())
                                .andReturn();

                // Verify profile data
                UserResponse userResponse = objectMapper.readValue(
                                profileResult.getResponse().getContentAsString(),
                                UserResponse.class);
                assertEquals("Test User", userResponse.getName());
                assertEquals("test@example.com", userResponse.getEmail());

                // Update user profile
                mockMvc.perform(put("/users/" + userResponse.getId())
                                .header("Authorization", "Bearer " + token)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"name\":\"Updated Name\"}"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Updated Name"));
        }
}