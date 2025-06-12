import { useState, useEffect, useCallback } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig';
import { toast } from 'react-hot-toast';
import OrderCard from './OrderCard';
import OtpVerificationModal from './OtpVerification.jsx';

const OrderDashboard = () => {
    const axios = useAxiosInstance();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [executiveDetails, setExecutiveDetails] = useState(null);

    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [currentActiveOrderForOtp, setCurrentActiveOrderForOtp] = useState(null);

    const hasActiveOrders = dashboardData?.activeOrder !== null || (dashboardData?.pendingOrders?.length > 0);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const executiveResponse = await axios.get('/api/executives/me');
            const fetchedExecutiveDetails = executiveResponse.data.data;
            setExecutiveDetails(fetchedExecutiveDetails);

            if (!fetchedExecutiveDetails || !fetchedExecutiveDetails.id) {
                throw new Error("Executive ID not found. Cannot load dashboard.");
            }

            const summaryResponse = await axios.get('/api/executives/performance');
            const summaryData = summaryResponse.data.data;

            const ordersResponse = await axios.get('/api/executives/my-orders/active');
            const ordersData = ordersResponse.data.data;

            let activeOrder = null;
            const pendingOrders = [];
            let activeOrderFound = false;

            if (ordersData && Array.isArray(ordersData)) {
                for (const order of ordersData) {
                    if (order.status === 'ASSIGNED') {
                        let storeName = 'N/A';
                        let storePhone = 'N/A';
                        let products = [];
                        let calculatedSubtotal = 0;

                        if (order.orderItems && order.orderItems.length > 0) {
                            const firstOrderItem = order.orderItems[0];
                            if (firstOrderItem.product && firstOrderItem.product.inventories && firstOrderItem.product.inventories.length > 0) {
                                const firstStore = firstOrderItem.product.inventories[0].store;
                                storeName = firstStore.name || 'N/A';
                                storePhone = firstStore.phoneNumber || 'N/A';
                            }

                            products = order.orderItems.map(item => {
                                calculatedSubtotal += item.totalPrice || 0;
                                return {
                                    name: item.product.name,
                                    quantity: item.quantity,
                                    unitPrice: item.unitPrice,
                                    totalPrice: item.totalPrice
                                };
                            });
                        }

                        const deliveryFee = calculatedSubtotal < 300 ? 40 : 0;
                        const platformFee = 10;
                        const taxableAmount = calculatedSubtotal + deliveryFee + platformFee;
                        const tax = taxableAmount * 0.18;
                        const finalCalculatedTotal = taxableAmount + tax;

                        const formattedOrder = {
                            id: order.id,
                            address: order.deliveryAddress,
                            price: finalCalculatedTotal,
                            customerPhone: order.recipientPhone,
                            recipientEmail: order.recipientEmail,
                            customerId: order.customer?.customerId,
                            storeName: storeName,
                            storePhone: storePhone,
                            products: products,
                            subtotal: calculatedSubtotal,
                            deliveryFee: deliveryFee,
                            platformFee: platformFee,
                            tax: tax
                        };

                        if (!activeOrderFound) {
                            activeOrder = formattedOrder;
                            activeOrderFound = true;
                        } else {
                            pendingOrders.push(formattedOrder);
                        }
                    }
                }
            }

            setDashboardData({
                ordersCompleted: summaryData.totalOrdersDelivered || 0,
                totalEarnings: summaryData.estimatedTotalEarnings || 0,
                averageDeliveryTime: summaryData.averageDeliveryTimeInMinutes || 0,
                activeOrder: activeOrder,
                pendingOrders: pendingOrders
            });

            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch dashboard data.");
            toast.error(err.response?.data?.message || "Failed to fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (endpoint, successMessage) => {
        if (!executiveDetails || !executiveDetails.id) {
            toast.error("Executive details not loaded. Cannot update status.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`/api/executives/${executiveDetails.id}/${endpoint}`);
            toast.success(successMessage);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to update status: ${endpoint}`);
            setError(err.response?.data?.message || `Failed to update status: ${endpoint}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStartMyDay = () => handleStatusChange('start-day', 'Your day has started. You are now available for orders.');
    const handleEndMyDay = () => handleStatusChange('end-day', 'Your day has ended. You are now inactive.');
    const handleAcceptNoMoreOrders = () => handleStatusChange('mark-unavailable', 'You have paused accepting new orders.');
    const handleResumeAcceptingOrders = () => handleStatusChange('start-day', 'You are now accepting new orders again.');

    const handleHandoverParcel = async () => {
        if (!executiveDetails || !executiveDetails.id) {
            toast.error("Executive details not loaded. Cannot initiate delivery completion.");
            return;
        }
        if (!dashboardData?.activeOrder) {
            toast.error("No active order to complete.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`/api/executives/${executiveDetails.id}/initiate-delivery-completion`);

            if (response.data.success) {
                toast.success('OTP sent to customer. Please ask for it to verify.');
                setCurrentActiveOrderForOtp(dashboardData.activeOrder);
                setIsOtpModalOpen(true);
            } else {
                toast.error(response.data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error initiating delivery completion.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpCompletionSuccess = () => {
        closeOtpModal();
        loadData();
    };

    const closeOtpModal = () => {
        setIsOtpModalOpen(false);
        setCurrentActiveOrderForOtp(null);
    };

    if (loading && !executiveDetails) {
        return (
            <div className="w-[80%] p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading executive data...</p>
                </div>
            </div>
        );
    }

    if (error && !executiveDetails) {
        return (
            <div className="w-[80%] p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> {error}
                    <p className="mt-2 text-sm">Please refresh the page or contact support if the issue persists.</p>
                </div>
            </div>
        );
    }

    let statusMessage = "";
    let actionButton = null;
    let endDayButton = null;
    const currentExecutiveStatus = executiveDetails?.status;

    switch (currentExecutiveStatus) {
        case 'NOT_VERIFIED':
            statusMessage = "Your account is not yet verified by an administrator. Please contact support.";
            break;
        case 'INACTIVE':
            statusMessage = "Your day is currently inactive. Click 'Start My Day' to become available for orders.";
            actionButton = (
                <button
                    onClick={handleStartMyDay}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                >
                    {loading ? 'Starting...' : 'Start My Day'}
                </button>
            );
            break;
        case 'AVAILABLE':
            statusMessage = "You are available and actively accepting new orders.";
            actionButton = (
                <button
                    onClick={handleAcceptNoMoreOrders}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Accept No More Orders'}
                </button>
            );
            if (!hasActiveOrders) {
                endDayButton = (
                    <button
                        onClick={handleEndMyDay}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Ending Day...' : 'End My Day'}
                    </button>
                );
            } else {
                statusMessage += " Complete all assigned orders to 'End My Day'.";
            }
            break;
        case 'UNAVAILABLE':
            statusMessage = "You've reached your maximum assigned orders and cannot accept new ones for now. Complete existing assignments to become available.";
            actionButton = (
                <button
                    onClick={handleAcceptNoMoreOrders}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Stop Accepting Orders'}
                </button>
            );
            if (!hasActiveOrders) {
                endDayButton = (
                    <button
                        onClick={handleEndMyDay}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Ending Day...' : 'End My Day'}
                    </button>
                );
            } else {
                statusMessage += " To 'End My Day', you must complete all active orders.";
            }
            break;
        case 'MANUALLY_UNAVAILABLE':
            statusMessage = "You have manually paused accepting new orders. Complete existing assignments or click 'Resume Accepting Orders' to receive new assignments.";
            actionButton = (
                <button
                    onClick={handleResumeAcceptingOrders}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
                >
                    {loading ? 'Resuming...' : 'Resume Accepting Orders'}
                </button>
            );
            if (!hasActiveOrders) {
                endDayButton = (
                    <button
                        onClick={handleEndMyDay}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Ending Day...' : 'End My Day'}
                    </button>
                );
            }
            break;
        default:
            statusMessage = "Loading executive status...";
            break;
    }

    return (
        <div className="w-[80%] p-4 bg-gray-50 min-h-screen">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

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
                            ₹{dashboardData?.totalEarnings?.toFixed(2) || '0.00'}
                        </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-gray-600 font-medium">Avg. Delivery Time</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {dashboardData?.averageDeliveryTime?.toFixed(0) || 0} min
                        </p>
                    </div>
                </div>

                <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-semibold mb-2">
                        Current Status: <span className="text-blue-600">
                            {currentExecutiveStatus ? currentExecutiveStatus.replace('_', ' ') : 'Loading...'}
                        </span>
                    </p>
                    <p className="text-gray-600 text-sm italic">{statusMessage}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {actionButton}
                    {endDayButton}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Orders</h2>

                {(dashboardData?.activeOrder === null && dashboardData?.pendingOrders?.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                        No current orders available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {dashboardData?.activeOrder && (
                            <OrderCard
                                order={dashboardData.activeOrder}
                                type="active"
                                onHandover={handleHandoverParcel}
                            />
                        )}

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

            <OtpVerificationModal
                isOpen={isOtpModalOpen}
                onClose={closeOtpModal}
                onSuccess={handleOtpCompletionSuccess}
                executiveId={executiveDetails?.id}
                axiosInstance={axios}
                orderId={currentActiveOrderForOtp?.id}
                recipientPhone={currentActiveOrderForOtp?.customerPhone}
                recipientEmail={currentActiveOrderForOtp?.recipientEmail}
            />
        </div>
    );
};

export default OrderDashboard;