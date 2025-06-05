import React, { useState } from "react";
import Sidebar from "../Components/AdminSidebar";
import DoctorProfiles from "../Components/DoctorProfiles";

const AdminLanding = () => {
  const [activeTab, setActiveTab] = useState("Doctor Profiles");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - 20% width */}
      <div className="w-0 md:w-1/5">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content - 80% width */}
      <div className="w-full md:w-4/5">
        {activeTab === "Doctor Profiles" && <DoctorProfiles />}
        {/* Other sections will be added here */}
      </div>
    </div>
  );
};

export default AdminLanding;