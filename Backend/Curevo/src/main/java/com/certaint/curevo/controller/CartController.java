package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.CartResponse;
import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.exception.ResourceNotFoundException;
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
    public ResponseEntity<ApiResponse<CartItem>> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId
    ) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        CartItem addedItem = cartItemService.addToCart(customer.get(), productId);

        ApiResponse<CartItem> response = new ApiResponse<>(true, "Item added to cart successfully", addedItem);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/decrease")
    public ResponseEntity<ApiResponse<CartResponse>> decreaseProductQuantity(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        try {
            CartResponse responseData = cartItemService.decreaseQuantity(customer.get(), productId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product quantity decreased", responseData));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }



    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> checkProductInCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId) {

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        CartResponse response = cartItemService.checkProductInCart(customer.get(), productId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product existence checked", response));
    }



}
