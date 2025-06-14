package com.certaint.curevo.service;

import com.certaint.curevo.dto.DeliveryExecutiveDTO;
import com.certaint.curevo.dto.ExecutivePerformanceDTO;
import com.certaint.curevo.entity.*;
import com.certaint.curevo.enums.DeliveryAssignmentStatus;
import com.certaint.curevo.enums.DeliveryExecutiveStatus;
import com.certaint.curevo.enums.OrderStatus;
import com.certaint.curevo.enums.Role;
import com.certaint.curevo.exception.EmailAlreadyExistsException;
import com.certaint.curevo.repository.*;
import com.certaint.curevo.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.certaint.curevo.enums.DeliveryExecutiveStatus.*;
import static com.certaint.curevo.enums.DeliveryAssignmentStatus.*;
import static java.lang.Boolean.TRUE;

@Service
@RequiredArgsConstructor
public class ExecutiveService {

    private final DeliveryExecutiveRepository executiveRepo;
    private final DeliveryAssignmentRepository assignmentRepo;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ExecutiveDocumentRepository executiveDocumentRepository;
    private final UserService userService;
    private final ImageHostingService imageHostingService;
    private final OtpService otpService;
    private final EmailService emailService;
    private final CacheService cacheService;
    private final JwtService jwtservice;

    private static final double PER_DELIVERY_FEE_INR = 40.0; // ₹50 per delivered order (adjust as needed)


    public void assignOrder(Order order) {
        // 1️⃣ Find a suitable executive
        Optional<DeliveryExecutive> availableExec = executiveRepo.findFirstByStatus(AVAILABLE);
        if (availableExec.isEmpty()) {
            throw new RuntimeException("No available delivery executive");
        }
        DeliveryExecutive executive = availableExec.get();

        // 2️⃣ Check if they have reached the max assignments
        if (hasReachedMaxAssignments(executive.getId())) {
            executive.setStatus(UNAVAILABLE);
            executiveRepo.save(executive);
            throw new RuntimeException("Executive has reached maximum assignments");
        }

        // 3️⃣ Create the assignment
        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setOrder(order);
        assignment.setExecutive(executive);

        List<DeliveryAssignment> activeAssignments = assignmentRepo.findByExecutiveAndStatusIn(
                executive, List.of(CURRENT, PENDING)
        );

        if (activeAssignments.stream().noneMatch(a -> a.getStatus() == CURRENT)) {
            assignment.setStatus(CURRENT);
        } else {
            assignment.setStatus(PENDING);
        }

        assignmentRepo.save(assignment);


        order.setStatus(OrderStatus.ASSIGNED);
        orderRepository.save(order);


        if (hasReachedMaxAssignments(executive.getId())) {
            executive.setStatus(UNAVAILABLE);
            executiveRepo.save(executive);
        }
    }

    public void startDay(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));

        // Step 1: Set initial status based on intent
        executive.setStatus(DeliveryExecutiveStatus.AVAILABLE);

        // Step 2: Double-check capacity and adjust status if necessary
        if (hasReachedMaxAssignments(executive.getId())) {
            executive.setStatus(DeliveryExecutiveStatus.UNAVAILABLE); // Override to UNAVAILABLE if at max capacity
        }

        // Step 3: Save the (potentially adjusted) status
        executiveRepo.save(executive);

        // Step 4: Try assigning pending orders now that this executive is available
        // This will only assign if their FINAL status is AVAILABLE
        processPendingOrders();
    }

    public void initiateDeliveryCompletion(Long executiveId) {

        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));

        Optional<DeliveryAssignment> currentAssignmentOpt = assignmentRepo.findByExecutiveAndStatus(executive, CURRENT);

        if (currentAssignmentOpt.isEmpty()) {
            throw new RuntimeException("No active delivery assignment found for this executive.");
        }

        DeliveryAssignment currentAssignment = currentAssignmentOpt.get();
        Long assignmentId = currentAssignment.getId();
        String recipientEmail = currentAssignment.getOrder().getRecipientEmail();

        // Generate and cache OTP
        String otp = otpService.generateOtp(String.valueOf(assignmentId)); // Use assignmentId as key for OTP caching
        cacheService.cacheOtpForDelivery(String.valueOf(assignmentId), otp); // Assuming cacheService has this method

        // Send OTP to recipient's email
        emailService.sendDeliveryCompletionOtpEmail(recipientEmail, otp, currentAssignment.getOrder().getRecipientName()); // You might want to get actual recipient name from Customer
    }

    // New method to complete delivery after OTP validation
    @Transactional
    public void completeDeliveryWithOtp(Long executiveId, String otp) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));

        Optional<DeliveryAssignment> currentAssignmentOpt = assignmentRepo.findByExecutiveAndStatus(executive, CURRENT);

        if (currentAssignmentOpt.isEmpty()) {
            throw new RuntimeException("No active delivery assignment found for this executive.");
        }

        DeliveryAssignment assignment = currentAssignmentOpt.get();
        Long assignmentId = assignment.getId();

        // Retrieve and validate OTP
        String cachedOtp = cacheService.getCachedOtpForDelivery(String.valueOf(assignmentId)); // Assuming cacheService has this method
        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP for delivery completion.");
        }

        // Proceed with delivery completion
        assignment.setStatus(DELIVERED);
        assignment.setActualDelivery(Instant.now()); // Set the actual delivery timestamp
        assignmentRepo.save(assignment);

        Order order = assignment.getOrder(); // Get the Order object directly from the assignment
        if (order != null) { // Defensive check
            order.setStatus(OrderStatus.DELIVERED); // Set the Order status to DELIVERED
            orderRepository.save(order); // Save the updated Order
        }

        // Check if executive can now take more orders
        if (executive.getStatus() == UNAVAILABLE && !hasReachedMaxAssignments(executive.getId())) {
            executive.setStatus(AVAILABLE);
            executiveRepo.save(executive);
        }

        // Try assigning pending orders
        processPendingOrders();

        // Clean up cached OTP
        cacheService.evictCachedOtpForDelivery(String.valueOf(assignmentId));
    }


    public void processPendingOrders() {
        // 1️⃣ Find orders in PENDING_ASSIGNMENT status
        List<Order> pendingOrders = orderRepository.findByStatusIn(List.of(OrderStatus.PENDING, OrderStatus.VERIFIED));

        // 2️⃣ Try to assign them using assignOrder()
        for (Order order : pendingOrders) {
            try {
                assignOrder(order);
            } catch (RuntimeException e) {
                System.out.println("Could not assign order ID: " + order.getId() + ". Reason: " + e.getMessage());
            }
        }
    }



    public void endDay(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));
        executive.setStatus(INACTIVE);
        executiveRepo.save(executive);
    }


    public void markUnavailable(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));
        executive.setStatus(MANUALLY_UNAVAILABLE);
        executiveRepo.save(executive);
    }


    public boolean hasReachedMaxAssignments(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found"));
        List<DeliveryAssignment> activeAssignments = assignmentRepo.findByExecutiveAndStatusIn(
                executive, List.of(CURRENT, PENDING)
        );
        return activeAssignments.size() >= 3;
    }

    // Add this method to your ExecutiveService.java

    @Transactional
    public DeliveryExecutive approveExecutive(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Executive not found with ID: " + executiveId));

        if (executive.getStatus() == NOT_VERIFIED) {
            executive.setStatus(INACTIVE);
            executiveRepo.save(executive);
             emailService.sendExecutiveApprovalEmail(executive.getUser().getEmail(), executive.getName());
            return executive;
        } else {
            throw new RuntimeException("Executive with ID: " + executiveId + " is already verified or not in NOT_VERIFIED status.");
        }
    }

    @Transactional
    public DeliveryExecutive updateDeliveryExecutive(Long id, DeliveryExecutiveDTO executiveDTO, MultipartFile image) {
        DeliveryExecutive executive = executiveRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Executive not found with ID: " + id));

        User user = executive.getUser();
        if (user == null) {
            throw new RuntimeException("Associated User not found for Delivery Executive ID: " + id);
        }


        user.setEmail(executiveDTO.getEmail());
        user.setPhone(executiveDTO.getPhone());

        userRepository.save(user);

        if (image != null && !image.isEmpty()) {
            // Upload new image and update the URL
            imageHostingService.deleteImage(executive.getImage());
            String imageUrl = imageHostingService.uploadImage(image, "executive");
            executive.setImage(imageUrl);
        }


        executive.setVehicleType(executiveDTO.getVehicleType());
        if (executiveDTO.getStatus() != null) {
            executive.setStatus(executiveDTO.getStatus());
        }
        executiveRepo.save(executive);

        ExecutiveDocument document = (ExecutiveDocument) executiveDocumentRepository.findByExecutive(executive)
                .orElseThrow(() -> new RuntimeException("Executive Document not found for Executive ID: " + id));

        document.setAadharNumber(executiveDTO.getAadharNumber());
        document.setPanNumber(executiveDTO.getPanNumber());
        document.setBankAccountNumber(executiveDTO.getBankAccountNumber());
        document.setBankIFSC(executiveDTO.getBankIFSC());
        document.setBankName(executiveDTO.getBankName());
        document.setVehicleNumber(executiveDTO.getVehicleNumber());
        executiveDocumentRepository.save(document);

        return executive;
    }

    public Boolean registerDeliveryExecutive(DeliveryExecutiveDTO executiveDTO, MultipartFile image) {
        String email = executiveDTO.getEmail();

        if (userService.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already in use.");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            // Upload image immediately and store its URL
            imageUrl = imageHostingService.uploadImage(image, "executive");
        }
        executiveDTO.setImageUrl(imageUrl); // Set the obtained URL in the DTO

        String otp = otpService.generateOtp(email);
        cacheService.cacheDeliveryExecutiveData(email, executiveDTO);
        emailService.sendExecutiveRegistrationOtpEmail(email, otp, executiveDTO.getName());

        return TRUE;
    }

    @Transactional
    public DeliveryExecutive validateAndSaveDeliveryExecutive(String email, String otp) {
        String cachedOtp = cacheService.getCachedOtp(email);
        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        DeliveryExecutiveDTO executiveDTO = cacheService.getCachedDeliveryExecutiveData(email);
        System.out.println("Printing Executive DTO"+executiveDTO);
        if (executiveDTO == null) {
            throw new IllegalStateException("Delivery Executive data not found or expired");
        }

        DeliveryExecutive savedExecutive = new DeliveryExecutive();
        try {
            savedExecutive = saveDeliveryExecutive(executiveDTO); // Attempt to save
            cacheService.evictCachedData(email); // Clean up cache on success
            System.out.println("Delivery Executive saved successfully: " + savedExecutive.getId());
        } catch (Exception e) {
            // If saving fails, delete the previously uploaded image
            if (executiveDTO.getImageUrl() != null && !executiveDTO.getImageUrl().isEmpty()) {
                try {
                    imageHostingService.deleteImage(executiveDTO.getImageUrl());
                    System.out.println("Cleaned up orphaned image: " + executiveDTO.getImageUrl());
                    cacheService.evictCachedData(email);
                    System.out.println("Cleaned up cache for email: " + email);
                } catch (RuntimeException deleteException) {
                    System.err.println("Failed to delete orphaned image: " + executiveDTO.getImageUrl() + ". Error: " + deleteException.getMessage());
                    cacheService.evictCachedData(email); // Clean up cache on success
                    System.out.println("Cleaned up cache for email: " + email);
                }
            }
            // Re-throw the original exception after cleanup
            throw new RuntimeException("Failed to save delivery executive after OTP verification: " + e.getMessage(), e);
        }

        return savedExecutive;
    }


        @Transactional
        public DeliveryExecutive saveDeliveryExecutive(DeliveryExecutiveDTO executiveDTO) {
            // 1. Create and save the User
            User user = new User();
            user.setEmail(executiveDTO.getEmail());
            user.setPassword(executiveDTO.getPassword());
            user.setPhone(executiveDTO.getPhone());
            user.setRole(Role.DELIVERY_EXECUTIVE);
            User savedUser = userService.saveUser(user);

            // 2. Create DeliveryExecutive entity
            DeliveryExecutive executive = new DeliveryExecutive();
            executive.setUser(savedUser);
            executive.setVehicleType(executiveDTO.getVehicleType());
            executive.setName(executiveDTO.getName());

            // Set the image URL from the DTO (it was uploaded earlier and cached)
            if (executiveDTO.getImageUrl() != null && !executiveDTO.getImageUrl().isEmpty()) {
                executive.setImage(executiveDTO.getImageUrl());
            }
            executiveRepo.save(executive);

            // 3. Create ExecutiveDocument entity
            ExecutiveDocument document = new ExecutiveDocument();
            document.setExecutive(executive);
            document.setAadharNumber(executiveDTO.getAadharNumber());
            document.setPanNumber(executiveDTO.getPanNumber());
            document.setBankAccountNumber(executiveDTO.getBankAccountNumber());
            document.setBankIFSC(executiveDTO.getBankIFSC());
            document.setBankName(executiveDTO.getBankName());
            document.setVehicleNumber(executiveDTO.getVehicleNumber());
            document.setSubmittedAt(Instant.now());
            executiveDocumentRepository.save(document);
            emailService.sendExecutiveApplicationReceivedEmail(executive.getUser().getEmail(), executive.getName());

            return executive;
        }


    // New method for Admin to reject an executive
    @Transactional
    public void rejectExecutive(Long executiveId) {
        DeliveryExecutive executive = executiveRepo.findById(executiveId)
                .orElseThrow(() -> new RuntimeException("Delivery Executive not found with ID: " + executiveId));

        User user = executive.getUser();
        ExecutiveDocument document = (ExecutiveDocument) executiveDocumentRepository.findByExecutive(executive)
                .orElse(null); // Document might not always exist if registration process is interrupted


        String executiveEmail = user.getEmail();
        String executiveName = user.getEmail(); // Assuming user name is derivable from email for now

        // Delete associated records to avoid foreign key constraints
        if (document != null) {
            executiveDocumentRepository.delete(document);
        }

        // Delete executive record
        executiveRepo.delete(executive);

        // Delete user record
        if (user != null) {
            userRepository.delete(user);
        }

        // Delete image if exists
        if (executive.getImage() != null && !executive.getImage().isEmpty()) {
            try {
                imageHostingService.deleteImage(executive.getImage());

            } catch (RuntimeException e) {
                System.err.println("Failed to delete image for executive ID: " + executiveId + ". Error: " + e.getMessage());
                // Log this, but don't rethrow, as the primary action is the rejection and deletion
            }
        }

        // Send rejection email
        emailService.sendExecutiveRejectionEmail(executiveEmail, executiveName);
    }

    public List<Order> getAllOrdersForExecutive(String authorizationHeader) {
        String email = jwtservice.extractEmail(authorizationHeader);
        DeliveryExecutive executive = executiveRepo.getDeliveryExecutiveByUserEmail(email);

        List<DeliveryAssignment> assignments = assignmentRepo.findByExecutive(executive);
        return assignments.stream()
                .map(DeliveryAssignment::getOrder)
                .collect(Collectors.toList());
    }


    public List<Order> getActiveOrdersForExecutive(String authHeader) {

        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String email = jwtservice.extractEmail(authHeader);
        DeliveryExecutive executive = executiveRepo.getDeliveryExecutiveByUserEmail(email);

        List<DeliveryAssignment> currentAssignments = assignmentRepo.findAllByExecutiveAndStatus(executive, CURRENT);
        List<DeliveryAssignment> pendingAssignments = assignmentRepo.findAllByExecutiveAndStatus(executive, PENDING);

        // Combine lists: CURRENT first, then PENDING
        List<Order> activeOrders = new ArrayList<>();
        currentAssignments.stream()
                .map(DeliveryAssignment::getOrder)
                .forEach(activeOrders::add);
        pendingAssignments.stream()
                .map(DeliveryAssignment::getOrder)
                .forEach(activeOrders::add);

        return activeOrders;
    }

    public List<DeliveryExecutive> getNotVerifiedExecutives() {
        List<DeliveryExecutive> notVerifiedExecutives = executiveRepo.findByStatus(NOT_VERIFIED);

        return notVerifiedExecutives;
    }



    public ExecutivePerformanceDTO getExecutivePerformanceMetrics(DeliveryExecutive executive) {
        List<DeliveryAssignment> deliveredAssignments = assignmentRepo
                .findAllByExecutiveAndStatus(executive, DeliveryAssignmentStatus.DELIVERED);

        long totalOrdersDelivered = deliveredAssignments.size();


        // --- Calculate Average Delivery Time ---
        double averageDeliveryTimeInMinutes = 0.0;
        if (totalOrdersDelivered > 0) {
            long totalDurationSeconds = 0;
            for (DeliveryAssignment assignment : deliveredAssignments) {
                // Ensure both timestamps are present for a valid calculation
                if (assignment.getAssignedAt() != null && assignment.getActualDelivery() != null) {
                    Duration duration = Duration.between(assignment.getAssignedAt(), assignment.getActualDelivery());
                    totalDurationSeconds += duration.getSeconds();
                }
            }
            // Avoid division by zero if all relevant assignments somehow had null timestamps
            if (totalDurationSeconds > 0 && totalOrdersDelivered > 0) {
                averageDeliveryTimeInMinutes = (double) totalDurationSeconds / 60.0 / totalOrdersDelivered;
            }
        }

        // --- Calculate Estimated Total Earnings ---
        double estimatedTotalEarnings = totalOrdersDelivered * PER_DELIVERY_FEE_INR;

        return new ExecutivePerformanceDTO(
                averageDeliveryTimeInMinutes,
                totalOrdersDelivered,
                estimatedTotalEarnings
        );
    }
}
