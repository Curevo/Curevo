// eslint-disable-next-line no-unused-vars
import { useState } from 'react';

// OrderCard component for displaying a summarized item in the list (unchanged)
const OrderCard = ({ orderItem, onClick }) => {
    if (!orderItem || !orderItem.product) {
        return null;
    }

    return (
        <div
            className="w-full h-16 flex items-center border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors px-4 py-2"
            onClick={onClick}
        >
            <img
                src={orderItem.product.image}
                alt={orderItem.product.name}
                className="w-10 h-10 rounded-lg object-cover mr-4 shadow-sm"
            />
            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-800 truncate">{orderItem.product.name}</p>
                <p className="text-sm text-gray-500">{orderItem.product.category}</p>
            </div>
            <span className="text-sm font-medium text-gray-700 ml-auto">Qty: {orderItem.quantity}</span>
        </div>
    );
};

// Helper function to format currency consistently
const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

// OrderDetailsModal component for showing detailed information and approval action
const OrderDetailsModal = ({ order, onClose, onApprove }) => {
    if (!order) return null;

    // --- START: Manual Order Calculations (Performed directly in the modal) ---
    const minimumOrderAmount = 300;
    const platformFee = 10; // Fixed platform fee

    // Calculate subtotal by summing up individual item total prices
    const calculatedSubtotal = order.orderItems?.reduce((acc, item) => acc + (item.totalPrice || 0), 0) || 0;

    // Calculate delivery charges based on subtotal
    const calculatedDeliveryFee = calculatedSubtotal < minimumOrderAmount ? 50 : 0;

    // Calculate the base amount for tax (Subtotal + Platform Fee + Delivery Charges)
    const taxableAmount = calculatedSubtotal + platformFee + calculatedDeliveryFee;

    // Calculate 18% GST
    const gstRate = 0.18;
    const calculatedTaxAmount = taxableAmount * gstRate;

    // Calculate the final total amount
    const calculatedTotalAmount = taxableAmount + calculatedTaxAmount;
    // --- END: Manual Order Calculations ---


    // Determine if any item in the order requires a prescription
    const hasPrescriptionRequiredItem = order.orderItems.some(item => item.product?.prescriptionRequired);
    const prescriptionUploaded = order.prescriptionUrl;
    const prescriptionVerifiedStatus = order.prescriptionVerified; // true, false, or null

    // Determine if the "Approve Prescription" button should be shown
    const showApproveButton = (hasPrescriptionRequiredItem && prescriptionUploaded && (prescriptionVerifiedStatus === false || prescriptionVerifiedStatus === null));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto transform scale-95 animate-zoom-in">
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Order Details #{order.id}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">Customer Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{order.customer?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{order.customer?.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{order.customer?.user?.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Delivery Address</p>
                                    <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <p className="text-gray-500">Delivery Instructions</p>
                                    <p className="font-medium text-gray-900">{order.deliveryInstructions || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Ordered Items List */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">Ordered Items</h4>
                            <ul className="space-y-4">
                                {order.orderItems?.length > 0 ? (
                                    order.orderItems.map(item => (
                                        <li key={item.id} className="flex items-start space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                                            <img
                                                src={item.product?.image}
                                                alt={item.product?.name}
                                                className="w-16 h-16 rounded-md object-cover flex-shrink-0 shadow-sm border border-gray-100"
                                            />
                                            <div className="flex-1">
                                                <p className="text-base font-medium text-gray-900">{item.product?.name}</p>
                                                <p className="text-sm text-gray-600">{item.product?.category}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity} @ {formatCurrency(item.unitPrice)}</p>
                                                <p className="text-sm font-semibold text-gray-800">Total: {formatCurrency(item.totalPrice)}</p>
                                                {item.product?.prescriptionRequired && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                        Prescription Required
                                                    </span>
                                                )}
                                                {item.product?.inventories?.[0]?.store?.name && (
                                                    <p className="text-xs text-gray-500 mt-1">Store: {item.product.inventories[0].store.name}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No items found for this order.</p>
                                )}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                                <p className="text-lg font-bold text-gray-900">
                                    Subtotal (Items): {formatCurrency(calculatedSubtotal)}
                                </p>
                            </div>
                        </div>

                        {/* Price Breakdown Section - THIS IS WHERE THE CHANGES ARE TO DISPLAY THE CALCULATIONS */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">Price Breakdown</h4>
                            <div className="space-y-2 text-gray-700 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal (Items):</span>
                                    {/* Displaying calculatedSubtotal */}
                                    <span>{formatCurrency(calculatedSubtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee:</span>
                                    {/* Displaying platformFee constant */}
                                    <span>{formatCurrency(platformFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges:</span>
                                    {/* Displaying calculatedDeliveryFee */}
                                    <span>{formatCurrency(calculatedDeliveryFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>GST (18%):</span>
                                    {/* Displaying calculatedTaxAmount (FIXED) */}
                                    <span>{formatCurrency(calculatedTaxAmount)}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t border-gray-300 pt-3 text-lg text-gray-800">
                                    <span>Grand Total:</span>
                                    {/* Displaying calculatedTotalAmount (FIXED) */}
                                    <span>{formatCurrency(calculatedTotalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Section */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-2">Prescription</h4>
                            {hasPrescriptionRequiredItem ? (
                                prescriptionUploaded ? (
                                    <>
                                        {prescriptionVerifiedStatus === false || prescriptionVerifiedStatus === null ? (
                                            <>
                                                <img
                                                    src={order.prescriptionUrl}
                                                    alt="Customer Prescription"
                                                    className="w-full max-h-96 object-contain rounded-md border border-gray-200 mb-4"
                                                />
                                                <div className="text-center py-2 rounded-md font-medium text-sm bg-orange-100 text-orange-800">
                                                    <p>Status: <span className="font-bold">Awaiting Verification</span></p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm text-center">
                                                <div className="flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-green-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm text-green-800 font-medium">Prescription has been **Verified**.</p>
                                                </div>
                                                <a href={order.prescriptionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2 block">View Verified Prescription</a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm text-center">
                                        <div className="flex items-center justify-center">
                                            <svg className="h-6 w-6 text-yellow-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <p className="text-sm text-yellow-800 font-medium">No prescription uploaded for items requiring it. Admin will follow up.</p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow-sm text-center">
                                    <div className="flex items-center justify-center">
                                        <svg className="h-6 w-6 text-blue-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-blue-800 font-medium">No prescription required for this order.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action button: Approve (Conditional) */}
                    {showApproveButton ? (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={() => onApprove(order.id)}
                                className="px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out"
                            >
                                Approve Prescription
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 text-center text-gray-600 font-medium">
                            {hasPrescriptionRequiredItem && prescriptionVerifiedStatus === true ? (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Prescription Verified
                                </span>
                            ) : (
                                <p>This order does not require prescription verification or has already been reviewed.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { OrderCard, OrderDetailsModal };