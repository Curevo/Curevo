package com.certaint.curevo.service;

import com.certaint.curevo.entity.User;
import com.certaint.curevo.exception.DuplicateResourceException;
import com.certaint.curevo.exception.UserNotFoundException;
import com.certaint.curevo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    // saveUser handles both creation and update, ensuring email/phone uniqueness
    @Transactional
    public User saveUser(User user) {
        // Scenario 1: New User Creation (user.getId() is null)
        if (user.getId() == null) {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already taken.");
            }
            if (userRepository.findByPhone(user.getPhone()).isPresent()) {
                throw new DuplicateResourceException("Phone number '" + user.getPhone() + "' is already taken.");
            }
            return userRepository.save(user); // Performs INSERT
        }
        // Scenario 2: Existing User Update (user.getId() is not null)
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

            // Update allowed fields on the existing (managed) entity
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            // Password update is handled separately in DoctorService if it's coming from Doctor update form.
            // If the user object here already has an encoded password, it will be saved.

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
}