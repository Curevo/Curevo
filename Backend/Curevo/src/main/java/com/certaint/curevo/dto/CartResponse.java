package com.certaint.curevo.dto;

import com.certaint.curevo.entity.CartItem;
import lombok.Data; // Provides @Getter, @Setter, @EqualsAndHashCode, @ToString
import lombok.NoArgsConstructor; // Adds a no-argument constructor

import java.util.List; // Import List

@Data
@NoArgsConstructor
public class CartResponse {

    private boolean inCart;
    private CartItem cartItem;

    private List<CartItem> items;
    private double subtotal;

    // CORRECTED CONSTRUCTOR: Use the 'inCart' parameter directly
    public CartResponse(boolean inCart, CartItem cartItem) {
        this.inCart = inCart; // NOW it correctly uses the passed 'inCart' value
        this.cartItem = cartItem;
        this.items = null;
        this.subtotal = 0.0;
    }

    // This constructor remains unchanged as it's for the full cart summary
    public CartResponse(List<CartItem> items, double subtotal) {
        this.items = items;
        this.subtotal = subtotal;
        this.inCart = true;
        this.cartItem = null;
    }
}