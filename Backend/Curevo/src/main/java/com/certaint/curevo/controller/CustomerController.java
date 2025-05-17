package com.certaint.curevo.controller;

import com.certaint.curevo.dto.CustomerDTO;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.service.CustomerService;
import com.certaint.curevo.service.ImageHostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;


@RestController
@RequestMapping("api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    private ImageHostingService imageHostingService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping(value = "/add")
    public ResponseEntity<CustomerDTO> addCustomer(
            @RequestPart CustomerDTO customer,
            @RequestPart MultipartFile image) {

        CustomerDTO savedCustomer = customerService.saveCustomer(customer, image);
        return ResponseEntity.ok(savedCustomer);
    }

    @GetMapping("/me")
    public ResponseEntity<Customer> getCurrentCustomer(Authentication authentication) {
        String userEmail = authentication.getName(); // email from JWT principal

        Optional<Customer> customer = customerService.getByEmail(userEmail);

        if (customer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // map Customer entity to DTO if you want
        return ResponseEntity.ok(customer.get());
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        boolean deleted = customerService.deleteCustomer(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Customer deleted successfully");
    }
}
