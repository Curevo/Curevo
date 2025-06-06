import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const CartButton = ({ productId }) => {
    const axios = useAxiosInstance();
    const navigate = useNavigate();

    const [inCart, setInCart] = useState(null); // null = loading, true/false after check
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const checkInCart = async () => {
            try {
                const response = await axios.get(`/api/cart/check/${productId}`);
                const responseData = response.data.data;
                const isInCart = responseData.inCart;
                setInCart(isInCart);
                if (isInCart) {
                    setQuantity(responseData.cartItem.quantity);
                } else {
                    setQuantity(0);
                }
            } catch (error) {
                console.error('Error checking cart status:', error);
                setInCart(false);
                setQuantity(0); 
            }
        };
        checkInCart();
    }, [productId, axios]); // Removed quantity and inCart from dependencies to prevent infinite loops

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            // Send productId as a query parameter
            const response = await axios.post(`/api/cart/add?productId=${productId}`);
            const updatedQuantity = response.data.data.quantity;
            setInCart(true);
            setQuantity(updatedQuantity);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecreaseQuantity = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/cart/decrease?productId=${productId}`);
            const responseData = response.data.data;
            const isInCart = responseData.inCart; // This will always be true or false

            if (isInCart) {
                const updatedQuantity = responseData.cartItem.quantity;
                setQuantity(updatedQuantity);
            } else {

                setQuantity(0);
            }
            setInCart(isInCart);

        } catch (error) {
            console.error('Error decreasing cart quantity:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleGoToCart = () => {
        navigate('/cart');
    };

    if (inCart === null) {
        return <button disabled>Loading...</button>;
    }

    return inCart ? (
        <div className="flex items-center mt-6 space-x-4">
            {/* Quantity Control Buttons */}
            <div className="flex border border-gray-400 rounded overflow-hidden">
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={handleDecreaseQuantity}
                    disabled={loading}
                >
                    -
                </button>
                <div className="w-px bg-gray-400"></div> {/* Vertical Separator */}
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={handleAddToCart}
                    disabled={loading}
                >
                    +
                </button>
            </div>

            {/* Go to Cart Button */}
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                onClick={handleGoToCart}
                disabled={loading}
            >
                Go to Cart ({quantity})
            </button>
        </div>
    ) : (
        <button
            className="mt-6 bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-2 rounded"
            onClick={handleAddToCart}
            disabled={loading}
        >
            {loading ? 'Adding...' : 'Add to Cart'}
        </button>
    );

};

export default CartButton;
