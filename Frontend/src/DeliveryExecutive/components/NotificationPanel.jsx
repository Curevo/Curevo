import React from "react";
import "../Delivery.css"
import {
  FaClipboardList,
  FaCheckCircle,
  FaTruckLoading,
  FaFileMedical,
  FaTimesCircle,
  FaExpandAlt,
} from "react-icons/fa";

const notifications = [
  {
    group: "Today",
    items: [
      {
        icon: <FaClipboardList className="notif-icon blue" />,
        title: "New Order Assigned",
        message: "Order #12345 has been assigned to you.",
        time: "5 min ago",
      },
      {
        icon: <FaTruckLoading className="notif-icon orange" />,
        title: "Pickup Completed",
        message: "You have picked up Order #12344.",
        time: "30 min ago",
      },
      {
        icon: <FaCheckCircle className="notif-icon green" />,
        title: "Order Delivered",
        message: "Order #12343 delivered successfully.",
        time: "2 hrs ago",
      },
    ],
  },
  {
    group: "Yesterday",
    items: [
      {
        icon: <FaFileMedical className="notif-icon teal" />,
        title: "New Pickup Route",
        message: "Route A7 is ready for pickup.",
        time: "Yesterday • 6:10 PM",
      },
      {
        icon: <FaTimesCircle className="notif-icon red" />,
        title: "Failed Delivery Attempt",
        message: "Order #12340 could not be delivered.",
        time: "Yesterday • 3:45 PM",
      },
    ],
  },
];

export default function NotificationPanel() {
  return (
    <div className="notif-panel">
      <div className="notif-header">
        <h2>Notifications</h2>
        <div className="notif-actions">
          <button className="mark-read">Mark as read</button>
          <FaExpandAlt className="expand-icon" />
        </div>
      </div>

      {notifications.map((group) => (
        <div key={group.group} className="notif-group">
          <div className="notif-group-title">{group.group}</div>
          {group.items.map((item, idx) => (
            <div key={idx} className="notif-item">
              <div className="notif-icon-wrapper">{item.icon}</div>
              <div className="notif-content">
                <div className="notif-title">{item.title}</div>
                <div className="notif-message">{item.message}</div>
              </div>
              <div className="notif-time">{item.time}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
