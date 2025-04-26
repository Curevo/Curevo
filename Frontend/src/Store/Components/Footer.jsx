import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-white to-[#f3ffb2] pt-12 pb-6 px-6 md:px-16 ">
        <div className="max-w-full px-8 sm:px-10 mx-auto flex flex-col md:flex-row md:justify-between gap-10">
            
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
                <button className="bg-green-700 text-white px-4 rounded-r-md hover:bg-green-800">
                →
                </button>
            </div>
            <div className="flex space-x-3 mt-6">
                <div className="bg-black text-white p-2 rounded-md">
                <FaFacebookF size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md">
                <FaInstagram size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md">
                <FaXTwitter size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md">
                <FaLinkedinIn size={18} />
                </div>
                <div className="bg-black text-white p-2 rounded-md">
                <FaYoutube size={18} />
                </div>
            </div>
            </div>

            {/* Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Pages</h3>
            <ul className="space-y-2 text-gray-700">
                <li>Home</li>
                <li>Home 2</li>
                <li>Shop</li>
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
                <li>FAQs</li>
                <li>Privacy Policy</li>
            </ul>
            </div>

            {/* Utility Pages */}
            <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Utility Pages</h3>
            <ul className="space-y-2 text-gray-700">
                <li>Style Guide</li>
                <li>Instructions</li>
                <li>Licenses</li>
                <li>Changelog</li>
                <li>Coming Soon</li>
                <li>Link in Bio</li>
                <li>Password Protected</li>
                <li>Error 404</li>
            </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact</h3>
            <ul className="space-y-2 text-gray-700">
                <li>+1 (123) 456-7890</li>
                <li>hello@example.com</li>
                <li>123 Main Street, Cityville, State</li>
            </ul>
            </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm mt-10 border-t pt-4">
            <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.75l-1.5-1.5m0 0l1.5-1.5m-1.5 1.5h9m-6 3.75v.75m0 3.75v.75m0-11.25v.75m0 3.75v.75m-3.75 3.75h.75m3.75 0h.75m-7.5 0h.75m7.5 0h.75M3.75 3.75h16.5v16.5H3.75V3.75z" />
            </svg>
            <span className="text-green-700 font-bold text-lg">Healup</span>
            </div>
            <div className="mt-4 md:mt-0">
            Designed by <a href="#" className="underline">Webestica</a>, Powered by <a href="#" className="underline">Webflow</a>
            </div>
        </div>
        </footer>
    );
};

export default Footer;
