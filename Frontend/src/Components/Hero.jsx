import React from "react";
import { ArrowRight } from 'lucide-react';
import { assets } from '../Assets/Assets';

export default function Hero() {
  return (
    <div className="relative h-[600px] w-full flex items-center justify-left rounded-t-3xl overflow-hidden z-0 p-36">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={assets.hero}
        autoPlay
        loop
        muted
        playsInline
        type="video/mp4"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-white max-w-2xl px-10 text-left items-center">
        <h1 className="text-5xl font-bold">Turnkey Pharmacy Fulfillment Solutions</h1>
        <p className="mt-3 text-lg">Pharmacy, Telehealth, Ready to Market</p>
        <button className="mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2">
          Get Started
          <span><ArrowRight /></span>
        </button>
      </div>
    </div>
  );
}
