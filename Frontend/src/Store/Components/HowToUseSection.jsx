import React from "react";

const HowToUseSection = () => {
    return (
        <section className="max-w-[90%] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">How to use</h2>
            <p className="text-gray-600 mb-6">
            A Comprehensive Guide to Using{" "}
            <span className="text-green-700 font-medium">
                Optigut probiotic blend tablets
            </span>
            </p>

            <ul className="space-y-4 text-base text-gray-700">
            <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">➞</span>
                <span>
                <strong>Administer the precise dose of medication.</strong>
                </span>
            </li>
            <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">➞</span>
                <span>
                <strong>Allow it to dissolve into a soft powder.</strong>
                </span>
            </li>
            <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">➞</span>
                <span>
                <strong>Brush for 2 minutes with a wet toothbrush.</strong>
                </span>
            </li>
            <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">➞</span>
                <span>
                <strong>
                    Spit, smile, and repeat twice daily for dental and environmental
                    health.
                </strong>
                </span>
            </li>
            </ul>
        </div>

        {/* Image */}
        <div className="w-full">
            <img
            src="/src/assets/66458ec344eb3d2d5acd0c4d_about-image-04.jpg"
            alt="How to use"
            className="w-full rounded-xl object-cover"
            />
        </div>
        </section>
    );
};

export default HowToUseSection;
