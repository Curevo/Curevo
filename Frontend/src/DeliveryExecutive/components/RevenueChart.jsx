import React from "react";
import "../Delivery.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for two series: current vs prior week
const data = [
  { date: "Feb 14", current: 15000, prior: 13500 },
  { date: "Feb 15", current: 13000, prior: 16259.78 },
  { date: "Feb 16", current: 17000, prior: 12790.34 },
  { date: "Feb 17", current: 18000, prior: 14000 },
  { date: "Feb 18", current: 20000, prior: 15500 },
  { date: "Feb 19", current: 19000, prior: 17000 },
  { date: "Feb 20", current: 21000, prior: 18000 },
];

export default function RevenueChart() {
  return (
    <div className="revenue-card">
      <div className="revenue-header">
        <h3 className="revenue-title">Revenue</h3>
        <div className="revenue-subtitle">Last 7 days vs prior week</div>
      </div>
      <div className="revenue-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#d1d5db" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }}
              itemStyle={{ color: "#ffffff" }}
              labelStyle={{ color: "#ffffff", fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="prior"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: "#94a3b8", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#0f172a"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffffff", stroke: "#0f172a", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
