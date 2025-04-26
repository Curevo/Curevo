import React, { useEffect, useState } from "react";

const testimonials = [
    {
        quote:
        "Using Healup products has been life-changing. From boosting my immunity to clearing up my skin, their products deliver real results. Highly recommend!",
        name: "Amanda Reed",
        title: "Manager",
        rating: 4,
    },
    {
        quote:
        "Healup has transformed my daily routine. Their supplements improved my digestion and gave me a new boost of energy.",
        name: "John Smith",
        title: "Wellness Coach",
        rating: 5,
    },
    {
        quote:
        "I have tried countless products but Healup stands out. My hair and skin have never looked better!",
        name: "Sarah Johnson",
        title: "Entrepreneur",
        rating: 5,
    },
    ];

    const TestimonialCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 3000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="text-center py-16 px-4 m-16 h-auto">
        <div className="mb-6 flex justify-center">
            {/* Stars */}
            {Array(5)
            .fill(0)
            .map((_, index) => (
                <svg
                key={index}
                className={`w-5 h-5 mx-0.5 ${
                    index < testimonials[currentIndex].rating ? "text-green-700" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.062 3.263a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.062 3.263c.3.921-.755 1.688-1.538 1.118L10 13.347l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.062-3.263a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.062-3.263z" />
                </svg>
            ))}
        </div>

        <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed">
            {testimonials[currentIndex].quote}
        </p>

        <div className="text-green-700 font-semibold text-lg">{testimonials[currentIndex].name}</div>
        <div className="text-gray-500">{testimonials[currentIndex].title}</div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, idx) => (
            <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full ${
                idx === currentIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
            />
            ))}
        </div>
        </section>
    );
};

export default TestimonialCarousel;
