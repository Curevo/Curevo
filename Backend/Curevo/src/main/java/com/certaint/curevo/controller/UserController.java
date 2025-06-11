package com.certaint.curevo.controller;

import com.certaint.curevo.entity.User;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/add")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("add/admin")
    public ResponseEntity<User> createAdminUser(@RequestBody User user) {
        User savedUser = userService.createAdminUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // ---------- New Password Reset Endpoints ----------

    @PostMapping("/password/initiate")
    public ResponseEntity<ApiResponse<String>> initiatePasswordReset(@RequestParam String email) {
        userService.initiatePasswordReset(email);
        ApiResponse<String> response = new ApiResponse<>(true, "Password reset initiated. Please check your email for the OTP.", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/validate-otp")
    public ResponseEntity<ApiResponse<Boolean>> validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = userService.validateOtp(email, otp);
        ApiResponse<Boolean> response = new ApiResponse<>(isValid, "OTP validation successful.", null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestParam String email,
            @RequestParam String newPassword
    ) {
        userService.resetPassword(email, newPassword);
        ApiResponse<String> response = new ApiResponse<>(true, "Password reset successfully.", null);
        return ResponseEntity.ok(response);
    }
}
