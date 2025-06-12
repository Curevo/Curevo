import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import OTPVerifyPopup from './OTPVerifyPopup';

const DeliveryExecutiveRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        aadharNumber: '',
        panNumber: '',
        bankAccountNumber: '',
        bankIFSC: '',
        bankName: '',
        vehicleNumber: '',
        vehicleType: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        photo: null
    });
    const axios = useAxiosInstance();
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [showOTPPopup, setShowOTPPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
            setErrors({ ...errors, passwordMatch: '' });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.photo) {
            newErrors.photo = 'Photo is required';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.passwordMatch = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (validateForm()) {
            setLoading(true);

            // Corrected: Initialize FormData correctly here
            const submitData = new FormData();

            if (formData.photo) {
                submitData.append('image', formData.photo);
            }

            const executiveDTO = {
                name: formData.name,
                aadharNumber: formData.aadharNumber,
                panNumber: formData.panNumber,
                bankAccountNumber: formData.bankAccountNumber,
                bankIFSC: formData.bankIFSC,
                bankName: formData.bankName,
                vehicleNumber: formData.vehicleNumber,
                vehicleType: formData.vehicleType,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                password: formData.password,
            };

            // Append the DTO as a JSON string under the 'executive' part name
            submitData.append('executive', new Blob([JSON.stringify(executiveDTO)], { type: 'application/json' }));

            try {
                const response = await axios.post('/api/executives/register', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Registration successful:', response.data.data);
                setShowOTPPopup(true);
            } catch (error) {
                console.error('Registration error:', error);
                setApiError(
                    error.response?.data?.message ||
                    'An error occurred during registration. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseOTPPopup = () => {
        setShowOTPPopup(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
                <Link
                    to="/"
                    className="absolute top-4 left-4 text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Website
                </Link>

                <div className="mb-8 flex flex-col items-center">
                    <img src="/Assets/Curevo-logo.png" alt="" className='w-36' />
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Delivery Executive Registration</h2>
                    <p className="text-gray-500 mt-1">Join our team and start delivering with Curevo!</p>
                </div>

                {apiError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Photo*
                        </label>
                        <div className="flex items-center gap-4">
                            <div
                                onClick={triggerFileInput}
                                className={`w-20 h-20 rounded-full border-2 ${errors.photo ? 'border-red-500' : 'border-gray-300'} flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                                >
                                    {preview ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 2MB)</p>
                                {errors.photo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                name="photo"
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/jpeg, image/png"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name*
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-3 border ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Enter your full name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">
                            Aadhar Number*
                        </label>
                        <input
                            type="text"
                            name="aadharNumber"
                            id="aadharNumber"
                            value={formData.aadharNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter 12-digit Aadhar Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                            PAN Number*
                        </label>
                        <input
                            type="text"
                            name="panNumber"
                            id="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter PAN Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
                            Bank Account Number*
                        </label>
                        <input
                            type="text"
                            name="bankAccountNumber"
                            id="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Bank Account Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bankIFSC" className="block text-sm font-medium text-gray-700">
                            Bank IFSC Code*
                        </label>
                        <input
                            type="text"
                            name="bankIFSC"
                            id="bankIFSC"
                            value={formData.bankIFSC}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter IFSC Code"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                            Bank Name*
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            id="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Bank Name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                            Vehicle Number*
                        </label>
                        <input
                            type="text"
                            name="vehicleNumber"
                            id="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Vehicle Number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                            Vehicle Type*
                        </label>
                        <select
                            name="vehicleType"
                            id="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        >
                            <option value="" disabled>Select Vehicle Type</option>
                            <option value="bike">Bike</option>
                            <option value="scooter">Scooter</option>
                            <option value="car">Car</option>
                            <option value="bicycle">Bicycle</option>
                            <option value="electric_bike">Electric Bike</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number*
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Phone Number"
                            required
                        />
                    </div>

                    <hr className="my-4 border-t border-gray-300" />

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email*
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Email Address"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password*
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter Password (min 8 characters)"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password*
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-3 border ${
                                errors.passwordMatch ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            placeholder="Confirm Password"
                            required
                        />
                        {errors.passwordMatch && (
                            <p className="mt-1 text-sm text-red-600">{errors.passwordMatch}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register as Delivery Executive'}
                        </button>
                    </div>
                </form>

                {showOTPPopup && (
                    <OTPVerifyPopup
                        email={formData.email}
                        isOpen={showOTPPopup}
                        onClose={handleCloseOTPPopup}
                        userType="deliveryExecutive"
                    />
                )}
            </div>
        </div>
    );
};

export default DeliveryExecutiveRegister;