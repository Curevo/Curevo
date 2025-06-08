import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    UserPen,
    Pill,
    Mails,
    CalendarHeart,
    Store,
    Hospital,
    HelpCircle,
    LogOut,
    Menu,
    X
} from "lucide-react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: <UserPen size={20} />, label: "Doctor Profiles", path: "/admin/home" },
        { icon: <Pill size={20} />, label: "Products", path: "/admin/products" },
        { icon: <CalendarHeart size={20} />, label: "Appointments", path: "/admin/appointments" },
        { icon: <Store size={20} />, label: "Store Management", path: "/admin/store" },
        { icon: <Hospital size={20} />, label: "Clinic Management", path: "/admin/clinics" },
        { icon: <HelpCircle size={20} />, label: "Help", path: "/admin/help" },
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setIsOpen(false); // Close sidebar on mobile after navigation
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <>
        {/* Mobile Menu Toggle Button */}
        {!isOpen && (
            <button
            className="md:hidden fixed top-6 left-6 z-50 bg-white p-2 rounded-full shadow-md"
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
            <div className="flex flex-col justify-center">
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center mb-8 md:hidden">
                <img src="/Curevo-logo.png" alt="Logo" className="h-10" />
                <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
                >
                <X size={24} />
                </button>
            </div>

            {/* Desktop Logo */}
            <div className="hidden md:block text-2xl font-bold text-blue-600 mb-10">
                <img src="/Curevo-logo.png" alt="Logo" className="h-10" />
            </div>

            {/* Navigation Items */}
            <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleNavClick(item.path)}
                    isActive={location.pathname === item.path}
                />
                ))}
            </nav>
            </div>

            {/* Logout Button */}
            <button
            className="flex items-center bg-gray-200 gap-2 text-red-500 hover:bg-red-100 px-3 py-2 rounded-md transition"
            onClick={handleLogout}
            >
            <LogOut size={20} /> Logout
            </button>
        </div>
        </>
    );
};

const NavItem = ({ icon, label, onClick, isActive }) => (
    <button
        className={`flex items-center gap-3 ${
        isActive
            ? "bg-blue-100 text-blue-600 font-medium"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } px-3 py-5 rounded-md transition w-full text-left`}
        onClick={onClick}
    >
        <span className={`${isActive ? "text-blue-600" : "text-gray-600"}`}>
        {icon}
        </span>
        <span>{label}</span>
    </button>
);

export default Sidebar;