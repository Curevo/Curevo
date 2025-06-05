package com.certaint.curevo.repository;

import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCustomerAndProduct(Customer customer, Product product);

    List<CartItem> findAllByCustomer(Customer customer);
}
