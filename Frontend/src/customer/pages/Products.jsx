import { useState } from "react";
import {productImg} from "../../assets/assets.js"; // Use placeholder initially

export default function Products() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([
        {
            id: 1,
            title: "Paracetamol 500mg",
            quantity: "10 tablets",
            price: "₹25",
            image: productImg,
        },
        {
            id: 2,
            title: "Azithromycin 250mg",
            quantity: "6 tablets",
            price: "₹90",
            image: productImg,
        },
        {
            id: 3,
            title: "Cough Syrup",
            quantity: "100ml",
            price: "₹55",
            image: productImg,
        },
        {
            id: 4,
            title: "Vitamin D3",
            quantity: "30 tablets",
            price: "₹150",
            image: productImg,
        },
        {
            id: 5,
            title: "Aspirin",
            quantity: "20 tablets",
            price: "₹40",
            image: productImg,
        },
        {
            id: 6,
            title: "Ibuprofen",
            quantity: "15 tablets",
            price: "₹35",
            image: productImg,
        },
    ]);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#f5f5f5] min-h-screen">
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-28 h-28 object-contain mb-4"
                        />
                        <h3 className="text-lg font-semibold text-center">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.quantity}</p>
                        <p className="text-purple-600 font-bold mt-2">{product.price}</p>
                        <div className="mt-4 flex gap-2">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm">
                                Buy Now
                            </button>
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
