// DeliveryPage.jsx
import React, { useState } from "react";
import DeliverySidebar from "./Components/DeliverySidebar";   // your sidebar component
import DeliveryMainContent from "./Components/DeliveryMainContent"; // we'll create this

export default function DeliveryPage() {
  // shared view state: "overview", "orders", or "delivered"
  const [view, setView] = useState("overview");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar always mounted */}
      <DeliverySidebar
        classNameWrapper="hidden md:block md:w-1/5 min-w-[200px]"
        activeView={view}
        setView={setView}
      />

      {/* Main content grows to fill remaining width */}
      <main className="flex-1 md:ml-0 p-4 pt-16 md:pt-4 overflow-y-auto bg-gray-50">
        <DeliveryMainContent view={view} setView={setView} />
      </main>
    </div>
  );
}
