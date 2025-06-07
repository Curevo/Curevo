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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.TRUE;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;
    private final CustomerService customerService;
    private final JwtService jwtService;

    // DTO for updating cart item quantity (can be in a separate DTO package/file)
    // Example: com.certaint.curevo.dto.UpdateCartItemRequest.java
    public record UpdateCartItemRequest(int quantity, Long storeId) {}

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItem>> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId,
            @RequestParam Long storeId
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }
        CartItem addedItem = cartItemService.addToCart(customer.get(), productId, storeId);

        ApiResponse<CartItem> response = new ApiResponse<>(true, "Item added to cart successfully", addedItem);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/decrease")
    public ResponseEntity<ApiResponse<CartResponse>> decreaseProductQuantity(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId,
            @RequestParam Long storeId
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }
        try {
            CartResponse responseData = cartItemService.decreaseQuantity(customer.get(), productId, storeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product quantity decreased", responseData));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/check/{productId}/{storeId}")
    public ResponseEntity<ApiResponse<CartResponse>> checkProductInCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long productId,
            @PathVariable Long storeId
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }
        CartResponse response = cartItemService.checkProductInCart(customer.get(), productId, storeId);
        response.setInCart(TRUE);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product existence checked", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCartItems(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }
        try {
            List<CartItem> cartItems = cartItemService.getCartItemsByCustomer(customer.get());

            BigDecimal subtotalBigDecimal = cartItems.stream()
                    .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            CartResponse responseData = new CartResponse( cartItems, subtotalBigDecimal.doubleValue());

            return ResponseEntity.ok(new ApiResponse<>(true, "Cart items fetched successfully", responseData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to fetch cart items: " + e.getMessage(), null));
        }
    }


    @DeleteMapping("/{itemId}") // itemId here refers to cartItemId
    public ResponseEntity<ApiResponse<Void>> removeItemFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("itemId") Long cartItemId // Renamed for clarity: itemId is cartItemId
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);

        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }

        try {
            // Call the service method with only customer and cartItemId
            cartItemService.removeItemFromCart(customer.get(), cartItemId);

            return ResponseEntity.ok(new ApiResponse<>(true, "Item removed from cart successfully", null));

        } catch (ResourceNotFoundException e) {
            // If the cart item is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (SecurityException e) {
            // If the authenticated customer is not authorized to remove this cart item
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to remove item: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse<CartItem>> updateCartItemQuantity(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long itemId,
            @RequestBody UpdateCartItemRequest request // Contains new quantity and storeId for verification
    ) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        Optional<Customer> customer = customerService.getByEmail(email);
        if (customer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Customer not found", null));
        }
        try {
            CartItem updatedItem = cartItemService.updateItemQuantity(customer.get(), itemId, request.quantity(), request.storeId()); // Assuming you'll implement this service method
            return ResponseEntity.ok(new ApiResponse<>(true, "Cart item quantity updated successfully", updatedItem));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update quantity: " + e.getMessage(), null));
        }
    }
}



