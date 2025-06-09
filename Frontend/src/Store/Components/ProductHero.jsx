import React from "react";
import Button from "../../Components/Button";
// import Button from "/src/Components/Button";

const ProductHero = () => {
    return (
        <section className="w-full px-4 md:px-24 py-8">
        <div className="relative rounded-2xl overflow-hidden  h-[400px] md:h-[800px]">
            <img
            src="/Assets/exercise1.jpg" // Replace with your image path
            alt="Glowradiance Tablet"
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-6 md:p-12">
            <h1 className="text-white text-2xl md:text-4xl font-bold mb-4 max-w-2xl">
                Fitness fundamentals building strength and stamina at home with Curevo.
            </h1>
            <p className="text-white text-sm md:text-lg mb-6 max-w-md">
                Uncover the secrets to crafting a successful home workout routine, whether you're a beginner or a fitness enthusiast.
            </p>
            <Button/>
            </div>
        </div>
        </section>
    );
};

export default ProductHero;
