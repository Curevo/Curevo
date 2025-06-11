import React, { useState } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel2";
import OTPVerifyPopup from '@/Components/OTPVerifyPopup'; // Assuming this component exists

export default function Signup() {
    const navigate = useNavigate();
    const axios = useAxiosInstance();

    // State for OTP popup
    const [isOtpPopupOpen, setOtpPopupOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading indicator

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable button and show loading

        if (!formData.termsAccepted) {
            alert("Please accept the terms and conditions to create an account.");
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match. Please re-enter.");
            setIsSubmitting(false);
            return;
        }

        // Basic password strength check (optional, but good practice)
        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            setIsSubmitting(false);
            return;
        }


        try {
            await axios.post(`/api/customers/register`, {
                name: formData.name,
                user: {
                    email: formData.email,
                    password: formData.password,
                }
            });

            setUserEmail(formData.email); // Set the email for OTP verification
            setOtpPopupOpen(true); // Show OTP popup

        } catch (error) {
            console.error("Signup error:", error.response?.data?.message || "Failed to create account.");
            alert(error.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsSubmitting(false); // Re-enable button
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-900 to-purple-950 font-sans">
            <LeftPanel />
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
                <form
                    onSubmit={handleSignup}
                    className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200 text-gray-800"
                >
                    <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-800">
                        Create Your Account
                    </h2>

                    <div className="mb-5">
                        <label htmlFor="name" className="block text-gray-600 text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="e.g., Jane Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" // Styled checkbox
                        />
                        <label htmlFor="termsAccepted" className="text-gray-600 text-sm">
                            I agree to the{" "}
                            <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200 ease-in-out">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isSubmitting} // Disable button during submission
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="text-center text-sm mt-8 text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition duration-200 ease-in-out">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
            <OTPVerifyPopup
                isOpen={isOtpPopupOpen}
                onClose={() => setOtpPopupOpen(false)}
                email={userEmail}
                userType="customer"
            />
        </div>
    );
}