import React from "react";
import Button from "/src/components/Button";

const ProductHero = () => {
    return (
        <section className="w-full px-4 md:px-24 py-8">
        <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[800px]">
            <img
            src="../assets/ProductHero.jpg" // Replace with your image path
            alt="Glowradiance Tablet"
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-6 md:p-12">
            <h1 className="text-white text-2xl md:text-4xl font-bold mb-4 max-w-lg">
                Healup glowradiance tablet
            </h1>
            <p className="text-white text-sm md:text-lg mb-6 max-w-md">
                Achieve radiant and healthy skin with Healup GlowRadiance Serum, a luxurious blend of potent antioxidants
            </p>
            <Button/>
            </div>
        </div>
        </section>
    );
};

export default ProductHero;
