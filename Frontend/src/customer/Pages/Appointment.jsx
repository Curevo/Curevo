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

import React, { useState, useEffect } from "react";
import axios from "axios";
import ActiveAppointmentSlider from "./Active_appointment";
import AppointmentHistory from "./Appointment_history";

export default function Appointment({ customerId = "12345" }) {
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch active appointments
        const [actRes, histRes] = await Promise.all([
          axios.get("https://your-api.com/api/active-appointments", {
            params: { customerId },
          }),
          axios.get("https://your-api.com/api/appointment-history", {
            params: { customerId },
          }),
        ]);

        // Expect actRes.data.appointments and histRes.data.visits
        setActiveAppointments(actRes.data.appointments);
        setVisitHistory(histRes.data.visits);
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

  const handleReschedule = (appointmentId) => {
    console.log("Reschedule clicked for", appointmentId);
    // open reschedule UI…
  };

  if (loading) {
    return <div className="p-8 text-center">Loading appointments…</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-12">
      {/* Active Appointments */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Active Appointments
        </h1>
        {activeAppointments.length > 0 ? (
          <ActiveAppointmentSlider
            appointments={activeAppointments}
            onReschedule={handleReschedule}
          />
        ) : (
          <p className="text-gray-500">No active appointments.</p>
        )}
      </section>

      {/* Appointment History */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Appointment History
        </h1>
        {visitHistory.length > 0 ? (
          <AppointmentHistory visits={visitHistory} />
        ) : (
          <p className="text-gray-500">No past appointments.</p>
        )}
      </section>
    </div>
  );
}
