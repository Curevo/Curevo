import React from "react";

const CareSection = () => {
    return (
        <section className="bg-sky-100 rounded-3xl overflow-hidden my-12 mx-4 md:mx-24">
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Text */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-8">
                Clarify pores and minimize <br /> 
                Imperfections for <span className="text-blue-500">clearer skin</span>
            </h2>

            <div className="space-y-6">
                {["Immunity booster", "Skin care", "Digestive care", "Hair care"].map((item, index) => (
                <div key={index} className="flex justify-between items-center group cursor-pointer">
                    <span className="text-lg text-gray-800 group-hover:underline">{item}</span>
                    <span className="text-gray-700 text-xl">→</span>
                </div>
                ))}
            </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-full h-96 md:h-auto">
            <img
                src="/src/assets/6641f70cb8baaeb641358d84_about-image-01.jpg" // <-- replace with your image path
                alt="Peach and Fork"
                className="w-full h-full object-cover"
            />
            </div>
        </div>
        </section>
    );
};

export default CareSection;
