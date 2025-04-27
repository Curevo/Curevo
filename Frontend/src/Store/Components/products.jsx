import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductGrid() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/products")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <section className="py-12 px-5 sm:px-8 lg:px-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Recent <span className="text-green-600">products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.productId}
                        className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition relative overflow-hidden"
                    >
                        <div className="relative w-full h-96 mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {product.name}
                        </h3>
                        <div className="text-sm text-gray-600">
                            ${parseFloat(product.price).toFixed(2)} {/* FIX 3: format price */}
                        </div>
                        <div className="text-sm text-gray-600">{product.quantity}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
