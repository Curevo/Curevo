import React from "react";

const categories = [
    "All",
    "Immunity booster",
    "Skin care",
    "Digestive care",
    "Hair care",
];

const HeroSection = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="w-full h-auto flex items-center justify-center">
        <section className="w-[95%] md:w-[90%] h-[40vh] md:h-[40vh] bg-gradient-to-b from-white to-blue-300 py-16 rounded-b-3xl">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-8 mt-10">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat, idx) => (
                <button
                key={idx}
                className={`px-4 py-2 rounded-md font-semibold text-white shadow ${
                    idx === 0
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-900 hover:bg-gray-700"
                }`}
                >
                {cat}
                </button>
            ))}
            </div>
        </div>
        </section>
        </div>
    );
};

export default HeroSection;
