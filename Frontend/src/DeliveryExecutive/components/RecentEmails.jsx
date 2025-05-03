import React from "react";
import "../Delivery.css"
const emails = [
  {
    sender: "Order #4532",
    subject: "3 items delivered",
    time: "Today, 10:30 AM",
  },
  {
    sender: "Order #4529",
    subject: "5 items delivered",
    time: "Today, 3:45 PM",
  },
  {
    sender: "Order #4527",
    subject: "2 items delivered",
    time: "Today, 5:00 PM",
  },
];

export default function RecentEmails() {
  return (
    <div className="email-section">
      <h3 className="section-header">Recent Deliveries</h3>
      <div className="email-list">
        {emails.map((email, index) => (
          <div key={index} className="email-item">
            <div className="email-left">
              <div className="email-avatar" />
              <div className="email-details">
                <span className="email-sender">{email.sender}</span>
                <span className="email-subject">{email.subject}</span>
              </div>
            </div>
            <div className="email-time">{email.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
