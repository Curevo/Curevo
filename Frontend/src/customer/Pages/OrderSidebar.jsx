// components/OrderSidebar.jsx
import React from "react";
import { FaUser, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar({ onChangeView, activeView }) {
  const items = [
    { label: "Account", icon: <FaUser /> },
    { label: "My Orders", icon: <FaShoppingCart /> },
    { label: "Appointment", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">MyApp</h2>
      <nav className="flex-1 space-y-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onChangeView(item.label)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${
              activeView === item.label
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="mt-8 flex items-center gap-3 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg transition">
        <FiLogOut className="text-lg" />
        Logout
      </button>
    </div>
  );
}
