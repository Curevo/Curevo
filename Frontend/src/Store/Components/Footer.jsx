import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-white to-blue-200 pt-12 pb-6 px-6 md:px-16 ">
        <div className="max-w-full px-8 sm:px-10 mx-auto flex flex-col md:flex-row md:justify-between gap-12">
            
            {/* Subscribe and Socials */}
            <div className="flex flex-col items-start">
            <p className="mb-4 text-gray-800 text-lg">
                Subscribe now and get 25% off on your first purchase.
            </p>
            <div className="flex w-full max-w-sm">
                <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-2.5 border rounded-l-md focus:outline-none"
                />
                <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-700 duration-300">
                →
                </button>
            </div>
            <div className="flex space-x-3 mt-6 ">
                <div className="bg-black text-white p-2 rounded-md hover:bg-blue-500 duration-300 cursor-pointer">
                <FaFacebookF size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md hover:bg-blue-500 duration-300 cursor-pointer">
                <FaInstagram size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md hover:bg-blue-500 duration-300 cursor-pointer">
                <FaXTwitter size={18} />
                </div>
            </div>
            </div>

            {/* Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Pages</h3>
            <ul className="space-y-2 text-gray-700 font-medium">
                <li className="cursor-pointer hover:text-blue-500">Home</li>
                <li className="cursor-pointer hover:text-blue-500">Shop</li>
                <li className="cursor-pointer hover:text-blue-500">About</li>
                <li className="cursor-pointer hover:text-blue-500">Contact</li>
            </ul>
            </div>

            {/* Utility Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Resources</h3>
            <ul className="space-y-2 text-gray-700 font-medium">
                <li className="cursor-pointer hover:text-blue-500">Terms of Service</li>
                <li className="cursor-pointer hover:text-blue-500">Privacy Policy</li>
                <li className="cursor-pointer hover:text-blue-500">Licenses</li>
                <li className="cursor-pointer hover:text-blue-500">Instructions</li>
                <li className="cursor-pointer hover:text-blue-500">Support</li>
            </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Curevo Office</h3>
            <ul className="space-y-2 text-gray-700 font-medium">
                <li>+91 123-456-7890</li>
                <li>support@curevo.com</li>
                <li>123 Main Street, Bangalore, India</li>
            </ul>
            </div>
        </div>

        {/* Bottom */}
        <div 
            className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm mt-10 border-t pt-4 px-6 md:px-7">
            <div className="flex items-center space-x-2">
            <img src="/src/assets/Curevo-logo.png" alt="Curevo logo" onClick={() => window.location.href = "/"} className="h-8 w-auto"/>
            </div>
            <div className="mt-4 md:mt-0">
            Designed by <a href="#" className="underline">Team A3</a>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
