import React from "react";
import { FiCheckCircle, FiCalendar, FiMapPin, FiClock, FiAlertCircle } from "react-icons/fi"; // Added FiAlertCircle for potential use, FiClock for pending
import { useNavigate } from 'react-router-dom';

function PremiumAppointmentCard({
                                    appointment,
                                    onReschedule,
                                    onCardClick
                                }) {
    const navigate = useNavigate();

    const doctor = appointment?.doctor;
    const clinic = doctor?.clinic;

    const avatarUrl = doctor?.image;
    const doctorName = doctor?.name;
    const doctorSpecialization = doctor?.specialization;
    const clinicName = clinic?.name;
    const clinicAddress = clinic?.address;

    const dateText = appointment?.appointmentDate;
    const timeText = appointment?.appointmentTime;
    const status = appointment?.status;

    const appointmentId = appointment?.id;

    const showProceedToPaymentButton = status === "PENDING_PAYMENT";

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) {
            console.error("Error formatting time:", timeString, e);
            return timeString;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const [year, month, day] = dateString.split('-');
            const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString;
        }
    };


    const handleActionButtonClick = (e) => {
        e.stopPropagation();

        if (showProceedToPaymentButton) {
            if (appointmentId) {
                navigate(`/payment/appointment/${appointmentId}`);
            } else {
                console.warn("Appointment ID is missing, cannot route to payment.");
            }
        } else {
            onReschedule();
        }
    };

    // Determine the icon and text for the status badge dynamically
    const getStatusDisplay = () => {
        switch (status) {
            case "BOOKED":
                return { icon: <FiCheckCircle className="h-3 w-3 mr-1" />, text: "Confirmed", bgColor: "bg-green-100", textColor: "text-green-700" };
            case "PENDING_PAYMENT":
                return { icon: <FiClock className="h-3 w-3 mr-1" />, text: "Payment Pending", bgColor: "bg-yellow-100", textColor: "text-yellow-700" };
            // You can add more cases for "COMPLETED", "CANCELLED", etc., if you ever show them here
            default:
                return { icon: <FiAlertCircle className="h-3 w-3 mr-1" />, text: `Status: ${status || "Unknown"}`, bgColor: "bg-gray-100", textColor: "text-gray-600" };
        }
    };

    const { icon, text, bgColor, textColor } = getStatusDisplay();


    return (
        <div
            className="bg-white rounded-2xl shadow-xl p-5 space-y-5 relative flex flex-col h-full cursor-pointer overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl"
            onClick={onCardClick}
        >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Status Badge */}
            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full w-fit ${bgColor} ${textColor}`}>
                {icon}
                {text}
            </div>

            {/* Doctor Info */}
            <div className="flex items-center space-x-3">
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt={doctorName || "Doctor"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-md"
                    />
                )}
                <div>
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        Dr. {doctorName || "Unknown Doctor"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {doctorSpecialization || "Specialization N/A"}
                    </p>
                </div>
            </div>

            {/* Clinic Location */}
            <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center">
                    <FiMapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{clinicName || "Clinic Name N/A"}</span>
                </div>
                <p className="text-xs text-gray-500 ml-6 leading-relaxed">
                    {clinicAddress || "Clinic Address N/A"}
                </p>
            </div>

            {/* Date & Time Block */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 flex items-center justify-between shadow-inner border border-blue-100">
                <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="text-sm font-medium text-gray-800">
                        {formatDate(dateText)}
                    </div>
                </div>
                <div className="flex items-center">
                    <FiClock className="h-5 w-5 text-purple-600 mr-2" />
                    <div className="text-sm font-medium text-gray-800">
                        {formatTime(timeText)}
                    </div>
                </div>
            </div>

            {/* Conditional Button */}
            {showProceedToPaymentButton && (
                <button
                    onClick={handleActionButtonClick}
                    className="mt-auto w-full py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Proceed to Payment
                </button>
            )}
        </div>
    );
}

export default PremiumAppointmentCard;