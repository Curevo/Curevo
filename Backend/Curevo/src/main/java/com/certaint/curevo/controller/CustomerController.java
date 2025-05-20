package com.certaint.curevo.controller;

import com.certaint.curevo.dto.CustomerDTO;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Boolean>> registerCustomer(@RequestBody CustomerDTO customerDTO) {
        boolean success = customerService.registerCustomer(customerDTO);
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP sent to email", success));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtpAndSaveCustomer(@RequestParam String email, @RequestParam String otp) {
        boolean verified = customerService.validateAndSaveCustomer(email, otp);
        if (verified) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Customer verified and registered", true));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "OTP verification failed", false));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Customer>> getCurrentCustomer(Authentication authentication) {
        String userEmail = authentication.getName();

        Optional<Customer> customer = customerService.getByEmail(userEmail);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Customer retrieved", customer.get()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCustomer(@PathVariable Long id) {
        boolean deleted = customerService.deleteCustomer(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found or could not be deleted", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer deleted successfully", "Deleted"));
    }
}
