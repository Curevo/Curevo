// src/components/AppointmentDetails.jsx
import React, { useState } from "react";
import {
  FiX,
  FiPhone,
  FiUser,
  FiCalendar,
  FiHash,
  FiClipboard,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiEye,
} from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";

export default function AppointmentDetails({
                                             appointment = null,
                                             onClose = () => {},
                                           }) {
  const [showPrescriptionImageModal, setShowPrescriptionImageModal] = useState(false);
  const [prescriptionImageUrl, setPrescriptionImageUrl] = useState('');

  const sampleVisit = {
    id: "#ERROR-0000",
    avatarName: "Unknown Doctor",
    avatarUrl: "/default-avatar.png",
    doctorName: "Unknown Doctor",
    specialization: "N/A",
    patient: { name: "N/A", phone: "N/A", age: "N/A" },
    reason: "Reason not available.",
    diagnosis: [],
    preferredPharmacy: [],
    prescription: null,
    bookingInfo: { date: "N/A", type: "N/A" },
    payment: {
      baseAmount: 0,
      serviceCharge: 0,
      extraCharge: 0,
      totalAmount: 0,
      status: "N/A",
    },
  };

  const v = appointment || sampleVisit;

  const doctor = v.doctor;
  const customer = v.customer;
  const clinic = doctor?.clinic;
  const customerUser = customer?.user;

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

  // Helper to check if a string is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const displayData = {
    id: v.id ? `#${v.id}` : sampleVisit.id,
    avatarUrl: doctor?.image || sampleVisit.avatarUrl,
    doctorName: doctor?.name || sampleVisit.doctorName,
    specialization: doctor?.specialization || sampleVisit.specialization,
    patient: {
      name: customer?.name || v.name || sampleVisit.patient.name,
      age: customer?.age || v.age || sampleVisit.patient.age,
      phone: customerUser?.phone || v.phone || sampleVisit.patient.phone,
    },
    reason: v.reason || sampleVisit.reason,
    prescription: v.prescription || sampleVisit.prescription,

    bookingInfo: {
      date: `${formatDate(v.appointmentDate)} • ${formatTime(v.appointmentTime)}`,
      type: "In-person",
    },
    payment: {
      baseAmount: v.baseAmount !== undefined && v.baseAmount !== null ? v.baseAmount : sampleVisit.payment.baseAmount,
      serviceCharge: v.serviceCharge !== undefined && v.serviceCharge !== null ? v.serviceCharge : sampleVisit.payment.serviceCharge,
      extraCharge: v.extraCharge !== undefined && v.extraCharge !== null ? v.extraCharge : sampleVisit.payment.extraCharge,
      totalAmount: v.totalAmount !== undefined && v.totalAmount !== null ? v.totalAmount : sampleVisit.payment.totalAmount,
      status: v.status === "BOOKED" || v.status === "COMPLETED" ? "Paid" :
          v.status === "PENDING_PAYMENT" ? "Pending" :
              v.status || sampleVisit.payment.status,
    },
  };

  const hasPrescriptionImage = displayData.prescription && isValidUrl(displayData.prescription);

  const handleViewPrescription = () => {
    setPrescriptionImageUrl(displayData.prescription);
    setShowPrescriptionImageModal(true);
  };

  const handleClosePrescriptionImageModal = () => {
    setShowPrescriptionImageModal(false);
    setPrescriptionImageUrl('');
  };


  return (
      <div className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-50 z-[9999] p-4 sm:p-6"> {/* Added padding here */}
        <div className="bg-white rounded-lg shadow-xl w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl overflow-hidden max-h-[95vh] flex flex-col"> {/* Increased max-width */}
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200"> {/* Increased padding */}
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2> {/* Title changed & made bolder */}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"> {/* Slightly larger badge */}
                {displayData.id}
            </span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition">
              <FiX size={24} /> {/* Larger close icon */}
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar"> {/* Increased padding & added custom-scrollbar class for consistent scrollbar styling */}
            {/* Doctor Info */}
            <section className="pb-6 border-b border-gray-100 mb-6"> {/* Added bottom border and margin */}
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Doctor Information</h3> {/* Stronger heading */}
              <div className="flex items-start space-x-5"> {/* Increased spacing */}
                <img
                    src={displayData.avatarUrl}
                    alt={displayData.doctorName}
                    className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-blue-200" /* Larger avatar & border */
                />
                <div className="flex-1 space-y-1">
                  <h4 className="text-xl font-bold text-gray-900">{displayData.doctorName}</h4> {/* Larger & bolder name */}
                  <p className="text-sm text-gray-600">{displayData.specialization}</p> {/* Slightly larger specialization */}
                </div>
              </div>
            </section>

            {/* Patient Details */}
            <section className="pb-6 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6"> {/* Adjusted grid for more spacing */}
                <div className="flex items-center space-x-3 text-gray-800"> {/* Increased spacing */}
                  <FiUser size={18} className="text-blue-500" /> {/* Larger icon & color */}
                  <div>
                    <div className="text-xs font-medium text-gray-600">Name</div>
                    <div className="text-sm font-semibold">{displayData.patient.name}</div> {/* Larger & bolder value */}
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-800">
                  <FiHash size={18} className="text-blue-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Age</div>
                    <div className="text-sm font-semibold">{displayData.patient.age || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-800">
                  <FiPhone size={18} className="text-blue-500" />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Phone</div>
                    <div className="text-sm font-semibold">{displayData.patient.phone}</div>
                  </div>
                </div>
              </div>

              {/* Reason for Appointment */}
              <div className="mt-8"> {/* Added margin top */}
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <FiClipboard size={18} className="text-blue-500" />
                  <span className="text-sm font-medium">Reason for Appointment</span>
                </div>
                <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="whitespace-pre-wrap">{displayData.reason}</p>
                </div>
              </div>

              {/* Prescription */}
              <div className="mt-8">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <FiClipboard size={18} className="text-blue-500" />
                  <span className="text-sm font-medium">Prescription</span>
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center justify-between">
                  {hasPrescriptionImage ? (
                      <>
                        <span className="text-gray-800">View prescription image:</span>
                        <button
                            onClick={handleViewPrescription}
                            className="p-2 text-blue-600 hover:text-blue-800 transition rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="View Prescription Image"
                        >
                          <FiEye size={22} /> {/* Larger icon */}
                        </button>
                      </>
                  ) : (
                      <p className="text-gray-600 italic">No prescription available.</p>
                  )}
                </div>
              </div>
            </section>

            {/* Booking Info */}
            <section className="pb-6 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div className="flex items-start space-x-3">
                  <FiCalendar className="mt-1 text-blue-500" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Appointment Date & Time</div>
                    <div className="text-sm font-semibold text-gray-800">{displayData.bookingInfo.date}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="mt-1 text-blue-500" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Clinic Address</div>
                    <div className="text-sm font-semibold text-gray-800">{clinic?.address || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Clinic & Payment Details */}
            <section className="pb-6"> {/* No bottom border for the last section */}
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Clinic & Payment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                {/* Clinic Name */}
                <div className="flex items-start space-x-3">
                  <FiHome className="mt-1 text-blue-500" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Clinic Name</div>
                    <div className="text-sm font-semibold text-gray-800">{clinic?.name || 'N/A'}</div>
                  </div>
                </div>

                {/* Clinic Phone */}
                <div className="flex items-start space-x-3">
                  <FiPhone className="mt-1 text-blue-500" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Clinic Phone</div>
                    <div className="text-sm font-semibold text-gray-800">{clinic?.phoneNumber || 'N/A'}</div>
                  </div>
                </div>

                {/* Base Amount */}
                <div className="flex items-start space-x-3">
                  <MdCurrencyRupee className="mt-1 text-green-600" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Base Amount</div>
                    <div className="text-sm font-semibold text-gray-800">
                      ₹{typeof displayData.payment.baseAmount === 'number' ? displayData.payment.baseAmount.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Service Charge */}
                <div className="flex items-start space-x-3">
                  <MdCurrencyRupee className="mt-1 text-green-600" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Service Charge</div>
                    <div className="text-sm font-semibold text-gray-800">
                      ₹{typeof displayData.payment.serviceCharge === 'number' ? displayData.payment.serviceCharge.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Extra Charge */}
                <div className="flex items-start space-x-3">
                  <MdCurrencyRupee className="mt-1 text-green-600" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Extra Charge</div>
                    <div className="text-sm font-semibold text-gray-800">
                      ₹{typeof displayData.payment.extraCharge === 'number' ? displayData.payment.extraCharge.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex items-start space-x-3">
                  <MdCurrencyRupee className="mt-1 text-green-600" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Total Amount</div>
                    <div className="text-lg font-bold text-green-700"> {/* Larger total amount */}
                      ₹{typeof displayData.payment.totalAmount === 'number' ? displayData.payment.totalAmount.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-start space-x-3">
                  <FiCreditCard className="mt-1 text-purple-600" size={18} />
                  <div>
                    <div className="text-xs font-medium text-gray-600">Payment Status</div>
                    <div className="text-sm text-purple-700 font-semibold">{displayData.payment.status}</div> {/* Slightly bolder status */}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Prescription Image Modal */}
        {showPrescriptionImageModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-[10000] p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl md:max-w-3xl max-h-[95vh] overflow-y-auto relative"> {/* Increased width */}
                <button
                    onClick={handleClosePrescriptionImageModal}
                    className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition"
                    title="Close"
                >
                  <FiX size={24} /> {/* Larger close icon */}
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Prescription Image</h3> {/* Larger title */}
                {prescriptionImageUrl ? (
                    <img
                        src={prescriptionImageUrl}
                        alt="Prescription"
                        className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                        style={{ maxHeight: 'calc(85vh - 100px)' }} // Adjusted max height for new padding and header
                    />
                ) : (
                    <p className="text-lg text-gray-600 italic">Image not available.</p>
                )}
              </div>
            </div>
        )}
      </div>
  );
}