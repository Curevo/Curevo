package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ProductWithDistanceTagDTO;
import com.certaint.curevo.dto.ProductWithInventoryDTO;
import com.certaint.curevo.entity.Product; // Keep Product for create/update operations
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;


    @PostMapping("/save-or-update") // A more descriptive path
    public ResponseEntity<ApiResponse<ProductWithInventoryDTO>> saveOrUpdateProduct(
            @RequestPart("product") ProductWithInventoryDTO requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "hoverImage", required = false) MultipartFile hoverImage) {
        try {
            ProductWithInventoryDTO resultProduct = productService.saveOrUpdateProduct(
                    requestDTO, image, hoverImage);

            String message = (requestDTO.getProductId() == null) ? "Product created successfully" : "Product updated successfully";
            HttpStatus status = (requestDTO.getProductId() == null) ? HttpStatus.CREATED : HttpStatus.OK;

            return ResponseEntity.status(status)
                    .body(new ApiResponse<>(true, message, resultProduct));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to process image: " + e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Use BAD_REQUEST for business logic errors
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An unexpected error occurred: " + e.getMessage(), null));
        }
    }

    // GET all products with their inventory details
    @GetMapping("/get-all-with-inventory")
    public ResponseEntity<ApiResponse<List<ProductWithInventoryDTO>>> getAllProducts() {
        try {
            List<ProductWithInventoryDTO> products = productService.getAllProductsWithInventory();
            return ResponseEntity.ok(new ApiResponse<>(true, "Products fetched successfully", products));
        } catch (Exception e) {
            // Catch a broader exception for unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to fetch products: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        try {
            Product product = productService.updateProduct(id, updatedProduct);
            return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Product not found", null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", "Deleted"));
    }
    // --- End Product Management ---


    // --- Location-aware Product Retrieval (Returns ProductWithDistanceTagDTO) ---
    @GetMapping("/by-location")
    public ResponseEntity<ApiResponse<Page<ProductWithDistanceTagDTO>>> getProductsByLocation(
            @RequestHeader("userLat") double userLat,
            @RequestHeader("userLon") double userLon,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductWithDistanceTagDTO> products = productService.getProductsByLocation(userLat, userLon, radiusKm, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", products));
    }

    @GetMapping("/by-location-all")
    public ResponseEntity<ApiResponse<Page<ProductWithDistanceTagDTO>>> getProductsByLocationAll(
            @RequestHeader("userLat") double userLat,
            @RequestHeader("userLon") double userLon,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Using a large radius (e.g., 100km) to get all within a reasonable search area
        Page<ProductWithDistanceTagDTO> productsPage = productService.getProductsByLocation(userLat, userLon, 100, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", productsPage));
    }

    @GetMapping("/products") // Unified endpoint for products
    public ResponseEntity<ApiResponse<Page<ProductWithDistanceTagDTO>>> getProducts(
            @RequestParam(required = false) String keyword, // Keyword is now optional
            @RequestHeader(value = "userLat", required = false) Double userLat, // User Lat from header
            @RequestHeader(value = "userLon", required = false) Double userLon, // User Lon from header
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size, // Match ProductGrid's default size
            @RequestParam(defaultValue = "50.0") double radiusKm) { // Default radius for location filter

        Pageable pageable = PageRequest.of(page, size);

        // Call the unified service method
        Page<ProductWithDistanceTagDTO> results = productService.getProducts(
                keyword, userLat, userLon, radiusKm, pageable
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", results));
    }

    @GetMapping("/{productId}/store/{storeId}")
    public ResponseEntity<ApiResponse<ProductWithDistanceTagDTO>> getProductDetails(
            @PathVariable Long productId,
            @PathVariable Long storeId,
            @RequestHeader(value = "userLat", required = false) Double userLat,
            @RequestHeader(value = "userLon", required = false) Double userLon) {
        return productService.getProductDetails(productId, storeId, userLat, userLon)
                .map(productDto -> ResponseEntity.ok(new ApiResponse<>(true, "Product details found", productDto)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Product or Store not found", null)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllProductCategories() {
        try {
            List<String> categories = productService.getAllProductCategories();
            return ResponseEntity.ok(new ApiResponse<>(true, "Product categories fetched successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to fetch product categories: " + e.getMessage(), null));
        }
    }
}