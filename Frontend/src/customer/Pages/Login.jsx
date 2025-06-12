import React, { useState } from "react";
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel"; // Assuming this is your background/decorative panel

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator
    const axios = useAxiosInstance();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable button and show loading

        try {
            const response = await axios.post(`/api/auth/login`, {
                email,
                password
            });

            const token = response.data.data.token;
            if (token) {
                const decodedToken = jwtDecode(token);

                if(localStorage.getItem("token") !== null){
                    // Clear previous token and role if they exist
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                }

                localStorage.setItem("token", token);
                localStorage.setItem("role", decodedToken.role);

                // Redirect based on role
                if (decodedToken.role === "ADMIN") {
                    navigate("/admin/home");
                } else if (decodedToken.role === "CUSTOMER") {
                    navigate("/");
                } else if (decodedToken.role === "DELIVERY_EXECUTIVE") {
                    navigate("/executive/dashboard");
                } else {
                    // Fallback for any other roles or default
                    navigate("/");
                }
            } else {
                // Handle cases where token might be missing from response.data.data
                const message = response?.data?.message || "Login failed: No token received. Please try again.";
                alert(message);
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || "Failed to login. Please check your credentials.";
            alert(message); // Provide user feedback for errors
        } finally {
            setIsSubmitting(false); // Re-enable button
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-900 to-purple-950 font-sans">
            {/* Left Panel - Assuming this is for visual flair */}
            <LeftPanel />

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200 text-gray-800"
                >
                    <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-800">
                        Welcome Back!
                    </h2>

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                        />
                    </div>

                    <div className="text-right text-sm mb-6">
                        <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200 ease-in-out">
                            Forgot Password?
                        </a>
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
                        {isSubmitting ? 'Logging In...' : 'Log In'}
                    </button>


                    <div className="text-center text-sm mt-8 text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition duration-200 ease-in-out">
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}