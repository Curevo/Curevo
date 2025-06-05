import React, { useRef, useState } from 'react';
import axios from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const OTPVerifyPopup = ({ isOpen, onClose, email = 'you@example.com'}) => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        }
    };

// Inside OTPVerifyPopup component
    const handleVerify = async () => {
    const enteredOtp = otp.join('');

    try {
        const response = await axios.post('/api/customers/verify-otp', null, {
            params: { email, otp: enteredOtp }
        });


        if (response.data === true) {
            alert('OTP Verified!');
            navigate('/');
        } else {
            alert('Invalid OTP. Try again.');
        }

    } catch (error) {
        alert('Verification failed. Please try again.');
        console.error(error);
    }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-[320px] rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" fill="none"/><path d="M20 4H4v16h16V4zm-2 2v.511l-6 3.75-6-3.75V6h12zM6 18V8.841l6 3.75 6-3.75V18H6z"/>
                </svg>
            </div>
            <h2 className="text-lg font-semibold mb-1">Check your email</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
                Enter the verification code sent to <br />
                <span className="text-black font-medium">{email}</span>
            </p>

            <div className="flex gap-2 mb-4">
                {otp.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={el => inputsRef.current[index] = el}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Didn’t get a code?{' '}
                <button className="text-blue-600 hover:underline" onClick={() => alert('Resend logic here')}>
                resend
                </button>
            </p>

            <button
                onClick={handleVerify}
                className="bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700"
            >
                Verify email
            </button>
            </div>
        </div>
        </div>
    );
};

export default OTPVerifyPopup;
