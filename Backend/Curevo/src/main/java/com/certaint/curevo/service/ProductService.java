package com.certaint.curevo.service;

import com.certaint.curevo.dto.ProductWithDistanceTagDTO;
import com.certaint.curevo.dto.ProductWithInventoryDTO;
import com.certaint.curevo.dto.StoreStockDTO;
import com.certaint.curevo.entity.Product;
import com.certaint.curevo.entity.Inventory;
import com.certaint.curevo.entity.Store;
import com.certaint.curevo.enums.ProductCategory;
import com.certaint.curevo.repository.InventoryRepository;
import com.certaint.curevo.repository.ProductRepository;
import com.certaint.curevo.dto.StoreDistanceInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
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
    private final InventoryService inventoryService; // Keep this for direct inventory operations if needed
    private final InventoryRepository inventoryRepository; // For direct inventory queries

    @Transactional
    public ProductWithInventoryDTO saveOrUpdateProduct(
            ProductWithInventoryDTO requestDTO,
            MultipartFile image,
            MultipartFile hoverImage) throws IOException {

        Product product;
        if (requestDTO.getProductId() != null) {
            // This is an update
            product = productRepository.findById(requestDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + requestDTO.getProductId()));

            // Handle image updates only if new files are provided (as per user's requirement)
            if (image != null && !image.isEmpty()) {
                if (product.getImage() != null && !product.getImage().isEmpty()) {
                    imageHostingService.deleteImage(product.getImage());
                }
                String imageUrl = imageHostingService.uploadImage(image, "products");
                product.setImage(imageUrl);
            }
            if (hoverImage != null && !hoverImage.isEmpty()) {
                if (product.getHoverImage() != null && !product.getHoverImage().isEmpty()) {
                    imageHostingService.deleteImage(product.getHoverImage());
                }
                String hoverImageUrl = imageHostingService.uploadImage(hoverImage, "products");
                product.setHoverImage(hoverImageUrl);
            }

        } else {
            // This is a new product creation
            product = new Product();
            // Upload images for new product
            if (image != null && !image.isEmpty()) {
                String imageUrl = imageHostingService.uploadImage(image, "products");
                product.setImage(imageUrl);
            }
            if (hoverImage != null && !hoverImage.isEmpty()) {
                String hoverImageUrl = imageHostingService.uploadImage(hoverImage, "products");
                product.setHoverImage(hoverImageUrl);
            }
        }

        // Update basic product details (common for both create and update)
        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setQuantity(requestDTO.getQuantity());
        product.setPrescriptionRequired(requestDTO.getPrescriptionRequired());
        product.setCategory(requestDTO.getCategory());

        // Save the product first to get its ID, crucial for new products
        Product savedProduct = productRepository.save(product);


        if (requestDTO.getInventoryDetails() != null && !requestDTO.getInventoryDetails().isEmpty()) {
            // If it's an update, we first clear existing inventories to handle deletions
            // and then add/update based on the DTO. This ensures only specified inventories exist.
            if (requestDTO.getProductId() != null) {
                // Clear existing inventories and let orphanRemoval=true handle deletions from DB
                // Ensure the Product's inventories collection is loaded if FetchType.LAZY
                // If FetchType.EAGER, it's already loaded.
                savedProduct.getInventories().clear();
                productRepository.save(savedProduct); // Persist the change to trigger orphanRemoval
            }

            for (StoreStockDTO storeStockDTO : requestDTO.getInventoryDetails()) {
                Store store = storeService.getStoreById(storeStockDTO.getStoreId());

                // Check if an inventory entry already exists for this product and store in the *loaded* collection
                Optional<Inventory> existingInventoryOptional = savedProduct.getInventories().stream()
                        .filter(inv -> inv.getStore().getStoreId().equals(store.getStoreId()))
                        .findFirst();

                Inventory inventory;
                if (existingInventoryOptional.isPresent()) {
                    inventory = existingInventoryOptional.get();
                    inventory.setStock(storeStockDTO.getStock()); // Update existing stock
                } else {
                    // Create new inventory entry and add to the product's collection
                    inventory = new Inventory();
                    inventory.setProduct(savedProduct); // Set the product side of the relationship
                    inventory.setStore(store);
                    inventory.setStock(storeStockDTO.getStock());
                    savedProduct.getInventories().add(inventory); // Add to the collection
                }
                // No need to call inventoryService.saveInventory(inventory) explicitly here if
                // cascade = CascadeType.ALL or CascadeType.PERSIST is used on the @OneToMany.
                // The save on savedProduct will handle it.
            }
            // Save the product again to persist changes to the inventory collection
            savedProduct = productRepository.save(savedProduct);

        } else if (requestDTO.getProductId() == null) {
            // For new products, if no inventoryDetails are provided, create a default initial stock
            Optional<Store> defaultStoreOptional = storeService.getFirstStoreById();
            if (defaultStoreOptional.isPresent()) {
                Inventory initialInventory = new Inventory();
                initialInventory.setProduct(savedProduct);
                initialInventory.setStore(defaultStoreOptional.get());
                initialInventory.setStock(0); // Default to 0 stock if not provided
                // Add to the product's collection
                savedProduct.getInventories().add(initialInventory);
                // Save the product again to persist this new inventory
                savedProduct = productRepository.save(savedProduct);
            } else {
                throw new RuntimeException("Cannot create product without inventory: No inventory details provided and no default store found in the system. Please add at least one store.");
            }
        }


        // Return the full DTO, including all current inventory details
        // Now using the product.getInventories() directly
        return getProductDetailsWithInventory(savedProduct.getProductId());
    }


    // --- Helper Method to get DTO from Product Entity ---
    // This method becomes much simpler by using product.getInventories()
    private ProductWithInventoryDTO convertProductToDTO(Product product) {
        // Map Inventory entries to StoreStockDTOs directly from the product's collection
        List<StoreStockDTO> storeStockDetails = product.getInventories().stream()
                .map(inventory -> {
                    Store store = inventory.getStore();
                    Long storeId = (store != null) ? store.getStoreId() : null;
                    String storeName = (store != null) ? store.getName() : "Unknown Store";
                    Integer stock = inventory.getStock();
                    return new StoreStockDTO(storeId, storeName, stock);
                })
                .collect(Collectors.toList());

        return new ProductWithInventoryDTO(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImage(),
                product.getHoverImage(),
                product.getQuantity(),
                product.getPrescriptionRequired(),
                product.getCategory(),
                storeStockDetails
        );
    }


    @Transactional // Ensure transactional boundary for potential lazy loading of inventories/stores
    public List<ProductWithInventoryDTO> getAllProductsWithInventory() {
        // Fetch all products, if inventories are LAZY, they will be loaded when accessed in the stream
        List<Product> products = productRepository.findAll();

        return products.stream()
                .map(this::convertProductToDTO) // Use the new helper method
                .collect(Collectors.toList());
    }


    @Transactional
    public ProductWithInventoryDTO getProductDetailsWithInventory(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Inventories are now directly accessible via product.getInventories()
        return convertProductToDTO(product); // Use the new helper method
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

    @Transactional // Ensure this method is transactional for lazy loading if needed
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Transactional
    public Page<ProductWithDistanceTagDTO> getProductsByLocation(double userLat, double userLon, double radiusKm, Pageable pageable) {
        // Here's the fix: Use storeId() and distance() instead of getStoreId() and getDistance()
        List<StoreService.StoreDistanceInfo> storeDistances = storeService.getStoresWithDistancesWithinRadius(userLat, userLon, radiusKm);

        if (storeDistances.isEmpty()) {
            return Page.empty(pageable);
        }

        Map<Long, Double> storeIdToDistanceMap = storeDistances.stream()
                .collect(Collectors.toMap(StoreService.StoreDistanceInfo::storeId, StoreService.StoreDistanceInfo::distance));

        List<Long> storeIds = storeDistances.stream()
                .map(StoreService.StoreDistanceInfo::storeId) // Fix here
                .collect(Collectors.toList());

        // Assuming inventoryRepository has a method to get inventories by store IDs and paginate
        Page<Inventory> inventories = inventoryRepository.findByStore_StoreIdIn(storeIds, pageable);

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

    @Transactional
    public Page<ProductWithDistanceTagDTO> getProducts(
            String keyword,
            Double userLat,
            Double userLon,
            Double radiusKm,
            Pageable pageable) {

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean calculateLocationInfo = (userLat != null && userLon != null);

        Page<Inventory> inventoriesPage;

        if (hasKeyword) {
            inventoriesPage = inventoryRepository.findByProduct_NameContainingIgnoreCase(keyword, pageable);
        } else {
            List<Long> storeIdsWithinRadius = null;
            if (calculateLocationInfo) {
                // Here's the fix: Use storeId() and distance() within getStoresWithDistancesWithinRadius
                List<StoreService.StoreDistanceInfo> storeDistances = storeService.getStoresWithDistancesWithinRadius(userLat, userLon, radiusKm != null ? radiusKm : Double.MAX_VALUE);
                if (storeDistances.isEmpty()) {
                    return Page.empty(pageable);
                }
                storeIdsWithinRadius = storeDistances.stream()
                        .map(StoreService.StoreDistanceInfo::storeId) // Fix here
                        .collect(Collectors.toList());
            }

            if (storeIdsWithinRadius != null && !storeIdsWithinRadius.isEmpty()) {
                inventoriesPage = inventoryRepository.findByStore_StoreIdIn(storeIdsWithinRadius, pageable);
            } else if (!calculateLocationInfo) {
                inventoriesPage = inventoryRepository.findAll(pageable);
            } else {
                return Page.empty(pageable);
            }
        }

        List<ProductWithDistanceTagDTO> dtoList = inventoriesPage.stream()
                .map(inventory -> {
                    String distanceTag = "N/A";
                    if (calculateLocationInfo && inventory.getStore() != null) {
                        double distance = calculateDistance(userLat, userLon,
                                inventory.getStore().getLatitude(),
                                inventory.getStore().getLongitude());
                        distanceTag = formatDistanceToTag(distance);
                    }
                    Integer availableStock = inventory.getStock();
                    return new ProductWithDistanceTagDTO(
                            inventory.getProduct(),
                            distanceTag,
                            availableStock,
                            inventory.getStore()
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, inventoriesPage.getTotalElements());
    }

    @Transactional // Ensure this method is transactional for lazy loading of inventories/stores
    public Optional<ProductWithDistanceTagDTO> getProductDetails(Long productId, Long storeId, Double userLat, Double userLon) {
        Product product = productRepository.findById(productId)
                .orElse(null); // Or throw an exception if product not found

        if (product == null) {
            return Optional.empty();
        }

        Store store = storeService.getStoreById(storeId);

        if (store == null) {
            return Optional.empty();
        }

        // Find the specific inventory for the product and store from the product's collection
        Optional<Inventory> inventoryOpt = product.getInventories().stream()
                .filter(inv -> inv.getStore().getStoreId().equals(storeId))
                .findFirst();

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

    @Transactional // Ensure this method is transactional for lazy loading of inventories/stores
    public ProductWithDistanceTagDTO convertProductToProductWithDistanceTagDTOForSearch(Product product, Double userLat, Double userLon) {
        // Directly use product.getInventories()
        List<Inventory> inventories = product.getInventories();

        Inventory closestInventory = null;
        Double minDistance = Double.MAX_VALUE;

        if (userLat != null && userLon != null) {
            for (Inventory inv : inventories) {
                Store store = inv.getStore();
                // Check for null store just in case, though it should be non-null due to nullable=false
                if (store != null) {
                    Double currentDistance = calculateDistance(userLat, userLon, store.getLatitude(), store.getLongitude());
                    if (currentDistance < minDistance) {
                        minDistance = currentDistance;
                        closestInventory = inv;
                    }
                }
            }
        } else if (!inventories.isEmpty()) {
            // If no user location, but inventories exist, just pick the first one
            closestInventory = inventories.get(0);
        }

        String distanceTag = "N/A";
        Integer availableStock = 0;
        Store relevantStore = null;

        if (closestInventory != null) {
            if (userLat != null && userLon != null && minDistance != Double.MAX_VALUE) {
                distanceTag = formatDistanceToTag(minDistance);
            }
            availableStock = closestInventory.getStock();
            relevantStore = closestInventory.getStore();
        }

        return new ProductWithDistanceTagDTO(product, distanceTag, availableStock, relevantStore);
    }

    public List<String> getAllProductCategories() {
        return Arrays.stream(ProductCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
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