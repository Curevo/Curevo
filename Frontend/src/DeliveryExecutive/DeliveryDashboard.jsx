import './Delivery.css';
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header  from "./components/Header";

// Dashboard
import SummaryCards   from "./components/SummaryCards";
import ClientStats    from "./components/ClientStats";
import RevenueChart   from "./components/RevenueChart";
import RecentEmails   from "./components/RecentEmails";
import FormationStatus from "./components/FormationStatus";
import TodoList       from "./components/TodoList";

// Delivered section
import DeliveredHeader from "./components/DeliveredHeader";
import DeliveredTable  from "./components/DeliveredTable";

function DeliveryDashboard() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="app-container">
      <aside className="sidebar-placeholder">
        <Sidebar />
      </aside>

      <main className="main-content">
        {/* Header always shown, with access to setView */}
        <Header setView={setView} />

        {view === "delivered" ? (
          <div className="delivered-section">
            <DeliveredHeader />
            <DeliveredTable />
          </div>
        ) : (
          <div className="dashboard-grid">
            <section className="summary-area">
              <SummaryCards />
            </section>
            <section className="formation-area">
              <FormationStatus />
              <TodoList />
            </section>
            <section className="stats-area">
              <ClientStats />
              <RevenueChart />
            </section>
            <section className="emails-area">
              <RecentEmails />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DeliveryDashboard;
