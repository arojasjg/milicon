package com.milicon.apigateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private String secret = "testSecret12345678901234567890123456789012";
    private long expirationTime = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", secret);
        ReflectionTestUtils.setField(jwtUtil, "expirationTime", expirationTime);
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = generateValidToken("1");

        // Act
        boolean result = jwtUtil.validateToken(token);

        // Assert
        assertTrue(result);
    }

    @Test
    void validateToken_ExpiredToken_ReturnsFalse() {
        // Arrange
        String token = generateExpiredToken("1");

        // Act
        boolean result = jwtUtil.validateToken(token);

        // Assert
        assertFalse(result);
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        // Arrange
        String token = "invalid.token.format";

        // Act
        boolean result = jwtUtil.validateToken(token);

        // Assert
        assertFalse(result);
    }

    @Test
    void extractUserId_ValidToken_ReturnsUserId() {
        // Arrange
        String userId = "1";
        String token = generateValidToken(userId);

        // Act
        String result = jwtUtil.extractUserId(token);

        // Assert
        assertEquals(userId, result);
    }

    @Test
    void extractUserId_InvalidToken_ReturnsNull() {
        // Arrange
        String token = "invalid.token.format";

        // Act
        String result = jwtUtil.extractUserId(token);

        // Assert
        assertNull(result);
    }

    private String generateValidToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject("user@example.com")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    private String generateExpiredToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject("user@example.com")
                .setIssuedAt(new Date(System.currentTimeMillis() - 2 * expirationTime))
                .setExpiration(new Date(System.currentTimeMillis() - expirationTime))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}