import { useState, useRef, useEffect } from 'react';
import { FiEdit, FiSave, FiX, FiCamera, FiLock } from 'react-icons/fi';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProfileSettings = () => {
    const axios = useAxiosInstance();
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [executiveId, setExecutiveId] = useState(null); // To store the executive's ID for updates
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        bankAccount: '', // Maps to executiveDocument.bankAccountNumber
        ifsc: '',        // Maps to executiveDocument.bankIFSC
        bankName: '',    // Maps to executiveDocument.bankName
        vehicleType: 'Bike',
        vehicleNumber: '', // Maps to executiveDocument.vehicleNumber
        profilePhoto: '', // Maps to image
        aadharNumber: '',
        panNumber: ''
    });

    // tempData holds editable values, starts as a copy of profileData
    const [tempData, setTempData] = useState({ ...profileData });
    // selectedNewImageFile holds the actual File object for upload
    const [selectedNewImageFile, setSelectedNewImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch profile data from backend
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/executives/me');
                const apiData = response.data.data; // Access the 'data' field of the ApiResponse

                if (apiData) {
                    setExecutiveId(apiData.id); // Store the executive ID

                    const fetchedProfile = {
                        name: apiData.name || '',
                        email: apiData.user?.email || '',
                        phone: apiData.user?.phone || '',
                        bankAccount: apiData.executiveDocument?.bankAccountNumber || '',
                        ifsc: apiData.executiveDocument?.bankIFSC || '',
                        bankName: apiData.executiveDocument?.bankName || '',
                        vehicleType: apiData.vehicleType || 'Bike', // Default if null
                        vehicleNumber: apiData.executiveDocument?.vehicleNumber || '',
                        profilePhoto: apiData.image || 'https://via.placeholder.com/150', // Default image
                        aadharNumber: apiData.executiveDocument?.aadharNumber || '',
                        panNumber: apiData.executiveDocument?.panNumber || ''
                    };
                    setProfileData(fetchedProfile);
                    setTempData(fetchedProfile); // Initialize tempData with fetched data
                } else {
                    setError('No executive data found.');
                }
            } catch (err) {
                console.error('Failed to fetch profile data:', err);
                setError(err.response?.data?.message || 'Failed to fetch profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [axios]);

    const handleEditClick = () => {
        setTempData({ ...profileData }); // Reset tempData to current profileData when editing
        setSelectedNewImageFile(null); // Clear any pending new image selection
        setError(null); // Clear previous errors
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!executiveId) {
            setError('Executive ID not found. Cannot update profile.');
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            // CONSTRUCT THE DeliveryExecutiveDTO PAYLOAD WITH A FLAT STRUCTURE
            // Use tempData for editable fields.
            // Use profileData for read-only fields (email, phone, aadharNumber, panNumber)
            // to ensure their original values are always sent.
            const executiveDTO = {
                // Fields from DeliveryExecutive entity
                name: tempData.name,
                vehicleType: tempData.vehicleType,
                // If status was editable, it would be tempData.status

                // Fields from User entity (flattened into main DTO)
                email: profileData.email, // Read-only, send original
                phone: profileData.phone, // Read-only, send original

                // Fields from ExecutiveDocument entity (flattened into main DTO)
                aadharNumber: profileData.aadharNumber, // Read-only, send original
                panNumber: profileData.panNumber,       // Read-only, send original
                bankAccountNumber: tempData.bankAccount,
                bankIFSC: tempData.ifsc,
                bankName: tempData.bankName,
                vehicleNumber: tempData.vehicleNumber,
            };

            // Append the DTO as a JSON Blob
            formData.append('executive', new Blob([JSON.stringify(executiveDTO)], { type: 'application/json' }));

            // Append the image file ONLY if a new one was selected
            if (selectedNewImageFile) {
                formData.append('image', selectedNewImageFile);
            }

            // Axio handles Content-Type for FormData automatically
            const response = await axios.put(`/api/executives/update/${executiveId}`, formData);

            // Update profileData with the new data returned from the backend
            const apiData = response.data.data;
            const updatedProfile = {
                name: apiData.name || '',
                email: apiData.user?.email || '',
                phone: apiData.user?.phone || '',
                bankAccount: apiData.executiveDocument?.bankAccountNumber || '',
                ifsc: apiData.executiveDocument?.bankIFSC || '',
                bankName: apiData.executiveDocument?.bankName || '',
                vehicleType: apiData.vehicleType || 'Bike',
                vehicleNumber: apiData.executiveDocument?.vehicleNumber || '',
                profilePhoto: apiData.image || 'https://via.placeholder.com/150',
                aadharNumber: apiData.executiveDocument?.aadharNumber || '',
                panNumber: apiData.executiveDocument?.panNumber || ''
            };
            setProfileData(updatedProfile);
            setTempData(updatedProfile); // Also update tempData to reflect saved changes
            setSelectedNewImageFile(null); // Clear the selected file after successful save
            setIsEditing(false);
            setError(null); // Clear any errors
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempData({ ...profileData }); // Revert tempData to original profileData
        setSelectedNewImageFile(null); // Clear any pending new image selection
        setError(null); // Clear errors
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCameraClick = () => {
        if (!isEditing) { // Only allow camera click if not in editing mode
            fileInputRef.current.click();
        }
    };

    // This now only handles selection and preview, actual upload is in handleSave
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedNewImageFile(file); // Store the actual file
            setTempData(prev => ({
                ...prev,
                profilePhoto: URL.createObjectURL(file) // For immediate preview
            }));
        }
    };

    // Simplified password reset: just navigate
    const handlePasswordReset = () => {
        navigate('/reset-password');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error && !isEditing) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg shadow-md mx-auto max-w-md text-center">
                <p className="text-red-700 font-semibold mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">Profile Settings</h2>
                        <button
                            onClick={handleEditClick}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <FiEdit size={18} />
                            <span>Edit Profile</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Photo & Basic Info */}
                        <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg shadow-inner">
                            <div className="relative mb-6">
                                <img
                                    src={profileData.profilePhoto}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                />
                                <button
                                    onClick={handleCameraClick}
                                    disabled={isLoading || isEditing}
                                    className="absolute bottom-0 right-0 bg-blue-700 text-white p-2.5 rounded-full hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    title="Upload Profile Photo"
                                >
                                    <FiCamera size={18} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isLoading || isEditing}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h3>
                            <p className="text-blue-700 font-medium text-center">{profileData.email}</p>
                            <p className="text-gray-600 text-sm mt-1">{profileData.phone || 'Phone not set'}</p>
                        </div>

                        {/* Personal & Bank Details & Vehicle Info - Column 2 & 3 */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-inner col-span-1">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Personal Details</h4>
                                <div className="space-y-4">
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
                                        <p className="text-gray-800 font-medium">{profileData.phone || 'N/A'}</p>
                                    </div>
                                    {profileData.aadharNumber && (
                                        <div>
                                            <p className="text-sm text-gray-500">Aadhar Number</p>
                                            <p className="text-gray-800 font-medium">{profileData.aadharNumber}</p>
                                        </div>
                                    )}
                                    {profileData.panNumber && (
                                        <div>
                                            <p className="text-sm text-gray-500">PAN Number</p>
                                            <p className="text-gray-800 font-medium">{profileData.panNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-inner col-span-1">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Bank Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Account Number</p>
                                        <p className="text-gray-800 font-medium">{profileData.bankAccount || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">IFSC Code</p>
                                        <p className="text-gray-800 font-medium">{profileData.ifsc || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Bank Name</p>
                                        <p className="text-gray-800 font-medium">{profileData.bankName || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-inner md:col-span-2">
                                <h4 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Vehicle Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Vehicle Type</p>
                                        <p className="text-gray-800 font-medium">{profileData.vehicleType || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Vehicle Number</p>
                                        <p className="text-gray-800 font-medium">{profileData.vehicleNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reset Password */}
                            <div className="md:col-span-2 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handlePasswordReset}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <FiLock size={18} />
                                    <span className="font-medium">Reset Password</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform scale-95 opacity-0 animate-scale-in">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-center pb-5 mb-6 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {error && <div className="mb-6 text-red-700 bg-red-100 border border-red-200 p-3 rounded-md text-sm font-medium">{error}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Profile Photo Upload Field */}
                                <div className="md:col-span-2 flex flex-col items-center mb-4">
                                    <img
                                        src={tempData.profilePhoto || 'https://via.placeholder.com/150'}
                                        alt="Profile Preview"
                                        className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-300 shadow-md"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <label htmlFor="image-upload-modal" className="block text-base font-medium text-blue-700 mb-2 cursor-pointer px-5 py-2.5 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-sm">
                                        <FiCamera className="inline mr-2" /> Change Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="image-upload-modal"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    {selectedNewImageFile && (
                                        <p className="text-sm text-gray-600 mt-2">Selected: <span className="font-semibold">{selectedNewImageFile.name}</span></p>
                                    )}
                                </div>

                                {/* Form Fields */}
                                {/* Personal Information Section */}
                                <div className="md:col-span-1 space-y-5">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Personal Info</h4>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={tempData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={tempData.email}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            disabled={true} // Email is read-only
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={tempData.phone}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            disabled={true} // Phone number is read-only
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Aadhar Number</label>
                                        <input
                                            type="text"
                                            id="aadharNumber"
                                            name="aadharNumber"
                                            value={tempData.aadharNumber}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            disabled={true} // Aadhar is read-only
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number</label>
                                        <input
                                            type="text"
                                            id="panNumber"
                                            name="panNumber"
                                            value={tempData.panNumber}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            disabled={true} // PAN is read-only
                                        />
                                    </div>
                                </div>

                                {/* Bank and Vehicle Information Section */}
                                <div className="md:col-span-1 space-y-5">
                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Bank Details</h4>
                                    <div>
                                        <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account Number</label>
                                        <input
                                            type="text"
                                            id="bankAccount"
                                            name="bankAccount"
                                            value={tempData.bankAccount}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-1.5">IFSC Code</label>
                                        <input
                                            type="text"
                                            id="ifsc"
                                            name="ifsc"
                                            value={tempData.ifsc}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
                                        <input
                                            type="text"
                                            id="bankName"
                                            name="bankName"
                                            value={tempData.bankName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 mt-8">Vehicle Info</h4>
                                    <div>
                                        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
                                        <select
                                            id="vehicleType"
                                            name="vehicleType"
                                            value={tempData.vehicleType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out bg-white"
                                            disabled={isLoading}
                                        >
                                            <option value="Bike">Bike</option>
                                            <option value="Scooter">Scooter</option>
                                            <option value="Cycle">Cycle</option>
                                            <option value="Car">Car</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Number</label>
                                        <input
                                            type="text"
                                            id="vehicleNumber"
                                            name="vehicleNumber"
                                            value={tempData.vehicleNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {isLoading ? (
                                        <span className="animate-spin inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        <FiSave size={18} />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProfileSettings;