import React, { useState } from "react";
import { FaUser, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { FiMenu, FiX, FiLogOut }               from "react-icons/fi";

export default function OrderSidebar({
  classNameWrapper = "",
  onChangeView,
  activeView
}) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { label: "Account",     icon: <FaUser />,         view: "Account"     },
    { label: "My Orders",   icon: <FaShoppingCart />, view: "My Orders"   },
    { label: "Appointment", icon: <FaCalendarAlt />,  view: "Appointment" },
  ];

  return (
    <>
      {/* ── 1) SLIM MOBILE HEADER ── */}
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
        <h1 className="text-lg font-bold text-blue-600">Curevo</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* ── 2) MOBILE SLIDE-DOWN ── */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40">
          <div className="absolute top-12 left-0 right-0 bg-white p-6 space-y-6 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-600">Curevo</h2>
              <button onClick={() => setIsOpen(false)} className="p-1">
                <FiX size={24} />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {items.map(({ label, icon, view }) => (
                <button
                  key={view}
                  onClick={() => { onChangeView(view); setIsOpen(false); }}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-lg transition
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
              onClick={() => {/* logout */}}
              className="flex items-center gap-3 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg transition"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 3) DESKTOP SIDEBAR ── */}
      <aside className={classNameWrapper}>
        <div className="flex flex-col h-full p-6 bg-white shadow">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">Curevo</h2>
          <nav className="flex-1 space-y-4">
            {items.map(({ label, icon, view }) => (
              <button
                key={view}
                onClick={() => onChangeView(view)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg transition
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
            onClick={() => {/* logout */}}
            className="mt-8 flex items-center gap-3 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
