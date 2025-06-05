// Notes for Your Friend
// Replace "https://your-api.com/api/summary-cards" with your actual backend endpoint.

// You can pass a dynamic user ID (deliveryGuyId) if needed.

// Ensure the backend formats the numbers or currency (like $) unless you want to format it on the frontend.


import React, { useEffect, useState } from "react";
import axios from '@/Config/axiosConfig.js';
import {
  FiDollarSign,
  FiShoppingCart,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function SummaryCards() {
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
          params: {
            deliveryGuyId: "12345", // Optional: Use dynamically if needed
          },
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
          className="relative bg-[#d1e0e9] rounded-[24px] p-6 min-h-[120px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
        >
          {/* Icon */}
          <div className="absolute top-4 left-4 w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center text-[16px] text-[#0f172a]">
            {card.icon}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-end h-full gap-2">
            <div className="ml-[56px] text-[32px] font-bold text-[#0f172a]">
              {card.value}
            </div>
            <div className="text-sm text-[#475569] leading-[1.4]">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
