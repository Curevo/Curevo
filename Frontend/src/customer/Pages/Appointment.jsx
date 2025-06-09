// Instructions for your friend:

// Endpoints

// Replace "https://your-api.com/api/active-appointments" and
// "https://your-api.com/api/appointment-history"
// with the real API URLs.

// Query Params

// Adjust { customerId } to the correct identifier.

// Response Shape

// Ensure actRes.data.appointments is an array matching the slider’s expected props.

// Ensure histRes.data.visits is an array matching the history component’s expected props.

// Error Handling

// Customize the catch block or loading states as needed.

// Appointment.jsx
import React, { useState, useEffect } from "react";
import axios from '@/Config/axiosConfig.js';
import ActiveAppointmentSlider from "./Active_Appointment";
import AppointmentHistory from "./Appointment_history";

export default function Appointment({ customerId = "12345" }) {
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [actRes, histRes] = await Promise.all([
          axios.get("https://your-api.com/api/active-appointments", {
            params: { customerId },
          }),
          axios.get("https://your-api.com/api/appointment-history", {
            params: { customerId },
          }),
        ]);
        setActiveAppointments(actRes.data.appointments || []);
        setVisitHistory(histRes.data.visits || []);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setActiveAppointments([]);
        setVisitHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [customerId]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen space-y-12">
      {/* Active Appointments */}
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Active Appointments
        </h1>
        {activeAppointments.length > 0 ? (
          <div className="-mx-4 sm:mx-0">
            {/* allow horizontal scroll on xs */}
            <ActiveAppointmentSlider
              appointments={activeAppointments}
              onReschedule={(id) => console.log("Reschedule clicked for", id)}
            />
          </div>
        ) : (
          <p className="text-gray-500">No active appointments.</p>
        )}
      </section>

      {/* Appointment History */}
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Appointment History
        </h1>
        {visitHistory.length > 0 ? (
          <div className="space-y-6">
            <AppointmentHistory visits={visitHistory} />
          </div>
        ) : (
          <p className="text-gray-500">No past appointments.</p>
        )}
      </section>
    </div>
  );
}
