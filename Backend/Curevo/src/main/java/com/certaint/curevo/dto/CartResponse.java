package com.certaint.curevo.dto;

import com.certaint.curevo.entity.CartItem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartResponse {
    private boolean inCart;
    private CartItem cartItem; // or null if not found

    public CartResponse(boolean inCart, CartItem cartItem) {
        this.inCart = inCart;
        this.cartItem = cartItem;
    }

}
