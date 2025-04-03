import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets';
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white  p-4">
      <div className="container mx-auto flex justify-between items-center">
        <img className='w-32' src={assets.logo} alt="Logo of curevo"/>
        
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Services</a>
          <a href="#" className="hover:text-blue-600">Portfolio</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
        
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md">Login</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Sign Up</button>
        </div>
        
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden flex flex-col items-center mt-4 space-y-4">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Services</a>
          <a href="#" className="hover:text-blue-600">Portfolio</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md w-full">Login</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md w-full">Sign Up</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

