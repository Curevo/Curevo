// CustomerDashboard.jsx
import React, { useState } from "react";
import Sidebar from "./OrderSidebar";        
import AccountSettings from "./CustomerProfile";
import MyOrders from "./MyOrders";
import AppointmentList from "./Appointment";

export default function CustomerDashboard() {
  // which view the sidebar has selected
  const [view, setView] = useState("Account");

  // render the main content based on `view`
  const renderContent = () => {
    switch (view) {
      case "Account":
        return <AccountSettings />;
      case "My Orders":
        return <MyOrders />;
      case "Appointment":
        return <AppointmentList />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white shadow-lg">
        {/* Pass setView so sidebar buttons can change view */}
        <Sidebar onChangeView={setView} activeView={view} />
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 bg-gray-50 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
