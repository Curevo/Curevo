import React, { useState } from "react";
import "../Delivery.css"
import { FaRegCalendarAlt, FaThLarge, FaList, FaFilter } from "react-icons/fa";

export default function DeliveredHeader() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Unpaid", "Need to ship", "Sent", "Completed", "Cancellation", "Returns"];

  return (
    <div className="delivered-header-container">
      {/* Top stats bar */}
      <div className="stats-bar">
        <div className="stats-icon"><FaRegCalendarAlt /></div>
        <div className="stats-item">
          <div className="delivered-stats-label ">Total orders</div>
          <div className="stats-value">48</div>
        </div>
        <div className="stats-item">
          <div className="delivered-stats-label ">Ordered medicines over time</div>
          <div className="stats-value">493</div>
        </div>
        <div className="stats-item">
          <div className="delivered-stats-label ">Returns</div>
          <div className="stats-value">6</div>
        </div>
        <div className="stats-item">
          <div className="delivered-stats-label ">Fulfilled orders over time</div>
          <div className="stats-value">359</div>
        </div>
        <div className="stats-item">
          <div className="delivered-stats-label ">Delivered orders over time</div>
          <div className="stats-value">353</div>
        </div>
      </div>

      {/* Tabs and actions */}
      <div className="tabs-bar">
        <div className="tabs">
          {tabs.map(tab => (
            <div
              key={tab}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="tab-actions">
          <input
            type="text"
            className="tab-search"
            placeholder="Search order..."
          />
          <button className="view-toggle">
            <FaThLarge />
          </button>
          <button className="view-toggle">
            <FaList />
          </button>
          <button className="filter-button">
            <FaFilter /> Filter
          </button>
        </div>
      </div>
    </div>
  );
}
