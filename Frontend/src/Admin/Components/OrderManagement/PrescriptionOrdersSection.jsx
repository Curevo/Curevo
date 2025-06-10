import { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionOrdersSection = () => {
    const [orders, setOrders] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders from Spring Boot backend
    useEffect(() => {
        const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/prescription-orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        };

        fetchOrders();
    }, []);

    const handleApprove = async (orderId) => {
        try {
        await axios.put(`/api/prescription-orders/${orderId}/approve`);
        setOrders(orders.filter(order => order.id !== orderId));
        setSelectedPrescription(null);
        } catch (err) {
        setError(err.message);
        }
    };

    const handleReject = async (orderId) => {
        try {
        await axios.put(`/api/prescription-orders/${orderId}/reject`);
        setOrders(orders.filter(order => order.id !== orderId));
        setSelectedPrescription(null);
        } catch (err) {
        setError(err.message);
        }
    };

    if (loading) {
        return (
        <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading prescription orders...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-red-500">
            <p>Error loading orders: {error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Retry
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="flex-1 p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Prescription Orders</h1>
            
            {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No prescription orders pending</p>
            </div>
            ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                {orders.map(order => (
                    <div 
                    key={order.id}
                    className="w-full p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPrescription(order)}
                    >
                    <div className="flex justify-between items-center">
                        <div>
                        <p className="text-sm font-medium text-gray-900">{order.medicineName}</p>
                        <p className="text-xs text-gray-600 mt-1">{order.category}</p>
                        </div>
                        <svg 
                        className="h-5 w-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>

        {/* Prescription Popup Modal */}
        {selectedPrescription && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                    Prescription for {selectedPrescription.medicineName}
                    </h3>
                    <button 
                    onClick={() => setSelectedPrescription(null)}
                    className="text-gray-500 hover:text-gray-700"
                    >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                        src={`data:image/jpeg;base64,${selectedPrescription.prescriptionImage}`}
                        alt="Prescription" 
                        className="w-full h-auto object-contain"
                        />
                    </div>
                    </div>

                    <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Medicine Details</h4>
                        <div className="space-y-2">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm font-medium">{selectedPrescription.medicineName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm font-medium">{selectedPrescription.category}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Dosage</p>
                            <p className="text-sm font-medium">{selectedPrescription.dosage}</p>
                        </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Customer Information</h4>
                        <div className="space-y-2">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-sm font-medium">{selectedPrescription.customerName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{selectedPrescription.customerEmail}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium">{selectedPrescription.customerPhone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Order Date</p>
                            <p className="text-sm font-medium">
                            {new Date(selectedPrescription.orderDate).toLocaleString()}
                            </p>
                        </div>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                        onClick={() => handleReject(selectedPrescription.id)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex-1"
                        >
                        Reject
                        </button>
                        <button
                        onClick={() => handleApprove(selectedPrescription.id)}
                        className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                        Approve
                        </button>
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

export default PrescriptionOrdersSection;