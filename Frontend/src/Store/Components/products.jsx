import React, { useEffect, useState , useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from '@/Config/axiosConfig.js';

export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const size = 1;
    const [loading, setLoading] = useState(false);
    const didFetch = useRef(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/products?page=${page}&size=${size}`);
            if (response.data.data.content.length === 0) {
                setHasMore(false); // No more products to load
            } else {
                setProducts(prev => [...prev, ...response.data.data.content]);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!didFetch.current) {
            fetchProducts();
            didFetch.current = true;
        }
    }, []);

    const navigate = useNavigate();

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
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
                            />
                            <img
                                src={product.hoverImage}
                                alt={product.name + " hovering"}
                                className="absolute inset-0 w-full h-full rounded-2xl object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                            />
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
                        onClick={fetchProducts}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </section>
    );
}
