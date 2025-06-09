// For Your Friend (Backend Developer)
// Replace:
// "https://your-api.com/api/delivery-status"
// "https://your-api.com/api/update-status"
// with actual API endpoints.
// Expected response format:
// { "status": "available" } // or "unavailable"

// Update payload structure if needed:
// {
//   "deliveryGuyId": "12345",
//   "status": "available" // or "unavailable"
// }


// DeliveryStatusCard.jsx
import React from "react";
import axios from '@/Config/axiosConfig.js';

export default function DeliveryStatusCard({ available, setAvailable, loading }) {
  const toggleStatus = async () => {
    const newStatus = available ? "unavailable" : "available";

    try {
      await axios.post("https://your-api.com/api/update-status", {
        deliveryGuyId: "12345",
        status: newStatus,
      });
      setAvailable(newStatus === "available");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-[20px] flex flex-col gap-4 shadow-lg transition-all">
      <div className="text-sm text-[#94a3af] tracking-wide">Delivery Availability</div>
      <div className="text-xl font-bold">
        {loading
          ? "Loading..."
          : available
          ? "Active and Ready to Deliver"
          : "Currently Inactive"}
      </div>
      <div className="text-sm text-[#cbd5e1] leading-relaxed">
        {loading
          ? "Please wait while we fetch your availability."
          : available
          ? "You are now available for receiving new orders assigned to you."
          : "Click below when you're ready to begin delivering orders for the day."}
      </div>
      <div className="w-full h-[10px] bg-[#1e293b] rounded-full overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            loading
              ? "bg-gray-400 w-[50%]"
              : available
              ? "bg-green-400 w-[90%]"
              : "bg-gray-400 w-[20%]"
          }`}
        ></div>
      </div>
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`py-2.5 px-5 rounded-[12px] font-semibold focus:outline-none transition-all duration-300 ${
          available
            ? "bg-white text-black hover:bg-gray-100"
            : "bg-green-400 text-white hover:bg-green-500"
        }`}
      >
        {loading ? "Loading..." : available ? "Call it a day" : "I'm ready to deliver"}
      </button>
    </div>
  );
}
