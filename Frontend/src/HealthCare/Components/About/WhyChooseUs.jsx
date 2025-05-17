import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const WhyChooseUs = () => {
    const [animate, setAnimate] = useState(false);
    return (
        <section className="bg-[#f1f9fc] px-4 py-12 md:px-16">
        <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="mb-8">
            <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
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
                </svg> Proven Excellence
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Why Choose us
            </h2>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Image */}
            <div className="flex-1 rounded-xl overflow-hidden shadow-sm">
                <img
                src="https://images.pexels.com/photos/7088534/pexels-photo-7088534.jpeg"
                alt="Doctor consultation"
                className="w-full h-auto object-cover"
                />
            </div>

            {/* Text Content */}
            <div className="flex-1">
                <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Excellence in Care
                </h3>
                <p className="text-sm text-gray-700">
                    Our team of skilled professionals, equipped with cutting-edge technology and compassionate expertise.
                </p>
                </div>
                <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Unmatched Healthcare Quality
                </h3>
                <p className="text-sm text-gray-700">
                    We ensure that patients receive not only the best possible care but also an experience centered on comfort, trust, and compassion; Quality is not just a goal.
                </p>
                </div>
                <button
                    onClick={() => (window.location.href = "/contact")}
                    onMouseEnter={() => setAnimate(true)}
                    onAnimationEnd={() => setAnimate(false)}
                    className="flex items-center justify-between px-4 py-2 rounded-full bg-[#f3f9ff] hover:bg-blue-600 hover:text-[#f3f9ff] hover:border-blue-600 duration-300 text-neutral-900 border-neutral-900 border-[1px] font-medium text-lg h-fit w-fit"
                >
                    <p className="text-base font-medium">Make an appointment</p>
                    <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 overflow-hidden">
                        <div className={animate ? "animate-arrowLoop" : ""}>
                        <ArrowUpRight className="text-[#f3f9ff] hover:text-neutral-900" />
                        </div>
                    </div>
                </button>
            </div>
            </div>
        </div>
        </section>
    );
};

export default WhyChooseUs;
