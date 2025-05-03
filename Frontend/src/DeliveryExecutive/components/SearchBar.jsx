import React, { useRef, useEffect } from "react";
import "../Delivery.css"

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
    <div ref={ref} className="searchbar-container">
      <svg
        className="searchbar-icon"
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
        className="searchbar-input"
        placeholder="Search..."
        autoFocus
      />
    </div>
  );
}
