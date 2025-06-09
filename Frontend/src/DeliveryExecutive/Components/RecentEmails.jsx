// Replace the URL https://your-api.com/api/recent-deliveries with their real API.

// deliveryGuyId can be dynamically passed from login context, if needed.

// Make sure the returned JSON contains a deliveries array.


import React, { useEffect, useState } from "react";
import axios from '@/Config/axiosConfig.js';

export default function RecentEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDeliveries = async () => {
      try {
        const res = await axios.get("https://your-api.com/api/recent-deliveries", {
          params: {
            deliveryGuyId: "12345", // Optional: pass user-specific data
          },
        });
        setEmails(res.data.deliveries); // assuming response is { deliveries: [...] }
      } catch (error) {
        console.error("Error fetching recent deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDeliveries();
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-[#d1e0e9] p-6 rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
      <h3 className="text-lg font-semibold text-[#1e293b]">Recent Deliveries</h3>

      {loading ? (
        <div className="text-sm text-gray-600">Loading recent deliveries...</div>
      ) : emails.length === 0 ? (
        <div className="text-sm text-gray-600">No recent deliveries found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {emails.map((email, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#cbd5e1] rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold text-[#334155]">
                  {email.orderId?.replace("#", "") || index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#1e293b]">
                    {email.orderId}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    {email.subject}
                  </span>
                </div>
              </div>
              <div className="text-sm text-[#94a3b8]">{email.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
