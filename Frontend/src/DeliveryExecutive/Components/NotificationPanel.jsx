// NotificationPanel.jsx
import React from "react";
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
        icon: <FaClipboardList className="w-5 h-5 text-blue-500" />,
        title: "New Order Assigned",
        message: "Order #12345 has been assigned to you.",
        time: "5 min ago",
      },
      {
        icon: <FaTruckLoading className="w-5 h-5 text-orange-500" />,
        title: "Pickup Completed",
        message: "You have picked up Order #12344.",
        time: "30 min ago",
      },
      {
        icon: <FaCheckCircle className="w-5 h-5 text-green-500" />,
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
        icon: <FaFileMedical className="w-5 h-5 text-teal-500" />,
        title: "New Pickup Route",
        message: "Route A7 is ready for pickup.",
        time: "Yesterday • 6:10 PM",
      },
      {
        icon: <FaTimesCircle className="w-5 h-5 text-red-500" />,
        title: "Failed Delivery Attempt",
        message: "Order #12340 could not be delivered.",
        time: "Yesterday • 3:45 PM",
      },
    ],
  },
];

export default function NotificationPanel() {
  return (
    <div className="w-[360px] max-h-[600px] bg-white border border-gray-200 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <div className="flex items-center gap-3">
          <button className="text-sm text-blue-500 hover:underline focus:outline-none">
            Mark as read
          </button>
          <FaExpandAlt className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Notification Groups */}
      {notifications.map((group) => (
        <div key={group.group} className="py-3">
          {/* Group Title */}
          <div className="px-4 text-xs font-medium text-gray-500 uppercase mb-2">
            {group.group}
          </div>

          {/* Items */}
          {group.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-2 border-b border-gray-100"
            >
              {/* Icon */}
              <div className="flex-shrink-0">{item.icon}</div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="text-sm font-semibold text-gray-900">
                  {item.title}
                </div>
                <div className="text-sm text-gray-600">{item.message}</div>
              </div>

              {/* Time */}
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
