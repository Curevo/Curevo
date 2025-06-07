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


import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // Fetch visit history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "https://your-api.com/api/appointment-history",
          { params: { customerId } }
        );
        // Expect: { visits: [ { id, avatarUrl, doctorName, specialization, visitType, lastVisitDate, lastVisitTime, status, rating, /* plus full details fields */ }, … ] }
        setVisits(res.data.visits);
      } catch (err) {
        console.error("Failed to load appointment history:", err);
        setVisits([]);  // fallback to empty
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customerId]);

  if (loading) {
    return <div className="py-12 text-center">Loading history…</div>;
  }

  if (visits.length === 0) {
    return <div className="py-12 text-center text-gray-500">No past appointments.</div>;
  }

  const selectedVisit = visits.find((v) => v.id === selectedVisitId);

  return (
    <>
      <div className="space-y-6">
        {visits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer"
            onClick={() => setSelectedVisitId(visit.id)}
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
              <p className="text-sm font-medium text-gray-700">
                Visit Type
              </p>
              <p className="mt-1 text-base text-gray-900">
                {visit.visitType}
              </p>
            </div>

            {/* Last Visit */}
            <div className="flex-1 w-full md:w-1/5 text-center">
              <p className="text-sm font-medium text-gray-700">
                Last Visit
              </p>
              <p className="mt-1 text-base text-gray-900">
                {visit.lastVisitDate}
              </p>
              <p className="text-sm text-gray-500">
                {visit.lastVisitTime}
              </p>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.948a1 1 0 00.95.69h4.153c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.285 3.948c.3.921-.755 1.688-1.54 1.118l-3.363-2.444a1 1 0 00-1.176 0l-3.363 2.444c-.784.57-1.838-.197-1.539-1.118l1.285-3.948a1 1 0 00-.364-1.118L2.073 9.375c-.783-.57-.38-1.81.588-1.81h4.153a1 1 0 00.95-.69l1.285-3.948z" />
                </svg>
                <span className="text-sm text-gray-800">
                  {visit.rating.toFixed(1)}/5
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
      </div>

      {/* Modal */}
      {selectedVisit && (
        <AppointmentDetails
          visit={selectedVisit}
          onClose={() => setSelectedVisitId(null)}
        />
      )}
    </>
  );
}
