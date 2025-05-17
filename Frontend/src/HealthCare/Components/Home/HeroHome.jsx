import React from 'react';
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function HeroHome() {
    const [animate, setAnimate] = useState(false);
    return (
        <section className="relative w-[100%] flex items-center justify-center bg-white font-sans">
            <img
                src="/src/assets/pexels-mart-production-7088526e.png"
                alt="Hero"
                className="w-[97%] h-[80vh] object-cover object-center rounded-xl brightness-[0.6]"
            />
            <div className="absolute top-0 w-[90%] h-full flex items-center px-6 md:px-12">
                <div className="text-white max-w-7xl absolute bottom-10 text-shadow-lg">
                    <button
                    onClick={() => (window.location.href = "/appointments")}
                    onMouseEnter={() => setAnimate(true)}
                    onAnimationEnd={() => setAnimate(false)}
                    className="flex items-center justify-between px-4 py-1 rounded-full bg-neutral-200 text-neutral-900 font-medium text-lg h-fit w-fit mb-5"
                    >
                    <p className="text-base font-bold">Make an Appointment</p>
                    <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-200 overflow-hidden">
                        <div className={animate ? "animate-arrowLoop" : ""}>
                        <ArrowUpRight className="text-neutral-200 hover:text-neutral-900" />
                        </div>
                    </div>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Healing Beyond Boundaries with Expertise
                    </h1>
                    <p className="text-lg text-white/90 md:text-xl max-w-md">
                        We pride ourselves on offering a comprehensive suite of services, from medicine & appointment scheduling to personalized wellness.
                    </p>
                    <a href="/services" className="mt-6 inline-block text-white text-lg underline font-medium decoration-transparent">Our Services →</a>
                </div>
            </div>
        </section>
    );
}
