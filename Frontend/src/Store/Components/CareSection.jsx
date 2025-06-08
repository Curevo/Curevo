import React from "react";

const CareSection = () => {
    return (
        <section className="bg-sky-100 rounded-3xl overflow-hidden my-12 mx-4 md:mx-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Text */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-8">
                The power of plant-based <br /> 
                diets for your  <span className="text-blue-500">health</span>
            </h2>

            <div className="space-y-6">
                {["Prevents Diseases", "Lowers Cholesterol", "Digestive care", "Boosts Energy & Recovery"].map((item, index) => (
                <div key={index} className="flex justify-between items-center group cursor-pointer" onClick={() => window.location.href = `https://github.com/Rounak665/Platera`}>
                    <span className="text-lg text-gray-800 group-hover:underline">{item}</span>
                    <span className="text-gray-700 text-xl">→</span>
                </div>
                ))}
            </div>

            <div className="mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full" onClick={() => window.location.href = `https://github.com/Rounak665/Platera`}>
                Shop Now from Platera
                </button>
            </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-full h-96 md:h-auto">
            <img
                src="/Assets/diet3.jpg" // <-- replace with your image path
                alt="Peach and Fork"
                className="w-full h-full object-cover"
            />
            </div>
        </div>
        </section>
    );
};

export default CareSection;
