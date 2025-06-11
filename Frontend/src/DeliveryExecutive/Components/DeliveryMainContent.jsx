// DeliveryMainContent.jsx
import React, { useEffect, useState } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';

import Header from "./Header";
import SummaryCards from "./SummaryCards";
import ClientStats from "./ClientStats";
import PendingOrders from "./PendingOrders";
import RecentEmails from "./RecentEmails";
import FormationStatus from "./FormationStatus";
import TodoList from "./TodoList";
import DeliveryStatusCard from "./DeliveryStatusCard";
import DeliveredHeader from "./DeliveredHeader";
import Orders from "./DeliveredOrders"; 

export default function DeliveryMainContent({ view, setView }) {
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
    const axios = useAxiosInstance();

  useEffect(() => {
    let cancelled = false;
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          "https://your-api.com/api/delivery-status",
          { params: { deliveryGuyId: "12345" } }
        );
        if (!cancelled) {
          setDeliveryAvailable(res.data.status === "available");
        }
      } catch (err) {
        console.error("Error fetching initial availability:", err);
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    };
    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1">
      {/* Header may contain navigation controls or a back button, can pass setView if needed */}
      <Header setView={setView} />

      {view === "orders" ? (
        // Orders page
        <div className="mt-6">
          <Orders />
        </div>
      ) : view === "delivered" ? (
        // Delivered section
        <div className="mt-6 flex flex-col gap-6 items-start">
          <DeliveredHeader />
          <DeliveredTable />
        </div>
      ) : (
        // Overview dashboard
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
          {/* LEFT COLUMN: summary, stats, pending orders, recent emails */}
          <div className="flex flex-col gap-6">
            {/* Summary cards row: on large screens, 4 columns; smaller screens collapse */}
            <section className="grid auto-rows-min grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryCards />
            </section>

            {/* Stats & Pending Orders, stacked vertically on mobile, side-by-side on md+ if desired */}
            <section className="flex flex-col md:flex-row gap-2.5">
              <ClientStats />
              <PendingOrders />
            </section>

            {/* Recent Emails */}
            <section>
              <RecentEmails />
            </section>
          </div>

          {/* RIGHT COLUMN: availability toggle, todo list, etc. */}
          <section className="flex flex-col gap-6">
            {!loadingAvailability && deliveryAvailable && <FormationStatus />}
            <DeliveryStatusCard
              available={deliveryAvailable}
              setAvailable={setDeliveryAvailable}
              loading={loadingAvailability}
            />
            <TodoList />
          </section>
        </div>
      )}
    </div>
  );
}
