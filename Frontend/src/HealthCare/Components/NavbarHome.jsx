import React, {useEffect, useState} from 'react';
import { Menu, X, ArrowUpRight} from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

export default function NavbarHome() {
    const axios = useAxiosInstance();
    const [menuOpen, setMenuOpen] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatusWithBackend = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await axios.get('/api/auth/check-status');
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Backend authentication check failed:", error);
                setIsLoggedIn(false);
                localStorage.removeItem('token');
            }
        };

        checkAuthStatusWithBackend();

    }, [axios]);

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
                onAnimationEnd={() => setAnimate(false)}
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
                    // Show Profile Icon when logged in
                    <div className="relative"> {/* Use relative for potential dropdown positioning */}
                <button
                    onClick={() => console.log("Profile icon clicked!")} // Placeholder for profile menu logic
                    className="text-black hover:text-gray-700 transition"
                    aria-label="User Profile"
                >
                    <UserIcon
  className="h-8 w-8 cursor-pointer hover:text-gray-600 transition-colors"
  onClick={() => (window.location.href = "../../customer/pages/UserProfile.jsx")}
/>

                </button>
                {/* You would add your dropdown menu here, conditionally rendered */}
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
            <a href="/about" className="block">About Us</a>
            <a href="/contact" className="block">Contact</a>
            {!isLoggedIn && (
                <>
                <a href="/signup" className="block border border-black px-4 py-2 rounded-full">
                    Sign Up
                </a>
                <a href="/login" className="block border border-black px-4 py-2 rounded-full">
                    Login
                </a>
                </>
            )}
            <button
                onClick={() => (window.location.href = '/doctors')}
                className="w-full border border-black px-4 py-2 rounded-full"
            >
                Make an Appointment
            </button>
            </div>
        )}
        </header>
    );
}
