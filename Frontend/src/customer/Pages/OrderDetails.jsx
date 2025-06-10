//How it works
// Props
// orderId (string) – if provided, the component will fetch details from your API.
// onClose – callback to hide the modal.
// Fetching
// useEffect fires on mount or when orderId changes.
// GET https://your-api.com/api/order-details?orderId=...
// Expects { order: { /* full object matching your UI */ } }.
// Fallback
// If no orderId prop or fetch fails, it falls back to sampleOrder.
// Loading state
// Shows a simple “Loading…” overlay while fetching. 


import React, { useState, useEffect } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import {
  FiX,
  FiClipboard,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";

export default function OrderDetails({ orderId = null, onClose = () => {} }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios = useAxiosInstance();

  // Sample fallback if API & prop both missing
  const sampleOrder = {
    orderNumber: "#0000",
    createdAt: "01 Jan 2020, 12:00 pm",
    paymentStatus: "Pending",
    deliveryStatus: "Pending",
    customer: {
      name: "Sample Customer",
      email: "sample@example.com",
      phone: "+1 (555) 000-0000",
      addressLines: ["123 Sample St", "Sample City, SC 12345", "USA"],
    },
    timeline: [],
    items: [],
    paymentSummary: {
      subtotal: 0,
      discount: 0,
      shippingCost: 0,
      tax: 0,
      total: 0,
    },
  };

  useEffect(() => {
    if (!orderId) {
      setOrder(sampleOrder);
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/order-details", {
          params: { orderId },
        });
        // assume response: { order: { … } }
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error loading order details:", err);
        setOrder(sampleOrder);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow">Loading...</div>
      </div>
    );
  }

  const data = order || sampleOrder;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div
        className="bg-gray-900 text-gray-100 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
        style={{ height: "70vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Order details</h2>
            <span className="px-2 py-0.5 bg-gray-800 rounded text-sm">
              {data.orderNumber}
            </span>
            <button className="ml-1 text-gray-400 hover:text-gray-200">
              <FiClipboard className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Created / Payment / Status */}
          <div className="grid grid-cols-3 gap-x-4">
            {/* Created */}
            <div>
              <p className="text-xs text-gray-400">Created at</p>
              <p className="text-sm text-gray-200">{data.createdAt}</p>
            </div>
            {/* Payment */}
            <div className="text-center">
              <p className="text-xs text-gray-400">Payment</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  data.paymentStatus === "Success"
                    ? "bg-green-600 text-white"
                    : data.paymentStatus === "Pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {data.paymentStatus}
              </span>
            </div>
            {/* Delivery Status */}
            <div className="text-right">
              <p className="text-xs text-gray-400">Status</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  data.deliveryStatus === "Delivered"
                    ? "bg-green-600 text-white"
                    : data.deliveryStatus === "In Progress"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {data.deliveryStatus}
              </span>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Customer</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-gray-400">Full name:</p>
                <p className="text-gray-200">{data.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Email:</p>
                <p className="text-gray-200">{data.customer.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone Number:</p>
                <p className="text-gray-200">{data.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400">Shipping Address:</p>
                <p className="text-gray-200">
                  {data.customer.addressLines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {data.timeline?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-200">Timeline</h3>
              <div className="space-y-6">
                {data.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="mt-1">{step.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.detail}</p>
                    </div>
                    <div className="text-xs text-gray-500">{step.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          {data.items?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-200">
                Items ({data.items.length})
              </h3>
              <div className="space-y-4">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-800 rounded-lg p-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover border border-gray-700"
                    />
                    <div className="flex-1 ml-4">
                      <p className="text-sm font-medium text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-sm text-gray-200">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-200">Payment</h3>
            <div className="grid grid-cols-2 gap-x-6 text-sm text-gray-300">
              <div>Subtotal:</div>
              <div className="text-right">
                ${data.paymentSummary.subtotal.toFixed(2)}
              </div>
              <div>Discount:</div>
              <div className="text-right">
                ${data.paymentSummary.discount.toFixed(2)}
              </div>
              <div>Shipping cost:</div>
              <div className="text-right">
                ${data.paymentSummary.shippingCost.toFixed(2)}
              </div>
              <div>Tax:</div>
              <div className="text-right">
                ${data.paymentSummary.tax.toFixed(2)}
              </div>
              <div className="font-semibold text-gray-100">Total:</div>
              <div className="text-right font-semibold text-gray-100">
                ${data.paymentSummary.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center space-x-4 px-6 py-4 border-t border-gray-700">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Refund
          </button>
        </div>
      </div>
    </div>
  );
}
