import React from 'react'
import PrescriptionOrdersSection from '../Components/OrderManagement/PrescriptionOrdersSection'
import Sidebar from '../Components/AdminSidebar'

const OrderManageAdmin = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar - 20% width */}
        <div className="w-0 md:w-1/5">
            <Sidebar/>
        </div>

        {/* Main Content - 80% width */}
        <div className="w-full md:w-4/5">
            <PrescriptionOrdersSection/>
        </div>
        </div>
    )
}

export default OrderManageAdmin