// src/pages/OrderPage.jsx
import React from 'react';
import OrderSidebar from '../Components/DashboardSidebar'; // Path to your sidebar
import MyOrders from '../Components/MyOrders';

export default function OrderPage() {
    const currentView = "My Orders";

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* The Order Sidebar component. No onChangeView prop needed here. */}
            <OrderSidebar
                activeView={currentView}
            />
            <main className="flex-1 p-6 md:ml-64 relative">
                {/* This div handles top spacing on mobile to push content below the fixed mobile header */}
                <div className="mt-12 md:mt-0">
                    <MyOrders /> {/* MyOrders is now correctly placed within the responsive main area */}
                </div>
            </main>
        </div>
    );
}