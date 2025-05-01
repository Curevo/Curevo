import { ShoppingCart, Search, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between px-6 md:px-32 py-4 bg-white/30 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-green-600 rounded-full" />
            <span className="font-bold text-xl text-green-800">Healup</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            <li className="text-green-800">Home</li>
            <li className="cursor-pointer" onClick={() => (window.location.href = "./Button.jsx")}>About</li>
            <li>Shop</li>
            <li className="relative group">
            Pages
            <div className="absolute top-6 left-0 w-28 p-2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm">Page 1</p>
                <p className="text-sm">Page 2</p>
            </div>
            </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-700" />
            <div className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            <span className="absolute -top-2 -right-2 text-white bg-green-700 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                0
            </span>
            </div>

            {/* Hamburger Menu */}
            <Menu
            className="w-6 h-6 text-gray-700 cursor-pointer md:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="absolute top-[72px] left-0 w-full bg-gradient-to-b from-[#f9ffd8] to-[#ebff77] shadow-md md:hidden rounded-b-3xl py-8 px-6">
            <ul className="flex flex-col items-start gap-4 p-4 text-gray-700 font-medium">
                <li className="text-green-800">Home</li>
                <li>About</li>
                <li>Shop</li>
                <li>
                <details className="w-full">
                    <summary className="cursor-pointer">Pages</summary>
                    <div className="pl-4 pt-4 flex flex-col gap-1 text-sm">
                    <p className="mb-2">Page 1</p>
                    <p>Page 2</p>
                    </div>
                </details>
                </li>
            </ul>
            </div>
        )}
        </nav>
    );
}
