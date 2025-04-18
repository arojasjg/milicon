package com.ecommerce.milicons.userservice.application.service.impl;

import com.ecommerce.milicons.userservice.application.dto.AuthenticationRequest;
import com.ecommerce.milicons.userservice.application.dto.AuthenticationResponse;
import com.ecommerce.milicons.userservice.application.dto.PasswordResetConfirmRequest;
import com.ecommerce.milicons.userservice.application.dto.PasswordResetRequest;
import com.ecommerce.milicons.userservice.application.exception.InvalidPasswordResetTokenException;
import com.ecommerce.milicons.userservice.application.exception.TokenExpiredException;
import com.ecommerce.milicons.userservice.application.exception.UserNotFoundException;
import com.ecommerce.milicons.userservice.application.mapper.UserMapper;
import com.ecommerce.milicons.userservice.application.service.AuthenticationService;
import com.ecommerce.milicons.userservice.application.service.JwtService;
import com.ecommerce.milicons.userservice.domain.model.PasswordResetToken;
import com.ecommerce.milicons.userservice.domain.model.User;
import com.ecommerce.milicons.userservice.domain.repository.PasswordResetTokenRepository;
import com.ecommerce.milicons.userservice.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final UserMapper userMapper;
        private final PasswordEncoder passwordEncoder;

        @Override
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                // Autenticar al usuario con Spring Security
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                // Obtener usuario y generar tokens
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Usuario no encontrado con email: " + request.getEmail()));

                String token = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);

                return AuthenticationResponse.builder()
                                .token(token)
                                .refreshToken(refreshToken)
                                .user(userMapper.toUserResponse(user))
                                .build();
        }

        @Override
        @Transactional
        public void requestPasswordReset(PasswordResetRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Usuario no encontrado con email: " + request.getEmail()));

                // Eliminar tokens previos
                passwordResetTokenRepository.deleteByUser(user);

                // Crear nuevo token
                String token = UUID.randomUUID().toString();
                PasswordResetToken resetToken = PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(LocalDateTime.now().plusHours(1))
                                .build();

                passwordResetTokenRepository.save(resetToken);

                // Aquí normalmente enviaríamos un email con el token
                // para un proyecto real, integrar con un servicio de email
                System.out.println("Token de restablecimiento generado: " + token);
        }

        @Override
        @Transactional
        public void confirmPasswordReset(PasswordResetConfirmRequest request) {
                PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                                .orElseThrow(() -> new InvalidPasswordResetTokenException(
                                                "Token de restablecimiento inválido"));

                if (resetToken.isExpired()) {
                        throw new TokenExpiredException("El token ha expirado");
                }

                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                // Eliminar el token usado
                passwordResetTokenRepository.delete(resetToken);
        }
}