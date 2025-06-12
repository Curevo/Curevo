import React from "react";
import { Search } from "lucide-react"; // Import the Search icon

const categories = [
    "All",
    "Immunity booster",
    "Skin care",
    "Digestive care",
    "Hair care",
];

// Ensure searchTerm and setSearchTerm are passed as props
const HeroSection = ({ searchTerm, setSearchTerm, onSearchSubmit }) => {
    // onSearchSubmit will be a function passed from the parent to handle the search logic

    const handleSearchClick = () => {
        if (onSearchSubmit) {
            onSearchSubmit(searchTerm);
        }
    };

    return (
        <div className="w-full h-auto flex items-center justify-center">
            <section className="w-[95%] md:w-[90%] h-[40vh] md:h-[40vh] bg-gradient-to-b from-white to-blue-300 py-16 rounded-b-3xl">
                <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
                    {/* Search Bar */}
                    <div className="w-full max-w-2xl mb-8 mt-10 relative"> {/* Added relative for positioning */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Optionally, allow pressing Enter key in HeroSection as well
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && onSearchSubmit) {
                                    onSearchSubmit(searchTerm);
                                }
                            }}
                            placeholder="Search for products..."
                            className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                        />
                        <button
                            onClick={handleSearchClick}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                className={`px-4 py-2 rounded-md font-semibold text-white shadow ${
                                    idx === 0 // Assuming the first category "All" is active by default
                                        ? "bg-blue-500 hover:bg-blue-700"
                                        : "bg-gray-900 hover:bg-gray-700"
                                }`}
                                // Add onClick handler for category filtering if needed
                                // onClick={() => handleCategoryClick(cat)}
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