import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const WellBeingSection = () => {
    const [animate, setAnimate] = useState(false);
    return (
        <section className="bg-[#f2f8fc] py-8 md:py-36 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Image */}
            <div>
            <img
                src="/src/assets/678dd906aac271d1741c21cd_about (1).jpg" // Replace with your image path
                alt="Healthcare professional consulting patient"
                className="rounded-xl w-full object-cover"
            />
            </div>

            {/* Right Content */}
            <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                    Dedicated to Your Well-Being
                </h2>
                <p className="text-gray-700 mb-4">
                    We are committed to providing compassionate, personalized healthcare to every patient
                    we serve. With a team of experienced doctors, nurses, and specialists, we strive to
                    offer the highest standard of care in a welcoming and supportive environment.
                </p>
                <p className="text-gray-700 mb-6">
                    Whether you need routine check-ups or specialized care, we are here to guide you
                    through every step of your healthcare journey.
                </p>

                    <button
                        onClick={() => (window.location.href = "/about")}
                        onMouseEnter={() => setAnimate(true)}
                        onAnimationEnd={() => setAnimate(false)}
                        className="flex items-center justify-between px-4 py-1 rounded-full bg-[#f3f9ff] text-neutral-900 border-neutral-900 border-[1px] font-medium text-lg h-fit w-fit"
                    >
                        <p className="text-base font-bold">More about us</p>
                        <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-200 overflow-hidden">
                            <div className={animate ? "animate-arrowLoop" : ""}>
                                <ArrowUpRight className="text-[#f3f9ff] hover:text-neutral-900" />
                            </div>
                        </div>
                    </button>

                {/* Features */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-start text-sm">
                        <img src="/src/assets/678ddce8dfe722c9cbd05e8b_tf-1.svg" alt="Expert Doctors" className="w-auto h-12 mb-2" />
                        <p className="font-semibold text-gray-800">Expert Doctors</p>
                        <p className="text-gray-600">Your health journey with expert.</p>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                        <img src="/src/assets/678ddce82e6bce024fc41b50_tf-2.svg" alt="Emergency Care" className="w-auto h-12 mb-2" />
                        <p className="font-semibold text-gray-800">Emergency Care</p>
                        <p className="text-gray-600">Proven Experts for Consultation</p>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                        <img src="/src/assets/678ddce8d11a64d21cfba86a_tf-3.svg" alt="Request Appointment" className="w-auto h-12 mb-2" />
                        <p className="font-semibold text-gray-800">Request Appointment</p>
                        <p className="text-gray-600">Schedule Your Visit</p>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
};

export default WellBeingSection;
