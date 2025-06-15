import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroHome() {
    const [animate, setAnimate] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideIntervalRef = useRef(null); // Ref to store the interval ID

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
            animateArrow: true,
        },
        {
            image: "/Assets/ExecutiveSignUp.jpg",
            alt: "Executive Signup",
            buttonText: "Executive Signup",
            buttonLink: "/executive/signup",
            title: "Empower Your Role, Join Our Executive Team",
            description: "Become a vital part of our mission to revolutionize healthcare. Sign up as an executive and lead the change.",
            extraLinkText: "Learn More About Executive Roles →",
            extraLink: "/executive/about",
            animateArrow: true,
        }
    ];

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    // --- Auto-sliding Effect ---
    useEffect(() => {
        // Clear any existing interval to prevent multiple timers running
        if (slideIntervalRef.current) {
            clearInterval(slideIntervalRef.current);
        }

        // Set a new interval to advance to the next slide every 10 seconds
        slideIntervalRef.current = setInterval(() => {
            goToNextSlide();
        }, 10000); // **Reduced to 10 seconds (10000 milliseconds)**

        // Cleanup function: This runs when the component unmounts or before the effect re-runs.
        // It's essential to clear the interval to prevent memory leaks.
        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, [currentSlide, slides.length]); // Dependencies: restarts timer when slide changes (manual or auto)

    const currentSlideData = slides[currentSlide]; // Data for the text overlay

    return (
        <section className="relative w-full flex items-center justify-center bg-white font-sans">
            <div className="relative w-[97%] h-[80vh] rounded-xl overflow-hidden">
                {/* --- Image Layering for Smooth Fade --- */}
                {/* We map over all slides and render each image. Their visibility (opacity)
                    and stacking order (z-index) are controlled by their 'index'
                    compared to 'currentSlide'. This allows for a CSS transition. */}
                {slides.map((slide, index) => (
                    <img
                        key={index} // Unique key for each image in the map
                        src={slide.image}
                        alt={slide.alt}
                        // Apply brightness here on each individual image
                        className={`absolute inset-0 w-full h-full object-cover object-center brightness-[0.6]
                                    transition-opacity duration-1000 ease-in-out
                                    ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        // opacity-100 and z-10 for the current slide, opacity-0 and z-0 for others.
                        // The 'transition-opacity' handles the fade effect.
                    />
                ))}

                {/* --- Content Overlay (Text and Buttons) --- */}
                {/* This div should be above all images.
                    We add a 'key' to force its re-render and trigger its own transition
                    when the slide content changes. */}
                <div className="absolute inset-0 flex items-center px-6 md:px-12 z-20"> {/* Higher z-index to be above images */}
                    <div
                        key={currentSlideData.title} // Key to force re-render and apply transition to the content block
                        className={`text-white max-w-7xl absolute bottom-10 text-shadow-lg
                                   transition-opacity duration-700 ease-in-out
                                   ${currentSlideData ? 'opacity-100' : 'opacity-0'}`}
                        // The content itself fades in/out based on the new key
                    >
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

                {/* --- Navigation Dots --- */}
                {/* Ensure dots are on top of content and images */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30"> {/* Higher z-index */}
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)} // Direct update, CSS handles image and content transition
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlide === index ? 'bg-white' : 'bg-gray-400 opacity-75'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* --- Navigation Arrows --- */}
                {/* Ensure arrows are on top of content and images */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full flex items-center justify-center transition-opacity duration-300 opacity-75 hover:opacity-100 z-30"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-3 rounded-full flex items-center justify-center transition-opacity duration-300 opacity-75 hover:opacity-100 z-30"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}