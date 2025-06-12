import { useState, useRef, useEffect } from 'react';
import { FiEdit, FiSave, FiX, FiCamera, FiLock } from 'react-icons/fi';
import axios from 'axios';

const ProfileSettings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        bankAccount: '',
        ifsc: '',
        bankName: '',
        vehicleType: 'Bike',
        vehicleNumber: '',
        profilePhoto: ''
    });

    const [tempData, setTempData] = useState({...profileData});
    const fileInputRef = useRef(null);

    // Fetch profile data from backend
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/delivery-executive/profile');
                setProfileData(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile data');
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleEditClick = () => {
        setTempData({...profileData});
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await axios.put('/api/delivery-executive/profile', tempData);
            setProfileData(response.data);
            setIsEditing(false);
            setIsLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('/api/delivery-executive/profile/photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                setProfileData(prev => ({
                    ...prev,
                    profilePhoto: response.data.profilePhotoUrl
                }));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to upload photo');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handlePasswordReset = async () => {
        try {
            setIsLoading(true);
            await axios.post('/api/delivery-executive/reset-password', {
                email: profileData.email
            });
            alert('Password reset link has been sent to your email');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initiate password reset');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl mx-4 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl mx-4">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl mx-4">
            <div className="flex justify-between items-center mb-6 md:mt-0 mt-10 md:px-0 px-10">
                <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
                <button 
                    onClick={handleEditClick}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                    <FiEdit size={16} />
                    <span>Edit</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="md:col-span-2 flex flex-col items-center">
                    <div className="relative mb-4">
                        <img 
                            src={profileData.profilePhoto || 'https://via.placeholder.com/150'} 
                            alt="Profile" 
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                            }}
                        />
                        <button 
                            onClick={handleCameraClick}
                            disabled={isLoading}
                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            <FiCamera size={16} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            disabled={isLoading}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{profileData.name}</h3>
                    <p className="text-gray-500">{profileData.email}</p>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
                    <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-800 font-medium">{profileData.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{profileData.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-gray-800 font-medium">{profileData.phone}</p>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                    <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Bank Details</h4>
                    <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="text-gray-800 font-medium">{profileData.bankAccount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="text-gray-800 font-medium">{profileData.ifsc}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="text-gray-800 font-medium">{profileData.bankName}</p>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-4 md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Vehicle Type</p>
                            <p className="text-gray-800 font-medium">{profileData.vehicleType}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vehicle Number</p>
                            <p className="text-gray-800 font-medium">{profileData.vehicleNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Reset Password */}
                <div className="md:col-span-2 pt-4 border-t">
                    <button 
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                    >
                        <FiLock size={16} />
                        <span>Reset Password</span>
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
                                <button 
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                            <div className="space-y-4">
                                {/* Profile Photo URL */}
                                <div className="flex flex-col items-center">
                                    <img 
                                        src={tempData.profilePhoto || 'https://via.placeholder.com/150'} 
                                        alt="Profile Preview" 
                                        className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                                        <input
                                            type="text"
                                            name="profilePhoto"
                                            value={tempData.profilePhoto}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter image URL"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={tempData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={tempData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={tempData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                                    <input
                                        type="text"
                                        name="bankAccount"
                                        value={tempData.bankAccount}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        name="ifsc"
                                        value={tempData.ifsc}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={tempData.bankName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                    <select
                                        name="vehicleType"
                                        value={tempData.vehicleType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    >
                                        <option value="Bike">Bike</option>
                                        <option value="Scooter">Scooter</option>
                                        <option value="Cycle">Cycle</option>
                                        <option value="Car">Car</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={tempData.vehicleNumber}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        <FiSave size={16} />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;