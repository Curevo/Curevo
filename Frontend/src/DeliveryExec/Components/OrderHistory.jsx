import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications
import { useAxiosInstance } from '@/Config/axiosConfig';

// Helper to format currency for consistency
const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

const OrderHistory = () => {
    const axios = useAxiosInstance(); // Use your custom axios instance
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to format individual order item details
    const formatOrderItem = (item) => {
        return {
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice // Use totalPrice from backend if available for item
        };
    };

    // Use useCallback for memoizing fetchOrders to prevent unnecessary re-renders of useEffect
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/executives/my-orders/all');
            const rawOrders = response.data.data;

            if (!Array.isArray(rawOrders)) {
                throw new Error("Invalid data format received from API.");
            }

            const formattedOrders = rawOrders.map(order => {
                let calculatedSubtotal = 0;
                const products = order.orderItems.map(item => {
                    calculatedSubtotal += item.totalPrice || 0;
                    return formatOrderItem(item);
                });

                const storeName = order.orderItems?.[0]?.product?.inventories?.[0]?.store?.name || 'N/A';
                // Store phone is not directly used in the UI now, but keeping for reference if needed
                // const storePhone = order.orderItems?.[0]?.product?.inventories?.[0]?.store?.phoneNumber || 'N/A';

                const deliveryFee = calculatedSubtotal < 300 ? 40 : 0;
                const platformFee = 10;
                const taxableAmount = calculatedSubtotal + deliveryFee + platformFee;
                const tax = taxableAmount * 0.18;
                const finalCalculatedTotal = taxableAmount + tax;

                return {
                    id: order.id,
                    orderId: order.id,
                    orderDate: order.placedAt,
                    totalAmount: finalCalculatedTotal,
                    deliveryAddress: order.deliveryAddress,
                    orderStatus: order.status,
                    customerName: order.recipientName, // Keep name for display
                    // Removed customerPhone, customerEmail from this mapped object for strict privacy
                    deliveryInstructions: order.deliveryInstructions,
                    clinicName: storeName,
                    orderItems: products,
                    subTotal: calculatedSubtotal,
                    deliveryFee: deliveryFee,
                    platformFee: platformFee,
                    taxAmount: tax,
                };
            });

            setOrders(formattedOrders);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
            toast.error(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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
                <p className="ml-4 text-gray-600">Loading order history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 w-full flex justify-center items-center h-64">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                    <p className="text-lg mb-2">No past orders to display.</p>
                    <p className="text-md">Once you complete deliveries, they'll appear here!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleCardClick(order)}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                        {order.orderStatus.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">
                                    <span className="font-medium">Date:</span> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm mb-2 truncate">
                                    <span className="font-medium">Delivery:</span> {order.deliveryAddress}
                                </p>
                                <div className="text-right mt-4">
                                    <span className="text-lg font-bold text-blue-600">
                                        Total: {formatCurrency(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-95 animate-zoom-in">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Order Details #{selectedOrder.orderId}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-lg text-gray-700 mb-2">Order Summary</h3>
                                <p className="text-gray-600">
                                    <span className="font-medium">Date:</span> {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={`font-bold ${
                                        selectedOrder.orderStatus === 'DELIVERED' ? 'text-green-600' :
                                            selectedOrder.orderStatus === 'CANCELLED' ? 'text-red-600' :
                                                'text-blue-600'}`}>
                                        {selectedOrder.orderStatus.replace('_', ' ')}
                                    </span>
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Store:</span> {selectedOrder.clinicName}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Delivery To:</span> {selectedOrder.deliveryAddress}
                                </p>
                                {selectedOrder.customerName && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Recipient:</span> {selectedOrder.customerName}
                                    </p>
                                )}
                                {selectedOrder.deliveryInstructions && (
                                    <p className="text-gray-600 italic">
                                        <span className="font-medium">Instructions:</span> "{selectedOrder.deliveryInstructions}"
                                    </p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-lg text-gray-700 mb-3">Items Ordered</h3>
                                <ul className="divide-y divide-gray-200">
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <li key={index} className="py-2 flex justify-between items-center text-gray-700">
                                            <span>{item.name} <span className="text-gray-500 text-sm">x{item.quantity}</span></span>
                                            <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-lg text-gray-700 mb-3">Price Breakdown</h3>
                                <div className="space-y-2 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(selectedOrder.subTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee:</span>
                                        <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                                    </div>
                                    {selectedOrder.platformFee > 0 && (
                                        <div className="flex justify-between">
                                            <span>Platform Fee:</span>
                                            <span>{formatCurrency(selectedOrder.platformFee)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.taxAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span>Taxes (18%):</span>
                                            <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold border-t border-gray-300 pt-3 text-lg text-gray-800">
                                        <span>Grand Total:</span>
                                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
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