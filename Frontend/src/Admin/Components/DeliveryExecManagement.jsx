import { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const DeliveryExecManagement = () => {
    const axios = useAxiosInstance();
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch applications from Spring Boot backend
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('/api/executives/get-non-verified');
                let fetchedApplications = response.data.data;

                if (!Array.isArray(fetchedApplications)) {
                    console.error("API response.data.data is not an array. Actual type:", typeof fetchedApplications, "Value:", fetchedApplications);
                    if (fetchedApplications && typeof fetchedApplications === 'object') {
                        fetchedApplications = [fetchedApplications];
                    } else {
                        fetchedApplications = [];
                    }
                }

                setApplications(fetchedApplications);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch applications');
                setLoading(false);
                console.error('Error fetching applications:', err);
            }
        };

        fetchApplications();
    }, [axios]);

    const handleVerify = async (id) => {
        try {
            await axios.post(`/api/executives/${id}/accept`);
            setApplications(applications.filter(app => app.id !== id));
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error verifying application:', err);
            setError('Failed to verify application');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.delete(`/api/executives/${id}/reject`);
            setApplications(applications.filter(app => app.id !== id));
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error rejecting application:', err);
            setError('Failed to reject application');
        }
    };

    const handleCardClick = (application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md" role="alert">
                    <strong className="font-bold text-lg">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-500 pb-4 text-center">
                    Delivery Executive Applications
                </h1>

                {applications.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center h-80 transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
                        <svg className="h-20 w-20 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3m-3 0h3m-3 0v3m-3-6h.008v.008H6V6zm-3 6h.008v.008H3V12zm9-6h.008v.008H12V6zm3 0h.008v.008H15V6zM3 18h.008v.008H3V18zm9 0h.008v.008H12V18zm3 0h.008v.008H15V18zM6 12h.008v.008H6V12zm3 6h.008v.008H9V18zm6 0h.008v.008H15V18z" />
                        </svg>
                        <p className="text-2xl text-gray-700 font-semibold mb-3">No pending applications found.</p>
                        <p className="text-md text-gray-600">All applications have been reviewed. Check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300"
                                onClick={() => handleCardClick(application)}
                            >
                                <img
                                    src={application.image || 'https://via.placeholder.com/80'}
                                    alt={application.name}
                                    className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-blue-400 ring-offset-2"
                                />
                                <h3 className="text-xl font-bold text-gray-900 truncate w-full mb-1">{application.name}</h3>
                                <p className="text-sm text-gray-600 truncate w-full mb-3">Email: <span className="font-medium">{application.user?.email}</span></p>
                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        Vehicle Type: {application.vehicleType || 'N/A'}
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
                                    Status: {application.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for detailed view */}
                {isModalOpen && selectedApplication && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-3xl w-full max-w-xl max-h-[95vh] overflow-y-auto transform scale-95 animate-zoom-in border border-blue-200">
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-start mb-6 border-b-2 border-gray-200 pb-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Applicant Details</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex flex-col items-center mb-6">
                                    <img
                                        src={selectedApplication.image || 'https://via.placeholder.com/120'}
                                        alt={selectedApplication.name}
                                        className="w-28 h-28 rounded-full object-cover mb-4 ring-4 ring-blue-500 ring-offset-2 shadow-md"
                                    />
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedApplication.name}</h3>
                                    <p className="text-md text-gray-600 mt-1">{selectedApplication.user?.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Applied On: {new Date(selectedApplication.createdAt).toLocaleDateString()}
                                    </p>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-md font-semibold bg-red-100 text-red-800 border border-red-300 mt-3">
                                        Status: {selectedApplication.status.replace('_', ' ')}
                                    </span>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Personal & Vehicle Information */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                {selectedApplication.user?.phone || 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Type</label>
                                            <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                {selectedApplication.vehicleType || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Information */}
                                    <div className="border-t pt-5 mt-5 border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3">Document Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Number</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.aadharNumber || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.panNumber || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Number</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.vehicleNumber || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.bankName || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Account Number</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.bankAccountNumber || 'N/A'}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank IFSC</label>
                                                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                                    {selectedApplication.executiveDocument?.bankIFSC || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address (still N/A as per your JSON) */}
                                    <div className="border-t pt-5 mt-5 border-gray-200">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                        <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-800 text-base">
                                            N/A (Field not in sample data)
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={() => handleReject(selectedApplication.id)}
                                        className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
                                    >
                                        Reject Application
                                    </button>
                                    <button
                                        onClick={() => handleVerify(selectedApplication.id)}
                                        className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105"
                                    >
                                        Verify Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryExecManagement;