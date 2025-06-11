import { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const PrescriptionOrdersSection = () => {
    const axios = useAxiosInstance();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all orders from Spring Boot backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders/get-all');
                let fetchedOrders = response.data.data; // Accessing the 'data' property

                // Ensure fetchedOrders is an array. If not, default to an empty array.
                if (!Array.isArray(fetchedOrders)) {
                    console.error("API response.data.data is not an array. Actual type:", typeof fetchedOrders, "Value:", fetchedOrders);
                    if (fetchedOrders && typeof fetchedOrders === 'object') {
                        fetchedOrders = [fetchedOrders];
                    } else {
                        fetchedOrders = [];
                    }
                }

                // Display all orders, no frontend filtering needed here
                setOrders(fetchedOrders);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError(err.message || 'Failed to fetch orders');
                setLoading(false);
            }
        };

        fetchOrders();
    }, [axios]);

    const handleApprove = async (orderId) => {
        try {
            await axios.post(`/api/orders/verify-prescription/${orderId}`);
            // Update the specific order in the local state to reflect its new verified status
            // Assuming status transitions to 'PROCESSING' once prescription is approved
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, prescriptionVerified: true, status: 'PROCESSING' } : order
                )
            );
            setSelectedOrder(null); // Close the modal
        } catch (err) {
            console.error("Error approving order:", err);
            setError(err.message || 'Failed to approve order');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600 bg-white p-8 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">Error loading orders!</p>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to determine the badge for the order list
    const getStatusBadge = (order) => {
        const hasPrescriptionRequiredItem = order.orderItems?.some(item => item.product?.prescriptionRequired);
        const prescriptionUploaded = order.prescriptionUrl; // Check if URL exists
        const prescriptionVerifiedStatus = order.prescriptionVerified; // true, false, or null

        let colorClass;
        let iconPath;
        let statusText;

        // Priority 1: Prescription status if relevant and not yet verified
        if (hasPrescriptionRequiredItem && prescriptionUploaded && (prescriptionVerifiedStatus === false || prescriptionVerifiedStatus === null)) {
            colorClass = 'bg-orange-100 text-orange-800'; // Orange for "Awaiting Prescription Verification"
            iconPath = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // Exclamation triangle
            statusText = "Prescription Awaiting Verification";
        } else if (hasPrescriptionRequiredItem && !prescriptionUploaded) {
            colorClass = 'bg-yellow-100 text-yellow-800';
            iconPath = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // Exclamation triangle
            statusText = "Prescription Missing (Follow-up)";
        } else if (hasPrescriptionRequiredItem && prescriptionVerifiedStatus === true) {
            colorClass = 'bg-green-100 text-green-800';
            iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // Checkmark circle
            statusText = "Prescription Verified";
        }
        // Priority 2: General order status if no specific prescription status
        else {
            const status = order.status?.toLowerCase();
            switch (status) {
                case 'pending':
                    colorClass = 'bg-blue-100 text-blue-800';
                    iconPath = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"; // Clock icon
                    statusText = 'Pending';
                    break;
                case 'processing':
                    colorClass = 'bg-purple-100 text-purple-800';
                    iconPath = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.545.333 1.25.623 2.001.789z"; // Gear icon
                    statusText = 'Processing';
                    break;
                case 'out_for_delivery':
                    colorClass = 'bg-orange-100 text-orange-800';
                    iconPath = "M8.25 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM15.75 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM12 10.5a.75.75 0 01.75-.75h.75V11a.75.75 0 01-1.5 0v-1.25a.75.75 0 01.75-.75zm0 0V9.75M6 6h15a.75.75 0 00.627-1.213L17.459 2.522A.75.75 0 0016.826 2.25H6a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75zM15.75 6H18V3.75h-2.25V6zM6 18.75V7.5h15a.75.75 0 01.75.75V15A2.25 2.25 0 0119.5 17.25h-6.75A2.25 2.25 0 0010.5 19.5h-4.5V18.75z"; // Truck icon
                    statusText = 'Out for Delivery';
                    break;
                case 'delivered':
                    colorClass = 'bg-green-100 text-green-800';
                    iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"; // Checkmark circle
                    statusText = 'Delivered';
                    break;
                case 'cancelled':
                    colorClass = 'bg-gray-400 text-gray-800';
                    iconPath = "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // X circle
                    statusText = 'Cancelled';
                    break;
                case 'rejected':
                    colorClass = 'bg-red-200 text-red-900';
                    iconPath = "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // X circle
                    statusText = 'Rejected';
                    break;
                default:
                    colorClass = 'bg-gray-100 text-gray-800';
                    iconPath = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"; // Info icon
                    statusText = order.status?.replace('_', ' ').toLowerCase() || 'Unknown Status';
            }
        }


        return (
            <div className={`mt-2 flex items-center text-xs font-medium px-2 py-1 rounded-full ${colorClass} w-fit`}>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                </svg>
                {statusText}
            </div>
        );
    };


    return (
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">
                    All Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-10 text-center flex flex-col items-center justify-center h-64">
                        <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3m-3 0h3m-3 0v3m-3-6h.008v.008H6V6zm-3 6h.008v.008H3V12zm9-6h.008v.008H12V6zm3 0h.008v.008H15V6zM3 18h.008v.008H3V18zm9 0h.008v.008H12V18zm3 0h.008v.008H15V18zM6 12h.008v.008H6V12zm3 6h.008v.008H9V18zm6 0h.008v.008H15V18z" />
                        </svg>
                        <p className="text-xl text-gray-600 font-medium">No orders found.</p>
                        <p className="text-sm text-gray-500 mt-2">There are currently no orders to display.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="w-full p-4 sm:p-6 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex flex-col">
                                    <p className="text-lg font-bold text-gray-900 mb-1">Order ID: <span className="font-mono text-blue-700">#{order.id}</span></p>
                                    <p className="text-sm text-gray-700">Customer: <span className="font-medium">{order.customer?.name}</span> (<span className="text-gray-600">{order.recipientEmail}</span>)</p>
                                    {getStatusBadge(order)} {/* Use the helper function */}
                                </div>
                                <svg
                                    className="h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details and Prescription Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform scale-95 animate-zoom-in">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Order Details: <span className="font-mono text-blue-700">#{selectedOrder.id}</span>
                                </h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {/* Left Column: Prescription & Ordered Items */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Prescription Image/Status */}
                                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Prescription Review</h4>
                                        {/* Logic for displaying prescription: only show if needed for verification */}
                                        {selectedOrder.orderItems?.some(item => item.product?.prescriptionRequired) ? (
                                            selectedOrder.prescriptionUrl && (selectedOrder.prescriptionVerified === false || selectedOrder.prescriptionVerified === null) ? (
                                                <>
                                                    <img
                                                        src={selectedOrder.prescriptionUrl}
                                                        alt="Prescription"
                                                        className="w-full max-h-96 object-contain rounded-md border border-gray-300 mb-4 shadow-md"
                                                    />
                                                    <div className="text-center py-2 rounded-md font-medium text-sm bg-orange-100 text-orange-800">
                                                        Status: <span className="font-bold">Awaiting Verification</span>
                                                    </div>
                                                </>
                                            ) : selectedOrder.prescriptionVerified === true ? (
                                                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md text-center">
                                                    <div className="flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-green-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-sm text-green-800 font-medium">Prescription has been **Verified**.</p>
                                                    </div>
                                                </div>
                                            ) : ( // No prescription URL but required
                                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-center">
                                                    <div className="flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-yellow-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <p className="text-sm text-yellow-800 font-medium">No prescription uploaded, but some items require it. Admin to follow up.</p>
                                                    </div>
                                                </div>
                                            )
                                        ) : ( // No items in order require prescription
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md text-center">
                                                <div className="flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-blue-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm text-blue-800 font-medium">No prescription required for this order's items.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ordered Items */}
                                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Ordered Items</h4>
                                        {selectedOrder.orderItems?.length > 0 ? (
                                            <ul className="space-y-4">
                                                {selectedOrder.orderItems.map(item => (
                                                    <li key={item.id} className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                                        <img
                                                            src={item.product?.image}
                                                            alt={item.product?.name}
                                                            className="w-20 h-20 rounded-md object-cover flex-shrink-0 shadow-sm"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-base font-medium text-gray-900">{item.product?.name}</p>
                                                            <p className="text-sm text-gray-600">Category: {item.product?.category}</p>
                                                            <p className="text-sm text-gray-600">Qty: {item.quantity} @ ₹{item.unitPrice?.toFixed(2)}</p>
                                                            <p className="text-md font-bold text-gray-800 mt-1">Total: ₹{item.totalPrice?.toFixed(2)}</p>
                                                            {item.product?.prescriptionRequired && (
                                                                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Prescription Required
                                                                </span>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No items in this order.</p>
                                        )}
                                        <div className="mt-6 pt-4 border-t border-gray-200 text-right">
                                            <p className="text-xl font-bold text-gray-900">
                                                Overall Order Total: ₹
                                                {(selectedOrder.orderItems?.reduce((acc, item) => acc + (item.totalPrice || 0), 0) || 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Customer Info & Actions */}
                                <div className="md:col-span-1 space-y-6">
                                    {/* Customer Information */}
                                    <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Customer & Delivery Info</h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-gray-500">Name</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.customer?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.customer?.user?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.customer?.user?.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Delivery Address</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.deliveryAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Delivery Instructions</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.deliveryInstructions || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Order Placed At</p>
                                                <p className="text-sm font-medium">
                                                    {selectedOrder.placedAt ?
                                                        new Date(selectedOrder.placedAt).toLocaleString() :
                                                        selectedOrder.customer?.user?.createdAt ?
                                                            new Date(selectedOrder.customer.user.createdAt).toLocaleString() :
                                                            'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Current Order Status</p>
                                                {getStatusBadge(selectedOrder)} {/* Use the same badge helper for consistency */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons - Only show if prescription needs verification */}
                                    {(selectedOrder.orderItems?.some(item => item.product?.prescriptionRequired) && selectedOrder.prescriptionUrl && (selectedOrder.prescriptionVerified === false || selectedOrder.prescriptionVerified === null)) ||
                                    (selectedOrder.orderItems?.some(item => item.product?.prescriptionRequired) && !selectedOrder.prescriptionUrl) ? (
                                        <div className="flex flex-col space-y-4 pt-2">
                                            <button
                                                onClick={() => handleApprove(selectedOrder.id)}
                                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Approve Prescription
                                            </button>
                                        </div>
                                    ) : (
                                        // This block now shows the status when buttons aren't needed
                                        <div className="mt-8 text-center">
                                            {selectedOrder.orderItems?.some(item => item.product?.prescriptionRequired) && selectedOrder.prescriptionVerified === true ? (
                                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Prescription Verified
                                                </span>
                                            ) : (
                                                <p className="text-gray-600 font-medium">This order does not require prescription verification or has already been reviewed.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionOrdersSection;