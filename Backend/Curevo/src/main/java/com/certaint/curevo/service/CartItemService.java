package com.certaint.curevo.service;

import com.certaint.curevo.dto.CartResponse;
import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.exception.ResourceNotFoundException;
import com.certaint.curevo.repository.CartItemRepository;
import com.certaint.curevo.repository.ProductRepository;
import com.certaint.curevo.repository.StoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

    public CartItem addToCart(Customer customer, Long productId, Long storeId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        Integer quantity = 1;

        Optional<CartItem> existingCartItemOpt = cartItemRepository.findByCustomerAndProductAndStore(customer, product, store);

        if (existingCartItemOpt.isPresent()) {
            CartItem existingCartItem = existingCartItemOpt.get();
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            existingCartItem.setAddedAt(Instant.now());
            cartItemRepository.save(existingCartItem);
            return existingCartItem;
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setCustomer(customer);
            newCartItem.setProduct(product);
            newCartItem.setStore(store);
            newCartItem.setQuantity(quantity);
            newCartItem.setAddedAt(Instant.now());
            cartItemRepository.save(newCartItem);
            return newCartItem;
        }
    }

    public List<CartItem> getCartItemsByCustomer(Customer customer) {
        return cartItemRepository.findAllByCustomer(customer);
    }

    public void removeItemFromCart(Customer customer, Long itemId, Long storeId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new SecurityException("Unauthorized to remove this cart item: belongs to another customer");
        }
        
        cartItemRepository.delete(cartItem);
    }

    public void clearCart(Customer customer) {
        List<CartItem> items = cartItemRepository.findAllByCustomer(customer);
        cartItemRepository.deleteAll(items);
    }

    // --- UPDATED METHOD: decreaseQuantity ---
    public CartResponse decreaseQuantity(Customer customer, Long productId, Long storeId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        CartItem cartItem = cartItemRepository.findByCustomerAndProductAndStore(customer, product, store)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found for this product and store"));

        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            CartItem updatedItem = cartItemRepository.save(cartItem);
            // Return CartResponse indicating item is still in cart with its updated quantity
            return new CartResponse(true, updatedItem);
        } else {
            cartItemRepository.delete(cartItem);
            // Return CartResponse indicating item is no longer in cart
            return new CartResponse(false, null);
        }
    }

    public CartResponse checkProductInCart(Customer customer, Long productId, Long storeId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        Optional<CartItem> cartItemOpt = cartItemRepository.findByCustomerAndProductAndStore(customer, product, store);

        if (cartItemOpt.isPresent()) {
            return new CartResponse(true, cartItemOpt.get());
        } else {
            return new CartResponse(false, null);
        }
    }

    public CartItem updateItemQuantity(Customer customer, Long itemId, int newQuantity, Long storeId) {
        if (newQuantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1.");
        }

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + itemId));

        if (!cartItem.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new SecurityException("Unauthorized to update this cart item: belongs to another customer");
        }


        cartItem.setQuantity(newQuantity);
        cartItem.setAddedAt(Instant.now());
        return cartItemRepository.save(cartItem);
    }
}