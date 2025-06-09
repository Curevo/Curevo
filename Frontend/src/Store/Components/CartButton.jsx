import React, { useEffect, useState, useCallback } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const CartButton = ({ productId, storeId, onGoToCart }) => {
    const axios = useAxiosInstance();

    const [inCart, setInCart] = useState(null); // null: loading, true: in cart, false: not in cart
    const [loading, setLoading] = useState(false); // Indicates if any API operation is in progress
    const [quantity, setQuantity] = useState(0); // Quantity of the product in the cart


    const checkInCart = useCallback(async () => {
        setLoading(true); // Start loading for check operation
        try {

            const response = await axios.get(`/api/cart/check/${productId}/${storeId}`);
            const responseData = response.data.data; // Access the 'data' field from ApiResponse

            const isInCart = responseData.inCart;
            setInCart(isInCart);

            if (isInCart) {
                // If in cart, update quantity from the returned cartItem
                setQuantity(responseData.cartItem.quantity);
            } else {
                // If not in cart, quantity is 0
                setQuantity(0);
            }
        } catch (error) {
            console.error(`[CartButton] Error checking cart status for Product ID ${productId}, Store ID ${storeId}:`, error);
            // On error, assume it's not in cart or reset to default
            setInCart(false);
            setQuantity(0);
        } finally {
            setLoading(false); // End loading
        }
    }, [productId, storeId, axios]); // Dependencies for useCallback

    useEffect(() => {
        if (productId && storeId) {
            checkInCart(); // Initial check when component mounts or props change

            // Define the event handler
            const handleCartUpdate = () => {
                // When the 'cartUpdated' event is received, re-check the cart status
                console.log(`[CartButton - Product ${productId}] Received cartUpdated event. Re-fetching.`); // For debugging
                checkInCart();
            };

            // Subscribe to the event on the window object
            window.addEventListener('cartUpdated', handleCartUpdate); // <--- CHANGED LINE

            // Cleanup function: Unsubscribe from the event when the component unmounts
            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdate); // <--- CHANGED LINE
            };
        }
    }, [productId, storeId, checkInCart]);

    /**
     * Handles adding the product to the cart or increasing its quantity.
     * Updates 'inCart' and 'quantity' states, and optionally calls 'onGoToCart'.
     */
    const handleAddToCart = async () => {
        setLoading(true); // Start loading for add operation
        try {
            // API call to add product to cart (or increase quantity if already exists)
            // Backend returns ApiResponse<CartItem>
            const response = await axios.post(`/api/cart/add?productId=${productId}&storeId=${storeId}`);
            const updatedCartItem = response.data.data; // Direct CartItem object from ApiResponse

            setInCart(true); // Product is now definitely in cart
            setQuantity(updatedCartItem.quantity); // Update quantity from the response

            if (onGoToCart) {
                onGoToCart(); // Optional callback to navigate to cart page/modal
            }
        } catch (error) {
            console.error(`[CartButton] Error adding Product ID ${productId}, Store ID ${storeId} to cart:`, error);
            // Handle error, e.g., display an error message to the user
        } finally {
            setLoading(false); // End loading
        }
    };


    const handleDecreaseQuantity = async () => {
        setLoading(true); // Start loading for decrease operation
        try {
            // API call to decrease product quantity
            // Backend now returns CartResponse with 'inCart' status and 'cartItem' (or null if removed)
            const response = await axios.post(`/api/cart/decrease?productId=${productId}&storeId=${storeId}`);
            const responseData = response.data.data; // Access the 'data' field from ApiResponse

            const isInCartAfterDecrease = responseData.inCart;
            setInCart(isInCartAfterDecrease); // Update the inCart status

            if (isInCartAfterDecrease) {
                // If still in cart, update quantity from the returned cartItem
                const updatedQuantity = responseData.cartItem.quantity;
                setQuantity(updatedQuantity);
            } else {
                // If no longer in cart (quantity dropped to 0 and item removed)
                setQuantity(0);
            }
        } catch (error) {
            console.error(`[CartButton] Error decreasing quantity for Product ID ${productId}, Store ID ${storeId}:`, error);
            // Handle error
        } finally {
            setLoading(false); // End loading
        }
    };


    const handleGoToCart = () => {
        if (onGoToCart) {
            onGoToCart();
        }
    };


    if (inCart === null) {
        // Show loading state while checking cart status
        return <button disabled>Loading...</button>;
    }

    // Render different buttons based on whether the item is in the cart
    return inCart ? (
        // If in cart, show quantity controls and "Go to Cart" button
        <div className="flex items-center mt-6 space-x-4">
            <div className="flex border border-gray-400 rounded overflow-hidden">
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={handleDecreaseQuantity}
                    disabled={loading} // Disable during API operations
                >
                    -
                </button>
                <div className="w-px bg-gray-400"></div>
                <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    onClick={handleAddToCart}
                    disabled={loading} // Disable during API operations
                >
                    +
                </button>
            </div>

            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
                onClick={handleGoToCart}
                disabled={loading} // Disable during API operations
            >
                Go to Cart ({quantity})
            </button>
        </div>
    ) : (
        // If not in cart, show "Add to Cart" button
        <button
            className="mt-6 bg-lime-600 hover:bg-lime-700 text-white font-semibold px-6 py-2 rounded"
            onClick={handleAddToCart}
            disabled={loading} // Disable during API operations
        >
            {loading ? 'Adding...' : 'Add to Cart'}
        </button>
    );
};

export default CartButton;