// DeliverySidebar.jsx
import React, { useState } from "react";
import { FaChartPie, FaClipboardList } from "react-icons/fa";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

export default function DeliverySidebar({ classNameWrapper, activeView, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { label: "Overview", icon: <FaChartPie />, view: "overview" },
    { label: "Orders",   icon: <FaClipboardList />, view: "orders"   },
  ];

  const handleNavClick = (view) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* ── 1) SLIM MOBILE HEADER (visible only on small screens) ── */}
      <div
        className="
          md:hidden
          fixed top-0 left-0 right-0 h-12
          bg-white shadow-md
          flex items-center justify-between
          px-4 z-50
        "
      >
        <button onClick={() => setIsOpen(true)} className="p-1">
          <FiMenu size={24} />
        </button>
        <h1 className="text-lg font-bold text-green-600">Delivery</h1>
        {/* invisible placeholder to balance flex */}
        <div style={{ width: 24, height: 24 }} />
      </div>

      {/* ── 2) MOBILE OFF-CANVAS SIDEBAR ── */}
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`
          fixed top-0 bottom-0 left-0
          w-3/4 max-w-xs
          bg-white p-6 shadow-lg
          flex flex-col
          transition-transform duration-300 ease-in-out
          z-50
          md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-green-600">Delivery</h1>
          <button onClick={() => setIsOpen(false)} className="p-1">
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col space-y-4">
          {items.map(({ label, icon, view }) => (
            <button
              key={view}
              onClick={() => handleNavClick(view)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                ${activeView === view
                  ? "bg-green-100 text-green-600"
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
          onClick={() => {
            // TODO: logout logic
            setIsOpen(false);
          }}
          className="
            mt-auto
            flex items-center gap-3 text-red-500 hover:bg-red-100
            px-4 py-3 rounded-lg transition w-full
          "
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* ── 3) DESKTOP SIDEBAR ── */}
      <aside className={`${classNameWrapper} h-screen bg-white shadow-lg hidden md:block`}>
        <div className="flex flex-col h-full p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-6">Delivery</h1>
          <nav className="flex-1 space-y-4">
            {items.map(({ label, icon, view }) => (
              <button
                key={view}
                onClick={() => setView(view)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                  ${activeView === view
                    ? "bg-green-100 text-green-600"
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
            onClick={() => {
              // TODO: logout logic
            }}
            className="
              mt-auto
              flex items-center gap-3 text-red-500 hover:bg-red-100
              px-4 py-3 rounded-lg transition w-full
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
