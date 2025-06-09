// SearchBar.jsx
import React, { useRef, useEffect } from "react";

export default function SearchBar({ onClose }) {
  const ref = useRef(null);

  // Close if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="flex items-center w-[280px] px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
    >
      <svg
        className="flex-shrink-0 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path
          fill="#64748b"
          d="M10 2a8 8 0 015.29 13.71l4 4a1 1 0 01-1.42 1.42l-4-4A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z"
        />
      </svg>
      <input
        type="text"
        className="flex-1 border-none outline-none text-sm text-[#1e293b] placeholder-[#94a3b8]"
        placeholder="Search..."
        autoFocus
      />
    </div>
  );
}
