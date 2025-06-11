import React, {useEffect, useState} from 'react';
import { Menu, X, ArrowUpRight} from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { jwtDecode } from "jwt-decode"; // <--- THIS WAS THE MISSING IMPORT!

export default function NavbarHome() {
    const axios = useAxiosInstance();
    const [menuOpen, setMenuOpen] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => { // Changed function name for clarity
            const token = localStorage.getItem('token');

            // 1. Client-side token existence check
            if (!token) {
                console.log("NavbarHome: No token found. User not logged in.");
                setIsLoggedIn(false);
                return;
            }

            try {
                // 2. Client-side token decode and expiration check
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Current time in seconds

                // if (decodedToken.exp < currentTime) {
                //     console.log("NavbarHome: Token expired. User not logged in.");
                //     setIsLoggedIn(false);
                //     // Axios config should handle clearing token on auth errors.
                //     return;
                // }

                // 4. Backend validation if client-side checks pass
                console.log("NavbarHome: Client-side token valid and role is 'CUSTOMER'. Verifying with backend...");
                const response = await axios.get('/api/auth/check-status');

                if (response.status === 200  && decodedToken.role === "CUSTOMER" ) {
                    console.log("NavbarHome: Backend confirmed authentication status (200 OK).");
                    setIsLoggedIn(true);
                } else {
                    console.log(`NavbarHome: Backend check failed with status: ${response.status}. User not logged in.`);
                    setIsLoggedIn(false);
                    // Axios config should handle clearing token on auth errors.
                }
            } catch (error) {
                console.error("NavbarHome: Authentication check failed (decode error or backend call):", error);
                setIsLoggedIn(false);
                // Axios config should handle clearing token on auth errors.
            }
        };

        checkAuthStatus(); // Call the renamed function
    }, [axios]); // Keep axios in dependencies

    return (
        <header className="bg-[white] top-0 z-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div
                        className="flex items-center space-x-4 cursor-pointer"
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
                        <a href="/store/home">Store</a>
                        <a href="/services">Services</a>
                        <a href="/doctors">Doctors</a>
                        <a href="/about">About us</a>
                        <a href="/contact">Contact</a>

                        {/* Make Appointment Button */}
                        <button
                            onClick={() => (window.location.href = '/doctors')}
                            onMouseEnter={() => setAnimate(true)}
                            onAnimationEnd={() => setAnimate(false)} // Keep onAnimationEnd for original behavior
                            onMouseLeave={() => setAnimate(false)} // Added to reset animation on mouse leave
                            className="flex items-center px-4 py-1 rounded-full bg-[white] text-neutral-900 border-neutral-900 border-[1px] font-medium text-lg"
                        >
                            <p className="text-base font-bold">Make an Appointment</p>
                            <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 overflow-hidden">
                                <div className={animate ? 'animate-arrowLoop' : ''}>
                                    <ArrowUpRight className="text-[white]" />
                                </div>
                            </div>
                        </button>

                        {/* Conditional Buttons (only if not logged in) */}
                        {!isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => (window.location.href = '/signup')}
                                    className="text-sm font-semibold text-black border border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => (window.location.href = '/login')}
                                    className="text-sm font-semibold text-black border border-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition"
                                >
                                    Login
                                </button>
                            </>
                        ): (
                            // Show Profile Icon when logged in (Desktop)
                            <div className="relative">
                                <button
                                    // Removed console.log, now navigates directly
                                    onClick={() => (window.location.href = "/my-profile")}
                                    className="text-black hover:text-gray-700 transition"
                                    aria-label="User Profile"
                                >
                                    <UserIcon className="h-8 w-8 cursor-pointer hover:text-gray-600 transition-colors" />
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white px-6 py-4 space-y-4 text-center border-t">
                    <a href="/store/home" className="block">Store</a>
                    <a href="/services" className="block">Services</a>
                    <a href="/doctors" className="block">Doctors</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    {!isLoggedIn ? (
                        <>
                            <a href="/signup" className="block border border-black px-4 py-2 rounded-full">
                                Sign Up
                            </a>
                            <a href="/login" className="block border border-black px-4 py-2 rounded-full">
                                Login
                            </a>
                        </>
                    ): (
                        // Show Profile Icon when logged in (Mobile)
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => {
                                    window.location.href = "/my-profile";
                                    setMenuOpen(false); // Close mobile menu after clicking
                                }}
                                className="text-black hover:text-gray-700 transition"
                                aria-label="User Profile"
                            >
                                <UserIcon className="h-8 w-8 cursor-pointer hover:text-gray-600 transition-colors" />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            window.location.href = '/doctors';
                            setMenuOpen(false); // Close mobile menu after clicking
                        }}
                        className="w-full border border-black px-4 py-2 rounded-full"
                    >
                        Make an Appointment
                    </button>
                </div>
            )}
        </header>
    );
}