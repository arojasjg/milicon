package com.ecommerce.milicons.userservice.application.mapper;

import com.ecommerce.milicons.userservice.application.dto.UserResponse;
import com.ecommerce.milicons.userservice.domain.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .shippingAddress(user.getShippingAddress())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}