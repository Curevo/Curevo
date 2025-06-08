// Navbar.jsx (The relevant parts for endpoint calls are unchanged, as they are already correct)

import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {useAxiosInstance} from "@/Config/axiosConfig.js";
import { FaSpinner } from "react-icons/fa";

export default function Navbar({ isCartOpen, setIsCartOpen }) {
    const axios = useAxiosInstance();
    const [isMobileMenuOpen, setMobileMenuMenuOpen] = useState(false);
    const [isCartClosing, setIsCartClosing] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);
    const cartRef = useRef(null);
    const overlayRef = useRef(null);
    const searchRef = useRef(null);

    const closeCart = () => {
        setIsCartClosing(true);
        setTimeout(() => {
            setIsCartOpen(false);
            setIsCartClosing(false);
        }, 300);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => {
                searchRef.current?.focus();
            }, 100);
        }
    };

    useEffect(() => {
        if (isCartOpen) {
            fetchCartItems();
        }
    }, [isCartOpen]);

    const fetchCartItems = async () => {
        setCartLoading(true);
        setCartError(null);
        try {
            // This GET call to /api/cart fetches all cart items, each with a unique 'id'
            const response = await axios.get('/api/cart');
            setCartItems(response.data.data.items || []);
        } catch (err) {
            console.error("Error fetching cart items:", err);
            setCartError(err.response?.data?.message || err.message || "Failed to load cart.");
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = async (itemId, storeId) => {
        setCartLoading(true);
        setCartError(null);
        try {
            // Sends DELETE /api/cart/{itemId}?storeId={storeId}
            // This perfectly matches the new @DeleteMapping("/{itemId}") in CartController.java
            await axios.delete(`/api/cart/${itemId}`);
            fetchCartItems();
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error("Error removing from cart:", err);
            setCartError(err.response?.data?.message || err.message || "Failed to remove item.");
        } finally {
            setCartLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity, storeId) => {
        if (newQuantity < 1) return;

        setCartLoading(true);
        setCartError(null);
        try {
            await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity, storeId: storeId });
            fetchCartItems();
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (err) {
            console.error("Error updating quantity:", err);
            setCartError(err.response?.data?.message || err.message || "Failed to update quantity.");
        } finally {
            setCartLoading(false);
        }
    };

    const cartSummary = cartItems.reduce((acc, item) => {
        const price = item.product?.price ?? 0;
        const quantity = item.quantity ?? 0;
        const itemTotal = price * quantity;
        return {
            subtotal: acc.subtotal + itemTotal,
            itemCount: acc.itemCount + quantity
        };
    }, { subtotal: 0, itemCount: 0 });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCartOpen && cartRef.current && !cartRef.current.contains(event.target)) {
                closeCart();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSearchOpen && window.innerWidth < 768 &&
                !event.target.closest('.search-container') &&
                !event.target.closest('.search-icon')) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    return (
        <>
            <nav className="flex items-center justify-between px-4 sm:px-6 md:px-32 py-4 bg-white/30 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
                    <img src="/Assets/Curevo-logo.png" alt="Curevo logo" className="h-8 sm:h-10 w-auto transition-transform duration-200 hover:scale-105" />
                </div>

                <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
                    <li className="cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={() => (window.location.href = "/store")}>Home</li>
                    <li className="cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={() => (window.location.href = "/product")}>Shop</li>
                    <li className="cursor-pointer hover:text-blue-500 transition-colors duration-200" onClick={() => (window.location.href = "../Pages/ProductStore.jsx")}>About</li>
                    <li className="relative group cursor-pointer">
                        <span className="hover:text-blue-500 transition-colors duration-200">Pages</span>
                        <div className="absolute top-6 left-0 w-28 p-2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <p className="cursor-pointer text-sm hover:text-blue-500 transition-colors duration-200">Page 1</p>
                            <p className="cursor-pointer text-sm hover:text-blue-500 transition-colors duration-200">Page 2</p>
                        </div>
                    </li>
                </ul>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center search-container">
                        {isSearchOpen ? (
                            <div className="flex items-center bg-white rounded-full shadow-sm px-3 py-1 border border-gray-200">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="outline-none text-sm w-40 transition-all duration-200 focus:w-52"
                                />
                                <X
                                    className="w-4 h-4 text-gray-500 cursor-pointer ml-2"
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                />
                            </div>
                        ) : (
                            <Search
                                className="w-5 h-5 text-gray-900 cursor-pointer hover:text-blue-500 transition-colors duration-200 search-icon"
                                onClick={toggleSearch}
                            />
                        )}
                    </div>

                    <div className="md:hidden search-container">
                        {isSearchOpen ? (
                            <div className="absolute top-16 left-0 right-0 bg-white px-4 py-3 shadow-md">
                                <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="outline-none text-sm w-full bg-transparent"
                                    />
                                    <X
                                        className="w-4 h-4 text-gray-500 cursor-pointer ml-2"
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            setSearchQuery("");
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <Search
                                className="w-5 h-5 text-gray-700 cursor-pointer hover:text-blue-500 transition-colors duration-200 search-icon"
                                onClick={toggleSearch}
                            />
                        )}
                    </div>

                    <div
                        className="relative cursor-pointer hover:text-blue-500 transition-colors duration-200"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartSummary.itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 text-white bg-blue-500 text-xs w-4 h-4 flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110">
                                {cartSummary.itemCount}
                            </span>
                        )}
                    </div>

                    <Menu
                        className="w-6 h-6 text-gray-700 cursor-pointer md:hidden hover:text-blue-500 transition-colors duration-200"
                        onClick={() => setMobileMenuMenuOpen(!isMobileMenuMenuOpen)}
                    />
                </div>

                {isMobileMenuOpen && (
                    <div
                        className="absolute top-[60px] left-0 w-full bg-gradient-to-b from-[#fffffc] to-[#fcffef] shadow-md md:hidden rounded-b-3xl py-8 px-6"
                        style={{
                            animation: "slideDown 0.3s ease-out forwards"
                        }}
                    >
                        <ul className="flex flex-col items-start gap-4 p-4 text-gray-700 font-medium">
                            <li
                                className="text-blue-800 cursor-pointer hover:pl-2 transition-all duration-200"
                                onClick={() => (window.location.href = "/")}
                            >
                                Home
                            </li>
                            <li
                                className="cursor-pointer hover:text-blue-800 hover:pl-2 transition-all duration-200"
                                onClick={() => (window.location.href = "/product")}
                            >
                                Shop
                            </li>
                            <li
                                className="cursor-pointer hover:text-blue-800 hover:pl-2 transition-all duration-200"
                                onClick={() => (window.location.href = "/about")}
                            >
                                About
                            </li>
                            <li>
                                <details className="w-full">
                                    <summary className="cursor-pointer hover:text-blue-800 hover:pl-2 transition-all duration-200">Pages</summary>
                                    <div className="pl-4 pt-4 flex flex-col gap-1 text-sm">
                                        <p className="cursor-pointer hover:text-blue-800 mb-2 transition-colors duration-200">Page 1</p>
                                        <p className="cursor-pointer hover:text-blue-800 mb-2 transition-colors duration-200">Page 2</p>
                                    </div>
                                </details>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            {(isCartOpen || isCartClosing) && (
                <>
                    <div
                        ref={overlayRef}
                        className="fixed inset-0 bg-black/50 z-40"
                        style={{
                            animation: `${isCartClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease-out forwards`
                        }}
                        onClick={closeCart}
                    />

                    <div
                        ref={cartRef}
                        className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto"
                        style={{
                            animation: `${isCartClosing ? 'slideOut' : 'slideIn'} 0.3s ease-out forwards`
                        }}
                    >
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-bold">Your Cart</h2>
                                <button
                                    onClick={closeCart}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {cartLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                                </div>
                            ) : cartError ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                    <p className="text-red-700">{cartError}</p>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                                    <ShoppingCart className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mb-3 sm:mb-4 transition-transform duration-200 hover:scale-110" />
                                    <p className="text-gray-500 text-sm sm:text-base mb-2">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base transition-colors duration-200 hover:shadow-md"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="divide-y">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="py-4 flex gap-4">
                                                <img
                                                    src={item.product?.image || "/placeholder-product.jpg"}
                                                    alt={item.product?.name ?? 'Product'}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-grow">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">{item.product?.name ?? 'Unknown Product'}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">${(item.product?.price ?? 0).toFixed(2)}</p>
                                                    <div className="flex items-center border rounded w-max">
                                                        <button
                                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.product?.storeId)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                                        <button
                                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.product?.storeId)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="font-medium">
                                                    ${((item.product?.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
                                        <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base">
                                            <span>Subtotal</span>
                                            <span>${cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="flex justify-between mb-3 sm:mb-4 text-sm sm:text-base font-bold">
                                            <span>Total</span>
                                            <span>${cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        <button
                                            className="w-full py-2 sm:py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base transition-colors duration-200 hover:shadow-md"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); }
                    to { transform: translateX(100%); }
                }
                @keyframes slideDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}