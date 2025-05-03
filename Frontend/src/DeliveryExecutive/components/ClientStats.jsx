import React from "react";
import "../Delivery.css"

export default function ClientStats() {
  return (
    <div className="client-stats-grid">
      <div className="client-stats-card">
        <div className="stats-label">New Orders</div>
        <div className="stats-value" data-value="54">
          <span className="stats-positive">+18.7%</span>
        </div>
      </div>

      <div className="client-stats-card">
        <div className="stats-label">Returns</div>
        <div className="stats-value" data-value="6">
          <span className="stats-negative">+2.7%</span>
        </div>
      </div>

    </div>
  );
}
