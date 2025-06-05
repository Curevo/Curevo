import React from 'react';
import axios from '@/Config/axiosConfig.js';

const AddToCartButton = ({ productId }) => {
    const handleAddToCart = async () => {
        try {
            console.log(productId)
            await axios.post('/api/cart/add', {
                productId: productId,
                quantity: 1
            });
            alert('Item added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart!');
        }
    };

    return (
        <button
            className="mt-6 bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-2 rounded"
            onClick={handleAddToCart}
        >
            Add to Cart
        </button>
    );
};

export default AddToCartButton;
