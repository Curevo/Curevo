// Notes for Your Friend (Backend Dev)
// Replace:

// "https://your-api.com/api/delivery-status"

// "https://your-api.com/api/update-delivery-status"
// with the actual API endpoints.
// Modify request:
// params: { deliveryGuyId: "12345" }
// API should return:
// { "status": "pickedUp" } // or outForDelivery, completed




// FormationStatus.jsx
import React, { useState, useEffect } from "react";
import axios from '@/Config/axiosConfig.js';

export default function FormationStatus({ availableStatus }) {
  const [status, setStatus] = useState(""); // pickedUp, outForDelivery, completed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!availableStatus) return;

    const fetchStatus = async () => {
      try {
        const response = await axios.get("https://your-api.com/api/delivery-status", {
          params: { deliveryGuyId: "12345" },
        });
        setStatus(response.data.status);
      } catch (err) {
        console.error("Failed to fetch delivery status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [availableStatus]);

  const updateStatus = async () => {
    let nextStatus = "";
    if (status === "pickedUp") nextStatus = "outForDelivery";
    else if (status === "outForDelivery") nextStatus = "completed";

    try {
      await axios.post("https://your-api.com/api/update-delivery-status", {
        deliveryGuyId: "12345",
        newStatus: nextStatus,
      });
      setStatus(nextStatus);
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pickedUp":
        return "Picking up order";
      case "outForDelivery":
        return "Out for Delivery";
      case "completed":
        return "All orders delivered";
      default:
        return "Waiting for order assignment...";
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "pickedUp":
        return "Picked Up";
      case "outForDelivery":
        return "Mark as Delivered";
      case "completed":
        return "No more orders";
      default:
        return "Waiting...";
    }
  };

  const isButtonDisabled = loading || status === "completed" || !availableStatus;

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-[20px] flex flex-col gap-3 shadow-lg transition-all">
      <div className="text-sm text-[#94a3af]">Delivery Status</div>

      <div className="text-lg font-semibold">
        {loading
          ? "Checking for orders..."
          : availableStatus
          ? getStatusText()
          : "You're currently not taking orders"}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[10px] bg-[#2e2e2e] rounded-full overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            !availableStatus || status === ""
              ? "bg-gray-600 w-[0%]"
              : status === "pickedUp"
              ? "bg-yellow-400 w-[30%]"
              : status === "outForDelivery"
              ? "bg-blue-400 w-[80%]"
              : "bg-green-400 w-full"
          }`}
        ></div>
      </div>

      {/* Estimated time or message */}
      {!loading && status !== "completed" && availableStatus ? (
        <div className="text-sm mt-1 mb-2.5">
          Estimated Delivery: <br />
          <strong>20–25 mins</strong>
        </div>
      ) : (
        <div className="text-sm mt-1 mb-2.5 text-[#94a3af]">
          {loading
            ? "Loading..."
            : !availableStatus
            ? "Go active to receive and manage deliveries."
            : "You’ve completed all assigned deliveries."}
        </div>
      )}

      {/* Button */}
      <button
        onClick={updateStatus}
        disabled={isButtonDisabled}
        className={`py-2.5 px-5 rounded-[12px] font-semibold transition-all duration-300 ${
          isButtonDisabled
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-100"
        }`}
      >
        {loading ? "Loading..." : getButtonText()}
      </button>
    </div>
  );
}

