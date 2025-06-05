import {useState} from "react";
import axios from '@/Config/axiosConfig.js';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import LeftPanel from "../../Components/LeftPanel";


export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const response = useRef(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/auth/login`, {
                email,
                password
            });

            const token = response.data.data.token;
            if (token) {
                const decodedToken = jwtDecode(token);

                localStorage.setItem("token", token);
                localStorage.setItem("role", decodedToken.role);

                if (decodedToken.role === "ADMIN") {
                    navigate("/admin-dashboard");
                } else if (decodedToken.role === "DOCTOR") {
                    navigate("/doctor-dashboard");
                } else if (decodedToken.role === "CUSTOMER") {
                    navigate("/UserProfile");
                } else {
                    navigate("/");
                }
            } else {
                const message = response?.data?.message || "Failed to login. Please try again.";
                alert(message);
            }
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || "Failed to login. Please try again.";
            alert(message);
        }
    };


    return (
        <div className="flex h-screen bg-[#2d2d44]">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex justify-center items-center">
            <form 
                onSubmit={handleLogin}
                className="w-full max-w-md p-8 bg-[#1e1e2f] rounded-[30px] text-white shadow-lg"
            >
            <h2 className="text-2xl font-bold mb-6">Log in</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mb-4"
                required
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mb-2"
                required
            />

            <div className="text-right text-sm mb-6">
                <a href="#" className="text-blue-400 hover:underline">Forgot Password?</a>
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-md py-2 text-white font-semibold mb-4"
            >
                Log in
            </button>

            <div className="flex items-center justify-between mt-4 gap-2">
                <button className="flex-1 bg-white text-black py-2 rounded-md shadow">Google</button>
                <button className="flex-1 bg-white text-black py-2 rounded-md shadow">Apple</button>
            </div>

            <div className="text-center text-sm mt-6">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:underline">Create Account</Link>
            </div>
            </form>
        </div>
        </div>
    );
}
