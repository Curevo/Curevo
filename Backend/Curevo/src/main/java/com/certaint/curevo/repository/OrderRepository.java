package com.certaint.curevo.repository;

import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.Order;
import com.certaint.curevo.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer(Customer customer);

    List<Order> findByStatusIn(Collection<OrderStatus> statuses);
}
