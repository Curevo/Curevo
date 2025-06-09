// TodoList.jsx
import React from "react";
import {
  FiPackage,
  FiBatteryCharging,
  FiMapPin,
  FiRotateCw,
} from "react-icons/fi";

const todos = [
  {
    icon: <FiPackage />,
    text: "Pick up Order #4532",
    date: "Mar 4 at 6:00 pm",
  },
  {
    icon: <FiBatteryCharging />,
    text: "Refuel Bike",
    date: "Mar 7 at 6:00 pm",
  },
  {
    icon: <FiMapPin />,
    text: "Deliver Order #4532",
    date: "Mar 12 at 6:00 pm",
  },
  {
    icon: <FiRotateCw />,
    text: "Collect Return Package from 12 Elm St.",
    date: "Mar 12 at 6:00 pm",
  },
];

export default function TodoList() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h3 className="text-[20px] font-semibold text-[#0f172a]">Your to-Do list</h3>

      {/* List */}
      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {todos.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4">
            {/* Icon Badge */}
            <div className="w-12 h-12 bg-black rounded-[12px] flex items-center justify-center text-white text-2xl">
              {item.icon}
            </div>
            {/* Text Block */}
            <div className="flex flex-col gap-1">
              <div className="text-[16px] font-medium text-[#0f172a]">{item.text}</div>
              <div className="text-sm text-[#64748b]">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
