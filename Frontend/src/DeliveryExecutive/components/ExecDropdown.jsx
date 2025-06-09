// ExecDropdown.jsx
import React from "react";
import {
  FaUserCircle,
  FaTruck,
  FaHistory,
  FaCog,
  FaHandsHelping,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ExecDropdown({ setView }) {
  return (
    <div className="w-60 bg-white border border-gray-200 rounded-lg shadow-md py-2 font-sans">
      {/* Profile */}
      <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
        <FaUserCircle className="mr-3 text-lg text-gray-600" />
        <span className="text-sm text-gray-800">Profile</span>
      </div>

      {/* Current Orders */}
      <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
        <FaTruck className="mr-3 text-lg text-gray-600" />
        <span className="text-sm text-gray-800">Current Orders</span>
      </div>

      {/* Delivery History */}
      <div
        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setView("delivered")}
      >
        <FaHistory className="mr-3 text-lg text-gray-600" />
        <span className="text-sm text-gray-800">Delivery History</span>
      </div>

      {/* Divider */}
      <hr className="my-2 border-t border-gray-200" />

      {/* Account Settings */}
      <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
        <FaCog className="mr-3 text-lg text-gray-600" />
        <span className="text-sm text-gray-800">Account Settings</span>
      </div>

      {/* Support */}
      <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
        <FaHandsHelping className="mr-3 text-lg text-gray-600" />
        <span className="text-sm text-gray-800">Support</span>
      </div>

      {/* Divider */}
      <hr className="my-2 border-t border-gray-200" />

      {/* Logout */}
      <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
        <FaSignOutAlt className="mr-3 text-lg text-red-600" />
        <span className="text-sm text-red-600">Logout</span>
      </div>
    </div>
  );
}
