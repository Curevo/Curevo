// src/components/OtpVerification.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OtpVerificationModal = ({
                                  isOpen,
                                  onClose,
                                  onSuccess,
                                  executiveId,
                                  axiosInstance,
                                  orderId,
                                  recipientPhone,
                                  recipientEmail
                              }) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }
        if (!executiveId) {
            toast.error("Executive ID is missing. Cannot verify OTP.");
            return;
        }

        setIsLoading(true);
        try {
            // ⭐⭐⭐ Crucial Change Here: Sending OTP as a query parameter ⭐⭐⭐
            const response = await axiosInstance.post(
                `/api/executives/${executiveId}/complete-delivery-with-otp?otp=${otp}`
            );

            if (response.data.success) {
                toast.success('Order delivered successfully!');
                setOtp('');
                onSuccess();
            } else {
                toast.error(response.data.message || 'OTP verification failed.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error verifying OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: -50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, type: "spring", damping: 20, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-3xl p-8 w-full max-w-sm sm:max-w-md transform transition-all duration-300 ease-out border border-gray-100"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
                            Verify Delivery
                        </h2>

                        <div className="mb-7 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 font-medium">
                            {orderId && (
                                <p className="flex items-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                    </svg>
                                    Order ID: <span className="font-bold ml-1">{orderId}</span>
                                </p>
                            )}
                            {recipientPhone && (
                                <p className="flex items-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.48a1 1 0 00.17.607l1.01 1.01a1 1 0 01.3.707v3.182a1 1 0 00-1 1l-1.01 1.01a1 1 0 01-.607.17l-1.48.74A1 1 0 013 18H2a1 1 0 01-1-1V3z" />
                                    </svg>
                                    Recipient Phone: <span className="font-bold ml-1">{recipientPhone}</span>
                                </p>
                            )}
                            {recipientEmail && (
                                <p className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0018 4H2a2 2 0 00-.003 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Recipient Email: <span className="font-bold ml-1">{recipientEmail}</span>
                                </p>
                            )}
                        </div>

                        <p className="mb-7 text-gray-700 text-center leading-relaxed text-base">
                            A <span className="font-semibold text-blue-600">6-digit OTP</span> has been sent to the recipient's registered email/phone. Please ask for the code and enter it below.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-7">
                                <label htmlFor="otp" className="block text-gray-800 text-xl font-bold mb-4 text-center">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="block w-full py-4 px-4 border border-gray-300 rounded-lg text-gray-900 text-center text-3xl font-extrabold tracking-widest bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 placeholder-gray-400"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength="6"
                                    pattern="\d{6}"
                                    inputMode="numeric"
                                    placeholder="• • • • • •"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row-reverse justify-center sm:justify-end gap-3 sm:gap-4 mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full sm:w-auto px-7 py-3 rounded-lg font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : 'Complete Delivery'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-7 py-3 rounded-lg font-bold bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OtpVerificationModal;