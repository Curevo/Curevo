import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/Hooks/LocationContext';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

export default function ProductGrid() {
    const locationContext = useLocation();
    const axios = useAxiosInstance();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const size = 5;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const initialFetchPerformed = useRef(false);

    const getDistancePriority = useCallback((distanceTag) => {
        switch (distanceTag) {
            case "nearest": return 1;
            case "far": return 2; // Keep 'far' at priority 2 as per backend, not 'near'
            case "farthest": return 3;
            default: return 99;
        }
    }, []);

    const sortAndPrioritizeProducts = useCallback((productsArray) => {
        return [...productsArray].sort((a, b) => {
            const priorityA = getDistancePriority(a.distanceTag);
            const priorityB = getDistancePriority(b.distanceTag);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            const stockA = a.availableStock ?? 0;
            const stockB = b.availableStock ?? 0;
            if (stockA !== stockB) {
                return stockB - stockA;
            }
        });
    }, [getDistancePriority]);

    const fetchProducts = useCallback(async (reset = false) => {
        console.log(`[fetchProducts] Called with reset: ${reset}, current loading: ${loading}, current hasMore: ${hasMore}, current page: ${page}`);
        if (loading || (!hasMore && !reset)) {
            console.log("[fetchProducts] Skipping fetch due to loading or no more data.");
            return;
        }

        setLoading(true);
        try {
            const currentPageToFetch = reset ? 0 : page;
            console.log(`[fetchProducts] Requesting page: ${currentPageToFetch}, size: ${size}`);

            const userLat = locationContext.userLat;
            const userLon = locationContext.userLon;

            if (userLat === null || userLon === null) {
                console.warn("User location not available yet. Skipping product fetch.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `/api/products/by-location-all`,
                {
                    params: {
                        page: currentPageToFetch,
                        size,
                    }
                }
            );

            const responseData = response.data.data;
            const newProductsContent = responseData.content;
            const isLastPage = responseData.last;

            console.log(`[fetchProducts] Received ${newProductsContent.length} new products from API.`);

            setProducts(prev => {
                const currentProducts = reset ? [] : prev;
                const combinedProductsMap = new Map();

                currentProducts.forEach(p => {
                    // Use a composite key for Map to ensure unique product-store combinations
                    combinedProductsMap.set(`${p.productId}-${p.store?.storeId || 'no-store'}`, p);
                });

                newProductsContent.forEach(newProd => {
                    const newProdKey = `${newProd.productId}-${newProd.store?.storeId || 'no-store'}`;
                    const existingProd = combinedProductsMap.get(newProdKey);

                    if (!existingProd) {
                        combinedProductsMap.set(newProdKey, newProd);
                    } else {
                        const newProdPriority = getDistancePriority(newProd.distanceTag);
                        const existingProdPriority = getDistancePriority(existingProd.distanceTag);

                        if (newProdPriority < existingProdPriority) {
                            combinedProductsMap.set(newProdKey, newProd);
                        } else if (newProdPriority === existingProdPriority) {
                            const newProdStock = newProd.availableStock ?? 0;
                            const existingProdStock = existingProd.availableStock ?? 0;
                            if (newProdStock > existingProdStock) {
                                combinedProductsMap.set(newProdKey, newProd);
                            }
                        }
                    }
                });

                const updatedProducts = Array.from(combinedProductsMap.values());
                const finalSortedProducts = sortAndPrioritizeProducts(updatedProducts);

                return finalSortedProducts;
            });

            setHasMore(!isLastPage);

            if (newProductsContent.length > 0) {
                setPage(prev => currentPageToFetch + 1);
            }

        } catch (error) {
            console.error("Error fetching products:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, size, loading, hasMore, axios, locationContext, getDistancePriority, sortAndPrioritizeProducts]);


    useEffect(() => {
        if (locationContext.userLat !== null && locationContext.userLon !== null && !initialFetchPerformed.current) {
            initialFetchPerformed.current = true;
            fetchProducts(true);
        }
    }, [fetchProducts, locationContext.userLat, locationContext.userLon]);

    return (
        <section className="py-12 px-5 sm:px-8 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Recent <span className="text-green-600">products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <div
                        // Ensure product.store is not null before accessing storeId
                        key={`${product.productId}-${product.store?.storeId || 'no-store'}`}
                        className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition relative overflow-hidden"
                        // --- CHANGE HERE: Pass storeId to the navigation path ---
                        onClick={() => {
                            if (product.store && product.store.storeId) {
                                navigate(`/product/${product.productId}/store/${product.store.storeId}`);
                            } else {
                                // Handle case where storeId might be missing (e.g., product has no associated store)
                                console.warn(`Cannot navigate to product ${product.productId}: storeId is missing.`);
                                // Optionally, navigate to a generic product page or show an alert
                                // navigate(`/product/${product.productId}`);
                            }
                        }}
                    >
                        <div className="relative w-full h-96 mb-4">
                            <img
                                src={product.image || `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Product')}`}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Product')}`;
                                }}
                            />
                            {product.hoverImage && (
                                <img
                                    src={product.hoverImage}
                                    alt={product.name + " hovering"}
                                    className="absolute inset-0 w-full h-full rounded-2xl object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Hover')}`;
                                    }}
                                />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {product.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                            ${parseFloat(product.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">{product.quantity}</div>
                        {product.distanceTag && (
                            <div className="text-sm text-green-700 font-medium mt-1">
                                {product.distanceTag.charAt(0).toUpperCase() + product.distanceTag.slice(1)}
                            </div>
                        )}
                        {product.availableStock !== undefined && product.availableStock !== null && (
                            <div className="text-sm text-gray-500 mt-1">
                                Stock: {product.availableStock}
                                {product.availableStock === 0 && <span className="text-red-500 ml-1">(Out of Stock)</span>}
                            </div>
                        )}
                        {product.store && product.store.name && (
                            <div className="text-xs text-gray-400 mt-1">
                                From: {product.store.name}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => fetchProducts(false)}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {!hasMore && products.length > 0 && !loading && (
                <p className="text-center text-gray-600 text-lg mt-8 rounded-lg p-4 bg-blue-100 border border-blue-300 shadow-sm">
                    You've reached the end of the product list!
                </p>
            )}
            {!hasMore && products.length === 0 && !loading && (
                <p className="text-center text-gray-600 text-lg mt-8 rounded-lg p-4 bg-yellow-100 border border-yellow-300 shadow-sm">
                    No products found for your location.
                </p>
            )}
        </section>
    );
}