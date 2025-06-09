// What your friend needs to do
// Replace /api/delivery/profile with whatever endpoint returns the driver’s profile (e.g. "/api/driver/me").

// Adjust the field names inside .then(res => { … }) if your JSON uses different keys (e.g. res.data.username or res.data.avatar).

// Ensure CORS/Authentication is properly configured on that endpoint. For example, if it needs a JWT in the headers, your friend can add:
// axios.get("/api/driver/me", {
//   headers: { Authorization: `Bearer ${token}` }
// })
// inside the same useEffect.




import React, { useState, useRef, useEffect } from "react";
import axios from '@/Config/axiosConfig.js';
import { FiBell, FiMessageSquare, FiSearch } from "react-icons/fi";
import ExecDropdown from "./ExecDropdown";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";

function Header({ setView }) {
  // 1) Local state for toggling popovers
  const [execOpen, setExecOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // 2) Local state for user info (name + avatar URL)
  const [userName, setUserName] = useState("Loading...");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 3) Refs for detecting outside clicks
  const avatarRef = useRef(null);
  const execRef = useRef(null);
  const bellRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // 4) Fetch user info (name + avatar) via Axios when Header mounts
  useEffect(() => {
    // NOTE: Replace "/api/delivery/profile" with your actual endpoint.
    // Expected response shape (example):
    //    { name: "James T.", avatarUrl: "https://example.com/james.jpg" }
    axios
      .get("/api/delivery/profile")
      .then((res) => {
        const data = res.data;
        // Adjust these properties to match your API’s response
        setUserName(data.name || "Unknown User");
        setAvatarUrl(data.avatarUrl || "https://i.pravatar.cc/40"); 
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setUserName("User");
        setAvatarUrl("https://i.pravatar.cc/40"); 
      });
  }, []); // Empty dependency array → runs once on mount

  // 5) Close any open popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      // Exec dropdown
      if (
        execOpen &&
        execRef.current &&
        !execRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setExecOpen(false);
      }

      // Notification panel
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }

      // Search bar
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [execOpen, notifOpen, searchOpen]);

  return (
    <div className="flex justify-between items-center px-6 py-5 bg-[#d1e0e9] rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] mb-5 relative">
      {/* 6) Display fetched name here */}
      <h1 className="text-[24px] font-semibold text-[#0f172a]">
        Good morning, {userName}!
      </h1>

      {/* 7) Icons: Search, Message, Bell, Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          ref={searchRef}
          onClick={() => {
            setSearchOpen((o) => !o);
            setExecOpen(false);
            setNotifOpen(false);
          }}
          className="relative inline-block"
        >
          <FiSearch className="w-5 h-5 text-[#4b5563] cursor-pointer transition-colors duration-200 hover:text-[#1f2937]" />
          {searchOpen && (
            <div className="absolute top-full mt-2 right-0 z-50">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Message Icon (no popover) */}
        <FiMessageSquare className="w-5 h-5 text-[#4b5563]" />

        {/* Notification Bell */}
        <div
          ref={bellRef}
          onClick={() => {
            setNotifOpen((o) => !o);
            setExecOpen(false);
            setSearchOpen(false);
          }}
          className="relative inline-block"
        >
          <FiBell className="w-5 h-5 text-[#4b5563] cursor-pointer transition-colors duration-200 hover:text-[#1f2937]" />
          {notifOpen && (
            <div className="absolute top-full mt-2 right-0 z-50" ref={notifRef}>
              <NotificationPanel />
            </div>
          )}
        </div>

        {/* Avatar + ExecDropdown */}
        <div
          ref={avatarRef}
          onClick={() => {
            setExecOpen((o) => !o);
            setNotifOpen(false);
            setSearchOpen(false);
          }}
          className="relative inline-block"
        >
          <img
            src={avatarUrl || "https://i.pravatar.cc/40"}
            alt={userName}
            className="w-9 h-9 rounded-full border-2 border-[#d1d5db] cursor-pointer object-cover"
          />
          {execOpen && (
            <div className="absolute top-full mt-2 right-0 z-50" ref={execRef}>
              <ExecDropdown setView={setView} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
