// eslint-disable-next-line no-unused-vars
import { useState } from 'react';

const OrderCard = ({ order, onClick }) => {
    return (
        <div 
        className="w-full h-10 flex items-center border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors px-4"
        onClick={onClick}
        >
        <img 
            src={order.product.image} 
            alt={order.product.name} 
            className="w-8 h-8 rounded-md object-cover mr-3"
        />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{order.product.name}</p>
            <p className="text-xs text-gray-500">{order.product.category}</p>
        </div>
        </div>
    );
    };

    const OrderDetailsModal = ({ order, onClose, onApprove, onReject }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                <img 
                    src={order.product.image} 
                    alt={order.product.name} 
                    className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                    <h4 className="text-sm font-medium text-gray-900">{order.product.name}</h4>
                    <p className="text-sm text-gray-500">{order.product.category}</p>
                    <p className="text-sm text-gray-500">{order.store.name}</p>
                </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm">{order.customer.name}</p>
                    </div>
                    <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{order.customer.email}</p>
                    </div>
                    <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm">{order.customer.phone}</p>
                    </div>
                </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Prescription</h4>
                <img 
                    src={order.prescription} 
                    alt="Prescription" 
                    className="w-full rounded-md border border-gray-200"
                />
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                type="button"
                onClick={onReject}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                Reject
                </button>
                <button
                type="button"
                onClick={onApprove}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                Approve
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export { OrderCard, OrderDetailsModal };