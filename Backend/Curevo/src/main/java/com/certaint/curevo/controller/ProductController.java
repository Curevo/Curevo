package com.certaint.curevo.controller;

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

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", products));
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
