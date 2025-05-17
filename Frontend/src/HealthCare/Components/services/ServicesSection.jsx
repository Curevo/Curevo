import React from "react";


const services = [
    {
        title: "Physical Therapy",
        subtitle: "Chronic Pain Relief",
        description:
        "Therapy services are designed to enhance recovery and improve quality of life.",
        image: "/src/assets/6789e3a9bc6f1dc6f9bb8258_service-thumb-06.jpg",
    },
    {
        title: "Diagnostic Excellence",
        subtitle: "Health Screening",
        description:
        "A commitment to excellence, we ensure accurate insights to guide effective treatment plans.",
        image: "/images/diagnostic.jpg",
    },
    {
        title: "Radiation Oncology",
        subtitle: "Cancer Specialists",
        description:
        "Combining cutting-edge technology with expert care, we ensure precise treatment tailored.",
        image: "/images/radiation.jpg",
    },
    {
        title: "Pharmacy",
        subtitle: "Medication Supply",
        description:
        "It’s provides a wide range of quality medications to support your treatment plan.",
        image: "/images/pharmacy.jpg",
    },
    {
        title: "Operation Theater",
        subtitle: "Precision Surgery",
        description:
        "With advanced equipment and a skilled surgical team, we provide precision care for all procedures.",
        image: "/images/operation.jpg",
    },
    {
        title: "Emergency Care",
        subtitle: "Immediate Attention",
        description:
        "We ensure prompt attention and compassionate support when you need it the most.",
        image: "/images/emergency.jpg",
    },
    ];

    const ServicesSection = () => {
    return (
        <section className="bg-[#f3f9fd] py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="mb-10">
            <p className="text-sm flex items-center text-gray-500 font-medium">
                <svg
                className="w-auto h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L15.25 12 9.75 7v10z"
                />
                </svg>
                What We Do
            </p>
            <h2 className="text-3xl font-semibold text-black mt-1">Our Services</h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
                <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex "
                >
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-[30%] h-48 object-cover"
                />
                <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{service.subtitle}</p>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default ServicesSection;
