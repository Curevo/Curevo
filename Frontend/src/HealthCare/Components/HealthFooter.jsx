import React from "react";

const HealthFooter = () => {
    return (
        <div className="w-full h-auto py-16 px-6 flex flex-col items-center text-white sm:px-12 md:px-20 lg:px-32">
            <div className="bg-[#3163C7] py-12 px-6 flex flex-col lg:flex-row items-center justify-between gap-10 max-w-7xl rounded-lg">
                {/* Left Section */}
                <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-semibold leading-snug mb-4">
                    Your health a priority <br />
                    <span className="text-white">Reach out to our experts now</span>
                </h1>
                <p className="text-sm sm:text-base text-white/90 mb-6">
                    Whether you need a consultation, treatment plan, or simply someone
                    to answer your health questions, we’re just a click away.
                </p>
                <button className="flex items-center gap-2 border border-white rounded-full px-6 py-2 hover:bg-white hover:text-[#3163C7] transition">
                    Meet Our Doctors
                    <span className="text-sm">↗</span>
                </button>
                </div>

                {/* Right Section */}
                <div className="flex-1 w-full">
                <div className="rounded overflow-hidden mb-4">
                    <img
                    src="/src/assets/about3.jpg"
                    alt="doctor"
                    className="w-full h-full object-cover rounded"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white text-black px-6 py-3 rounded w-full text-center font-medium">
                    #healthandwellness
                    </div>
                    <button className="bg-[#0A2E73] hover:bg-[#021845] text-white px-6 py-3 rounded w-full text-center transition">
                    Make an Appointment →
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default HealthFooter;
