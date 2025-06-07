package com.certaint.curevo.repository;

import com.certaint.curevo.entity.CartItem;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByCustomerAndProductAndStore(Customer customer, Product product, Store store);

    List<CartItem> findAllByCustomer(Customer customer);



}
