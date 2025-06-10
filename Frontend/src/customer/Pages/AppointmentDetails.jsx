// How your friend customizes
// Endpoint
// Change
// "https://your-api.com/api/visit-details"
// to their actual route.

// Params
// Modify the params: { visitId } to match how they identify the appointment.

// Response Shape
// Ensure the backend returns:
// {
//   "visit": {
//     "id": "...",
//     "avatarUrl": "...",
//     "doctorName": "...",
//     "specialization": "...",
//     "patient": { "phone": "...", "email": "..." },
//     "reason": "...",
//     "diagnosis": ["...", "..."],
//     "preferredPharmacy": ["...", "..."],
//     "bookingInfo": { "date": "...", "type": "..." },
//     "schedule": [
//       { "datetime": "...", "title": "...", "doctor": "...",
//         "assistant": "...", "room": "..." }
//     ]
//   }
// }
// Fallback
// If the fetch fails or no visitId is passed, the sampleVisit data will display.


// AppointmentDetails.jsx
import React, { useState, useEffect } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import {
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiMoreVertical,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function AppointmentDetails({ visitId = null, onClose = () => {} }) {
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
   const axios = useAxiosInstance();

  const sampleVisit = {
    id: "#0000",
    avatarUrl: "/default-avatar.png",
    doctorName: "Dr. Sample",
    specialization: "General Practice",
    patient: { phone: "+1 (555) 000-0000", email: "patient@example.com" },
    reason: "Sample reason for visit.",
    diagnosis: ["N/A"],
    preferredPharmacy: ["N/A"],
    bookingInfo: { date: "01 Jan 2020, 10:00 AM", type: "In-person" },
    schedule: [
      {
        datetime: "01 Jan 2020, 10:00 AM",
        title: "Check-up",
        doctor: "Dr. Sample",
        assistant: "Asst. Nurse",
        room: "Room 101",
      },
    ],
  };

  useEffect(() => {
    if (!visitId) {
      setVisit(sampleVisit);
      setLoading(false);
      return;
    }
    axios
      .get("https://your-api.com/api/visit-details", { params: { visitId } })
      .then((res) => setVisit(res.data.visit || sampleVisit))
      .catch((_) => setVisit(sampleVisit))
      .finally(() => setLoading(false));
  }, [visitId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 z-50">
        <div className="bg-white p-6 rounded-lg shadow">Loading...</div>
      </div>
    );
  }

  const v = visit || sampleVisit;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full sm:max-w-lg md:max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-800">Visit Details</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              ID {v.id}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <button className="p-1 hover:bg-gray-100 rounded">
              <FiArrowLeft size={16} />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <FiArrowRight size={16} />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Doctor & Patient */}
          <section className="space-y-3">
            <h3 className="text-base font-medium text-gray-700">Doctor & Patient</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <img
                src={v.avatarUrl}
                alt={v.doctorName}
                className="w-16 h-16 rounded-full object-cover shadow"
              />
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <h4 className="text-lg font-semibold text-gray-800">{v.doctorName}</h4>
                  <div className="flex items-center text-gray-500 space-x-3 mt-1 sm:mt-0">
                    <div className="flex items-center space-x-1 text-xs">
                      <FiPhone size={14} />
                      <span>{v.patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <FiMail size={14} />
                      <span>{v.patient.email}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{v.specialization}</p>

                {/* Reason */}
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-xs text-gray-700">{v.reason}</p>
                </div>

                {/* Diagnose & Pharmacy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-gray-600 text-xs">
                      <FiCheckCircle size={14} />
                      <span className="font-medium">Diagnose</span>
                    </div>
                    <ul className="text-xs text-gray-700 list-disc list-inside">
                      {v.diagnosis.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-gray-600 text-xs">
                      <FiMoreVertical size={14} />
                      <span className="font-medium">Preferred Pharmacy</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {v.preferredPharmacy.map((p, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Booking Info */}
          <section className="space-y-3">
            <h3 className="text-base font-medium text-gray-700">Booking Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <FiCalendar className="mt-1 text-gray-500" size={16} />
                <div>
                  <div className="text-xs font-semibold text-gray-600">Date</div>
                  <div className="text-xs text-gray-800">{v.bookingInfo.date}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FaWhatsapp className="mt-1 text-green-500" size={16} />
                <div>
                  <div className="text-xs font-semibold text-gray-600">Type</div>
                  <div className="text-xs text-gray-800">{v.bookingInfo.type}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Planning Schedule */}
          <section className="space-y-3">
            <h3 className="text-base font-medium text-gray-700">Planning Schedule</h3>
            <div className="space-y-4">
              {v.schedule.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                    {idx < v.schedule.length - 1 && (
                      <div className="w-[2px] flex-1 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-md p-3 flex-1 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                      <span className="text-xs text-gray-500">{item.datetime}</span>
                      <span className="text-xs text-blue-600 font-semibold">{item.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <div className="font-medium text-gray-700">Doctor</div>
                        <div>{item.doctor}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Assistant</div>
                        <div>{item.assistant}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Room</div>
                        <div>{item.room}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
          >
            <FiX size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

