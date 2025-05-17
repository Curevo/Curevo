import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const AboutServices = () => {
    const [animate, setAnimate] = useState(false);
    return (
        <section className="bg-[#f3f9fc] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                Inspiring pet wellness guided by passion and defined by purpose
            </h2>
            <p className="text-gray-700 mb-4">
                We aim to create a world where everyone has access to exceptional eyewear that not only
                enhances their vision but also reflects their unique style.
            </p>
            <p className="text-gray-700 mb-8">
                Through relentless innovation and unwavering dedication, we’re on a mission to make
                premium eyewear accessible to all, empowering individuals to express themselves with
                confidence and clarity.
            </p>
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

            {/* Image */}
            <div className="w-full lg:w-1/2">
            <img
                src="/src/assets/AboutServices1.jpg"
                alt="Doctor examining a patient"
                className="w-full rounded-xl object-cover"
            />
            </div>
        </div>
        </section>
    );
};

export default AboutServices;
