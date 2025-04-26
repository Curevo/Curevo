import {useState} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../../components/LeftPanel";

export default function Signup() {
    const navigate = useNavigate();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        termsAccepted: false,
    })

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

        try {
            const response = await axios.post("${BACKEND_URL}/api/auth/signup", {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            alert("Account created successfully!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Failed to create account. Please try again.");
        }
    }

    return (
        <div className="flex h-screen bg-[#2d2d44]">
        <LeftPanel/>
        <div className="w-full lg:w-1/2 flex justify-center items-center">
            <form 
                onSubmit={handleSignup}
                className="w-full max-w-xl p-8 bg-[#1e1e2f] rounded-[30px] text-white shadow-lg"
            >
            <h2 className="text-2xl font-bold mb-6">Create an account</h2>

            <div className="flex gap-2 mb-4">
                <input 
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                />
            </div>
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

            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mr-2"
                />
                <span>I agree to the <a href="#" className="text-blue-400 underline">Terms & Conditions</a></span>
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-md py-2 text-white font-semibold mb-4"
            >
                Create account
            </button>

            <div className="flex items-center justify-between mt-4 gap-2">
                <button className="flex-1 bg-white text-black py-2 rounded-md shadow">Google</button>
                <button className="flex-1 bg-white text-black py-2 rounded-md shadow">Apple</button>
            </div>

            <div className="text-center text-sm mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
            </div>
            </form>
        </div>
        </div>
    );
}
