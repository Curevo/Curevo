import React, { useState, useEffect } from "react";
import { FiTruck, FiCheckCircle, FiClock, FiPackage, FiFileText, FiInfo, FiX } from "react-icons/fi";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import OrderDetails from "./OrderDetails.jsx";

// --- Helper Functions (No changes needed here) ---
const formatOrderTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 2592000) { // Approx 30 days
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

const getOrderStatusInfo = (status, prescriptionUrl, prescriptionVerified) => {
  let statusStep = 0;
  let eta = "ETA: Pending confirmation";
  let statusText = "Pending";
  let statusColor = "bg-yellow-500"; // Default, could be refined

  switch (status) {
    case "NEEDS_VERIFICATION":
      statusStep = 0;
      eta = "ETA: Awaiting prescription verification";
      statusText = "Needs Verification";
      statusColor = "bg-orange-500";
      break;
    case "PENDING":
      statusStep = 1;
      eta = "ETA: Awaiting processing";
      statusText = "Pending";
      statusColor = "bg-amber-400";
      break;
    case "VERIFIED":
      statusStep = 2; // Adjusted step for VERIFIED
      eta = "ETA: Preparing order";
      statusText = "Verified";
      statusColor = "bg-blue-500";
      break;
    case "ASSIGNED":
      statusStep = 3; // Adjusted step for ASSIGNED
      eta = "ETA: Out for delivery soon";
      statusText = "Assigned";
      statusColor = "bg-cyan-400";
      break;
    case "OUT_FOR_DELIVERY":
      statusStep = 4; // Adjusted step for OUT_FOR_DELIVERY
      eta = "ETA: Within 30 mins";
      statusText = "Out for Delivery";
      statusColor = "bg-lime-500";
      break;
    case "DELIVERED":
      statusStep = 5; // Adjusted step for DELIVERED
      eta = "Delivered";
      statusText = "Delivered";
      statusColor = "bg-green-600";
      break;
    case "CANCELLED":
      statusStep = -1; // Special step for cancelled
      eta = "Cancelled";
      statusText = "Cancelled";
      statusColor = "bg-red-600";
      break;
    default:
      statusStep = 0;
      eta = "ETA: Unknown";
      statusText = "Unknown";
      statusColor = "bg-gray-500";
  }
  return { statusStep, eta, statusText, statusColor };
};

// --- Main Component ---
export default function MyOrders() {
  const axios = useAxiosInstance();
  const tabs = ["Scheduled Orders", "Previous Orders"];
  const [activeTab, setActiveTab] = useState(0);
  const [scheduled, setScheduled] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New handleDelete function
  const handleDelete = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
      return; // User cancelled
    }

    try {
      setLoading(true); // Indicate loading state
      const response = await axios.post(`/api/orders/delete/${orderId}`);
      console.log(`Order ${orderId} deleted successfully:`, response.data);

      // Optimistically update the UI by removing the deleted order
      setScheduled(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setPrevious(prevOrders => prevOrders.filter(order => order.id !== orderId));

      // Optionally, refetch all orders to ensure state consistency
      // fetchOrders(); // Uncomment if you prefer a full data refresh
    } catch (error) {
      console.error(`Error deleting order ${orderId}:`, error);
      alert(`Failed to delete order ${orderId}. Please try again.`);
    } finally {
      setLoading(false); // End loading state
    }
  };


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/orders/me");
        const allOrders = res.data.data;

        const scheduledOrders = [];
        const previousOrders = [];

        allOrders.forEach(order => {
          const paymentType = "Online";

          const calculatedTotalAmount = order.totalAmount !== null
              ? order.totalAmount
              : (order.orderItems ? order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0) : 0);
          const totalAmountFormatted = `₹${calculatedTotalAmount.toFixed(2)}`;

          const itemsCount = order.orderItems ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
          const orderedAtTimestamp = order.placedAt || order.updatedAt;
          const orderedAgo = formatOrderTime(orderedAtTimestamp);

          const needsPrescriptionVerification = order.prescriptionUrl && (order.prescriptionVerified === null || order.prescriptionVerified === false);

          const { statusStep, eta, statusText, statusColor } =
              getOrderStatusInfo(order.status, order.prescriptionUrl, order.prescriptionVerified);

          const transformedOrder = {
            // Properties primarily used for the MyOrders card display:
            id: order.id,
            total: totalAmountFormatted,
            itemsCount: itemsCount,
            paymentType: paymentType,
            orderedAgo: orderedAgo,
            eta: eta,
            statusStep: statusStep,
            statusText: statusText,
            statusColor: statusColor,

            // Properties that are *re-including* the original API fields for OrderDetails:
            customer: {
              customerId: order.customer?.customerId,
              name: order.recipientName || order.customer?.name || "N/A",
              age: order.customer?.age,
              address: order.customer?.address,
              image: order.customer?.image,
              user: {
                id: order.customer?.user?.id,
                email: order.recipientEmail || order.customer?.user?.email || "N/A",
                password: order.customer?.user?.password,
                phone: order.recipientPhone || order.customer?.user?.phone || "N/A",
                role: order.customer?.user?.role,
                createdAt: order.customer?.user?.createdAt,
              }
            },
            recipientName: order.recipientName,
            recipientPhone: order.recipientPhone,
            recipientEmail: order.recipientEmail,
            deliveryInstructions: order.deliveryInstructions,
            deliveryAddress: order.deliveryAddress,
            deliveryLat: order.deliveryLat,
            deliveryLng: order.deliveryLng,
            prescriptionUrl: order.prescriptionUrl,
            prescriptionVerified: order.prescriptionVerified,
            totalAmount: calculatedTotalAmount,
            status: order.status,
            placedAt: order.placedAt,
            updatedAt: order.updatedAt,
            orderItems: order.orderItems ? order.orderItems.map(item => ({
              id: item.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              product: {
                productId: item.product?.productId,
                name: item.product?.name || "N/A",
                description: item.product?.description || "No description",
                price: item.product?.price,
                image: item.product?.image || "",
                hoverImage: item.product?.hoverImage,
                quantity: item.product?.quantity,
                prescriptionRequired: item.product?.prescriptionRequired,
                category: item.product?.category,
                inventories: item.product?.inventories,
              }
            })) : [],
            needsPrescriptionVerification: needsPrescriptionVerification,
          };

          if (["PENDING", "NEEDS_VERIFICATION", "VERIFIED", "ASSIGNED", "OUT_FOR_DELIVERY"].includes(order.status)) {
            scheduledOrders.push(transformedOrder);
          } else if (["DELIVERED", "CANCELLED"].includes(order.status)) {
            previousOrders.push(transformedOrder);
          }
        });

        setScheduled(scheduledOrders);
        setPrevious(previousOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axios]);

  const renderOrders = (ordersArray, isPrevious) => {
    if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-48 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-blue-500 border-gray-200"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
          </div>
      );
    }
    if (!ordersArray.length) {
      return (
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            <p className="text-lg mb-2 font-semibold">No orders found.</p>
            <p className="text-sm">Check back later or place a new order to see it here!</p>
          </div>
      );
    }

    // IMPORTANT: Updated statusStep values to match new flow (0 to 5)
    const progressSteps = [
      { name: "Needs Verification", icon: FiFileText, status: "NEEDS_VERIFICATION" },
      { name: "Order Processing", icon: FiClock, status: "PENDING" },
      { name: "Verified", icon: FiCheckCircle, status: "VERIFIED" },
      { name: "Assigned", icon: FiPackage, status: "ASSIGNED" },
      { name: "Out for Delivery", icon: FiTruck, status: "OUT_FOR_DELIVERY" },
      { name: "Delivered", icon: FiCheckCircle, status: "DELIVERED" },
    ];
    const numSegments = progressSteps.length - 1;

    return ordersArray.map(order => {
      const progressLineWidth = order.statusStep === -1
          ? '0%'
          : `calc(${(order.statusStep / numSegments) * 100}% + 0px)`;

      return (
          <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 transform hover:scale-[1.005] transition-transform duration-200 ease-in-out"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
              <div>
                <p className="text-sm font-medium text-gray-500">Order <span className="font-semibold text-gray-700">{order.id}</span></p>
                <p className="text-2xl font-bold text-gray-800">{order.total}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-5 py-2 bg-blue-500 text-white text-base font-medium rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
                >
                  Order Details
                </button>
                {/* Delete button (only for non-previous orders that are not cancelled) */}
                {!isPrevious && order.statusText !== "Cancelled" && (
                    <button
                        onClick={() => handleDelete(order.id)} // Call handleDelete with order ID
                        className="px-5 py-2 text-red-600 text-base font-medium border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-700 transition duration-200"
                    >
                      Delete Order
                    </button>
                )}
              </div>
            </div>

            {/* Status Pills */}
            <div className="mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full text-white ${order.statusColor}`}>
              {order.statusText}
            </span>
            </div>

            {/* Progress Bar */}
            <div className="relative flex justify-between items-start mb-4 px-2 py-4">
              {/* Background line */}
              <div className="absolute h-1 bg-gray-200 rounded-full" style={{ left: '20px', right: '20px', top: '25px', zIndex: 0 }} />
              {/* Progress line */}
              <div
                  className={`absolute h-1 rounded-full transition-all duration-500 ease-out ${order.statusColor}`}
                  style={{
                    left: '20px',
                    width: progressLineWidth,
                    top: '25px',
                    zIndex: 10,
                  }}
              />
              {progressSteps.map((step, idx) => {
                let isActive = false;
                let circleBgClass = "bg-gray-200"; // Default inactive circle background
                let iconTextColorClass = "text-gray-400"; // Default inactive icon color

                if (order.statusStep !== -1) { // If not cancelled
                  if (idx <= order.statusStep) {
                    isActive = true;
                    // Apply the order's current status color class for active/completed circles
                    circleBgClass = order.statusColor;
                    iconTextColorClass = "text-white"; // Icons turn white when active/completed
                  }
                }

                return (
                    <div key={idx} className="flex flex-col items-center flex-1 z-20">
                      <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-300 ease-in-out ${circleBgClass}`}
                          style={{
                            position: 'relative',
                            top: '-10px', // Adjust to center the circle on the line
                          }}
                      >
                        <step.icon className={`h-6 w-6 ${iconTextColorClass}`} /> {/* Applied iconTextColorClass here */}
                      </div>
                      <p
                          className={`text-xs mt-2 text-center${
                              isActive && order.statusStep !== -1 ? "text-gray-800 font-medium" : "text-gray-500"
                          }`}
                      >
                        {step.name}
                      </p>
                    </div>
                );
              })}
            </div>

            {/* Summary line */}
            <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mt-5 pt-4 border-t border-gray-100 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{order.itemsCount} items</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium text-gray-700">{order.paymentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Ordered <span className="font-medium text-gray-700">{order.orderedAgo}</span></span>
                <span className="text-gray-400">•</span>
                <span className="font-medium text-gray-700">{order.eta}</span>
              </div>
            </div>
          </div>
      );
    });
  };

  return (
      <>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Orders</h1>

          {/* Tabs */}
          <div className="flex justify-center overflow-x-auto mb-8">
            <div className="inline-flex space-x-10 border-b-2 border-gray-200">
              {tabs.map((tab, idx) => (
                  <button
                      key={idx}
                      onClick={() => {
                        setActiveTab(idx);
                        setSelectedOrder(null); // Close modal when changing tabs
                      }}
                      className={`pb-3 text-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
                          activeTab === idx
                              ? "text-blue-600 border-b-3 border-blue-600"
                              : "text-gray-600 hover:text-gray-800"
                      }`}
                  >
                    {tab} <span className="text-gray-400 font-normal ml-1">(
                    {idx === 0 ? scheduled.length : previous.length}
                    )</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 0 && renderOrders(scheduled, false)}
          {activeTab === 1 && renderOrders(previous, true)}
        </div>

        {/* Order Details Modal - Conditionally rendered */}
        {selectedOrder && (
            <OrderDetails
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        )}
      </>
  );
}