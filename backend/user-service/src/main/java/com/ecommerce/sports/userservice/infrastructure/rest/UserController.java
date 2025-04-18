package com.ecommerce.milicons.userservice.infrastructure.rest;

import com.ecommerce.milicons.userservice.application.dto.user.UserResponse;
import com.ecommerce.milicons.userservice.application.dto.user.UserUpdateRequest;
import com.ecommerce.milicons.userservice.application.service.UserService;
import com.ecommerce.milicons.userservice.infrastructure.security.CurrentUser;
import com.ecommerce.milicons.userservice.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management API")
@SecurityRequirement(name = "JWT")
public class UserController {

        private final UserService userService;

        @Operation(summary = "Get all users", description = "Returns a list of all users (admin only)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "List of users retrieved successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<UserResponse>> getAllUsers() {
                List<UserResponse> users = userService.getAllUsers();
                return ResponseEntity.ok(users);
        }

        @Operation(summary = "Get user by ID", description = "Returns a user by their ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User retrieved successfully", content = @Content(schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
                UserResponse user = userService.getUserById(id);
                return ResponseEntity.ok(user);
        }

        @Operation(summary = "Get current user profile", description = "Returns the profile of the currently authenticated user")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User profile retrieved successfully", content = @Content(schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        @GetMapping("/me")
        public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser UserPrincipal currentUser) {
                UserResponse user = userService.getUserById(currentUser.getId());
                return ResponseEntity.ok(user);
        }

        @Operation(summary = "Update user", description = "Updates a user's profile information")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content(schema = @Schema(implementation = UserResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid input"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @PutMapping("/{id}")
        public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id,
                        @Valid @RequestBody UserUpdateRequest request) {
                UserResponse updatedUser = userService.updateUser(id, request);
                return ResponseEntity.ok(updatedUser);
        }

        @Operation(summary = "Delete user", description = "Deletes a user (admin only)")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "204", description = "User deleted successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
                userService.deleteUser(id);
                return ResponseEntity.noContent().build();
        }
}