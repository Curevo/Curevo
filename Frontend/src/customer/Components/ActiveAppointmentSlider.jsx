// src/components/ActiveAppointmentSlider.jsx
import React from "react";
import PremiumAppointmentCard from './PremiumAppointmentCard.jsx'; // Import the new component file

export default function ActiveAppointmentSlider({
                                                    appointments = [], // Expects a filtered array of active appointments
                                                    onReschedule = (id) => console.log("Reschedule for", id),
                                                }) {
    if (!appointments.length) {
        return (
            <div className="py-6 text-center text-gray-500">
                No upcoming appointments.
            </div>
        );
    }

    return (
        <div className="relative mt-6">
            <div
                className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {appointments.map((appt) => (
                    <div
                        key={appt.id} // Assuming 'id' is unique for each appointment
                        className="flex-shrink-0 w-full max-w-xs sm:w-64 snap-start"
                    >
                        <PremiumAppointmentCard
                            appointment={appt} // Pass the entire appointment object
                            onReschedule={() => onReschedule(appt.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}