import { useState } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel";
import OTPVerifyPopup from '@/Components/OTPVerifyPopup';


export default function Signup() {
    const navigate = useNavigate();
    const axios = useAxiosInstance();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [isOtpPopupOpen, setOtpPopupOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');


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

        if (!formData.termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await axios.post(`/api/customers/register`, {
                name: formData.name,
                user: {
                    email: formData.email,
                    password: formData.password,

                }});

            setUserEmail(formData.email); // Set the dynamic email
            setOtpPopupOpen(true); // Show OTP popup
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to create account. Please try again.");
            alert("Failed to create account. Please try again.");
        }

    };

    return (
        <div className="flex h-screen bg-[#2d2d44]">
            <LeftPanel />
            <div className="w-full lg:w-1/2 flex justify-center items-center">
                <form
                    onSubmit={handleSignup}
                    className="w-full max-w-xl p-8 bg-[#1e1e2f] rounded-[30px] text-white shadow-lg"
                >
                    <h2 className="text-2xl font-bold mb-6">Create an account</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input mb-4"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input mb-4"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input mb-4"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input mb-4"
                        required
                    />

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span>
                            I agree to the{" "}
                            <a href="#" className="text-blue-400 underline">
                                Terms & Conditions
                            </a>
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-md py-2 text-white font-semibold mb-4"
                    >
                        Create account
                    </button>

                    <div className="flex items-center justify-between mt-4 gap-2">
                        <button className="flex-1 bg-white text-black py-2 rounded-md shadow">
                            Google
                        </button>
                        <button className="flex-1 bg-white text-black py-2 rounded-md shadow">
                            Apple
                        </button>
                    </div>

                    <div className="text-center text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 hover:underline">
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
            <OTPVerifyPopup
                isOpen={isOtpPopupOpen}
                onClose={() => setOtpPopupOpen(false)}
                email={userEmail}
            />

        </div>
    );
}
