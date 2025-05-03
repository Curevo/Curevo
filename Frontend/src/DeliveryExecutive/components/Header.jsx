import React, { useState, useRef, useEffect } from "react";
import "../Delivery.css"
import { FiBell, FiMessageSquare, FiSearch } from "react-icons/fi";
import ExecDropdown from "./ExecDropdown";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";

function Header({ setView }) {
  const [execOpen,  setExecOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const avatarRef = useRef(null);
  const execRef   = useRef(null);
  const bellRef   = useRef(null);
  const notifRef  = useRef(null);
  const searchRef = useRef(null);

  // close any open popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (execOpen &&
          execRef.current &&
          !execRef.current.contains(e.target) &&
          avatarRef.current &&
          !avatarRef.current.contains(e.target)
      ) setExecOpen(false);

      if (notifOpen &&
          notifRef.current &&
          !notifRef.current.contains(e.target) &&
          bellRef.current &&
          !bellRef.current.contains(e.target)
      ) setNotifOpen(false);

      if (searchOpen &&
          searchRef.current &&
          !searchRef.current.contains(e.target)
      ) setSearchOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [execOpen, notifOpen, searchOpen]);

  return (
    <div className="header-container" style={{ position: "relative" }}>
      <h1 className="header-title">Good morning, James!</h1>
      <div className="header-icons">
        {/* Search Icon */}
        <div
          ref={searchRef}
          onClick={() => { setSearchOpen(o => !o); setExecOpen(false); setNotifOpen(false); }}
          style={{ position: "relative", display: "inline-block" }}
        >
          <FiSearch className="header-icon" style={{ cursor: "pointer" }} />
          {searchOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                zIndex: 1000
              }}
            >
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* Message Icon (no popover) */}
        <FiMessageSquare className="header-icon" />

        {/* Bell Icon + NotificationPanel */}
        <div
          ref={bellRef}
          onClick={() => { setNotifOpen(o => !o); setExecOpen(false); setSearchOpen(false); }}
          style={{ position: "relative", display: "inline-block" }}
        >
          <FiBell className="header-icon" style={{ cursor: "pointer" }} />
          {notifOpen && (
            <div
              ref={notifRef}
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                zIndex: 1000,
              }}
            >
              <NotificationPanel />
            </div>
          )}
        </div>

        {/* Avatar + ExecDropdown */}
        <div
          ref={avatarRef}
          onClick={() => { setExecOpen(o => !o); setNotifOpen(false); setSearchOpen(false); }}
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="header-avatar"
            style={{ cursor: "pointer" }}
          />
          {execOpen && (
            <div
              ref={execRef}
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                zIndex: 1000,
              }}
            >
              <ExecDropdown setView={setView} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
