import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { FiMenu, FiX, FiLogOut }               from "react-icons/fi";
import { MdOutlineHelpOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CurevoLogo from "/Assets/Curevo-logo.png";

export default function DashboardSidebar({
                                             classNameWrapper = "hidden md:block w-64 fixed top-0 bottom-0 left-0",
                                             activeView
                                         }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const items = [
        { label: "Account",     icon: <FaUser />,         view: "Account",     path: "/my-profile"      },
        { label: "My Orders",   icon: <FaShoppingCart />, view: "My Orders",   path: "/my-orders"       },
        { label: "Appointment", icon: <FaCalendarAlt />,  view: "Appointment", path: "/my-appointments" },
        { label: "Help", icon: <MdOutlineHelpOutline />,  view: "Help", path: "/help" },
    ];

    return (
        <>
            {/* ── 1) SLIM MOBILE HEADER (shown only on small screens) ── */}
            <div
                className="
                md:hidden
                fixed top-0 left-0 right-0 h-12
                bg-white shadow-md
                flex items-center justify-between
                px-4 z-40"
            >
                <button onClick={() => setIsOpen(true)} className="p-1">
                    <FiMenu size={24} />
                </button>
                <img src={CurevoLogo} alt="Curevo Logo" className="h-8" onClick={() => navigate('/')}/>
                <div className="w-6 h-6" />
            </div>

            {/* ── 2) MOBILE SIDEBAR (Off-canvas / Drawer) ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div
                className={`
                fixed top-0 bottom-0 left-0
                w-3/4 max-w-xs
                bg-white p-6 shadow-lg
                flex flex-col
                transition-transform duration-300 ease-in-out
                z-50
                md:hidden
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            >
                <div className="flex justify-between items-center mb-6">
                    <img src={CurevoLogo} alt="Curevo Logo" className="h-8" />
                    <button onClick={() => setIsOpen(false)} className="p-1">
                        <FiX size={24} />
                    </button>
                </div>

                <nav className="flex-1 flex flex-col space-y-4">
                    {items.map(({ label, icon, view, path }) => (
                        <button
                            key={view}
                            onClick={() => { navigate(path); setIsOpen(false); }}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                w-full                           // <-- ADDED: Make button full width
                ${activeView === view
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }
              `}
                        >
                            <span className="text-lg">{icon}</span>
                            <span className="font-medium">{label}</span>
                        </button>
                    ))}
                </nav>
                <button
                    onClick={() => {/* Implement logout logic here */}}
                    className="
            mt-auto
            flex items-center gap-3 text-red-500 hover:bg-red-100
            px-4 py-3 rounded-lg transition
            w-full                           // <-- ADDED: Make logout button full width too
          "
                >
                    <FiLogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* ── 3) DESKTOP SIDEBAR (visible only on large screens) ── */}
            <aside className={`
        ${classNameWrapper}
        h-screen
        hidden md:block
      `}>
                <div className="flex flex-col h-full p-6 bg-white shadow-lg">
                    <img src={CurevoLogo} alt="Curevo Logo" className="h-8 w-auto md:h-12 mb-6" />

                    <nav className="flex-1 space-y-4">
                        {items.map(({ label, icon, view, path }) => (
                            <button
                                key={view}
                                onClick={() => navigate(path)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition
                  w-full                           // <-- ADDED: Make button full width
                  ${activeView === view
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }
                `}
                            >
                                <span className="text-lg">{icon}</span>
                                <span className="font-medium">{label}</span>
                            </button>
                        ))}
                    </nav>
                    <button
                        onClick={() => {window.location.href = '/logout'}}
                        className="
              mt-auto
              flex items-center gap-3 text-red-500 hover:bg-red-100
              px-4 py-3 rounded-lg transition
              w-full                           // <-- ADDED: Make logout button full width too
            "
                    >
                        <FiLogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}