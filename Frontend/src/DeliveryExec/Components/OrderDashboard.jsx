import { useState, useEffect } from 'react';
import {
    fetchDashboardData,
    updateReadyStatus,
    updateOrderStatus
} from './api';

const OrderDashboard = () => {
    // State for the dashboard data
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the buttons
    const [readyStatus, setReadyStatus] = useState("I'm Ready");
    const [orderStatus, setOrderStatus] = useState("No more Orders Today");
    
    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
        try {
            const data = await fetchDashboardData();
            setDashboardData(data);
            
            // Set initial button states from backend
            setReadyStatus(data.readyStatus ? "Call it for a day" : "I'm Ready");
            setOrderStatus(data.acceptingOrders ? "No more Orders Today" : "Not receiving Orders");
            
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        };
        
        loadData();
    }, []);

    // Toggle ready status
    const toggleReadyStatus = async () => {
        try {
        const newStatus = readyStatus === "I'm Ready";
        await updateReadyStatus(newStatus);
        setReadyStatus(newStatus ? "Call it for a day" : "I'm Ready");
        } catch (err) {
        setError(err.message);
        }
    };
    
    // Toggle order status
    const toggleOrderStatus = async () => {
        try {
        const newStatus = orderStatus === "No more Orders Today";
        await updateOrderStatus(newStatus);
        setOrderStatus(newStatus ? "Not receiving Orders" : "No more Orders Today");
        } catch (err) {
        setError(err.message);
        }
    };

    if (loading) {
        return (
        <div className="w-[80%] p-4 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="w-[80%] p-4 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
            </div>
        </div>
        );
    }

    return (
        <div className="w-[80%] p-4 bg-gray-50 min-h-screen">
        {/* Error message display */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            </div>
        )}
        
        {/* Upper Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-gray-600 font-medium">Orders Completed</h3>
                <p className="text-3xl font-bold text-blue-600">
                {dashboardData?.ordersCompleted || 0}
                </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-gray-600 font-medium">Total Earnings</h3>
                <p className="text-3xl font-bold text-green-600">
                ${dashboardData?.totalEarnings?.toFixed(2) || '0.00'}
                </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-gray-600 font-medium">Active Days</h3>
                <p className="text-3xl font-bold text-purple-600">
                {dashboardData?.activeDays || 0}
                </p>
            </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
            <button 
                onClick={toggleReadyStatus}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium ${readyStatus === "I'm Ready" ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-colors disabled:opacity-50`}
            >
                {loading ? 'Updating...' : readyStatus}
            </button>
            
            <button 
                onClick={toggleOrderStatus}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium ${orderStatus === "No more Orders Today" ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors disabled:opacity-50`}
            >
                {loading ? 'Updating...' : orderStatus}
            </button>
            </div>
        </div>
        
        {/* Lower Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Orders</h2>
            
            {dashboardData?.orders?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
                No current orders available
            </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Order Card */}
                {dashboardData?.activeOrder && (
                <OrderCard 
                    order={dashboardData.activeOrder} 
                    type="active" 
                />
                )}
                
                {/* Pending Orders */}
                {dashboardData?.pendingOrders?.map((order, index) => (
                <OrderCard 
                    key={order.id} 
                    order={order} 
                    type="pending" 
                    index={index + 1}
                />
                ))}
            </div>
            )}
        </div>
        </div>
    );
    };

    // Separate OrderCard component for better organization
    const OrderCard = ({ order, type, index }) => {
    const cardStyles = {
        active: {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        button: 'bg-blue-500 hover:bg-blue-600'
        },
        pending: {
        border: 'border-yellow-200',
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        button: 'bg-yellow-500 hover:bg-yellow-600'
        }
    };

    const title = type === 'active' 
        ? 'Active Order' 
        : `Pending Order ${index}`;

    return (
        <div className={`border ${cardStyles[type].border} rounded-lg p-4 ${cardStyles[type].bg}`}>
        <h3 className={`text-lg font-semibold ${cardStyles[type].text} mb-2`}>{title}</h3>
        <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Order ID:</span> {order.id}
        </p>
        <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Address:</span> {order.address}
        </p>
        
        <button className={`w-full mb-4 ${cardStyles[type].button} text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call Customer
        </button>
        
        <div className="bg-white p-3 rounded-lg">
            <p className="text-xl font-bold text-gray-800 mb-2">
            ${order.price?.toFixed(2) || '0.00'}
            </p>
            <div className="text-sm text-gray-600">
            <p>Delivery Fee: ${order.breakdown?.deliveryFee?.toFixed(2) || '0.00'}</p>
            <p>Tip: ${order.breakdown?.tip?.toFixed(2) || '0.00'}</p>
            <p>Bonus: ${order.breakdown?.bonus?.toFixed(2) || '0.00'}</p>
            </div>
        </div>
        </div>
    );
};

export default OrderDashboard;