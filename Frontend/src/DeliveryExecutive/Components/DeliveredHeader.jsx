// DeliveredHeader.jsx
import React, { useState } from "react";
import { FaRegCalendarAlt, FaThLarge, FaList, FaFilter } from "react-icons/fa";

export default function DeliveredHeader() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = [
    "All",
    "Unpaid",
    "Need to ship",
    "Sent",
    "Completed",
    "Cancellation",
    "Returns",
  ];

  return (
    <div className="flex flex-col gap-4 mb-5">
      {/* Top stats bar */}
      <div className="flex items-center bg-[#d1e0e9] rounded-lg px-5 py-3 shadow-md gap-6 overflow-x-auto">
        <div className="flex-shrink-0 text-xl text-[#475569]">
          <FaRegCalendarAlt />
        </div>

        <div className="flex flex-col whitespace-nowrap pl-7 border-l border-[#6b7280]">
          <div className="text-[13px] text-[#6b7280]">Total orders</div>
          <div className="text-xl font-semibold text-[#0f172a]">48</div>
        </div>

        <div className="flex flex-col whitespace-nowrap pl-7 border-l border-[#6b7280]">
          <div className="text-[13px] text-[#6b7280]">
            Ordered medicines over time
          </div>
          <div className="text-xl font-semibold text-[#0f172a]">493</div>
        </div>

        <div className="flex flex-col whitespace-nowrap pl-7 border-l border-[#6b7280]">
          <div className="text-[13px] text-[#6b7280]">Returns</div>
          <div className="text-xl font-semibold text-[#0f172a]">6</div>
        </div>

        <div className="flex flex-col whitespace-nowrap pl-7 border-l border-[#6b7280]">
          <div className="text-[13px] text-[#6b7280]">
            Fulfilled orders over time
          </div>
          <div className="text-xl font-semibold text-[#0f172a]">359</div>
        </div>

        <div className="flex flex-col whitespace-nowrap pl-7 border-l border-[#6b7280]">
          <div className="text-[13px] text-[#6b7280]">
            Delivered orders over time
          </div>
          <div className="text-xl font-semibold text-[#0f172a]">353</div>
        </div>
      </div>

      {/* Tabs and actions */}
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 text-sm cursor-pointer ${
                activeTab === tab
                  ? "text-[#1f2937] font-semibold"
                  : "text-[#475569]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1f2937] rounded"></span>
              )}
            </div>
          ))}
        </div>

        {/* Search + Icons */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search order..."
            className="px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-md text-sm text-[#334155] placeholder-[#94a3b8] focus:outline-none"
          />
          <button className="text-lg text-[#475569] hover:text-[#1f2937] focus:outline-none">
            <FaThLarge />
          </button>
          <button className="text-lg text-[#475569] hover:text-[#1f2937] focus:outline-none">
            <FaList />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-md text-sm text-[#475569] hover:bg-[#f9fafb] focus:outline-none">
            <FaFilter />
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
