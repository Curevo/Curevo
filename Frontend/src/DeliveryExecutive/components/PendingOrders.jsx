// Notes for Your Friend:
// Replace https://your-api.com/api/pending-orders with their actual API endpoint.

// Replace deliveryGuyId: "12345" with the real ID (possibly from login or context).

// Update the data field names (orderId, items, address, estimatedTime) if the database uses different ones.



import React, { useEffect, useState } from "react";
import axios from '@/Config/axiosConfig.js';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending orders from your API
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/pending-orders", {
          params: {
            deliveryGuyId: "12345", // replace with dynamic ID if needed
          },
        });
        setOrders(res.data.orders); // assuming the response is { orders: [...] }
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-[#d1e0e9] p-6 rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] w-full">
      <h3 className="text-lg font-semibold text-[#1e293b]">Upcoming Orders</h3>

      {loading ? (
        <div className="text-sm text-gray-600">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-600">No upcoming orders.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex items-start justify-between border-b border-gray-300 pb-4 last:border-b-0"
            >
              {/* Left Side: Order Info */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#94a3b8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {order.orderId.replace("#", "")}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#0f172a]">
                    Order {order.orderId}
                  </span>
                  <span className="text-xs text-[#475569]">
                    {order.items} items • {order.address}
                  </span>
                </div>
              </div>

              {/* Right Side: Estimated Delivery Time */}
              <div className="text-sm text-[#64748b] whitespace-nowrap">
                {order.estimatedTime}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
