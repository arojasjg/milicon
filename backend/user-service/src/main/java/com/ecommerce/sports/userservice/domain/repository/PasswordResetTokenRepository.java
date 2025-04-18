package com.ecommerce.milicons.userservice.domain.repository;

import com.ecommerce.milicons.userservice.domain.model.PasswordResetToken;
import com.ecommerce.milicons.userservice.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}