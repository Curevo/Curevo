package com.certaint.curevo.service;

import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ImageHostingService imageHostingService;

    public Customer saveCustomer(Customer customer, MultipartFile imageFile, MultipartFile prescriptionFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(imageFile, "customers");
            customer.setImage(imageUrl);
        }

        if (prescriptionFile != null && !prescriptionFile.isEmpty()) {
            String prescriptionUrl = imageHostingService.uploadImage(prescriptionFile, "prescriptions");
            customer.setPrescription(prescriptionUrl);
        }

        return customerRepository.save(customer);
    }


    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public boolean deleteCustomer(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
