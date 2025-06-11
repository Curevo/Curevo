import React from "react";
// FiStar is no longer needed since the rating section is removed
// import { FiStar } from "react-icons/fi"; // Removed import

// Function to format time from "HH:MM:SS" to "HH:MM AM/PM"
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

// Function to format date from "YYYY-MM-DD" to "Month Day, Year"
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


export default function AppointmentHistory({ visits = [], onCardClick = () => {} }) {

  if (!visits.length) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500">
          No past appointments.
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {visits.map((appointment) => (
            <div
                key={appointment.id}
                onClick={() => onCardClick(appointment)}
                className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Doctor Info & Patient Name (Combined/Reorganized) */}
              <div className="flex-none w-full md:w-2/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                    src={appointment.doctor?.image || "/default-avatar.png"}
                    alt={appointment.doctor?.name || "Unknown Doctor"}
                    className="w-16 h-16 rounded-full object-cover shadow-md"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {appointment.doctor?.name || "Unknown Doctor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.doctor?.specialization || "N/A"}
                  </p>
                  {/* Patient Name added here */}
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Patient:</span> {appointment.customer?.name || "N/A"}
                  </p>
                </div>
              </div>

              {/* Clinic Name & Address */}
              <div className="flex-1 w-full md:w-1/5 text-center sm:text-left"> {/* Adjusted text alignment */}
                <p className="text-sm font-medium text-gray-700">Clinic</p>
                <p className="mt-1 text-base font-semibold text-gray-900">
                  {appointment.doctor?.clinic?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  {appointment.doctor?.clinic?.address || "N/A"} {/* Clinic Address */}
                </p>
              </div>

              {/* Appointment Date */}
              <div className="flex-1 w-full md:w-1/5 text-center">
                <p className="text-sm font-medium text-gray-700">Date & Time</p> {/* Changed label */}
                <p className="mt-1 text-base text-gray-900">
                  {formatDate(appointment.appointmentDate)}
                </p>
                <p className="text-sm text-gray-500">{formatTime(appointment.appointmentTime)}</p>
              </div>

              {/* Status */}
              <div className="flex-1 w-full md:w-1/6 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700">Status</p>
                <span
                    className={`mt-1 inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                        appointment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-600"
                    }`}
                >
              {appointment.status}
            </span>
              </div>
            </div>
        ))}
      </div>
  );
}