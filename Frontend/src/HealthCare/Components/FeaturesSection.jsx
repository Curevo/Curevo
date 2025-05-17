import React from "react";

const FeaturesSection = () => {
    const features = [
        {
        icon: "/src/assets/6642e35c9752a40d3c4f73ab_icon-01.svg", // Replace with your actual path
        label: "Consciously formulated",
        },
        {
        icon: "/src/assets/6642e35cf21de4f31f188a1d_icon-02.svg",
        label: "No-harmful chemicals",
        },
        {
        icon: "/src/assets/6642e35c441f55e658e55bc0_icon-03.svg",
        label: "Natural essentials",
        },
        {
        icon: "/src/assets/6642e35c877f843ed8a55e2c_icon-04.svg",
        label: "Suitable for all",
        },
    ];

    return (
        <section className="py-12 bg-white">
        <div className="max-w-[90%] mx-auto px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
                <img
                src={feature.icon}
                alt={feature.label}
                className="h-12 w-12 mb-4"
                />
                <p className="text-md font-semibold text-gray-800">
                {feature.label}
                </p>
            </div>
            ))}
        </div>
        </section>
    );
};

export default FeaturesSection;
