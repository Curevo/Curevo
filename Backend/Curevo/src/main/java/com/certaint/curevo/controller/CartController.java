package com.certaint.curevo.controller;

import com.certaint.curevo.dto.AddToCartRequest;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.security.JwtService;
import com.certaint.curevo.service.CartItemService;
import com.certaint.curevo.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;
    private final CustomerService customerService;
    private final JwtService jwtService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<String>> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AddToCartRequest request
    ) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);


        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        cartItemService.addToCart(customer.get(), request.getProductId(), request.getQuantity());

        ApiResponse<String> response = new ApiResponse<>(true, "Item added to cart successfully", null);
        return ResponseEntity.ok(response);
    }
}
