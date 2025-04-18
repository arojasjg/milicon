package com.ecommerce.milicons.userservice.infrastructure.rest;

import com.ecommerce.milicons.userservice.application.dto.user.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.user.UserUpdateRequest;
import com.ecommerce.milicons.userservice.application.service.UserService;
import com.ecommerce.milicons.userservice.infrastructure.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private UserService userService;

        @MockBean
        private JwtTokenProvider jwtTokenProvider;

        private UserResponse userResponse;
        private UserUpdateRequest updateRequest;
        private UUID userId;

        @BeforeEach
        void setUp() {
                userId = UUID.randomUUID();
                userResponse = UserResponse.builder()
                                .id(userId)
                                .name("Test User")
                                .email("test@example.com")
                                .build();

                updateRequest = UserUpdateRequest.builder()
                                .name("Updated Name")
                                .build();
        }

        @Test
        @WithMockUser
        void getUserById_ExistingUser_ReturnsUserResponse() throws Exception {
                // Arrange
                when(userService.getUserById(userId)).thenReturn(userResponse);

                // Act & Assert
                mockMvc.perform(get("/users/{id}", userId))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.id", is(userId.toString())))
                                .andExpect(jsonPath("$.name", is("Test User")))
                                .andExpect(jsonPath("$.email", is("test@example.com")));
        }

        @Test
        @WithMockUser
        void getAllUsers_ReturnsListOfUsers() throws Exception {
                // Arrange
                List<UserResponse> users = Arrays.asList(userResponse);
                when(userService.getAllUsers()).thenReturn(users);

                // Act & Assert
                mockMvc.perform(get("/users"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$", hasSize(1)))
                                .andExpect(jsonPath("$[0].id", is(userId.toString())))
                                .andExpect(jsonPath("$[0].name", is("Test User")))
                                .andExpect(jsonPath("$[0].email", is("test@example.com")));
        }

        @Test
        @WithMockUser
        void updateUser_ValidRequest_ReturnsUpdatedUser() throws Exception {
                // Arrange
                UserResponse updatedResponse = UserResponse.builder()
                                .id(userId)
                                .name("Updated Name")
                                .email("test@example.com")
                                .build();

                when(userService.updateUser(eq(userId), any(UserUpdateRequest.class))).thenReturn(updatedResponse);

                // Act & Assert
                mockMvc.perform(put("/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.id", is(userId.toString())))
                                .andExpect(jsonPath("$.name", is("Updated Name")))
                                .andExpect(jsonPath("$.email", is("test@example.com")));
        }

        @Test
        void getUsers_Unauthenticated_ReturnsUnauthorized() throws Exception {
                // Act & Assert
                mockMvc.perform(get("/users"))
                                .andExpect(status().isUnauthorized());
        }
}