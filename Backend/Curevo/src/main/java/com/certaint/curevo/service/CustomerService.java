package com.certaint.curevo.service;

import com.certaint.curevo.dto.CustomerDTO;
import com.certaint.curevo.dto.UserDTO;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.User;
import com.certaint.curevo.enums.Role;
import com.certaint.curevo.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CustomerService {


    private final CustomerRepository customerRepository;
    private final UserService userService;
    private final ImageHostingService imageHostingService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CustomerDTO saveCustomer(CustomerDTO customerDTO, MultipartFile imageFile) {
        // 1. Create and save the User
        User user = new User();
        user.setEmail(customerDTO.getUser().getEmail());
        user.setPassword(passwordEncoder.encode(customerDTO.getUser().getPassword()));
        user.setPhone(customerDTO.getUser().getPhone());
        user.setRole(Role.valueOf(customerDTO.getUser().getRole())); // should be "CUSTOMER"

        User savedUser = userService.saveUser(user);

        // 2. Create and save the Customer
        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setName(customerDTO.getName());
        customer.setAddress(customerDTO.getAddress());

        // 3. Upload image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(imageFile, "customers");
            customer.setImage(imageUrl);
        }

        Customer savedCustomer = customerRepository.save(customer);

        // 4. Build and return safe CustomerDTO
        CustomerDTO responseDTO = new CustomerDTO();
        responseDTO.setName(savedCustomer.getName());
        responseDTO.setAddress(savedCustomer.getAddress());
        responseDTO.setImage(savedCustomer.getImage());

        // Map UserDTO (excluding sensitive fields like password and role)
        UserDTO responseUserDTO = new UserDTO();
        responseUserDTO.setEmail(savedUser.getEmail());
        responseUserDTO.setPhone(savedUser.getPhone());

        responseDTO.setUser(responseUserDTO);

        return responseDTO;
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
