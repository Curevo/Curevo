// Notes for Your Friend
// Replace "https://your-api.com/api/summary-cards" with your actual backend endpoint.

// You can pass a dynamic user ID (deliveryGuyId) if needed.

// Ensure the backend formats the numbers or currency (like $) unless you want to format it on the frontend.

// SummaryCards.jsx
import React, { useEffect, useState } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import {
  FiDollarSign,
  FiShoppingCart,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function SummaryCards() {
  const axios = useAxiosInstance();
  const [summary, setSummary] = useState({
    revenue: "Loading...",
    totalOrders: "Loading...",
    deliveredOrders: "Loading...",
    pendingOrders: "Loading...",
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/summary-cards", {
          params: { deliveryGuyId: "12345" },
        });
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary cards:", error);
        setSummary({
          revenue: "Error",
          totalOrders: "Error",
          deliveredOrders: "Error",
          pendingOrders: "Error",
        });
      }
    };
    fetchSummary();
  }, []);

  const cards = [
    {
      title: "Revenue this month",
      value: summary.revenue,
      icon: <FiDollarSign />,
    },
    {
      title: "Total Orders this month",
      value: summary.totalOrders,
      icon: <FiShoppingCart />,
    },
    {
      title: "Total Delivered Orders",
      value: summary.deliveredOrders,
      icon: <FiCheckCircle />,
    },
    {
      title: "Pending Orders today",
      value: summary.pendingOrders,
      icon: <FiClock />,
    },
  ];

  return (
    <>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="
            relative bg-[#d1e0e9] rounded-2xl p-6
            shadow-lg
            flex flex-col items-start
          "
        >
          {/* Icon at top-left */}
          <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg text-[#0f172a]">
            {card.icon}
          </div>
          {/* Content block: add left margin so it’s not overlapped by icon */}
          <div className="ml-[56px] flex flex-col gap-1">
            <div className="text-2xl font-bold text-[#0f172a]">
              {card.value}
            </div>
            <div className="text-sm text-[#475569] leading-snug">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
