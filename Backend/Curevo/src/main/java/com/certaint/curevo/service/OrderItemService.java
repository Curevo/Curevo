package com.certaint.curevo.service;

import com.certaint.curevo.entity.OrderItem;
import com.certaint.curevo.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

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

    // Additional methods can be added here (e.g. findByOrderId)
}
