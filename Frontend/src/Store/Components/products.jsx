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

            const response = await axios.get(
                `/api/products/by-location-all`,
                {
                    params: {
                        page: currentPageToFetch,
                        size,
                        _t: Date.now()
                    }
                }
            );

            const newProducts = response.data.data;
            console.log(`[fetchProducts] Received ${newProducts.length} new products from API.`);
            console.log(`[fetchProducts] Fetched IDs: ${newProducts.map(p => p.productId).join(', ')}`);


            setProducts(prev => {
                const currentProducts = reset ? [] : prev;
                const uniqueNewProducts = newProducts.filter(
                    newProd => !currentProducts.some(existingProd => existingProd.productId === newProd.productId)
                );
                console.log(`[fetchProducts] Unique products to add: ${uniqueNewProducts.length}`);
                console.log(`[fetchProducts] Unique IDs being added: ${uniqueNewProducts.map(p => p.productId).join(', ')}`);
                return [...currentProducts, ...uniqueNewProducts];
            });

            if (newProducts.length < size) {
                setHasMore(false);
                console.log("[fetchProducts] setHasMore(false) because received less than requested size.");
            } else {
                setHasMore(true);
                console.log("[fetchProducts] setHasMore(true) because received full page.");
            }

            if (newProducts.length > 0) {
                setPage(prev => {
                    const nextPage = currentPageToFetch + 1;
                    console.log(`[fetchProducts] Setting next page state to: ${nextPage}`);
                    return nextPage;
                });
            } else {
                setHasMore(false);
                console.log("[fetchProducts] setHasMore(false) because no new products received.");
            }


        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            console.log("[fetchProducts] Loading state set to false.");
        }
    }, [page, size, loading, hasMore, axios]);

    useEffect(() => {
        console.log(`[useEffect] Initial fetch effect running. initialFetchPerformed: ${initialFetchPerformed.current}, products.length: ${products.length}, page: ${page}, hasMore: ${hasMore}, loading: ${loading}`);
        if (!initialFetchPerformed.current) {
            initialFetchPerformed.current = true;
            console.log("[useEffect] Triggering initial fetchProducts call for first render.");
            fetchProducts(false);
        }
    }, [fetchProducts]);

    return (
        <section className="py-12 px-5 sm:px-8 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Recent <span className="text-green-600">products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <div
                        key={product.productId}
                        className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition relative overflow-hidden"
                        onClick={() => navigate(`/product/${product.productId}`)}
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
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => fetchProducts()} // Changed this line!
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
        </section>
    );
}
