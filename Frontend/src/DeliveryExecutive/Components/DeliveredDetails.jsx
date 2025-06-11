import React, { useState, useEffect } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import {
  FiX,
  FiTruck,
  FiDollarSign,
} from "react-icons/fi";

export default function DeliveryDetails({
  orderId = null,
  initialSummary = {},    // passed from Orders.jsx
  onClose = () => {}
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
const axios = useAxiosInstance();

  // Merge summary into details immediately
  const summary = initialSummary;

  useEffect(() => {
    if (!orderId) return;
    async function fetchDetails() {
      try {
        const res = await axios.get(
          "https://your-api.com/api/delivery-order-details",
          { params: { orderId } }
        );
        setDetails(res.data.order);
      } catch (err) {
        console.error("Error loading details:", err);
        // leave details null to fallback on summary
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [orderId]);

  // Choose data: full details once fetched, else show summary:
  const data = details || {
    orderNumber: summary.id,
    createdAt: summary.time,
    paymentStatus: summary.paymentStatus || "Unknown",
    deliveryStatus: summary.deliveryStatus || "Completed",
    customer: {
      name: summary.customerName,
      email: summary.customerEmail || "",
      phone: summary.customerPhone || "",
      addressLines: summary.address ? [summary.address] : [],
    },
    items: summary.items || [],
    paymentSummary: {
      subtotal: summary.subtotal || summary.total || 0,
      discount: 0,
      shippingCost: 0,
      tax: 0,
      total: summary.total || 0,
    },
    timeline: details?.timeline || []
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow">Loading…</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Order {data.orderNumber}
          </h2>
          <button onClick={onClose}>
            <FiX size={20}/>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <div>
            <p className="text-sm text-gray-500">Created at</p>
            <p>{data.createdAt}</p>
          </div>

          <div>
            <h3 className="font-medium">Customer</h3>
            <p>{data.customer.name}</p>
            {data.customer.addressLines.map((l,i)=>(
              <p key={i} className="text-sm text-gray-500">{l}</p>
            ))}
          </div>

          <div>
            <h3 className="font-medium">Items</h3>
            <ul className="divide-y">
              {data.items.map((it,i)=>(
                <li key={i} className="py-2 flex justify-between">
                  <span>{it.name} ×{it.qty}</span>
                  <span>${it.price?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${data.paymentSummary.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
          >
            <FiTruck /> Track
          </button>
        </div>
      </div>
    </div>
  );
}
