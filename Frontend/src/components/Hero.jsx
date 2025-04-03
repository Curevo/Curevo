import React from "react";
import assets from "../assets/assets";

export default function Hero() {
  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center rounded-3xl overflow-hidden" 
    style={{ backgroundImage: `url(${assets.})` }}>
      
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
      
      {/* Content */}
      <div className="relative z-10 text-white max-w-2xl px-10">
        <h1 className="text-5xl font-bold">Turnkey Pharmacy Fulfillment Solutions</h1>
        <p className="mt-3 text-lg">Pharmacy, Telehealth, Ready to Market</p>
        <button className="mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2">
          Get Started
          <span className="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}