package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.AuthRequest;
import com.certaint.curevo.dto.AuthResponse;
import com.certaint.curevo.entity.User;
import com.certaint.curevo.repository.UserRepository;
import com.certaint.curevo.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.AuthenticationException;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            System.out.println("User found: " + user.getEmail());
            System.out.println("User Password: " + request.getPassword());

            String token = jwtService.generateToken(request.getEmail(), user.getRole().name());

            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", new AuthResponse(token)));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid email or password", null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Login failed due to an internal error", null));
        }
    }
    @GetMapping("/check-status")
    public ResponseEntity<ApiResponse<String>> checkAuthStatus() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Authenticated", "Token is valid"));
    }


}
