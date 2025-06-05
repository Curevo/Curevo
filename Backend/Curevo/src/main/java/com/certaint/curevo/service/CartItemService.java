package com.certaint.curevo.service;

import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.exception.ResourceNotFoundException;
import com.certaint.curevo.repository.CartItemRepository;
import com.certaint.curevo.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;


    public void addToCart(Customer customer, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingCartItemOpt = cartItemRepository.findByCustomerAndProduct(customer, product);

        if (existingCartItemOpt.isPresent()) {
            CartItem existingCartItem = existingCartItemOpt.get();
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            existingCartItem.setAddedAt(Instant.now());
            cartItemRepository.save(existingCartItem);
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setCustomer(customer);
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            newCartItem.setAddedAt(Instant.now());
            cartItemRepository.save(newCartItem);
        }
    }


    public List<CartItem> getCartItemsByCustomer(Customer customer) {
        return cartItemRepository.findAllByCustomer(customer);
    }


    public void removeCartItem(Customer customer, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new SecurityException("Unauthorized to remove this cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    /**
     * Clear all cart items for a customer
     */
    public void clearCart(Customer customer) {
        List<CartItem> items = cartItemRepository.findAllByCustomer(customer);
        cartItemRepository.deleteAll(items);
    }
}
