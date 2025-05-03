import React from "react";
import "../Delivery.css"
import {
  FiPackage,           // Pick up Order
  FiBatteryCharging,   // Refuel / Charge Bike
  FiMapPin,            // Deliver Order
  FiRotateCw           // Collect Return Package
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
    <div className="todo-section">
      <h3 className="todo-header">Your to-Do list</h3>
      <ul className="todo-list">
        {todos.map((item, idx) => (
          <li key={idx} className="todo-item">
            <div className="todo-icon">{item.icon}</div>
            <div className="todo-texts">
              <div className="todo-text">{item.text}</div>
              <div className="todo-date">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
