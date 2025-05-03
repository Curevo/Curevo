import React, { useState } from "react";
import "../Delivery.css"

// Sample data for a medicine delivery executive
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
  const [page, setPage]       = useState(1);

  const start = (page - 1) * perPage;
  const paginated = sampleDeliveries.slice(start, start + perPage);
  const totalPages = Math.ceil(sampleDeliveries.length / perPage);

  return (
    <div className="delivered-container">
      <table className="delivered-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Medicine</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Items</th>
            <th>Method</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((o) => (
            <tr key={o.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div className="medicine-cell">
                  <img src={`https://via.placeholder.com/40`} alt="" />
                  <div className="medicine-info">
                    <div className="med-name">{o.medicine}</div>
                    <div className="med-id">{o.id}</div>
                  </div>
                </div>
              </td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td>{o.total}</td>
              <td>
                <span className={`status-badge ${o.status.toLowerCase()}`}>
                  {o.status}
                </span>
              </td>
              <td>{o.items} items</td>
              <td>{o.method}</td>
              <td className="actions-cell">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="delivered-footer">
        <div className="per-page">
          Items per page:
          <select
            value={perPage}
            onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
          >
            {[5,10,20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i+1}
              className={page===i+1 ? "active" : ""}
              onClick={() => setPage(i+1)}
            >{i+1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
