package com.certaint.curevo.controller;

import com.certaint.curevo.dto.ProductWithDistanceTagDTO;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.dto.ApiResponse;
import com.certaint.curevo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/by-location")
    public ResponseEntity<ApiResponse<Page<Product>>> getProductsByLocation(
            @RequestHeader("userLat") double userLat,
            @RequestHeader("userLon") double userLon,
            @RequestParam(defaultValue = "10") double radiusKm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Product> products = productService.getProductsByLocation(userLat, userLon, radiusKm, pageable);

        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", products));
    }

    @GetMapping("/by-location-all")
    public ResponseEntity<ApiResponse<List<ProductWithDistanceTagDTO>>> getProductsByLocationAll(
            @RequestHeader("userLat") double userLat,
            @RequestHeader("userLon") double userLon,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Map<Long, ProductWithDistanceTagDTO> productMap = new LinkedHashMap<>();

        // Fetch nearest products (distance <= 10 km)
        Page<Product> nearestProducts = productService.getProductsByLocation(userLat, userLon, 10, pageable);
        nearestProducts.forEach(product -> {
            productMap.put(product.getProductId(), new ProductWithDistanceTagDTO(product, "nearest"));
        });

        // Fetch far products (distance <= 20 km)
        Page<Product> farProducts = productService.getProductsByLocation(userLat, userLon, 20, pageable);
        farProducts.forEach(product -> {
            productMap.merge(product.getProductId(), new ProductWithDistanceTagDTO(product, "far"),
                    (existing, newEntry) -> {
                        if ("nearest".equals(existing.getDistanceTag())) {
                            return existing;
                        } else {
                            return newEntry;
                        }
                    });
        });

        // Fetch farthest products (distance <= 50 km)
        Page<Product> farthestProducts = productService.getProductsByLocation(userLat, userLon, 50, pageable);
        farthestProducts.forEach(product -> {
            productMap.merge(product.getProductId(), new ProductWithDistanceTagDTO(product, "farthest"),
                    (existing, newEntry) -> {
                        if ("nearest".equals(existing.getDistanceTag()) || "far".equals(existing.getDistanceTag())) {
                            return existing;
                        } else {
                            return newEntry;
                        }
                    });
        });

        // Collect unique products
        List<ProductWithDistanceTagDTO> combined = new ArrayList<>(productMap.values());

        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", combined));
    }






    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Product>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> results = productService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Search completed successfully", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> ResponseEntity.ok(new ApiResponse<>(true, "Product found", product)))
                .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Product not found", null)));
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
}
