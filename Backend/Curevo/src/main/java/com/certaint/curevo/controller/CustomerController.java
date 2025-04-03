package com.certaint.curevo.controller;

import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.service.CustomerService;
import com.certaint.curevo.service.ImageHostingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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
    public ResponseEntity<Customer> addCustomer(
            @RequestPart Customer customer,
            @RequestPart MultipartFile image,
            @RequestPart MultipartFile prescription) {

        Customer savedCustomer = customerService.saveCustomer(customer, image, prescription);
        return ResponseEntity.ok(savedCustomer);
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
