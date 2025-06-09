package com.certaint.curevo.service;



import com.certaint.curevo.controller.CartController;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.entity.OrderItem;
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
    private final CartController cartController;

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

        order = repository.save(order);  // Save it to get the generated ID

        // 2️⃣ Create OrderItems from CartItems
        List<OrderItem> orderItems = orderItemService.createOrderItems(customer);

        // 3️⃣ Assign this Order to each OrderItem
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        // 4️⃣ Save all OrderItems
        orderItemRepository.saveAll(orderItems);

        // 5️⃣ (Optional) Clear the customer's cart
        cartItemService.clearCartForCustomer(customer);

        // 6️⃣ Return the saved Order
        return order;
    }
    public List<Order> findAllByCustomer(Customer customer) {
        return repository.findByCustomer(customer);
    }
}
