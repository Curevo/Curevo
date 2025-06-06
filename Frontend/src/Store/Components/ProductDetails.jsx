import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams to get both productId and storeId
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import AddToCartButton from "@/Store/Components/CartButton.jsx";
import { useLocation } from '@/Hooks/LocationContext'; // Import useLocation to get user coordinates

const ProductDetails = () => {
    // Destructure both productId and storeId from useParams
    const { productId, storeId } = useParams();
    const axios = useAxiosInstance();
    const locationContext = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Ensure storeId is available before making the call
                if (!storeId) {
                    setError("Store ID is missing in the URL.");
                    setLoading(false);
                    return;
                }

                const userLat = locationContext.userLat;
                const userLon = locationContext.userLon;

                const headers = {};
                // Only include user location headers if they are available
                if (userLat !== null && userLon !== null) {
                    headers['userLat'] = userLat;
                    headers['userLon'] = userLon;
                } else {
                    console.warn("User location not available for product details. Distance tag might be 'N/A'.");
                }

                // Construct the API URL using both productId and storeId
                const response = await axios.get(`/api/products/${productId}/store/${storeId}`, { headers });
                setProduct(response.data.data);
            } catch (err) {
                console.error("Error fetching product:", err);
                // Check for 404 specifically for a more user-friendly message
                if (err.response && err.response.status === 404) {
                    setError("Product or Store not found.");
                } else {
                    setError("Failed to load product details.");
                }
            } finally {
                setLoading(false);
            }
        };

        // Trigger fetch when productId, storeId, axios, or user location changes
        fetchProductDetails();
    }, [productId, storeId, axios, locationContext.userLat, locationContext.userLon]);

    if (loading) return <div className="mt-24 text-center text-lg text-gray-700">Loading product details...</div>;
    if (error) return <div className="mt-24 text-center text-lg text-red-500">{error}</div>;
    if (!product) return <div className="mt-24 text-center text-lg text-gray-700">Product not found.</div>; // This should ideally be caught by error state if 404

    const formatDistanceTag = (tag) => {
        return tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'N/A';
    };

    return (
        <div className="w-full h-auto flex items-center justify-center mt-24">
            <section className="max-w-[90%] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Images */}
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src={product.image || `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Product')}`}
                        alt={product.name}
                        className="w-full h-auto rounded-xl object-cover shadow-md"
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Image Not Found')}`; }}
                    />
                    <img
                        src={product.hoverImage || `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Hover Image')}`}
                        alt={product.name + " extra"}
                        className="w-full h-auto rounded-xl object-cover shadow-md"
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/F0F4F8/6B7280?text=${encodeURIComponent(product.name || 'Hover Not Found')}`; }}
                    />
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-xl font-semibold text-green-800 mb-2">
                        ₹{parseFloat(product.price).toFixed(2)}
                    </p>
                    <p className="text-gray-600 mb-4">{product.description || "No description available."}</p>

                    {/* Quantity & Stock */}
                    <div className="mb-4 space-y-2">
                        {product.quantity && (
                            <div className="text-base">
                                <span className="font-medium text-gray-700">Quantity:</span> {product.quantity}
                            </div>
                        )}
                        {/* Display availableStock */}
                        {product.availableStock !== undefined && product.availableStock !== null && (
                            <div className="text-base">
                                <span className="font-medium text-gray-700">Available Stock:</span>{" "}
                                <span className={product.availableStock === 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                    {product.availableStock}
                                    {product.availableStock === 0 && " (Out of Stock)"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Distance Tag and Store Info */}
                    <div className="mb-4 space-y-2">
                        {product.distanceTag && (
                            <div className="text-base text-gray-700">
                                <span className="font-medium">Proximity:</span>{" "}
                                <span className="text-green-700 font-semibold">{formatDistanceTag(product.distanceTag)}</span>
                            </div>
                        )}
                        {product.store && (
                            <div className="text-base text-gray-700">
                                <span className="font-medium">Available at:</span>{" "}
                                <span className="text-gray-800 font-semibold">{product.store.storeName || 'N/A'}</span>
                                {product.store.address && (
                                    <p className="text-sm text-gray-500 mt-1 ml-1">{product.store.address}</p>
                                )}
                                {product.store.phoneNumber && (
                                    <p className="text-sm text-gray-500 mt-1 ml-1">Call: {product.store.phoneNumber}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ingredients and Features */}
                    <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Ingredients:</h3>
                            <ul className="list-disc ml-4 text-gray-600 space-y-1">
                                {/* Assuming product.ingredients is an array of strings */}
                                {product.ingredients && product.ingredients.length > 0 ? (
                                    product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                                ) : (
                                    <li>Not available</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Key features:</h3>
                            <ul className="list-disc ml-4 text-gray-600 space-y-1">
                                {/* Assuming product.features is an array of strings */}
                                {product.features && product.features.length > 0 ? (
                                    product.features.map((feat, i) => <li key={i}>{feat}</li>)
                                ) : (
                                    <li>Not available</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-8">
                        <AddToCartButton productId={product.productId} />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;