import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import AddToCartButton from "@/Store/Components/CartButton.jsx";
import { useLocation } from '@/Hooks/LocationContext';

const ProductDetails = ({ onOpenCartModal }) => {
    const { productId, storeId } = useParams();
    const axios = useAxiosInstance();
    const locationContext = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId, storeId]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!storeId) {
                    setError("Store ID is missing in the URL.");
                    setLoading(false);
                    return;
                }

                const userLat = locationContext.userLat;
                const userLon = locationContext.userLon;

                const headers = {};
                if (userLat !== null && userLon !== null) {
                    headers['userLat'] = userLat;
                    headers['userLon'] = userLon;
                }

                const response = await axios.get(`/api/products/${productId}/store/${storeId}`, { headers });
                setProduct(response.data.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Product or Store not found.");
                } else {
                    setError("Failed to load product details.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, storeId, axios, locationContext.userLat, locationContext.userLon]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
            <div className="text-center text-xl font-medium text-gray-700">Loading product details...</div>
        </div>
    );
    if (error) return (
        <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
            <div className="text-center text-xl font-medium text-red-600">{error}</div>
        </div>
    );
    if (!product) return (
        <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
            <div className="text-center text-xl font-medium text-gray-700">Product not found.</div>
        </div>
    );

    const formatDistanceTag = (tag) => {
        return tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'N/A';
    };

    return (
        <div className="w-full flex flex-col items-center pt-24 pb-10 bg-gray-50 min-h-screen">
            <section className="max-w-[69%] mx-auto px-4 py-10 bg-white rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center">
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={product.image || `https://placehold.co/600x450/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Product Image')}`}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain rounded-xl"
                            onError={(e) => { e.currentTarget.src = `https://placehold.co/600x450/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Image Not Found')}`; }}
                        />
                    </div>
                    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={product.hoverImage || `https://placehold.co/600x450/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Hover Image')}`}
                            alt={product.name + " extra"}
                            className="max-h-full max-w-full object-contain rounded-xl"
                            onError={(e) => { e.currentTarget.src = `https://placehold.co/600x450/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Hover Not Found')}`; }}
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                    <p className="text-3xl font-bold text-green-700 mb-6">
                        ₹{parseFloat(product.price).toFixed(2)}
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {product.description || "No description available for this product."}
                    </p>

                    <div className="mb-8 space-y-4">
                        {product.quantity && (
                            <div className="text-xl flex items-center">
                                <span className="font-semibold text-gray-800 mr-2">Pack Size:</span> {product.quantity}
                            </div>
                        )}
                        {product.availableStock !== undefined && product.availableStock !== null && (
                            <div className="text-xl flex items-center">
                                <span className="font-semibold text-gray-800 mr-2">Availability:</span>{" "}
                                <span className={product.availableStock === 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                    {product.availableStock > 0 ? `${product.availableStock} in stock` : "Out of Stock"}
                                </span>
                            </div>
                        )}
                        {product.prescriptionRequired && (
                            <div className="text-xl flex items-center text-red-600 font-bold mt-2">
                                <svg className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Prescription Required
                            </div>
                        )}
                    </div>

                    <div className="mb-8 space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        {product.distanceTag && (
                            <div className="text-lg text-blue-800 flex items-center">
                                <span className="font-semibold text-blue-900 mr-2">Proximity:</span>{" "}
                                <span className="font-bold">{formatDistanceTag(product.distanceTag)}</span>
                            </div>
                        )}
                        {product.store && (
                            <div className="text-lg text-blue-800">
                                <span className="font-semibold text-blue-900">Available at:</span>{" "}
                                <span className="font-bold">{product.store.name || 'N/A'}</span>
                                {product.store.address && (
                                    <p className="text-base text-blue-700 mt-1 pl-0 md:pl-4">{product.store.address}</p>
                                )}
                                {product.store.phoneNumber && (
                                    <p className="text-base text-blue-700 mt-1 pl-0 md:pl-4">Call: {product.store.phoneNumber}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-10">
                        <AddToCartButton
                            productId={product.productId}
                            storeId={product.store.storeId}
                            onGoToCart={onOpenCartModal}
                            availableStock={product.availableStock}
                        />
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* Universal Truth / Why Shop With Us? Section */}
            <section className="max-w-[90%] mx-auto mt-12 mb-10 px-6 py-10 bg-white rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Shop With Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-4">
                        <svg className="h-16 w-16 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
                        <p className="text-gray-600">Every product meets strict quality standards for your peace of mind.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <svg className="h-16 w-16 text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.333 0 2.5.56 3.313 1.467M12 8a9 9 0 00-7.313 1.467M12 8V5m0 3a5.996 5.996 0 01-3.313 1.467m3.313-1.467a5.996 5.996 0 003.313 1.467M21 12c0 3.313-2.687 6-6 6H9c-3.313 0-6-2.687-6-6V9a6 6 0 0112 0v3m0 0a6 6 0 01-12 0" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">Get your essentials delivered quickly and reliably to your doorstep.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <svg className="h-16 w-16 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9.25a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V7.5A.75.75 0 0112 6.75h4.25c.414 0 .75.336.75.75v1.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a.75.75 0 00-.75.75v3.5a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H9z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Support</h3>
                        <p className="text-gray-600">Our dedicated team is here to assist you with any questions or concerns.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;