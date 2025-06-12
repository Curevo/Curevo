import React from 'react'; // React is needed for JSX

const OrderCard = ({ order, type, index, onHandover }) => {
    const cardStyles = {
        active: {
            border: 'border-blue-300',
            bg: 'bg-blue-50',
            text: 'text-blue-800',
            button: 'bg-blue-500 hover:bg-blue-600'
        },
        pending: {
            border: 'border-yellow-300',
            bg: 'bg-yellow-50',
            text: 'text-yellow-800',
            button: 'bg-yellow-500 hover:bg-yellow-600'
        }
    };

    const title = type === 'active'
        ? 'Active Order'
        : `Pending Order ${index}`;

    const handleCallCustomer = () => {
        if (order.customerPhone) {
            window.location.href = `tel:${order.customerPhone}`;
        } else {
            alert('Customer phone number not available.');
        }
    };

    return (
        <div className={`border ${cardStyles[type].border} rounded-lg p-6 ${cardStyles[type].bg} flex flex-col h-full`}>
            <h3 className={`text-xl font-bold ${cardStyles[type].text} mb-3`}>{title}</h3>

            <div className="mb-4 text-gray-700 text-sm flex-grow">
                <p className="mb-1">
                    <span className="font-semibold">Order ID:</span> {order.id}
                </p>
                <p className="mb-1">
                    <span className="font-semibold">Delivery Address:</span> {order.address}
                </p>

                <div className="my-3 p-3 bg-white rounded-md border border-gray-200">
                    <p className="mb-1">
                        <span className="font-semibold">Store Name:</span> {order.storeName}
                    </p>
                    {order.storePhone !== 'N/A' && (
                        <p>
                            <span className="font-semibold">Store Phone:</span> {order.storePhone}
                        </p>
                    )}
                </div>

                {order.products && order.products.length > 0 && (
                    <div className="bg-white p-3 rounded-lg mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Order Items:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {order.products.map((product, idx) => (
                                <li key={idx} className="mb-1 last:mb-0">
                                    {product.name} ({product.quantity}) - ₹{product.unitPrice?.toFixed(2)} x {product.quantity} = ₹{product.totalPrice?.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <button
                onClick={handleCallCustomer}
                className={`w-full mb-3 ${cardStyles[type].button} text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-base font-medium`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Customer
            </button>

            {/* Hand over Parcel Button - ONLY for Active Orders */}
            {type === 'active' && onHandover && (
                <button
                    onClick={() => onHandover(order.id, order.customerId)}
                    className={`w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-base font-medium`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Hand over Parcel
                </button>
            )}

            <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-800">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-700">Delivery Fee:</span>
                    <span className="font-semibold text-gray-800">₹{order.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-700">Platform Fee:</span>
                    <span className="font-semibold text-gray-800">₹{order.platformFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-700">Tax (18%):</span>
                    <span className="font-semibold text-gray-800">₹{order.tax?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-between mt-3">
                    <span className="text-base font-semibold text-blue-800">Final Total:</span>
                    <p className="text-2xl font-extrabold text-blue-900">
                        ₹{order.price?.toFixed(2) || '0.00'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;