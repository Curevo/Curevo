import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from Spring Boot backend
    useEffect(() => {
        const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders/history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT auth
            }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
            setLoading(false);
        }
        };

        fetchOrders();
    }, []);

    const handleCardClick = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return (
        <div className="p-4 w-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-4 w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            </div>
        </div>
        );
    }

    return (
        <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        
        {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
            No order history available
            </div>
        ) : (
            <div className="space-y-3">
            {orders.map((order) => (
                <div 
                key={order.id}
                onClick={() => handleCardClick(order)}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                <div className="font-medium">Order ID: {order.orderId}</div>
                <div>Date: {new Date(order.orderDate).toLocaleDateString()}</div>
                <div>Price: ₹{order.totalAmount}</div>
                <div className="truncate max-w-xs">Location: {order.deliveryAddress}</div>
                </div>
            ))}
            </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>

                <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">Order Information</h3>
                    <p>Order ID: {selectedOrder.orderId}</p>
                    <p>Date: {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                    <p>Clinic: {selectedOrder.clinicName}</p>
                    <p>Delivery Location: {selectedOrder.deliveryAddress}</p>
                    <p>Status: {selectedOrder.orderStatus}</p>
                </div>

                <div>
                    <h3 className="font-semibold">Items</h3>
                    <ul className="divide-y divide-gray-200">
                    {selectedOrder.orderItems?.map((item, index) => (
                        <li key={index} className="py-2 flex justify-between">
                        <span>{item.medicineName} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                        </li>
                    ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold">Price Breakdown</h3>
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.subTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    {selectedOrder.taxAmount > 0 && (
                        <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>₹{selectedOrder.taxAmount}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default OrderHistory;