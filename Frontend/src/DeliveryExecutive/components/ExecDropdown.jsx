import React from "react";
import "../Delivery.css"
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
    <div className="dropdown-menu">
      <div className="dropdown-item">
        <FaUserCircle className="dropdown-icon" />
        <span>Profile</span>
      </div>
      <div className="dropdown-item">
        <FaTruck className="dropdown-icon" />
        <span>Current Orders</span>
      </div>
      <div
        className="dropdown-item"
        onClick={() => setView("delivered")}
      >
        <FaHistory className="dropdown-icon" />
        <span>Delivery History</span>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item">
        <FaCog className="dropdown-icon" />
        <span>Account Settings</span>
      </div>
      <div className="dropdown-item">
        <FaHandsHelping className="dropdown-icon" />
        <span>Support</span>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item logout">
        <FaSignOutAlt className="dropdown-icon" />
        <span>Logout</span>
      </div>
    </div>
  );
}
