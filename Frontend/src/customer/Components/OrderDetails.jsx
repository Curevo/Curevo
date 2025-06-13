import React from "react";
import {
  FiX,
  FiClipboard,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to generate timeline based on status
const generateTimeline = (status, placedAt, updatedAt) => {
  const timeline = [];
  const eventDate = updatedAt || placedAt;

  if (placedAt) {
    timeline.push({
      icon: <FiCheckCircle className="h-5 w-5 text-green-500" />,
      title: "Order Placed",
      detail: "Your order has been successfully placed.",
      date: formatDate(placedAt),
    });
  }

  const statusDetails = {
    "PENDING": { icon: <FiClock className="h-5 w-5 text-gray-500" />, title: "Order Pending", detail: "Awaiting processing." },
    "NEEDS_VERIFICATION": { icon: <FiInfo className="h-5 w-5 text-yellow-500" />, title: "Prescription Required", detail: "Awaiting prescription verification." },
    "VERIFIED": { icon: <FiCheckCircle className="h-5 w-5 text-green-500" />, title: "Prescription Verified", detail: "Your prescription has been verified." },
    "ASSIGNED": { icon: <FiPackage className="h-5 w-5 text-blue-500" />, title: "Order Assigned", detail: "Your order has been assigned to a delivery executive." },
    "OUT_FOR_DELIVERY": { icon: <FiTruck className="h-5 w-5 text-indigo-500" />, title: "Out for Delivery", detail: "Your order is on its way!" },
    "DELIVERED": { icon: <FiCheckCircle className="h-5 w-5 text-green-500" />, title: "Delivered", detail: "Your order has been successfully delivered." },
    "CANCELLED": { icon: <FiX className="h-5 w-5 text-red-500" />, title: "Order Cancelled", detail: "Your order has been cancelled." },
  };

  const effectiveStatus = typeof status === 'string' ? status : '';

  if (effectiveStatus && eventDate) {
    const detail = statusDetails?.[effectiveStatus];
    if (detail) {
      timeline.push({
        icon: detail.icon,
        title: detail.title,
        detail: detail.detail,
        date: formatDate(eventDate),
      });
    } else {
      timeline.push({
        icon: <FiInfo className="h-5 w-5 text-gray-400" />,
        title: `Status: ${effectiveStatus.replace(/_/g, ' ')}`,
        detail: "Order status updated.",
        date: formatDate(eventDate),
      });
    }
  }

  return timeline;
};


export default function OrderDetails({ order, onClose = () => {} }) {
  if (!order) {
    return null;
  }

  const orderNumber = order.id ? `#${order.id}` : "#N/A";
  const createdAt = order.placedAt || order.updatedAt;
  const currentStatus = typeof order.status === 'string' ? order.status : "UNKNOWN";

  // --- MODIFIED: Payment Status Logic ---
  let paymentStatus;
  if (currentStatus === "CANCELLED") {
    paymentStatus = "Refunded";
  } else if (order.totalAmount !== null && order.totalAmount > 0) {
    paymentStatus = "Paid";
  } else {
    paymentStatus = "Pending";
  }
  // --- END MODIFIED ---

  const customerName = order.recipientName || order.customer?.name || "N/A";
  const customerEmail = order.recipientEmail || order.customer?.user?.email || "N/A";
  const customerPhone = order.recipientPhone || order.customer?.user?.phone || "N/A";

  const displayAddress = order.deliveryAddress && String(order.deliveryAddress).trim() !== ''
      ? String(order.deliveryAddress)
      : "N/A";

  const items = order.orderItems?.map(item => ({
    id: item.id,
    name: item.product?.name || "N/A",
    imageUrl: item.product?.image || "",
    description: item.product?.description || "No description",
    quantity: item.quantity,
    price: item.unitPrice, // Use unitPrice for per-item calculation
  })) || [];

  // --- Manual Payment Calculations ---
  const calculatedSubtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const deliveryCharges = calculatedSubtotal > 300 ? 0 : 50;
  const platformFee = 10;

  const totalBeforeTax = calculatedSubtotal + deliveryCharges + platformFee;
  const tax = totalBeforeTax * 0.18; // 18% tax as per current Indian GST norms

  const finalTotal = totalBeforeTax + tax;

  const paymentSummary = {
    subtotal: calculatedSubtotal,
    deliveryCharges: deliveryCharges,
    platformFee: platformFee,
    tax: tax,
    total: finalTotal,
  };
  // --- End Manual Payment Calculations ---

  const timeline = generateTimeline(currentStatus, order.placedAt, order.updatedAt);

  const needsPrescriptionVerification = !!order.needsPrescriptionVerification;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 overflow-y-auto">
        <div
            className="bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col my-8 overflow-hidden"
            style={{ maxHeight: "calc(100vh - 4rem)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {orderNumber}
            </span>
              <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <FiClipboard className="h-5 w-5" />
              </button>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none"
            >
              <FiX className="h-7 w-7" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
            {/* Created / Payment / Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-4 pb-5 border-b border-gray-100">
              {/* Created */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-sm font-medium text-gray-700">{formatDate(createdAt)}</p>
              </div>
              {/* Payment */}
              <div className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700" // Refunded will also use red styling
                    }`}
                >
                {paymentStatus}
              </span>
              </div>
              {/* Delivery Status */}
              <div className="text-center sm:text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
                <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        currentStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : currentStatus === "OUT_FOR_DELIVERY"
                                ? "bg-blue-100 text-blue-700"
                                : currentStatus === "CANCELLED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {currentStatus.replace(/_/g, ' ')}
              </span>
              </div>
            </div>

            {/* Customer */}
            <div className="space-y-4 pb-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-8 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Full Name:</p>
                  <p className="text-gray-700 mt-0.5">{customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Email:</p>
                  <p className="text-gray-700 mt-0.5">{customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Phone Number:</p>
                  <p className="text-gray-700 mt-0.5">{customerPhone}</p>
                </div>
                {/* Shipping Address - Now displays as a single block */}
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 font-medium">Shipping Address:</p>
                  <p className="text-gray-700 mt-0.5 leading-relaxed">
                    {displayAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Prescription Status (Conditional Render) */}
            {needsPrescriptionVerification && (
                <div className="space-y-4 pb-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Prescription Status</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <FiInfo className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 flex-grow">
                      {order.prescriptionVerified === false
                          ? "Prescription needs verification. Please upload or contact support."
                          : "Prescription pending upload or review by a pharmacist."}
                    </p>
                    {order.prescriptionUrl && (
                        <a
                            href={order.prescriptionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold flex-shrink-0"
                        >
                          View Prescription
                        </a>
                    )}
                  </div>
                </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
                <div className="space-y-4 pb-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
                  <div className="space-y-5">
                    {timeline.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-4">
                          <div className="mt-0.5 flex-shrink-0">{step.icon}</div>
                          <div className="flex-1">
                            <p className="text-base font-medium text-gray-800">
                              {step.title}
                            </p>
                            <p className="text-sm text-gray-600">{step.detail}</p>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">{step.date}</div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Items */}
            {items.length > 0 && (
                <div className="space-y-4 pb-5 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Items Ordered ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-100"
                        >
                          <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 ml-4">
                            <p className="text-base font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          <p className="text-base font-semibold text-gray-700 ml-auto">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Payment Summary - Now with manual calculations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Summary</h3>
              <div className="grid grid-cols-2 gap-y-2 sm:gap-x-6 text-base text-gray-700">
                <div className="font-medium">Subtotal:</div>
                <div className="text-right font-medium">
                  ${paymentSummary.subtotal.toFixed(2)}
                </div>
                {/* Discount is 0 as per your rule, can be omitted or kept if logic changes */}
                {/* <div className="font-medium">Discount:</div>
                <div className="text-right font-medium">
                  ${paymentSummary.discount.toFixed(2)}
                </div> */}
                <div className="font-medium">Delivery Charges:</div>
                <div className="text-right font-medium">
                  ${paymentSummary.deliveryCharges.toFixed(2)}
                </div>
                <div className="font-medium">Platform Fee:</div>
                <div className="text-right font-medium">
                  ${paymentSummary.platformFee.toFixed(2)}
                </div>
                <div className="font-medium">Tax (18%):</div> {/* Updated tax percentage for clarity */}
                <div className="text-right font-medium">
                  ${paymentSummary.tax.toFixed(2)}
                </div>
                <div className="font-bold text-gray-900 text-lg">Total:</div>
                <div className="text-right font-bold text-gray-900 text-lg">
                  ${paymentSummary.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer (empty) */}
          <div className="flex justify-end items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
            {/* No buttons here */}
          </div>
        </div>
      </div>
  );
}