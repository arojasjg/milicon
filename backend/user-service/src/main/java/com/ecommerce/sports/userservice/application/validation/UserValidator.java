package com.ecommerce.milicons.userservice.application.validation;

import com.ecommerce.milicons.userservice.application.dto.UserRegistrationRequest;
import com.ecommerce.milicons.userservice.application.exception.InvalidUserDataException;
import com.ecommerce.milicons.userservice.application.exception.UserAlreadyExistsException;
import com.ecommerce.milicons.userservice.application.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserService userService;

    public void validateRegistration(UserRegistrationRequest request) {
        validateEmail(request.getEmail());
        validateAge(request.getBirthDate());
    }

    private void validateEmail(String email) {
        if (userService.emailExists(email)) {
            throw new UserAlreadyExistsException("El email ya está registrado: " + email);
        }
    }

    private void validateAge(LocalDate birthDate) {
        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if (age < 18) {
            throw new InvalidUserDataException("El usuario debe ser mayor de 18 años");
        }
    }
}