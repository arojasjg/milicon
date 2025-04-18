package com.ecommerce.milicons.userservice.application.service;

import com.ecommerce.milicons.userservice.application.dto.UserRegistrationRequest;
import com.ecommerce.milicons.userservice.application.dto.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.UserUpdateRequest;
import com.ecommerce.milicons.userservice.domain.model.User;

import java.util.UUID;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);

    UserResponse getUserById(UUID userId);

    UserResponse updateUser(UUID userId, UserUpdateRequest request);

    User findUserByEmail(String email);

    boolean isUserAdult(User user);

    boolean emailExists(String email);
}