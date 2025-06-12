import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocation } from '@/Hooks/LocationContext';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

export default function ProductGrid() {
    const locationContext = useLocation();
    const axios = useAxiosInstance();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Hook to access URL query parameters

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const size = 15; // Default size from ProductController
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // State to hold the current keyword from the URL, for strict comparison
    const [currentKeyword, setCurrentKeyword] = useState("");

    // Ref to track if an initial fetch has happened for the current keyword/location combo
    const initialFetchPerformedRef = useRef(false);

    // --- Effect to manage keyword changes from URL ---
    useEffect(() => {
        const keywordFromUrl = searchParams.get('keyword') || "";

        // If the keyword has changed, reset state and mark for new initial fetch
        if (keywordFromUrl !== currentKeyword) {
            setCurrentKeyword(keywordFromUrl);
            setProducts([]); // Clear existing products
            setPage(0);     // Reset to first page
            setHasMore(true); // Assume there are more results
            initialFetchPerformedRef.current = false; // Flag for a new initial fetch
            // No need to call fetchProducts here directly, the main useEffect will handle it
        }
    }, [searchParams, currentKeyword]);


    const getDistancePriority = useCallback((distanceTag) => {
        switch (distanceTag) {
            case "nearest": return 1;
            case "far": return 2;
            case "farthest": return 3;
            default: return 99; // For 'N/A' or unknown tags, put them last
        }
    }, []);

    const sortAndPrioritizeProducts = useCallback((productsArray) => {
        return [...productsArray].sort((a, b) => {
            const priorityA = getDistancePriority(a.distanceTag);
            const priorityB = getDistancePriority(b.distanceTag);

            // Primary sort: by distance priority
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Secondary sort: by available stock (higher stock first)
            const stockA = a.availableStock ?? 0;
            const stockB = b.availableStock ?? 0;
            if (stockA !== stockB) {
                return stockB - stockA;
            }

            // Tertiary sort: by product name alphabetically
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    }, [getDistancePriority]);

    const fetchProducts = useCallback(async (reset = false) => {
        if (loading || (!hasMore && !reset)) {
            return; // Prevent multiple fetches or fetching when no more data
        }

        setLoading(true);
        const currentPageToFetch = reset ? 0 : page;

        const userLat = locationContext.userLat;
        const userLon = locationContext.userLon;

        const hasLocation = userLat !== null && userLon !== null;
        const hasKeyword = currentKeyword.trim() !== "";

        // Determine if we should attempt a fetch at all
        // If it's a reset fetch and neither location nor keyword is present, then there's nothing to search for.
        if (reset && !hasLocation && !hasKeyword) {
            setLoading(false);
            setHasMore(false); // No criteria, so no products to show
            setProducts([]); // Ensure products array is empty
            return;
        }

        try {
            const headers = {};
            // Only send location headers if location data is available and it's not a pure keyword search
            if (hasLocation && !hasKeyword) { // Changed this condition
                headers['userLat'] = userLat;
                headers['userLon'] = userLon;
            }
            // If it's a keyword search, the backend's default radius will apply,
            // or we could explicitly send user location even with keyword if desired.
            // For now, let's keep location headers only for non-keyword searches.

            const params = {
                page: currentPageToFetch,
                size,
            };
            if (hasKeyword) {
                params.keyword = currentKeyword;
            }

            const response = await axios.get(
                `/api/products/products`, // Unified endpoint
                {
                    params: params,
                    headers: headers // Send location as headers
                }
            );

            const responseData = response.data.data;
            const newProductsContent = responseData.content;
            const isLastPage = responseData.last;

            setProducts(prev => {
                const currentProducts = reset ? [] : prev;
                const combinedProductsMap = new Map();

                currentProducts.forEach(p => {
                    combinedProductsMap.set(`${p.productId}-${p.store?.storeId || 'no-store'}`, p);
                });

                newProductsContent.forEach(newProd => {
                    const newProdKey = `${newProd.productId}-${newProd.store?.storeId || 'no-store'}`;
                    const existingProd = combinedProductsMap.get(newProdKey);

                    if (!existingProd) {
                        combinedProductsMap.set(newProdKey, newProd);
                    } else {
                        // Logic to prioritize products from closer stores/higher stock remains
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
            // Only increment page if new content was actually received
            if (newProductsContent.length > 0 || !isLastPage) {
                setPage(prev => currentPageToFetch + 1);
            } else {
                setPage(currentPageToFetch); // Stay on current page if no new content and it's last page
            }


        } catch (error) {
            console.error("Error fetching products:", error);
            setHasMore(false); // Assume no more products on error
        } finally {
            setLoading(false);
        }
    }, [page, size, loading, hasMore, axios, locationContext.userLat, locationContext.userLon, currentKeyword, getDistancePriority, sortAndPrioritizeProducts]);


    // --- Main Effect for Initial Fetching ---
    useEffect(() => {
        const hasLocation = locationContext.userLat !== null && locationContext.userLon !== null;
        const hasKeyword = currentKeyword.trim() !== "";

        // Trigger fetch if:
        // 1. An initial fetch hasn't happened yet for the current state (location/keyword)
        // 2. Either location or keyword is available (meaning there's a valid search criteria)
        // 3. Or, if there are no products and we haven't tried fetching yet (e.g., initial load without criteria)
        if (!initialFetchPerformedRef.current && (hasLocation || hasKeyword || products.length === 0)) {
            initialFetchPerformedRef.current = true;
            fetchProducts(true); // Always pass true to ensure a reset when this effect triggers
        }
        // Dependency array: Re-run when location changes or when the keyword changes
    }, [fetchProducts, locationContext.userLat, locationContext.userLon, currentKeyword]);


    return (
        <section className="py-12 px-5 sm:px-8 lg:px-24 bg-gray-50">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
                Discover Our <span className="text-blue-600">Products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {products.map((product) => (
                    <div
                        key={`${product.productId}-${product.store?.storeId || 'no-store'}`}
                        className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col h-full"
                        onClick={() => {
                            if (product.store && product.store.storeId) {
                                navigate(`/product/${product.productId}/store/${product.store.storeId}`);
                            } else {
                                console.warn(`Cannot navigate to product ${product.productId}: storeId is missing.`);
                            }
                        }}
                    >
                        <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl group">
                            <img
                                src={product.image || `https://placehold.co/400x300/E0E7FF/5C6BC0?text=${encodeURIComponent(product.name || 'Product')}`}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `https://placehold.co/400x300/E0E7FF/5C6BC0?text=${encodeURIComponent(product.name || 'Product')}`;
                                }}
                            />
                            {product.hoverImage && (
                                <img
                                    src={product.hoverImage}
                                    alt={product.name + " hovering"}
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `https://placehold.co/400x300/E0E7FF/5C6BC0?text=${encodeURIComponent(product.name || 'Hover')}`;
                                    }}
                                />
                            )}
                        </div>

                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                                    {product.name}
                                </h3>
                                <div className="text-sm font-medium text-blue-600 mb-2">
                                    ₹{parseFloat(product.price).toFixed(2)}
                                </div>
                                {product.quantity && (
                                    <div className="text-xs text-gray-500 mb-2">
                                        Pack: {product.quantity}
                                    </div>
                                )}

                                {product.prescriptionRequired && (
                                    <div className="flex items-center text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded-full w-fit mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L10 13.414l1.293 1.293a1 1 0 001.414-1.414L11.414 12l1.293-1.293a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293z" clipRule="evenodd" />
                                        </svg>
                                        Prescription Required
                                    </div>
                                )}

                                {product.distanceTag && (
                                    <div className="text-sm text-green-700 font-medium mt-2">
                                        {product.distanceTag.charAt(0).toUpperCase() + product.distanceTag.slice(1)}
                                    </div>
                                )}
                                {product.availableStock !== undefined && product.availableStock !== null && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        Stock: {product.availableStock}
                                        {product.availableStock === 0 && <span className="text-red-500 ml-1">(Out of Stock)</span>}
                                    </div>
                                )}
                            </div>
                            {product.store && product.store.name && (
                                <div className="text-xs text-gray-400 mt-3 border-t pt-2 border-gray-100 self-end w-full">
                                    From: <span className="font-semibold text-gray-600">{product.store.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && products.length > 0 && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => fetchProducts(false)}
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {loading ? "Loading More..." : "Load More Products"}
                    </button>
                </div>
            )}

            {!loading && products.length === 0 && ( // Display messages when no products are found after loading
                <p className="text-center text-gray-700 text-base mt-12 rounded-xl p-4 bg-yellow-100 border border-yellow-300 shadow-sm font-medium">
                    {currentKeyword.trim() !== ""
                        ? `No products found for "${currentKeyword}".`
                        : "No products found for your location at this time. Please check back later!"
                    }
                </p>
            )}

            {loading && products.length === 0 && ( // Show spinner only when initially loading or loading more into empty list
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {currentKeyword.trim() !== "" ? `Searching for "${currentKeyword}"...` : "Finding products near you..."}
                    </p>
                </div>
            )}
            {!hasMore && products.length > 0 && !loading && ( // Show end of list message only if products were found
                <p className="text-center text-gray-600 text-base mt-12 rounded-xl p-4 bg-blue-100 border border-blue-300 shadow-sm font-medium">
                    You've reached the end of the product list! No more products to show.
                </p>
            )}
        </section>
    );
}