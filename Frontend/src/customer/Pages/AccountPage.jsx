// src/pages/AccountPage.jsx
import React from 'react';
import OrderSidebar from '../Components/DashboardSidebar'; // Path to your sidebar
import UserProfile from '../Components/UserProfile';

export default function AccountPage() {
    // This highlights 'Account' in your sidebar
    const currentView = "Account";

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Your responsive sidebar component. No onChangeView prop needed here. */}
            <OrderSidebar
                activeView={currentView}
            />

            <main className="flex-1 p-6 md:ml-64 relative">
                {/* This div handles top spacing on mobile to push content below the fixed mobile header */}
                <div className="mt-12 md:mt-0">
                    {/* <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Account Settings</h1> */}
                    <UserProfile />
                </div>
            </main>
        </div>
    );
}