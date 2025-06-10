import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryExecManagement = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch applications from Spring Boot backend
    useEffect(() => {
        const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/delivery-executives/pending');
            setApplications(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch applications');
            setLoading(false);
            console.error('Error fetching applications:', err);
        }
        };

        fetchApplications();
    }, []);

    const handleVerify = async (id) => {
        try {
        await axios.put(`http://localhost:8080/api/delivery-executives/${id}/verify`);
        setApplications(applications.filter(app => app.id !== id));
        setIsModalOpen(false);
        } catch (err) {
        console.error('Error verifying application:', err);
        setError('Failed to verify application');
        }
    };

    const handleReject = async (id) => {
        try {
        await axios.delete(`http://localhost:8080/api/delivery-executives/${id}`);
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
        <div className="p-4 w-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="p-4 w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            </div>
        </div>
        );
    }

    return (
        <div className="p-4 w-full">
        <h1 className="text-2xl font-bold mb-6">Delivery Executive Applications</h1>
        
        {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
            No pending applications
            </div>
        ) : (
            <div className="space-y-3">
            {applications.map((application) => (
                <div 
                key={application.id}
                className="flex items-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 h-[40px] overflow-hidden"
                onClick={() => handleCardClick(application)}
                >
                <img 
                    src={application.profilePicture || 'https://via.placeholder.com/40'} 
                    alt={application.fullName}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                />
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                    <div className="truncate">
                        <span className="font-medium">{application.fullName}</span>
                        <span className="text-gray-500 text-sm ml-2">{application.email}</span>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap ml-2">
                        Registered: {new Date(application.registrationDate).toLocaleDateString()}
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Modal for detailed view */}
        {isModalOpen && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">Application Details</h2>
                    <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                
                <div className="flex items-center mb-6">
                    <img 
                    src={selectedApplication.profilePicture || 'https://via.placeholder.com/80'} 
                    alt={selectedApplication.fullName}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                    <h3 className="text-lg font-semibold">{selectedApplication.fullName}</h3>
                    <p className="text-gray-600">{selectedApplication.email}</p>
                    <p className="text-sm text-gray-500">
                        Registered: {new Date(selectedApplication.registrationDate).toLocaleDateString()}
                    </p>
                    </div>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.aadharNumber}
                    </div>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.panNumber}
                    </div>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.vehicleNumber}
                    </div>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.vehicleType}
                    </div>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.phoneNumber}
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border border-gray-200">
                        {selectedApplication.address}
                    </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                    onClick={() => handleReject(selectedApplication.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                    Reject
                    </button>
                    <button
                    onClick={() => handleVerify(selectedApplication.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                    Verify
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default DeliveryExecManagement;