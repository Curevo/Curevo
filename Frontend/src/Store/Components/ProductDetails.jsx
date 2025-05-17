import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${productId}`)
        .then(res => setProduct(res.data))
        .catch(err => console.error("Error fetching product:", err));
    }, [productId]);

    if (!product) return <div className="mt-24 text-center">Loading...</div>;

    return (
        <div className="w-full h-auto flex items-center justify-center mt-24">
        <section className="max-w-[90%] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div className="grid grid-cols-2 gap-4">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-xl object-cover"
            />
            <img
                src={product.hoverImage || product.image}
                alt={product.name + " extra"}
                className="w-full h-auto rounded-xl object-cover"
            />
            </div>

            {/* Product Info */}
            <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-xl font-semibold text-green-800 mb-2">
                ${parseFloat(product.price).toFixed(2)} USD
            </p>
            <p className="text-gray-600 mb-4">{product.description || "No description available."}</p>

            {/* Bottle Quantity */}
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mr-2">Bottle:</label>
                <select className="border border-gray-300 rounded px-3 py-1">
                <option>5</option>
                <option>10</option>
                <option>15</option>
                </select>
            </div>

            {/* Ingredients and Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                <h3 className="font-semibold text-gray-700 mb-1">Ingredients:</h3>
                <ul className="list-disc ml-4 text-gray-600 space-y-1">
                    {product.ingredients?.map((ing, i) => <li key={i}>{ing}</li>) || <li>Not available</li>}
                </ul>
                </div>
                <div>
                <h3 className="font-semibold text-gray-700 mb-1">Key features:</h3>
                <ul className="list-disc ml-4 text-gray-600 space-y-1">
                    {product.features?.map((feat, i) => <li key={i}>{feat}</li>) || <li>Not available</li>}
                </ul>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-6 bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-2 rounded">
                Add to Cart
            </button>
            </div>
        </section>
        </div>
    );
};

export default ProductDetails;
