import React, {useEffect, useState} from "react";
// import axios from "axios";

const products = [
    {
        id: 1,
        name: "ScalpCare biotin tablets",
        price: "$65.00 USD",
        quantity: "60 Capsules",
        img: "/src/assets/product1.jpg",
        hoverImg: "/src/assets/product1-1.jpg",
    },
    {
        id: 2,
        name: "Gutbalance prebiotic tablets",
        price: "$49.00 USD",
        quantity: "40 Capsules",
        img: "/src/assets/product2.jpg",
        hoverImg: "/src/assets/product2-1.jpg",
    },
    {
        id: 3,
        name: "Vitality boost hair tablets",
        price: "$69.00 USD",
        quantity: "80 Capsules",
        img: "/src/assets/product3.jpg",
        hoverImg: "/src/assets/product3-1.jpg",
    },
    {
        id: 4,
        name: "Immunity elite herbal tablets",
        price: "$49.00 USD",
        quantity: "45 Capsules",
        img: "/src/assets/product4.jpg",
        hoverImg: "/src/assets/product4-1.jpg",
    },
    ];



    export default function ProductGrid() {
    //     const [products, setProducts] = useState([]);

    //     useEffect(() => {
    //         axios.get("http://localhost:8080/api/products")
    //             .then((response) => {
    //                 setProducts(response.data);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching products:", error);
    //             });
    //     }, []);
    return (
        <section className="py-12 px-5 sm:px-8 lg:px-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Recent <span className="text-green-600">products</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
            <div
                key={product.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition relative overflow-hidden"
            >
                <div className="relative w-full h-96 mb-4">
                <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl opacity-100 transition-opacity duration-300"
                />
                <img
                    src={product.hoverImg}
                    alt={product.name + " blurred"}
                    className="absolute inset-0 w-full h-full rounded-2xl object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
                </h3>
                <div className="text-sm text-gray-600">{product.price}</div>
                <div className="text-sm text-gray-600">{product.quantity}</div>
            </div>
            ))}
        </div>
        </section>
    );
}
