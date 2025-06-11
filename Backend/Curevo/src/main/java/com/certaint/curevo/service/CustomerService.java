package com.certaint.curevo.service;

import com.certaint.curevo.dto.CustomerDTO;
import com.certaint.curevo.dto.UserDTO;
import com.certaint.curevo.entity.Customer;
import com.certaint.curevo.entity.User;
import com.certaint.curevo.enums.Role;
import com.certaint.curevo.exception.EmailAlreadyExistsException;
import com.certaint.curevo.exception.UserNotFoundException;
import com.certaint.curevo.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static java.lang.Boolean.TRUE;

@RequiredArgsConstructor
@Service
public class CustomerService {


    private final CustomerRepository customerRepository;
    private final UserService userService;
    private final ImageHostingService imageHostingService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final SignupCacheService cacheService;
    private final EmailService emailService;



    @Transactional
    public Boolean saveCustomer(CustomerDTO customerDTO) {
        // 1. Create and save the User
        User user = new User();
        user.setEmail(customerDTO.getUser().getEmail());
        user.setPassword(passwordEncoder.encode(customerDTO.getUser().getPassword()));
        user.setRole(Role.valueOf("CUSTOMER"));

        User savedUser = userService.saveUser(user);

        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setName(customerDTO.getName());

        Customer savedCustomer = customerRepository.save(customer);
        return TRUE;
    }


    public Optional<Customer> getByEmail(String email) {
        return customerRepository.findByUserEmail(email);
    }


    public boolean deleteCustomer(Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public Boolean registerCustomer(CustomerDTO customerDTO) {
        String email = customerDTO.getUser().getEmail();

        if (userService.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already in use.");
        }


        String otp = otpService.generateOtp(email);
        cacheService.cacheCustomerData(email, customerDTO);
        emailService.sendCustomerRegistrationOtpEmail(email, otp, customerDTO.getName());

        System.out.println(customerDTO.getUser().getPassword());
        return TRUE;
    }
    public Boolean validateAndSaveCustomer(String email, String otp) {
        String cachedOtp = cacheService.getCachedOtp(email);
        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        CustomerDTO customerDTO = cacheService.getCachedCustomerData(email);
        System.out.println(customerDTO.getUser().getPassword());
        if (customerDTO == null) {
            throw new IllegalStateException("Customer data not found or expired");
        }

        Boolean saved = saveCustomer(customerDTO);
        cacheService.evictCachedData(email);
        emailService.sendCustomerRegistrationSuccessEmail(email, customerDTO.getName());
        return saved;
    }
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Customer not found with id: " + id));
    }

}
