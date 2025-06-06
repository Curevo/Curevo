import React from 'react'
import Sidebar from '../Components/AdminSidebar'
import ProductDetails from '../Components/ProductDetails'

const ProductManageAdmin = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar - 20% width */}
            <div className="w-0 md:w-1/5">
                <Sidebar/>
            </div>

            {/* Main Content - 80% width */}
            <div className="w-full md:w-4/5">
                <ProductDetails />
            </div>
        </div>
    )
}

export default ProductManageAdmin