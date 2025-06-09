// DeliveredTable.jsx
import React, { useState } from "react";

const sampleDeliveries = [
  {
    id: "#MD1001",
    medicine: "Paracetamol 500mg",
    customer: "Alice Johnson",
    date: "May 1, 2025 • 09:15 AM",
    total: "$12.00",
    status: "Pending",
    items: 2,
    method: "Standard Delivery",
  },
  {
    id: "#MD1002",
    medicine: "Amoxicillin 250mg",
    customer: "Bob Smith",
    date: "May 1, 2025 • 10:30 AM",
    total: "$18.50",
    status: "Delivered",
    items: 1,
    method: "Express Delivery",
  },
  {
    id: "#MD1003",
    medicine: "Cough Syrup 100ml",
    customer: "Cathy Lee",
    date: "May 1, 2025 • 11:00 AM",
    total: "$8.75",
    status: "Failed",
    items: 1,
    method: "Standard Delivery",
  },
  // …more rows
];

export default function DeliveredTable() {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const start = (page - 1) * perPage;
  const paginated = sampleDeliveries.slice(start, start + perPage);
  const totalPages = Math.ceil(sampleDeliveries.length / perPage);

  return (
    <div className="bg-[#d1e0e9] rounded-lg p-4 shadow-md font-sans">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              <input type="checkbox" />
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Medicine
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Customer
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Date
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Total
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Status
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Items
            </th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              Method
            </th>
            <th className="px-2 py-3 text-center text-xs font-semibold text-[#475569] border-b border-[#e2e8f0]">
              {/* Empty for actions */}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((o) => (
            <tr key={o.id} className="border-b border-[#f1f5f9]">
              <td className="px-2 py-3">
                <input type="checkbox" />
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://via.placeholder.com/40`}
                    alt=""
                    className="w-10 h-10 rounded-[6px] object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#1e293b]">
                      {o.medicine}
                    </div>
                    <div className="text-xs text-[#64748b]">{o.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3 text-sm text-[#334155]">{o.customer}</td>
              <td className="px-2 py-3 text-sm text-[#334155]">{o.date}</td>
              <td className="px-2 py-3 text-sm text-[#334155]">{o.total}</td>
              <td className="px-2 py-3">
                <span
                  className={`inline-block text-xs font-medium py-1 px-2 rounded-full whitespace-nowrap ${
                    o.status === "Pending"
                      ? "bg-[#fef3c7] text-[#b45309]"
                      : o.status === "Delivered"
                      ? "bg-[#dcfce7] text-[#15803d]"
                      : "bg-[#fee2e2] text-[#b91c1c]"
                  }`}
                >
                  {o.status}
                </span>
              </td>
              <td className="px-2 py-3 text-sm text-[#334155]">
                {o.items} items
              </td>
              <td className="px-2 py-3 text-sm text-[#334155]">{o.method}</td>
              <td className="px-2 py-3 text-center text-lg text-[#94a3b8] cursor-pointer">
                ⋮
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-[#475569]">
          Items per page:
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(+e.target.value);
              setPage(1);
            }}
            className="ml-2 px-2 py-1 text-sm border border-[#cbd5e1] rounded-[6px] bg-white outline-none"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`ml-1 px-3 py-1.5 text-sm ${
              page === 1
                ? "text-[#cbd5e1] cursor-default"
                : "text-[#475569] hover:bg-[#f1f5f9]"
            } rounded-[6px] transition`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`ml-1 px-3 py-1.5 text-sm rounded-[6px] transition ${
                page === i + 1
                  ? "bg-[#f1f5f9] text-[#334155]"
                  : "text-[#475569] hover:bg-[#f1f5f9]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`ml-1 px-3 py-1.5 text-sm ${
              page === totalPages
                ? "text-[#cbd5e1] cursor-default"
                : "text-[#475569] hover:bg-[#f1f5f9]"
            } rounded-[6px] transition`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
