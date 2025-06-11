// src/components/Appointment.jsx
import React, { useState, useEffect } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import PremiumAppointmentCard from "./PremiumAppointmentCard.jsx";
import AppointmentHistory from "./Appointment_history.jsx"; // Assuming this is also a separate file
import AppointmentDetails from "./AppointmentDetails.jsx"; // Import the modal component

export default function Appointment({ customerId = "12345" }) {
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const axios = useAxiosInstance();

  useEffect(() => {
    const fetchAndSortAppointments = async () => {
      try {
        const response = await axios.get("/api/appointments/me");

        const allAppointments = response.data.data || [];

        const active = [];
        const history = [];

        allAppointments.forEach(appointment => {
          if (
              appointment.status === "PENDING_PAYMENT" ||
              appointment.status === "BOOKED"
          ) {
            active.push(appointment);
          } else if (
              appointment.status === "COMPLETED" ||
              appointment.status === "CANCELLED"
          ) {
            history.push(appointment);
          }
        });

        setActiveAppointments(active);
        setVisitHistory(history);

      } catch (err) {
        console.error("Failed to load and sort appointments:", err);
        setActiveAppointments([]);
        setVisitHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSortAppointments();
  }, [customerId]);

  // Handler for when an appointment card is clicked
  const handleCardClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedAppointment(null); // Clear selected appointment when closing
  };

  // Handler for rescheduling (passed to the card)
  const handleReschedule = (id) => {
    console.log("Reschedule clicked for appointment ID:", id);
    // Logic for rescheduling, e.g., open a separate reschedule modal/form
    // For now, it just logs.
  };

  if (loading) {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-600">
          Loading appointments…
        </div>
    );
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen space-y-12">
        {/* Active Appointments Section */}
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Active Appointments
          </h1>
          {activeAppointments.length > 0 ? (
              <div className="-mx-4 sm:mx-0">
                <div
                    className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                  {activeAppointments.map((appt) => (
                      <div
                          key={appt.id}
                          className="flex-shrink-0 w-full max-w-xs sm:w-64 snap-start"
                          // Make the entire card clickable
                          onClick={() => handleCardClick(appt)}
                      >
                        <PremiumAppointmentCard
                            appointment={appt}
                            onReschedule={() => handleReschedule(appt.id)}
                        />
                      </div>
                  ))}
                </div>
              </div>
          ) : (
              <p className="py-6 text-center text-gray-500">No upcoming appointments.</p>
          )}
        </section>

        {/* Appointment History Section */}
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Appointment History
          </h1>
          {visitHistory.length > 0 ? (
              <div className="space-y-6">
                {/* You'll need to adapt AppointmentHistory similarly if it renders clickable items */}
                <AppointmentHistory visits={visitHistory} onCardClick={handleCardClick} />
              </div>
          ) : (
              <p className="text-gray-500">No past appointments.</p>
          )}
        </section>

        {/* Appointment Details Modal */}
        {showDetailsModal && selectedAppointment && (
            <AppointmentDetails
                appointment={selectedAppointment} // Pass the entire appointment object
                onClose={handleCloseModal}
            />
        )}
      </div>
  );
}