import React from "react";
import "../Delivery.css"
import {
  FiShoppingCart, FiCheckCircle, FiClock,
  FiDollarSign,
  FiMoreVertical,
} from "react-icons/fi";

const cards = [
  {
    title: "Revenue this month",
    value: "$12,345",
    icon: <FiDollarSign />,
  },
  {
    title: "Total Orders this month",
    value: "2241",
    icon: <FiShoppingCart />,
  },
  {
    title: "Total Delivered Orders",
    value: "7",
    icon: <FiCheckCircle />,
  },
  {
    title: "Pending Orders today",
    value: "23",
    icon: <FiClock />,
  },
];

export default function SummaryCards() {
  return (
    <>
      {cards.map((card, idx) => (
        <div key={idx} className="summary-card">
          <div className="icon-wrapper">{card.icon}</div>
          <div className="options-wrapper">
            <FiMoreVertical className="options-icon" />
          </div>
          <div className="card-content">
            <div className="card-value">{card.value}</div>
            <div className="card-title">{card.title}</div>
          </div>
        </div>
      ))}
    </>
  );
}
