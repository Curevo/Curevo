import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAxiosInstance } from '@/Config/axiosConfig.js'; // Assuming this path to your hook

const DoctorProfileComponent = () => {
    const { doctorId } = useParams(); // Get doctorId from URL parameters
    const navigate = useNavigate();
    const axios = useAxiosInstance(); // Get the authenticated axios instance

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            if (!doctorId) {
                setError("Doctor ID is missing from the URL.");
                setLoading(false);
                return;
            }

            try {
                // Use the authenticated axios instance
                // The endpoint is correctly structured as `/api/doctors/{id}`
                const response = await axios.get(`/api/doctors/${doctorId}`);
                // Access data from response.data.data as per your JSON structure
                setDoctor(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
                setLoading(false);
                console.error("Error fetching doctor profile:", err);
            }
        };

        fetchDoctorProfile();
    }, [doctorId, axios]); // Depend on doctorId and axios instance for re-fetch

    const getDefaultAvatar = () => {
        return "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg";
    };

    const renderDoctorImage = () => {
        if (!doctor) return null;

        // Use doctor.image for the image URL from the JSON
        if (doctor.image) {
            return (
                <img
                    src={doctor.image}
                    alt={doctor.name || "Doctor"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to default avatar if the image URL fails to load
                        e.target.src = getDefaultAvatar();
                    }}
                />
            );
        }

        return (
            <img
                src={getDefaultAvatar()}
                alt="Default doctor avatar"
                className="w-full h-full object-cover"
            />
        );
    };

    const handleBookAppointment = () => {
        if (!doctor) {
            alert("Doctor details not loaded. Cannot book appointment.");
            return;
        }
        navigate(`/appointments/${doctor.doctorId}`);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded mt-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mt-8 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-5/6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">Failed to load doctor profile: {error}.</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 text-center text-gray-600">
                No doctor data available.
            </div>
        );
    }

    // Extracting data based on your provided JSON structure
    const doctorName = doctor.name || 'N/A';
    const qualification = doctor.qualification || 'Not specified';
    const specialization = doctor.specialization || 'Medical Specialist';
    const clinicName = doctor.clinic?.name || 'Not specified';
    const clinicAddress = doctor.clinic?.address || 'Not specified';
    const consultationFee = doctor.fee?.toFixed(2) || 'N/A'; // Use 'fee' from JSON
    const availableDays = doctor.availabilities?.map(a => a.day).join(", ") || 'Not specified';
    const phone = doctor.user?.phone || 'Not specified'; // Access phone from nested user object
    const email = doctor.user?.email || 'Not specified'; // Access email from nested user object

    return (
        <div className="max-w-7xl mx-auto rounded-lg shadow-md py-16 px-6 sm:px-12 md:px-20 lg:px-32 bg-white">
            {/* Profile Header */}
            <div className="flex flex-col items-center md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 overflow-hidden shadow-sm flex-shrink-0">
                    {renderDoctorImage()}
                </div>

                {/* Doctor Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {doctorName}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-2">
                        {specialization}
                    </p>
                    <p className="text-gray-600">{qualification}</p>
                    {clinicName && (
                        <p className="text-gray-600 mt-1">Clinic: {clinicName}</p>
                    )}
                    {clinicAddress && (
                        <p className="text-gray-600 text-sm">{clinicAddress}</p>
                    )}
                </div>
            </div>

            {/* Bio Section - No direct 'bio' in your JSON, so it remains generic */}
            {/*<div className="my-8">*/}
            {/*    <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>*/}
            {/*    <p className="text-gray-500 italic">No detailed biography available.</p>*/}
            {/*</div>*/}

            <div className="border-t border-gray-200 my-6"></div>

            {/* Doctor Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Qualification</h3>
                    <p className="text-gray-800">
                        {qualification}
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Availability</h3>
                    <p className="text-gray-800">
                        {availableDays}
                    </p>
                    {consultationFee !== 'N/A' && (
                        <p className="text-gray-600 text-sm mt-1">
                            Fee: ${consultationFee}
                        </p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-500 mb-1">Contact</h3>
                    <p className="text-gray-800">
                        Phone: {phone}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                        Email: {email}
                    </p>
                </div>
            </div>

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