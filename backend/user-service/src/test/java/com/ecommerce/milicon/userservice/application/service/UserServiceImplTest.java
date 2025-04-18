package com.ecommerce.milicons.userservice.application.service;

import com.ecommerce.milicons.userservice.application.dto.user.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.user.UserUpdateRequest;
import com.ecommerce.milicons.userservice.application.exception.UserNotFoundException;
import com.ecommerce.milicons.userservice.application.mapper.UserMapper;
import com.ecommerce.milicons.userservice.domain.model.User;
import com.ecommerce.milicons.userservice.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserResponse userResponse;
    private UserUpdateRequest updateRequest;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = User.builder()
                .id(userId)
                .name("Test User")
                .email("test@example.com")
                .password("encoded_password")
                .build();

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
    void getUserById_ExistingUser_ReturnsUserResponse() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        // Act
        UserResponse result = userService.getUserById(userId);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).findById(userId);
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void getUserById_NonExistingUser_ThrowsUserNotFoundException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.getUserById(userId));
        verify(userRepository).findById(userId);
        verify(userMapper, never()).toUserResponse(any());
    }

    @Test
    void updateUser_ExistingUser_ReturnsUpdatedUserResponse() {
        // Arrange
        User updatedUser = User.builder()
                .id(userId)
                .name("Updated Name")
                .email("test@example.com")
                .password("encoded_password")
                .build();

        UserResponse updatedResponse = UserResponse.builder()
                .id(userId)
                .name("Updated Name")
                .email("test@example.com")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);
        when(userMapper.toUserResponse(updatedUser)).thenReturn(updatedResponse);

        // Act
        UserResponse result = userService.updateUser(userId, updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("Updated Name", result.getName());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).findById(userId);
        verify(userRepository).save(any(User.class));
        verify(userMapper).toUserResponse(updatedUser);
    }

    @Test
    void updateUser_NonExistingUser_ThrowsUserNotFoundException() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> userService.updateUser(userId, updateRequest));
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
        verify(userMapper, never()).toUserResponse(any());
    }
}