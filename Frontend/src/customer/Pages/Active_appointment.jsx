// What your friend needs to adjust
// Replace
// "https://your-api.com/api/active-appointments"
// with their real route.

// Query Params
// Change { customerId } to whatever identifier the backend requires.

// Response Mapping
// Ensure the JSON response shape matches:
// {
//   "appointments": [
//     {
//       "id": "A1001",
//       "avatarUrl": "...",
//       "personName": "...",
//       "locationName": "...",
//       "roomLocation": "...",
//       "dateText": "...",
//       "timeText": "..."
//     },
//     ...
//   ]
// }

// Or transform res.data appropriately.

import React, { useState, useEffect } from "react";
import axios from '@/Config/axiosConfig.js';
import {
  FiX,
  FiClipboard,
  FiCheckCircle,
  FiCalendar,
} from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";

/* ===== PremiumAppointmentCard ===== */
function PremiumAppointmentCard({
  avatarUrl,
  personName,
  locationName,
  roomLocation,
  dateText,
  timeText,
  onReschedule,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4 relative flex flex-col">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400" />

      {/* Confirmation */}
      <div className="flex items-center text-green-600 text-xs font-medium">
        <FiCheckCircle className="h-4 w-4 mr-1" />
        Confirmed
      </div>

      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Appointment Scheduled
        </h2>
        <div className="flex items-center mt-1 text-xs text-gray-600">
          <img
            src={avatarUrl}
            alt={personName}
            className="w-6 h-6 rounded-full mr-1 ring-2 ring-white shadow-sm"
          />
          <span>with {personName}</span>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900">{locationName}</p>
        <div className="flex items-center text-xs text-blue-600">
          <FaShippingFast className="h-4 w-4 mr-1" />
          {roomLocation}
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-3 shadow-inner">
        <div className="flex-shrink-0 bg-white rounded-full p-1 shadow">
          <FiCalendar className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 text-xs text-gray-700">
          <div className="font-medium tracking-wide">DATE & TIME</div>
          <div className="mt-0.5 tracking-tight">
            {dateText} • {timeText}
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onReschedule}
        className="mt-auto w-full py-2 text-[12px] font-medium border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition"
      >
        Reschedule
      </button>
    </div>
  );
}

/* ===== ActiveAppointmentSlider ===== */
export default function ActiveAppointmentSlider({
  customerId = "12345",
  onReschedule = (id) => console.log("Reschedule for", id),
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://your-api.com/api/active-appointments", {
        params: { customerId },
      })
      .then((res) => setAppointments(res.data.appointments || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading)
    return <div className="py-6 text-center">Loading appointments…</div>;
  if (!appointments.length)
    return (
      <div className="py-6 text-center text-gray-500">
        No upcoming appointments.
      </div>
    );

  return (
    <div className="relative mt-6">
      <div
        className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex-shrink-0 w-full max-w-xs sm:w-64 snap-start"
          >
            <PremiumAppointmentCard
              avatarUrl={appt.avatarUrl}
              personName={appt.personName}
              locationName={appt.locationName}
              roomLocation={appt.roomLocation}
              dateText={appt.dateText}
              timeText={appt.timeText}
              onReschedule={() => onReschedule(appt.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
