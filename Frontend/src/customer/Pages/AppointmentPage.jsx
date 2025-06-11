// src/pages/AppointmentPage.jsx
import React from 'react';
import OrderSidebar from '../components/DashboardSidebar.jsx'; // Path to your sidebar
import Appointment from '../components/Appointment';

export default function AppointmentPage() {
    // This tells the sidebar which item should be highlighted
    const currentView = "Appointment";

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Your responsive sidebar. No onChangeView prop needed here. */}
            <OrderSidebar
                activeView={currentView}
            />

            <main className="flex-1 p-6 md:ml-64 relative">
                {/* This div handles top spacing on mobile to clear the fixed mobile header */}
                <div className="mt-12 md:mt-0">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Appointments</h1>
                    <Appointment /> {/* Your Appointment component goes here */}
                </div>
            </main>
        </div>
    );
}