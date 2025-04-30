import React, { useState } from "react";
import {
    Home,
    User,
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: <Home size={20} />, label: "Home" },
        { icon: <User size={20} />, label: "Profile" },
        { icon: <Settings size={20} />, label: "Settings" },
        { icon: <Bell size={20} />, label: "Notifications" },
        { icon: <HelpCircle size={20} />, label: "Help" },
    ];

    return (
        <>
        {/* Menu Toggle Button (only for mobile) */}
        {!isOpen && (
            <button
            className="md:hidden fixed top-8 left-6 z-50 bg-white p-2 rounded-full shadow-md"
            onClick={() => setIsOpen(true)}
            >
            <Menu size={24} />
            </button>
        )}

        {/* Sidebar */}
        <div
            className={`fixed top-0 left-0 h-full bg-white shadow-md rounded-r-2xl p-10 flex flex-col justify-between z-40 transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-[70%] sm:w-[50%] md:w-[20%]`}
        >
            <div>
            {/* Close button (only for mobile) */}
            <div className="flex justify-between items-center mb-8 md:hidden">
                <div className="text-2xl font-bold text-blue-600">MyApp</div>
                <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
                >
                <X size={24} />
                </button>
            </div>

            {/* Logo (for desktop only) */}
            <div className="hidden md:block text-2xl font-bold text-blue-600 mb-10">
                MyApp
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                <NavItem key={index} icon={item.icon} label={item.label} />
                ))}
            </nav>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-2 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md transition">
            <LogOut size={20} /> Logout
            </button>
        </div>
        </>
    );
};

const NavItem = ({ icon, label }) => (
    <button className="flex items-center gap-3 text-gray-700 hover:bg-gray-300 px-3 py-2 rounded-md transition">
        {icon} {label}
    </button>
);

export default Sidebar;
