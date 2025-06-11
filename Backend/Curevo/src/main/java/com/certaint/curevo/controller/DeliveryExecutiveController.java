package com.certaint.curevo.controller;

import com.azure.core.annotation.Get;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.dto.DeliveryExecutiveDTO;
import com.certaint.curevo.entity.DeliveryExecutive;
import com.certaint.curevo.entity.Order; // Import Order entity
import com.certaint.curevo.exception.EmailAlreadyExistsException;
import com.certaint.curevo.repository.DeliveryExecutiveRepository;
import com.certaint.curevo.service.ExecutiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/executives")
@RequiredArgsConstructor
public class DeliveryExecutiveController {

    private final ExecutiveService executiveService;
    private final DeliveryExecutiveRepository executiveRepo;


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Boolean>> registerDeliveryExecutive(
            @RequestPart("executive") DeliveryExecutiveDTO executiveDTO,
            @RequestPart(value = "image", required = true) MultipartFile image) {
        try {
            Boolean registered = executiveService.registerDeliveryExecutive(executiveDTO, image);
            return ResponseEntity.ok(new ApiResponse<>(true, "Registration initiated successfully. OTP sent to your email.", registered));
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false, e.getMessage(), false));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, "Registration failed: " + e.getMessage(), false));
        }
    }

    @PostMapping("/verify-and-save")
    public ResponseEntity<ApiResponse<DeliveryExecutive>> verifyAndCompleteRegistration(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp) {
        try {
            DeliveryExecutive savedExecutive = executiveService.validateAndSaveDeliveryExecutive(email, otp);
            return ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive registered and verified successfully. Application is under review.", savedExecutive));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(false, "Failed to complete registration: " + e.getMessage(), null));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<DeliveryExecutive>> update(
            @PathVariable Long id,
            @RequestPart("executive") DeliveryExecutiveDTO executiveDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            DeliveryExecutive updatedExecutive = executiveService.updateDeliveryExecutive(id, executiveDTO, image);
            return ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive updated successfully.", updatedExecutive));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse<DeliveryExecutive>> getById(@PathVariable Long id) {
        return executiveRepo.findById(id)
                .map(executive -> ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive found.", executive)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Delivery Executive not found.", null)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryExecutive>>> getAll() {
        List<DeliveryExecutive> executives = executiveRepo.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "List of Delivery Executives retrieved successfully.", executives));
    }

    // --- Executive Status Management Endpoints ---

    @PostMapping("/{id}/start-day")
    public ResponseEntity<ApiResponse<Void>> startDay(@PathVariable Long id) {
        try {
            executiveService.startDay(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Executive day started successfully.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/end-day")
    public ResponseEntity<ApiResponse<Void>> endDay(@PathVariable Long id) {
        try {
            executiveService.endDay(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Executive day ended successfully.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/mark-unavailable")
    public ResponseEntity<ApiResponse<Void>> markUnavailable(@PathVariable Long id) {
        try {
            executiveService.markUnavailable(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Executive marked unavailable successfully.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // --- Admin Action Endpoints ---

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<DeliveryExecutive>> acceptExecutive(@PathVariable Long id) {
        try {
            DeliveryExecutive acceptedExecutive = executiveService.acceptExecutive(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive application accepted successfully.", acceptedExecutive));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectExecutive(@PathVariable Long id) {
        try {
            executiveService.rejectExecutive(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive application rejected and record deleted successfully.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}") // Replaced this with the rejectExecutive service call, as per earlier instruction
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            executiveService.rejectExecutive(id); // Using the service method for deletion
            return ResponseEntity.ok(new ApiResponse<>(true, "Delivery Executive and associated data deleted successfully.", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }



    @GetMapping("/my-orders/all")
    public ResponseEntity<ApiResponse<List<Order>>> getAllMyOrders(
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            List<Order> orders = executiveService.getAllOrdersForExecutive(authorizationHeader);
            return ResponseEntity.ok(new ApiResponse<>(true, "All orders for the executive retrieved successfully.", orders));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Failed to retrieve all orders: " + e.getMessage(), null));
        }
    }

    @GetMapping("/my-orders/active")
    public ResponseEntity<ApiResponse<List<Order>>> getActiveMyOrders(
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            List<Order> activeOrders = executiveService.getActiveOrdersForExecutive(authorizationHeader);
            return ResponseEntity.ok(new ApiResponse<>(true, "Active (current and pending) orders for the executive retrieved successfully.", activeOrders));
        } catch ( RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Failed to retrieve active orders: " + e.getMessage(), null));
        }
    }
    @GetMapping("/get-non-verified")
    public ResponseEntity<ApiResponse<List<DeliveryExecutive>>> getNotVerifiedExecutives() {
        List<DeliveryExecutive> notVerifiedExecutives = executiveService.getNotVerifiedExecutives();
        return ResponseEntity.ok(new ApiResponse<>(true, "List of not verified Delivery Executives retrieved successfully.", notVerifiedExecutives));
    }
}