//Change
// "https://your-api.com/api/appointment-history"
// to your real URL.

// Params
// Modify { customerId } to match your backend’s query.

// Response Shape
// Ensure the API returns:
// {
//   "visits": [
//     {
//       "id": "VST001",
//       "avatarUrl": "...",
//       "doctorName": "...",
//       "specialization": "...",
//       "visitType": "...",
//       "lastVisitDate": "...",
//       "lastVisitTime": "...",
//       "status": "...",
//       "rating": 4.9,
//       // plus the full detail fields used by AppointmentDetails...
//     }
//   ]
// }
// Fallbacks
// If the fetch fails or returns empty, the component gracefully shows “No past appointments.”


// AppointmentHistory.jsx
import React, { useState, useEffect } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import AppointmentDetails from "./AppointmentDetails";
import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPackage,
} from "react-icons/fi";

export default function AppointmentHistory({ customerId = "12345" }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const axios = useAxiosInstance();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "https://your-api.com/api/appointment-history",
          { params: { customerId } }
        );
        setVisits(res.data.visits || []);
      } catch (err) {
        console.error("Failed to load appointment history:", err);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customerId]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600">
        Loading history…
      </div>
    );
  }
  if (!visits.length) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500">
        No past appointments.
      </div>
    );
  }

  const selectedVisit = visits.find((v) => v.id === selectedVisitId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      {visits.map((visit) => (
        <div
          key={visit.id}
          onClick={() => setSelectedVisitId(visit.id)}
          className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
        >
          {/* Doctor Info */}
          <div className="flex items-center gap-4 w-full md:w-2/5">
            <img
              src={visit.avatarUrl}
              alt={visit.doctorName}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {visit.doctorName}
              </p>
              <p className="text-sm text-gray-500">
                {visit.specialization}
              </p>
            </div>
          </div>

          {/* Visit Type */}
          <div className="flex-1 w-full md:w-1/5 text-center">
            <p className="text-sm font-medium text-gray-700">Visit Type</p>
            <p className="mt-1 text-base text-gray-900">{visit.visitType}</p>
          </div>

          {/* Last Visit */}
          <div className="flex-1 w-full md:w-1/5 text-center">
            <p className="text-sm font-medium text-gray-700">Last Visit</p>
            <p className="mt-1 text-base text-gray-900">
              {visit.lastVisitDate}
            </p>
            <p className="text-sm text-gray-500">{visit.lastVisitTime}</p>
          </div>

          {/* Status */}
          <div className="flex-1 w-full md:w-1/6 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-700">Status</p>
            <span
              className={`mt-1 inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                visit.status === "Visited"
                  ? "bg-green-100 text-green-800"
                  : visit.status === "Missed"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {visit.status}
            </span>
          </div>

          {/* Rating & Button */}
          <div className="flex-1 w-full md:w-1/6 flex flex-col items-center gap-3">
            <div className="flex items-center space-x-1">
              <FiStar className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-800">
                {visit.rating?.toFixed(1) || "–"}/5
              </span>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              View More
            </button>
          </div>
        </div>
      ))}

      {/* Details Modal */}
      {selectedVisit && (
        <AppointmentDetails
          visit={selectedVisit}
          onClose={() => setSelectedVisitId(null)}
        />
      )}
    </div>
  );
}
