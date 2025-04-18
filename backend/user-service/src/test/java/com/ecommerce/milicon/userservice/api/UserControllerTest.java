package com.ecommerce.milicon.userservice.api;

import com.ecommerce.milicons.userservice.application.dto.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.UserUpdateRequest;
import com.ecommerce.milicons.userservice.application.service.UserService;
import com.ecommerce.milicons.userservice.exception.UserNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private UserService userService;

        private UserResponse sampleUserResponse;
        private UUID userId;

        @BeforeEach
        void setUp() {
                userId = UUID.randomUUID();
                sampleUserResponse = new UserResponse();
                sampleUserResponse.setId(userId.toString());
                sampleUserResponse.setFirstName("John");
                sampleUserResponse.setLastName("Doe");
                sampleUserResponse.setEmail("john.doe@example.com");
        }

        @Test
        @WithMockUser
        void getUserById_shouldReturnUser_whenUserExists() throws Exception {
                when(userService.getUserById(eq(userId))).thenReturn(sampleUserResponse);

                mockMvc.perform(get("/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(userId.toString())))
                                .andExpect(jsonPath("$.firstName", is("John")))
                                .andExpect(jsonPath("$.lastName", is("Doe")))
                                .andExpect(jsonPath("$.email", is("john.doe@example.com")));
        }

        @Test
        @WithMockUser
        void getUserById_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
                when(userService.getUserById(any(UUID.class)))
                                .thenThrow(new UserNotFoundException("User not found"));

                mockMvc.perform(get("/users/{id}", UUID.randomUUID())
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound());
        }

        @Test
        @WithMockUser
        void updateUser_shouldReturnUpdatedUser_whenUserExists() throws Exception {
                UserUpdateRequest updateRequest = new UserUpdateRequest();
                updateRequest.setFirstName("Jane");
                updateRequest.setLastName("Smith");

                UserResponse updatedUser = new UserResponse();
                updatedUser.setId(userId.toString());
                updatedUser.setFirstName("Jane");
                updatedUser.setLastName("Smith");
                updatedUser.setEmail("john.doe@example.com");

                when(userService.updateUser(eq(userId), any(UserUpdateRequest.class)))
                                .thenReturn(updatedUser);

                mockMvc.perform(put("/users/{id}", userId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id", is(userId.toString())))
                                .andExpect(jsonPath("$.firstName", is("Jane")))
                                .andExpect(jsonPath("$.lastName", is("Smith")))
                                .andExpect(jsonPath("$.email", is("john.doe@example.com")));
        }

        @Test
        @WithMockUser
        void updateUser_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
                UserUpdateRequest updateRequest = new UserUpdateRequest();
                updateRequest.setFirstName("Jane");
                updateRequest.setLastName("Smith");

                when(userService.updateUser(any(UUID.class), any(UserUpdateRequest.class)))
                                .thenThrow(new UserNotFoundException("User not found"));

                mockMvc.perform(put("/users/{id}", UUID.randomUUID())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isNotFound());
        }
}