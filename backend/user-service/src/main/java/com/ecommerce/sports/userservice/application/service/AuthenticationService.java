package com.ecommerce.milicons.userservice.application.service;

import com.ecommerce.milicons.userservice.application.dto.AuthenticationRequest;
import com.ecommerce.milicons.userservice.application.dto.AuthenticationResponse;
import com.ecommerce.milicons.userservice.application.dto.PasswordResetConfirmRequest;
import com.ecommerce.milicons.userservice.application.dto.PasswordResetRequest;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);

    void requestPasswordReset(PasswordResetRequest request);

    void confirmPasswordReset(PasswordResetConfirmRequest request);
}