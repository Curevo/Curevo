import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorProfileComponent = () => {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axios.get("/api/doctors/profile");
                setDoctor(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error("Error fetching doctor profile:", err);
            }
        };

        fetchDoctorProfile();
    }, []);

    const getDefaultAvatar = () => {
        // Default doctor avatar (can be replaced with your preferred default image)
        return "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg";
    };

    const renderDoctorImage = () => {
        if (!doctor) return null;
        
        // Case 1: Image URL provided
        if (doctor.imageUrl) {
            return (
                <img
                    src={doctor.imageUrl}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = getDefaultAvatar();
                    }}
                />
            );
        }
        
        // Case 2: Base64 image data provided
        if (doctor.imageData) {
            return (
                <img
                    src={`data:image/jpeg;base64,${doctor.imageData}`}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                />
            );
        }
        
        // Case 3: No image provided - use default
        return (
            <img
                src={getDefaultAvatar()}
                alt="Default doctor avatar"
                className="w-full h-full object-cover"
            />
        );
    };

    const handleBookAppointment = async () => {
        try {
            // Implement your appointment booking logic here
            console.log("Booking appointment with doctor:", doctor.id);
            // Example: await axios.post("/api/appointments", { doctorId: doctor.id });
            alert(`Appointment booked with Dr. ${doctor.lastName}`);
        } catch (err) {
            console.error("Error booking appointment:", err);
            alert("Failed to book appointment. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 text-center">
                <div className="animate-pulse">
                    <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded mt-4 w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mt-8 w-full mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-5/6 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 text-center text-red-500">
                Error loading doctor profile: {error}
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 text-center">
                No doctor data available
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32">
            {/* Profile Header */}
            <div className="flex flex-col items-center md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                    {renderDoctorImage()}
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {doctor.title ? `${doctor.title} ` : ''}{doctor.firstName} {doctor.lastName}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-2">
                        {doctor.specialization || "Medical Specialist"}
                    </p>
                    {doctor.department && (
                        <p className="text-gray-600">{doctor.department}</p>
                    )}
                    {doctor.hospital && (
                        <p className="text-gray-600">{doctor.hospital}</p>
                    )}
                </div>
            </div>

            {/* Bio Section */}
            <div className="my-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
                {doctor.bio ? (
                    <p className="text-gray-700 whitespace-pre-line">{doctor.bio}</p>
                ) : (
                    <p className="text-gray-500 italic">No biography available</p>
                )}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Doctor Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Education</h3>
                    <p className="text-gray-800">
                        {doctor.degree || "Not specified"}
                    </p>
                    {doctor.medicalSchool && (
                        <p className="text-gray-600 text-sm mt-1">{doctor.medicalSchool}</p>
                    )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Experience</h3>
                    <p className="text-gray-800">
                        {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} Years` : "Not specified"}
                    </p>
                    {doctor.languages && (
                        <p className="text-gray-600 text-sm mt-1">
                            Languages: {doctor.languages.join(", ")}
                        </p>
                    )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Availability</h3>
                    <p className="text-gray-800">
                        {doctor.availableDays ? doctor.availableDays.join(", ") : "Not specified"}
                    </p>
                    {doctor.consultationFee && (
                        <p className="text-gray-600 text-sm mt-1">
                            Fee: ${doctor.consultationFee}
                        </p>
                    )}
                </div>
            </div>

            {/* Additional Information */}
            {doctor.additionalInfo && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Additional Information</h2>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700 whitespace-pre-line">{doctor.additionalInfo}</p>
                    </div>
                </div>
            )}

            {/* Appointment Button */}
            <div className="flex justify-center">
                <button 
                    className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md"
                    onClick={handleBookAppointment}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorProfileComponent;