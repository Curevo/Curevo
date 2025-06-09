package com.certaint.curevo.service;

import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.OrderItem;
import com.certaint.curevo.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    private final CartItemService cartItemService;


    public OrderItem save(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getAllItems() {
        return orderItemRepository.findAll();
    }

    public Optional<OrderItem> getItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    public void deleteItem(Long id) {
        orderItemRepository.deleteById(id);
    }

    public List<OrderItem> createOrderItems(Customer customer) {
        // 1️⃣ Fetch all cart items for the customer
        List<CartItem> cartItems = cartItemService.getCartItemsByCustomer(customer);

        // 2️⃣ Convert each cart item to an OrderItem
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice()); // assuming product has price field

            orderItems.add(orderItem);
        }

        // 3️⃣ Return the list of order items
        return orderItems;
    }
}
