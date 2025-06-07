import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
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

    // Fetch cart items when cart opens
    useEffect(() => {
        if (isCartOpen) {
            fetchCartItems();
        }
    }, [isCartOpen]);

    const fetchCartItems = async () => {
        setCartLoading(true);
        setCartError(null);
        try {
            // Replace with your Spring Boot API endpoint
            const response = await axios.get('http://localhost:8080/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCartItems(response.data.items || []);
        } catch (err) {
            setCartError(err.response?.data?.message || err.message);
            console.error('Error fetching cart items:', err);
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Refresh cart items after removal
            fetchCartItems();
        } catch (err) {
            console.error('Error removing item from cart:', err);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await axios.put(`http://localhost:8080/api/cart/${itemId}`, 
                { quantity: newQuantity },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            // Refresh cart items after update
            fetchCartItems();
        } catch (err) {
            console.error('Error updating cart item quantity:', err);
        }
    };

    // Calculate cart summary
    const cartSummary = cartItems.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;
        return {
            subtotal: acc.subtotal + itemTotal,
            itemCount: acc.itemCount + item.quantity
        };
    }, { subtotal: 0, itemCount: 0 });

    // Close cart when clicking outside
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

    // Close search when clicking outside on mobile
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
            {/* Navbar */}
            <nav className="flex items-center justify-between px-4 sm:px-6 md:px-32 py-4 bg-white/30 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => (window.location.href = "/")}>
                    <img src="/src/assets/Curevo-logo.png" alt="Curevo logo" className="h-8 sm:h-10 w-auto transition-transform duration-200 hover:scale-105" />
                </div>

                {/* Desktop Nav */}
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

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    {/* Search - Desktop */}
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

                    {/* Search - Mobile */}
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

                    {/* Hamburger Menu */}
                    <Menu
                        className="w-6 h-6 text-gray-700 cursor-pointer md:hidden hover:text-blue-500 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </div>

                {/* Mobile Menu */}
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

            {/* Cart Sidebar */}
            {(isCartOpen || isCartClosing) && (
                <>
                    {/* Overlay with fade transition */}
                    <div 
                        ref={overlayRef}
                        className="fixed inset-0 bg-black/50 z-40"
                        style={{
                            animation: `${isCartClosing ? 'fadeOut' : 'fadeIn'} 0.3s ease-out forwards`
                        }}
                        onClick={closeCart}
                    />
                    
                    {/* Cart Content with slide-in transition */}
                    <div 
                        ref={cartRef}
                        className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto"
                        style={{
                            animation: `${isCartClosing ? 'slideOut' : 'slideIn'} 0.3s ease-out forwards`
                        }}
                    >
                        <div className="p-4 sm:p-6">
                            {/* Cart Header */}
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
                                /* Empty Cart State */
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
                                /* Cart with Items */
                                <>
                                    <div className="divide-y">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="py-4 flex gap-4">
                                                <img 
                                                    src={item.image || "/placeholder-product.jpg"} 
                                                    alt={item.name} 
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-grow">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">{item.name}</h3>
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">${item.price.toFixed(2)}</p>
                                                    <div className="flex items-center border rounded w-max">
                                                        <button 
                                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                                        <button 
                                                            className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Cart Footer */}
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

            {/* Animation Styles */}
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