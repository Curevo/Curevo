import React, { useRef, useState } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom';

const OTPVerifyPopup = ({ isOpen, onClose, email = 'you@example.com', userType }) => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const axios = useAxiosInstance();
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to the next input only if a value was entered
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            alert('Please enter the complete 6-digit OTP.');
            return;
        }

        let endpoint = '';
        if (userType === 'customer') {
            endpoint = '/api/customers/verify-otp';
        } else if (userType === 'deliveryExecutive') {
            endpoint = '/api/executives/verify-and-save';
        } else {
            alert('Invalid user type provided.');
            return;
        }

        try {
            const response = await axios.post(endpoint, null, {
                params: { email, otp: enteredOtp }
            });

            if (response.data.success === true) {
                navigate('/login');
            } else {

                alert(response.data.message || 'OTP verification failed. Please check the code.');
            }

        } catch (error) {
            // Catch network errors or server-side errors
            alert('Verification failed. Please try again or resend OTP.');
            console.error('OTP verification error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"> {/* Added padding for small screens */}
            <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl transform transition-all scale-100 opacity-100 animate-fade-in-scale"> {/* Increased shadow, added animation */}
                <div className="flex flex-col items-center">
                    {/* Close button at top right */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close OTP verification popup"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <div className="bg-blue-100 p-4 rounded-full mb-6"> {/* Increased padding, margin */}
                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"> {/* Larger icon */}
                            <path d="M4 4h16v16H4z" fill="none"/><path d="M20 4H4v16h16V4zm-2 2v.511l-6 3.75-6-3.75V6h12zM6 18V8.841l6 3.75 6-3.75V18H6z"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2> {/* Larger, bolder text */}
                    <p className="text-base text-gray-600 mb-6 text-center leading-relaxed"> {/* Adjusted font size, color, line-height */}
                        We've sent a 6-digit verification code to <br />
                        <span className="text-blue-700 font-semibold truncate block">{email}</span> {/* Highlighted email, truncate for long emails */}
                    </p>

                    <div className="flex justify-center gap-3 mb-6"> {/* Increased gap, centered */}
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                ref={el => inputsRef.current[index] = el}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-11 h-14 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200" // Enhanced styling
                            />
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        OTP will expire in 3 minutes.
                    </p>
                    {/* Add a resend button (implementation needed) */}
                    <button className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium mb-6 transition-colors">
                        Resend Code
                    </button>


                    <button
                        onClick={handleVerify}
                        className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105" // Enhanced button
                    >
                        Verify Email
                    </button>
                </div>
            </div>
            {/* Simple CSS animation for popup */}
            <style jsx>{`
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default OTPVerifyPopup;