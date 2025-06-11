package com.certaint.curevo.service;

import com.certaint.curevo.entity.User;
import com.certaint.curevo.enums.Role;
import com.certaint.curevo.exception.DuplicateResourceException;
import com.certaint.curevo.exception.UserNotFoundException;
import com.certaint.curevo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;


    @Transactional
    public User saveUser(User user) {

        if (user.getId() == null) {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already taken.");
            }
//            if (userRepository.findByPhone(user.getPhone()).isPresent()) {
//                throw new DuplicateResourceException("Phone number '" + user.getPhone() + "' is already taken.");
//            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
        }

        else {
            User existingUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + user.getId()));

            // Check if email is changing and if the new email is already taken by another user
            if (!existingUser.getEmail().equalsIgnoreCase(user.getEmail())) {
                Optional<User> userWithNewEmail = userRepository.findByEmail(user.getEmail());
                if (userWithNewEmail.isPresent() && !userWithNewEmail.get().getId().equals(existingUser.getId())) {
                    throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already taken by another account.");
                }
            }

            // Check if phone is changing and if the new phone is already taken by another user
            if (!existingUser.getPhone().equals(user.getPhone())) {
                Optional<User> userWithNewPhone = userRepository.findByPhone(user.getPhone());
                if (userWithNewPhone.isPresent() && !userWithNewPhone.get().getId().equals(existingUser.getId())) {
                    throw new DuplicateResourceException("Phone number '" + user.getPhone() + "' is already taken by another account.");
                }
            }

            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());

            return userRepository.save(existingUser); // Performs UPDATE
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.certaint.curevo.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                )
        );
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User createAdminUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already taken.");
        }
        user.setRole(Role.ADMIN);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for password reset."));

        String otp = otpService.generateOtp(email);

        String userName = user.getEmail();
        emailService.sendPasswordResetOtpEmail(email, otp, userName);
    }

    public boolean validateOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for OTP validation."));

        boolean isValid = otpService.validateOtp(email, otp);
        if (!isValid) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        return true;
    }

    @Transactional
    public void resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for password reset."));

        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Clear OTP from cache
        otpService.clearOtp(email);
    }
}