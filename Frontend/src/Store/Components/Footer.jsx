import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-white to-blue-200 pt-12 pb-6 px-6 md:px-16 ">
        <div className="max-w-full px-8 sm:px-10 mx-auto flex flex-col md:flex-row md:justify-around gap-12">
            
            {/* Subscribe and Socials */}
            <div className="flex flex-col">
            <div className="flex space-x-2 mt-6">
                <img src="/Assets/Curevo-logo.png" className='w-32' alt="" />
            </div>
            <div className="flex justify-left space-x-6 mt-6 ">
                <div className="bg-blue-500 text-white p-2 rounded-md hover:bg-[#47C0B0] duration-300 cursor-pointer">
                <FaFacebookF size={18} />
                </div>
                <div className="bg-blue-500 text-white p-2 rounded-md hover:bg-[#47C0B0] duration-300 cursor-pointer">
                <FaInstagram size={18} />
                </div>
                <div className="bg-blue-500 text-white p-2 rounded-md hover:bg-[#47C0B0] duration-300 cursor-pointer">
                <FaXTwitter size={18} />
                </div>
            </div>
            </div>

            {/* Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Pages</h3>
            <ul className="space-y-10 text-gray-700 font-medium">
                <a href="/store/home"><li className="cursor-pointer hover:text-blue-500">Home</li></a>
                <a href="/store/products"><li className="cursor-pointer hover:text-blue-500">Shop</li></a>
                <a href="/about"><li className="cursor-pointer hover:text-blue-500">About</li></a>
                <a href="/contact"><li className="cursor-pointer hover:text-blue-500">Contact</li></a>
            </ul>
            </div>

            {/* Utility Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Resources</h3>
            <ul className="space-y-2 text-gray-700 font-medium">
                <a href="/terms"><li className="cursor-pointer hover:text-blue-500">Terms of Service</li></a>
                <a href="/policies"><li className="cursor-pointer hover:text-blue-500">Privacy Policy</li></a>
                <a href="/licenses"><li className="cursor-pointer hover:text-blue-500">Licenses</li></a>
                <a href="/services"><li className="cursor-pointer hover:text-blue-500">Services</li></a>
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
            <p className="text-lg">&copy; 2025 Curevo. All rights reserved</p>
            </div>
            <div className="mt-4 md:mt-0 text-lg mb-10">
            Designed by <a href="https://github.com/Curevo/Curevo" className="underline">Team A3</a>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
