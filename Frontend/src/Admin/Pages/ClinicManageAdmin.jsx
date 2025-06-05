import React from 'react'
import Sidebar from '../Components/AdminSidebar'
import ClinicManagement from '../Components/ClinicManagement'


const ClinicManageAdmin = () => {
    return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - 20% width */}
    <div className="w-0 md:w-1/5">
        <Sidebar/>
    </div>

    {/* Main Content - 80% width */}
    <div className="w-full md:w-4/5">
        <ClinicManagement />
    </div>
    </div>
    )
}

export default ClinicManageAdmin