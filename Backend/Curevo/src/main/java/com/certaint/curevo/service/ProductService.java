package com.certaint.curevo.service;

import com.certaint.curevo.dto.ProductWithDistanceTagDTO;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Inventory;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.repository.ProductRepository;
import com.certaint.curevo.dto.StoreDistanceInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ImageHostingService imageHostingService;
    private final StoreService storeService;
    private final InventoryService inventoryService;

    public Product saveProduct(Product product, MultipartFile image, MultipartFile hoverImage) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(image, "products");
            product.setImage(imageUrl);
        }
        if (hoverImage != null && !hoverImage.isEmpty()) {
            String imageUrl = imageHostingService.uploadImage(hoverImage, "products");
            product.setHoverImage(imageUrl);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long productId, Product updatedProduct) {
        return productRepository.findById(productId)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setDescription(updatedProduct.getDescription());
                    product.setPrice(updatedProduct.getPrice());
                    product.setImage(updatedProduct.getImage());
                    product.setHoverImage(updatedProduct.getHoverImage());
                    product.setQuantity(updatedProduct.getQuantity());
                    product.setCategory(updatedProduct.getCategory());
                    product.setPrescriptionRequired(updatedProduct.getPrescriptionRequired());
                    return productRepository.save(product);
                }).orElseThrow(() -> new RuntimeException("Product not found with id " + productId));
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    public Page<ProductWithDistanceTagDTO> getProductsByLocation(double userLat, double userLon, double radiusKm, Pageable pageable) {
        List<StoreDistanceInfo> storeDistances = storeService.getStoresWithDistancesWithinRadius(userLat, userLon, radiusKm);

        if (storeDistances.isEmpty()) {
            return Page.empty(pageable);
        }

        Map<Long, Double> storeIdToDistanceMap = storeDistances.stream()
                .collect(Collectors.toMap(StoreDistanceInfo::getStoreId, StoreDistanceInfo::getDistance));

        List<Long> storeIds = storeDistances.stream()
                .map(StoreDistanceInfo::getStoreId)
                .collect(Collectors.toList());

        Page<Inventory> inventories = inventoryService.getInventoriesByStoreIds(storeIds, pageable);

        List<ProductWithDistanceTagDTO> productWithDistanceTags = inventories.stream()
                .map(inventory -> {
                    Double distance = storeIdToDistanceMap.get(inventory.getStore().getStoreId());
                    String distanceTag = formatDistanceToTag(distance);
                    Integer availableStock = inventory.getStock();
                    return new ProductWithDistanceTagDTO(inventory.getProduct(), distanceTag, availableStock, inventory.getStore());
                })
                .collect(Collectors.toList());

        return new PageImpl<>(productWithDistanceTags, pageable, inventories.getTotalElements());
    }

    public Page<ProductWithDistanceTagDTO> searchProducts(String keyword, Pageable pageable, Double userLat, Double userLon) {
        Page<Product> productsPage = productRepository.findByNameContainingIgnoreCase(keyword, pageable);

        List<ProductWithDistanceTagDTO> dtoList = productsPage.stream()
                .map(product -> convertProductToProductWithDistanceTagDTOForSearch(product, userLat, userLon))
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, productsPage.getTotalElements());
    }

    public Optional<ProductWithDistanceTagDTO> getProductDetails(Long productId, Long storeId, Double userLat, Double userLon) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return Optional.empty();
        }
        Product product = productOpt.get();

        Store store = storeService.getStoreById(storeId);


        Optional<Inventory> inventoryOpt = inventoryService.getInventoryByProductAndStore(product, store);

        Integer availableStock = 0;
        if (inventoryOpt.isPresent()) {
            availableStock = inventoryOpt.get().getStock();
        }

        String distanceTag = "N/A";
        if (userLat != null && userLon != null) {
            Double distance = calculateDistance(userLat, userLon, store.getLatitude(), store.getLongitude());
            distanceTag = formatDistanceToTag(distance);
        }

        return Optional.of(new ProductWithDistanceTagDTO(
                product,
                distanceTag,
                availableStock,
                store
        ));
    }

    private ProductWithDistanceTagDTO convertProductToProductWithDistanceTagDTOForSearch(Product product, Double userLat, Double userLon) {
        List<Inventory> inventories = inventoryService.getInventoriesByProduct(product);

        Inventory closestInventory = null;
        Double minDistance = Double.MAX_VALUE;

        if (userLat != null && userLon != null) {
            for (Inventory inv : inventories) {
                Store store = inv.getStore();
                Double currentDistance = calculateDistance(userLat, userLon, store.getLatitude(), store.getLongitude());
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    closestInventory = inv;
                }
            }
        } else if (!inventories.isEmpty()) {
            // If no user location, but inventories exist, just pick the first one
            // This provides *some* store context when location isn't a factor.
            closestInventory = inventories.get(0);
        }

        String distanceTag = "N/A";
        Integer availableStock = 0;
        Store relevantStore = null; // Initialize to null

        if (closestInventory != null) {
            // If a closest (or arbitrary first) inventory was found
            if (userLat != null && userLon != null && minDistance != Double.MAX_VALUE) {
                distanceTag = formatDistanceToTag(minDistance);
            }
            availableStock = closestInventory.getStock();
            relevantStore = closestInventory.getStore(); // Get the store from the found inventory
        }
        // If closestInventory is null, relevantStore remains null, availableStock remains 0, distanceTag remains "N/A"

        return new ProductWithDistanceTagDTO(product, distanceTag, availableStock, relevantStore);
    }

    private String formatDistanceToTag(Double distance) {
        if (distance == null) {
            return "N/A";
        }
        if (distance <= 10.0) {
            return "nearest";
        } else if (distance <= 20.0) {
            return "far";
        } else if (distance <= 50.0) {
            return "farthest";
        } else {
            return "unknown";
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        return distance;
    }
}