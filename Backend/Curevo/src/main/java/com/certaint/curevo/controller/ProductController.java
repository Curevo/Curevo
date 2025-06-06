package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ProductWithDistanceTagDTO;
import com.certaint.curevo.entity.Product; // Keep Product for create/update operations
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;


    @PostMapping
    public ResponseEntity<ApiResponse<Product>> saveProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "hoverImage", required = false) MultipartFile hoverImage) {
        Product savedProduct = productService.saveProduct(product, image, hoverImage);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product saved successfully", savedProduct));
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

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ProductWithDistanceTagDTO>>> searchProducts(
            @RequestParam String keyword,
            @RequestHeader(value = "userLat", required = false) Double userLat, // Optional user location
            @RequestHeader(value = "userLon", required = false) Double userLon, // Optional user location
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Pass userLat/Lon to service so it can calculate distance tags if provided
        Page<ProductWithDistanceTagDTO> results = productService.searchProducts(keyword, pageable, userLat, userLon);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search completed successfully", results));
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
}