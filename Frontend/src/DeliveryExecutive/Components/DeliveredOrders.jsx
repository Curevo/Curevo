import React, { useState, useEffect } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import {
  FiMoreVertical,
  FiClock,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import DeliveryDetails from "./DeliveredDetails";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const axios = useAxiosInstance();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("https://your-api.com/api/completed-orders", {
          params: { deliveryGuyId: "12345" }
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Could not load orders:", err);
        // fallback to static sample if desired
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-8 bg-gray-50 flex max-h-screen">
      <h2 className="text-3xl font-extrabold mb-6">Completed Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {orders.map(o => (
          <div
            key={o.id}
            className="relative bg-white rounded-3xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition p-4 flex flex-col"
          >
            {/* ID badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-0.5 rounded-full">
              {o.id}
            </div>
            <div className="mt-6 mb-4 flex justify-between items-center">
              <img src={o.customerAvatar} alt="" className="w-10 h-10 rounded-full" />
              <button><FiMoreVertical /></button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{o.customerName}</h3>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FiClock className="mr-1" /> {o.time}
              </div>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center">
                  <FiMapPin className="mr-1"/> {o.distance} km
                </span>
                <span className="px-2 py-1 bg-yellow-50 rounded-full text-xs flex items-center">
                  <FiStar className="mr-1"/> {o.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">${o.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setSelected(o)}
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <DeliveryDetails
          orderId={selected.id}
          initialSummary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
