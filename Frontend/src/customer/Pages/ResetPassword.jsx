import React, { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ onClose }) => {
    const axios = useAxiosInstance();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentStep, setCurrentStep] = useState('emailInput'); // 'emailInput', 'otpVerification', 'newPasswordSetup'

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    // Effect to check for stored email on component mount and to clean up on unmount
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setCurrentStep('otpVerification'); // Assume they are on OTP step if email is stored
        }

        return () => {
            // This cleanup ensures the email is removed from session storage if the user navigates away
            // or closes the component without completing the full reset flow.
            // If the reset was successful, it's explicitly cleared in handleResetPassword.
            sessionStorage.removeItem('resetPasswordEmail');
        };
    }, []); // Empty dependency array: runs only once on mount and once on unmount

    const getStepIndex = (step) => {
        switch (step) {
            case 'emailInput': return 0;
            case 'otpVerification': return 1;
            case 'newPasswordSetup': return 2;
            default: return 0;
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email.trim()) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/password-initiate', new URLSearchParams({ email }));
            sessionStorage.setItem('resetPasswordEmail', email); // Save email to session storage
            showToast('OTP sent to your email!', 'success');
            setCurrentStep('otpVerification');
        } catch (err) {
            console.error('Error sending OTP:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (!storedEmail || !otp.trim()) {
            setError('Email or OTP missing. Please go back to the first step or re-enter OTP.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/validate-otp', new URLSearchParams({ email: storedEmail, otp }));
            showToast('OTP verified successfully!', 'success');
            setCurrentStep('newPasswordSetup');
        } catch (err) {
            console.error('Error verifying OTP:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (!storedEmail) {
            setError('Email missing. Please restart the password reset process.');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/reset-password', new URLSearchParams({ email: storedEmail, newPassword }));
            showToast('Password reset successfully! You can now log in.', 'success');
            sessionStorage.removeItem('resetPasswordEmail'); // Clear email from session storage on successful reset
            navigate('/login');
            if (onClose) onClose();
        } catch (err) {
            console.error('Error resetting password:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'emailInput':
                return (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <p className="text-gray-600 text-center text-sm mb-6">Enter your email to receive a **One-Time Password (OTP)**.</p>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-base"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                );
            case 'otpVerification':
                return (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <p className="text-gray-600 text-center text-sm mb-6">An OTP has been sent to <span className="font-semibold text-blue-700">{email}</span>. Please enter it below.</p>
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                autoComplete="off"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-base"
                                placeholder="Enter OTP"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4 sm:gap-0 mt-4">
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-center py-2 px-4 font-medium"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : ''}
                                Resend OTP
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-md"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Verify OTP'}
                            </button>
                        </div>
                    </form>
                );
            case 'newPasswordSetup':
                return (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <p className="text-gray-600 text-center text-sm mb-6">Set your new password.</p>
                        <div>
                            <label htmlFor="new-password" className="sr-only">New Password</label>
                            <input
                                id="new-password"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-base"
                                placeholder="New Password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-base"
                                placeholder="Confirm New Password"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-xl animate-fade-in-down ${
                        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                    {toast.type === 'success' ? (
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ) : (
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    )}
                    <span className="font-semibold text-lg">{toast.message}</span>
                </div>
            )}

            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl z-10">
                <div className="text-center mb-8">
                    <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-md text-gray-600">
                        Follow the steps to regain access to your account.
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-10 w-full px-4"> {/* Added horizontal padding */}
                    <ol className="flex justify-between items-center max-w-sm mx-auto">
                        {['Email', 'OTP', 'New Password'].map((stepName, index) => (
                            <li key={index} className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white transition-all duration-300 transform
                                    ${getStepIndex(currentStep) >= index ? 'bg-blue-600 scale-105 shadow-md' : 'bg-gray-300'}`}>
                                    {index + 1}
                                </div>
                                <span className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                                    getStepIndex(currentStep) >= index ? 'text-blue-700' : 'text-gray-500'
                                }`}>
                                    {stepName}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {renderStepContent()}

                <div className="text-center text-sm text-gray-600 mt-6">
                    <p>Remembered your password? {' '}
                        <button
                            type="button"
                            onClick={() => {
                                sessionStorage.removeItem('resetPasswordEmail');
                                navigate('/login');
                            }}
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                            Sign in
                        </button>
                    </p>
                    {onClose && (
                        <p className="mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.removeItem('resetPasswordEmail');
                                    onClose();
                                }}
                                className="font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Go back
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;