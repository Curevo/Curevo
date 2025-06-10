// CustomerDashboard.jsx
import React, { useState } from "react";
import Sidebar from "./OrderSidebar"; 
import UserProfile from "../pages/UserProfile";
import MyOrders from "./MyOrders";
import AppointmentList from "./Appointment";

export default function CustomerDashboard() {
  const [view, setView] = useState("Account");
  return (
    <div className="flex min-h-screen">
      {/* Sidebar always mounted; desktop version hidden via classNameWrapper */}
      <Sidebar
        classNameWrapper="hidden md:block md:w-1/5 min-w-[200px]"
        onChangeView={setView}
        activeView={view}
      />

      {/* Main content grows to fill remaining width */}
      <main className="flex-1 pt-12 md:pt-8 md:ml-64 overflow-y-auto">
        {view === "Account" && <UserProfile />}
        {view === "My Orders" && <MyOrders />}
        {view === "Appointment" && <AppointmentList />}
      </main>
    </div>
  );
}