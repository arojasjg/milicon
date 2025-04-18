package com.ecommerce.milicons.userservice.application.service.impl;

import com.ecommerce.milicons.userservice.application.dto.UserRegistrationRequest;
import com.ecommerce.milicons.userservice.application.dto.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.UserUpdateRequest;
import com.ecommerce.milicons.userservice.application.exception.UserNotFoundException;
import com.ecommerce.milicons.userservice.application.mapper.UserMapper;
import com.ecommerce.milicons.userservice.application.service.UserService;
import com.ecommerce.milicons.userservice.application.validation.UserValidator;
import com.ecommerce.milicons.userservice.domain.model.Role;
import com.ecommerce.milicons.userservice.domain.model.User;
import com.ecommerce.milicons.userservice.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserValidator userValidator;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        userValidator.validateRegistration(request);

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .birthDate(request.getBirthDate())
                .shippingAddress(request.getShippingAddress())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }

        if (request.getShippingAddress() != null) {
            user.setShippingAddress(request.getShippingAddress());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con email: " + email));
    }

    @Override
    public boolean isUserAdult(User user) {
        return Period.between(user.getBirthDate(), LocalDate.now()).getYears() >= 18;
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}