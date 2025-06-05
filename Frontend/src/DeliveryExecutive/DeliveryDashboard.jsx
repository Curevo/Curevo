// DeliveryDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Dashboard
import SummaryCards from "./components/SummaryCards";
import ClientStats from "./components/ClientStats";
import RevenueChart from "./components/PendingOrders";
import RecentEmails from "./components/RecentEmails";
import FormationStatus from "./components/FormationStatus";
import TodoList from "./components/TodoList";
import DeliveryStatusCard from "./components/DeliveryStatusCard";

// Delivered section
import DeliveredHeader from "./components/DeliveredHeader";
import DeliveredTable from "./components/DeliveredTable";

export default function DeliveryDashboard() {
  const [view, setView] = useState("dashboard");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch delivery status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/delivery-status", {
          params: { deliveryGuyId: "12345" },
        });
        setDeliveryAvailable(res.data.status === "available");
      } catch (err) {
        console.error("Error fetching initial availability:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="flex max-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-1/5 min-w-[200px] bg-transparent">
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-scroll">
        <Header setView={setView} />

        {view === "delivered" ? (
          <div className="mt-6 flex flex-col gap-6">
            <DeliveredHeader />
            <DeliveredTable />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_360px] gap-6">
            {/* Summary Cards */}
            <section className="md:col-span-2 flex flex-row gap-2.5">
              <SummaryCards />
            </section>

            {/* Right Column */}
            <section className="md:col-start-3 md:row-start-1 md:row-span-3 flex flex-col gap-6">
              {/* Show only if available */}
              {deliveryAvailable && <FormationStatus />}
              <DeliveryStatusCard
                available={deliveryAvailable}
                setAvailable={setDeliveryAvailable}
                loading={loading}
              />
              <TodoList />
            </section>

            {/* Stats */}
            <section className="md:col-span-2 md:row-start-2 flex md:flex-row flex-col gap-2.5">
              <ClientStats />
              <RevenueChart />
            </section>

            {/* Emails */}
            <section className="md:col-span-2 md:row-start-3">
              <RecentEmails />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
