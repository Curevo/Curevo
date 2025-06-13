import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import direct axios
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel";

// Enhanced Modal Component (retained for context, assumes it's defined elsewhere or here)
const Modal = ({ message, onClose, title = "Notification" }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-7 w-full max-w-sm flex flex-col items-center transform scale-95 animate-zoom-in border border-gray-200">
                <h3 className="text-2xl font-bold text-center text-blue-700 mb-4">
                    {title}
                </h3>
                <p className="text-gray-700 text-center text-base leading-relaxed mb-6">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null); // For general login errors
    const [showAuthErrorModal, setShowAuthErrorModal] = useState(false); // For 401/403 from interceptor

    // Create a local axios instance for login, without interceptors
    const loginAxios = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL || 'https://api.example.com/v1',
        timeout: 60000,
    });

    // Effect to check for navigation state and show modal
    useEffect(() => {
        if (location.state?.showAuthErrorModal) {
            setShowAuthErrorModal(true);
            // Clear the state after reading it to prevent re-showing on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null); // Clear previous error messages

        try {
            // Use the local 'loginAxios' instance for this request
            const response = await loginAxios.post(`/api/auth/login`, {
                email,
                password
            });

            const token = response.data.data.token;
            if (token) {
                const decodedToken = jwtDecode(token);

                if(localStorage.getItem("token") !== null){
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                }

                localStorage.setItem("token", token);
                localStorage.setItem("role", decodedToken.role);

                if (decodedToken.role === "ADMIN") {
                    navigate("/admin/home");
                } else if (decodedToken.role === "CUSTOMER") {
                    navigate("/");
                } else if (decodedToken.role === "DELIVERY_EXECUTIVE") {
                    navigate("/executive/dashboard");
                } else {
                    navigate("/");
                }
            } else {
                const message = response?.data?.message || "Login failed: No token received. Please try again.";
                setErrorMessage(message);
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || "Failed to login. Please check your credentials.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
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
                            name="email" // Added name attribute
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                            autoComplete="username" // Added autocomplete attribute
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password" // Added name attribute
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition duration-200 ease-in-out"
                            required
                            autoComplete="current-password" // Added autocomplete attribute
                        />
                    </div>

                    <div className="text-right text-sm mb-6">
                        <a href="/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline transition duration-200 ease-in-out">
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isSubmitting ? 'Logging In...' : 'Log In'}
                    </button>

                    {/* Display general login errors (e.g., wrong credentials) */}
                    <Modal
                        title="Login Failed"
                        message={errorMessage}
                        onClose={() => setErrorMessage(null)}
                    />

                    <div className="text-center text-sm mt-8 text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition duration-200 ease-in-out">
                            Create Account
                        </Link>
                    </div>
                </form>
            </div>

            {/* Auth Error Modal for 401/403 triggered by global interceptor */}
            <Modal
                title="Session Expired"
                message={showAuthErrorModal ? "Your session has expired due to inactivity or unauthorized access. Please log in again to continue." : null}
                onClose={() => setShowAuthErrorModal(false)}
            />
        </div>
    );
}