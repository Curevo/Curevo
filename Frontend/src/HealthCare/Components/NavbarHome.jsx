import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, CircleUserRound } from 'lucide-react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { jwtDecode } from "jwt-decode";

export default function NavbarHome() {
    const axios = useAxiosInstance();
    const [menuOpen, setMenuOpen] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("NavbarHome: No token found. User not logged in.");
                setIsLoggedIn(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check for token expiration client-side first
                if (decodedToken.exp < currentTime) {
                    console.log("NavbarHome: Token expired client-side. User not logged in.");
                    setIsLoggedIn(false);
                    localStorage.removeItem('token'); // Clear expired token
                    return;
                }

                // Also check if the role is 'CUSTOMER' for this specific navbar's display logic
                if (decodedToken.role !== "CUSTOMER") {
                    console.log("NavbarHome: User is logged in but not a 'CUSTOMER'. Displaying as logged out.");
                    setIsLoggedIn(false); // Treat as logged out for customer-specific display
                    return;
                }

                console.log("NavbarHome: Client-side token valid and role is 'CUSTOMER'. Verifying with backend...");
                const response = await axios.get('/api/auth/check-status');

                if (response.status === 200) {
                    console.log("NavbarHome: Backend confirmed authentication status (200 OK).");
                    setIsLoggedIn(true);
                } else {
                    console.log(`NavbarHome: Backend check failed with status: ${response.status}. User not logged in.`);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("NavbarHome: Authentication check failed (decode error or backend call):", error);
                setIsLoggedIn(false);
            }
        };

        checkAuthStatus();
    }, [axios]);

    return (
        <header className="bg-white top-0 z-50 font-sans shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3.5">
                    {/* Logo */}
                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => (window.location.href = '/')}
                    >
                        <img
                            src="/Assets/Curevo-logo.png"
                            alt="Curevo logo"
                            className="h-8 w-auto"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 text-black font-medium">
                        <a href="/store/home" className="hover:text-blue-600 transition-colors">Store</a>
                        <a href="/services" className="hover:text-blue-600 transition-colors">Services</a>
                        <a href="/doctors" className="hover:text-blue-600 transition-colors">Doctors</a>
                        <a href="/about" className="hover:text-blue-600 transition-colors">About us</a>
                        <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>

                        {/* Make Appointment Button - White to Black on Hover */}
                        <button
                            onClick={() => (window.location.href = '/doctors')}
                            onMouseEnter={() => setAnimate(true)}
                            onAnimationEnd={() => setAnimate(false)}
                            onMouseLeave={() => setAnimate(false)}
                            className="flex items-center px-5 py-2 rounded-full bg-white text-neutral-900 border border-neutral-900 font-semibold text-base shadow-sm hover:bg-neutral-900 hover:text-white transition-all duration-300 ease-in-out group"
                        >
                            <span className="mr-2">Make an Appointment</span>
                            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-neutral-900 overflow-hidden group-hover:bg-white transition-colors duration-300">
                                <div className={animate ? 'animate-arrowLoop' : ''}>
                                    <ArrowUpRight className="text-white group-hover:text-neutral-900 transition-colors duration-300" size={20} />
                                </div>
                            </div>
                        </button>

                        {/* Conditional Buttons (only if not logged in) */}
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => (window.location.href = '/signup')}
                                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold text-base hover:bg-gray-100 transition-all duration-200"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => (window.location.href = '/login')}
                                    className="px-5 py-2 rounded-full bg-gray-800 text-white font-semibold text-base hover:bg-gray-900 transition-all duration-200"
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            // Show Profile Icon when logged in (Desktop)
                            <div className="relative ml-2">
                                <button
                                    onClick={() => (window.location.href = "/my-profile")}
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                    aria-label="User Profile"
                                >
                                    <CircleUserRound className="h-9 w-9 cursor-pointer" />
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 hover:text-gray-900 transition-colors">
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white px-6 py-4 space-y-4 text-center border-t shadow-md">
                    <a href="/store/home" className="block text-gray-700 hover:text-blue-600 py-2 transition-colors">Store</a>
                    <a href="/services" className="block text-gray-700 hover:text-blue-600 py-2 transition-colors">Services</a>
                    <a href="/doctors" className="block text-gray-700 hover:text-blue-600 py-2 transition-colors">Doctors</a>
                    <a href="/about" className="block text-gray-700 hover:text-blue-600 py-2 transition-colors">About Us</a>
                    <a href="/contact" className="block text-gray-700 hover:text-blue-600 py-2 transition-colors">Contact</a>
                    {!isLoggedIn ? (
                        <>
                            <a href="/signup" className="block w-full px-5 py-2 mt-4 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition">
                                Sign Up
                            </a>
                            <a href="/login" className="block w-full px-5 py-2 mt-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-900 transition">
                                Login
                            </a>
                        </>
                    ) : (
                        // Show Profile Icon when logged in (Mobile)
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => {
                                    window.location.href = "/my-profile";
                                    setMenuOpen(false); // Close mobile menu after clicking
                                }}
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                                aria-label="User Profile"
                            >
                                <CircleUserRound className="h-9 w-9 cursor-pointer" />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            window.location.href = '/doctors';
                            setMenuOpen(false);
                        }}
                        // Mobile button also updated to white-to-black hover
                        className="w-full px-5 py-2 mt-4 rounded-full bg-white text-neutral-900 border border-neutral-900 font-semibold shadow-sm hover:bg-neutral-900 hover:text-white transition"
                    >
                        Make an Appointment
                    </button>
                </div>
            )}
        </header>
    );
}