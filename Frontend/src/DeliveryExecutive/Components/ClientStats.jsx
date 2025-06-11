// Replace "https://your-api.com/api/client-stats" with the actual API endpoint.

// deliveryGuyId in params can be removed or dynamically injected based on login.

// Ensure backend sends percentage values (newOrdersChange, deliveryChange) and raw counts.


// ClientStats.jsx
import React, { useEffect, useState } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';

export default function ClientStats() {
  const [stats, setStats] = useState({
    newOrders: 0,
    newOrdersChange: 0,
    monthlyDeliveries: 0,
    deliveryChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const axios = useAxiosInstance();

  useEffect(() => {
    const fetchClientStats = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/client-stats", {
          params: {
            deliveryGuyId: "12345", // or dynamic
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching client stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientStats();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Card 1: New Orders */}
      <div className="flex flex-col bg-[#d1e0e9] py-6 px-5 rounded-2xl w-full">
        <div className="text-xl font-semibold text-[#1e293b]">New Orders</div>
        {loading ? (
          <div className="text-gray-500 mt-2 text-sm">Loading...</div>
        ) : (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-5xl font-bold text-[#253237]">
              {stats.newOrders}
            </span>
            <span
              className={`inline-block text-sm font-medium py-1 px-2 rounded-[12px] ${
                stats.newOrdersChange >= 0
                  ? "bg-[#dcfce7] text-[#22c55e]"
                  : "bg-[#fee2e2] text-[#ef4444]"
              }`}
            >
              {stats.newOrdersChange >= 0 ? "+" : ""}
              {stats.newOrdersChange}%
            </span>
          </div>
        )}
      </div>

      {/* Card 2: Monthly Deliveries */}
      <div className="flex flex-col bg-[#d1e0e9] py-6 px-5 rounded-2xl w-full">
        <div className="text-xl font-semibold text-[#1e293b]">
          Delivered (month)
        </div>
        {loading ? (
          <div className="text-gray-500 mt-2 text-sm">Loading...</div>
        ) : (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-5xl font-bold text-[#253237]">
              {stats.monthlyDeliveries}
            </span>
            <span
              className={`inline-block text-sm font-medium py-1 px-2 rounded-[12px] ${
                stats.deliveryChange >= 0
                  ? "bg-[#dcfce7] text-[#22c55e]"
                  : "bg-[#fee2e2] text-[#ef4444]"
              }`}
            >
              {stats.deliveryChange >= 0 ? "+" : ""}
              {stats.deliveryChange}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
