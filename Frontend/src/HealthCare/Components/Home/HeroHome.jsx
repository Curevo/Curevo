import React from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"; // Import Chevron icons
import { useState } from "react";
// import Assets from "@/Assets/Assets.js"


export default function HeroHome() {
    const [animate, setAnimate] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0); // 0 for first slide, 1 for second

    const slides = [
        {
            image: "/Assets/HeroHome.png",
            alt: "Hero",
            buttonText: "Make an Appointment",
            buttonLink: "/doctors",
            title: "Healing Beyond Boundaries with Expertise",
            description: "We pride ourselves on offering a comprehensive suite of services, from medicine & appointment scheduling to personalized wellness.",
            extraLinkText: "Our Services →",
            extraLink: "/services",
            animateArrow: true, // This is true for the first slide
        },
        {
            image: "/Assets/ExecutiveSignUp.jpg", // New image for the second slide
            alt: "Executive Signup",
            buttonText: "Executive Signup",
            buttonLink: "/executive/signup",
            title: "Empower Your Role, Join Our Executive Team",
            description: "Become a vital part of our mission to revolutionize healthcare. Sign up as an executive and lead the change.",
            extraLinkText: "Learn More About Executive Roles →",
            extraLink: "/executive/about", // Example link, you can change this
            animateArrow: true, // <<< CHANGED THIS TO TRUE for the Executive Signup button
        }
    ];

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    const currentSlideData = slides[currentSlide];

    return (
        <section className="relative w-full flex items-center justify-center bg-white font-sans">
            <div className="relative w-[97%] h-[80vh] rounded-xl overflow-hidden"> {/* New wrapper div */}
                <img
                    src={currentSlideData.image}
                    alt={currentSlideData.alt}
                    className="w-full h-full object-cover object-center brightness-[0.6]" // Image now fills its parent div
                />
                <div className="absolute inset-0 flex items-center px-6 md:px-12"> {/* Changed top-0 w-[90%] h-full to inset-0 */}
                    <div className="text-white max-w-7xl absolute bottom-10 text-shadow-lg">
                        <button
                            onClick={() => (window.location.href = currentSlideData.buttonLink)}
                            onMouseEnter={() => currentSlideData.animateArrow && setAnimate(true)}
                            onAnimationEnd={() => currentSlideData.animateArrow && setAnimate(false)}
                            className="flex items-center justify-between px-4 py-1 rounded-full bg-neutral-200 text-neutral-900 font-medium text-lg h-fit w-fit mb-5"
                        >
                            <p className="text-base font-bold">{currentSlideData.buttonText}</p>
                            <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-200 overflow-hidden">
                                <div className={currentSlideData.animateArrow && animate ? "animate-arrowLoop" : ""}>
                                    <ArrowUpRight className="text-neutral-200 hover:text-neutral-900" />
                                </div>
                            </div>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                            {currentSlideData.title}
                        </h1>
                        <p className="text-lg text-white/90 md:text-xl max-w-md">
                            {currentSlideData.description}
                        </p>
                        <a href={currentSlideData.extraLink} className="mt-6 inline-block text-white text-lg underline font-medium decoration-transparent">
                            {currentSlideData.extraLinkText}
                        </a>
                    </div>
                </div>

                {/* Navigation Dots - Still relative to the main section, but visually fine */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index ? 'bg-white' : 'bg-gray-400 opacity-75'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Improved Navigation Arrows - NOW RELATIVE TO THE IMAGE WRAPPER */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full flex items-center justify-center transition-opacity duration-300 opacity-75 hover:opacity-100 z-20"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full flex items-center justify-center transition-opacity duration-300 opacity-75 hover:opacity-100 z-20"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}