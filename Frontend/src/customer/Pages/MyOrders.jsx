//How it works for your friend
// useEffect fetches from GET /api/my-orders?customerId=12345.
// Assumes the JSON payload:
// {
//   "scheduled": [ /* array of order objects */ ],
//   "previous": [ /* ... */ ]
// }
// Each order object must include the same fields your existing code expects:
// id, total, itemsCount, paymentType, orderedAgo, eta, statusStep.
// And a fully built .details object (or the friend can move the makeDetailObject logic server-side and return order.details directly).
// Loading and empty states are handled gracefully.


import React, { useState, useEffect } from "react";
import {
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPackage,
} from "react-icons/fi";
import axios from "axios";
import OrderDetails from "./OrderDetails";

export default function MyOrders() {
  const tabs = ["Scheduled Orders", "Previous Orders"];
  const [activeTab, setActiveTab] = useState(0);
  const [scheduled, setScheduled] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://your-api.com/api/my-orders",
          {
            params: { customerId: "12345" },
          }
        );
        // assume API returns { scheduled: [...], previous: [...] }
        setScheduled(res.data.scheduled);
        setPrevious(res.data.previous);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrders = (ordersArray, isPrevious) => {
    if (loading) {
      return <div className="py-12 text-center">Loading orders…</div>;
    }
    if (!ordersArray.length) {
      return <div className="py-12 text-center text-gray-500">No orders here.</div>;
    }

    return ordersArray.map((order) => (
      <div
        key={order.id}
        className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Order no {order.id}</p>
            <p className="text-lg font-semibold text-gray-800">
              {order.total}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setSelectedOrder(order)}
              className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Order Details
            </button>
            {!isPrevious && (
              <button className="text-red-500 text-sm font-medium px-4 py-2 rounded-lg hover:text-red-600 transition">
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4 px-2">
          {["Confirmed", "Preparing", "Picked up", "Delivered"].map(
            (step, idx) => {
              const isActive = idx <= order.statusStep;
              const Icon = [FiCheckCircle, FiPackage, FiTruck, FiClock][idx];
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center w-1/4">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isActive
                          ? "text-gray-800 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-0.5 mt-4 ${
                        idx < order.statusStep ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            }
          )}
        </div>

        {/* Summary line */}
        <div className="text-sm text-gray-500">
          {order.itemsCount} items ● {order.paymentType} ● Ordered{" "}
          {order.orderedAgo} ● {order.eta}
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setSelectedOrder(null);
              }}
              className={`pb-2 text-sm font-medium ${
                activeTab === idx
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}{" "}
              <span className="text-gray-400">(
                {idx === 0 ? scheduled.length : previous.length}
                )</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 0 && renderOrders(scheduled, false)}
        {activeTab === 1 && renderOrders(previous, true)}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
