import React from 'react';

export default function InfoCards() {
    return (
        <section className="bg-[#f3f9ff] py-10 px-4 md:px-16 font-sans">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#3366cc] text-white rounded-lg overflow-hidden">
            <div className="bg-[#3366cc] px-6 py-3 font-semibold text-lg border-b border-gray-200">
                Opening & Closing Times
            </div>
            <div className="p-6 space-y-4">
                <p>Our facility is open to serve you every week. We are also available for emergency care.</p>
                <div className="space-y-2 text-sm">
                <div className="flex justify-between border-t pt-2">
                    <span>Monday - Friday</span>
                    <span>9AM - 10PM</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                    <span>Saturday</span>
                    <span>9AM - 10PM</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                    <span>Sunday</span>
                    <span>10AM - 4PM</span>
                </div>
                </div>
            </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white text-black rounded-lg overflow-hidden border border-gray-300">
                <div className="bg-white px-6 py-3 font-semibold text-lg border-b border-gray-300">
                    Emergency Cases
                </div>
                <div className="p-6 space-y-4 text-sm">
                    <p>For urgent medical attention, our team is ready to help 24/7 & contact us.</p>
                    <div>
                    <p>
                        <span className="font-medium">Hospital No: </span>
                        <span className="text-[#3366cc]">+(704) 555-0127</span>
                    </p>
                    <p>
                        <span className="font-medium">For Ambulance: </span>
                        <span className="text-[#3366cc]">+(480) 555-0103</span>
                    </p>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#001f4d] text-white rounded-lg overflow-hidden">
            <div className="bg-[#001f4d] px-6 py-3 font-semibold text-lg border-b border-gray-200">
                Schedule Your Appointment
            </div>
            <div className="p-6 space-y-4 text-sm">
                <p>Simply choose a convenient time, and our team will be ready to assist you.</p>
                <div>
                <p>
                    Call us for book: <span className="text-[#7fbfff] font-medium">+(316) 555-0116</span>
                </p>
                <p className="mt-2 underline text-[#7fbfff] cursor-pointer">
                    Make an Appointment →
                </p>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}
