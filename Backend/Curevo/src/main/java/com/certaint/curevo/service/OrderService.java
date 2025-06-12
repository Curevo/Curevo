package com.certaint.curevo.service;

import com.certaint.curevo.controller.CartController;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.OrderItem;
import com.certaint.curevo.enums.OrderStatus;
import com.certaint.curevo.repository.OrderItemRepository;
import com.certaint.curevo.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repository;
    private final OrderItemService orderItemService;
    private final OrderItemRepository orderItemRepository;
    private final CartItemService cartItemService;
    private final ImageHostingService imageHostingService;
    private final CartController cartController; // This might be a circular dependency, consider if OrderService really needs CartController.




    public Order save(Order order) {
        return repository.save(order);
    }

    public Optional<Order> findById(Long id) {
        return repository.findById(id);
    }

    public List<Order> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }


    @Transactional
    public Order createOrder(Customer customer, Order order, MultipartFile prescription) {
        order.setCustomer(customer);
        if (prescription != null && !prescription.isEmpty()) {
            String imgUrl = imageHostingService.uploadImage(prescription,"prescription");
            order.setPrescriptionUrl(imgUrl);
        }

        // Set a default status, which can be overridden if a prescription is needed
        // Assuming your Order entity has a 'status' field and you have an OrderStatus enum
        order.setStatus(OrderStatus.PENDING); // Or your default initial status

        order = repository.save(order);  // Save it to get the generated ID

        // Create OrderItems from CartItems
        List<OrderItem> orderItems = orderItemService.createOrderItems(customer);

        // Assign this Order to each OrderItem and check for prescription requirement
        boolean needsVerification = false;
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            // Assuming OrderItem has a getProduct() method, and Product has a isPrescriptionRequired() method
            if (item.getProduct() != null && item.getProduct().getPrescriptionRequired()) {
                needsVerification = true;
            }
        }

        // If any product requires a prescription, update the order status
        if (needsVerification) {
            order.setStatus(OrderStatus.NEEDS_VERIFICATION);
            order.setPrescriptionVerified(false);
            repository.save(order);
        }

        // Save all OrderItems
        orderItemRepository.saveAll(orderItems);

        // (Optional) Clear the customer's cart
        cartItemService.clearCartForCustomer(customer);

        // Return the saved Order
        return order;
    }

    public Boolean verifyPrescription(Long orderId) {
        System.out.println("Verifying prescription for order ID: " + orderId);
        Optional<Order> orderOpt = repository.findById(orderId);
        System.out.println("Verifying prescription for order ID: " + orderId);
        if (orderOpt.isEmpty()) {
            return false;
        }

        Order order = orderOpt.get();

        if( order.getPrescriptionUrl() != null ) {
            imageHostingService.deleteImage(order.getPrescriptionUrl());
            System.out.println("Deleted it: " + orderId);
        }
        System.out.println("Just outside the if: " + orderId);
        order.setPrescriptionUrl(null);
        System.out.println("Setting prescription URL to null for order ID: " + orderId);
        order.setStatus(OrderStatus.VERIFIED);
        System.out.println("Setting order status to VERIFIED for order ID: " + orderId);
        order.setPrescriptionVerified(true);
        System.out.println("Eveyrhting working fine");
        repository.save(order);

        return true;
    }


    public List<Order> findAllByCustomer(Customer customer) {
        return repository.findByCustomer(customer);
    }
}