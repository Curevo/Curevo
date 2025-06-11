import { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const AppointmentDetails = () => {
    const axios = useAxiosInstance();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch appointments from Spring Boot backend
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('/api/appointments/all');
                const fetchedData = response.data.data;

                if (Array.isArray(fetchedData)) {
                    setAppointments(fetchedData);
                } else {
                    console.error("API response.data.data is not an array. Actual type:", typeof fetchedData, "Value:", fetchedData);
                    setAppointments([]);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch appointments. ' + (err.response?.data?.message || err.message));
                setLoading(false);
                console.error('Error fetching appointments:', err);
            }
        };

        fetchAppointments();
    }, [axios]);

    const handleCardClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
        setError(null); // Clear any modal-specific errors on close
    };

    // Handle appointment status update
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            // Note: The API endpoint remains `complete`, but the newStatus parameter will determine the actual status.
            await axios.put(`/api/appointments/complete/${appointmentId}`, {
                status: newStatus
            });

            // Update local state to reflect the status change
            setAppointments(prevAppointments =>
                prevAppointments.map(app =>
                    app.id === appointmentId ? { ...app, status: newStatus } : app
                )
            );

            // If the modal is open, update the selected appointment's status
            if (selectedAppointment?.id === appointmentId) {
                setSelectedAppointment(prevSelected => ({
                    ...prevSelected,
                    status: newStatus
                }));
            }
            setError(null); // Clear any previous error if update is successful
        } catch (err) {
            console.error('Error updating appointment status:', err);
            setError('Failed to update appointment status. ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error && !isModalOpen) {
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
                    Appointment Management
                </h1>

                {appointments.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center h-80 transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
                        <svg className="h-20 w-20 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3m-3 0h3m-3 0v3m-3-6h.008v.008H6V6zm-3 6h.008v.008H3V12zm9-6h.008v.008H12V6zm3 0h.008v.008H15V6zM3 18h.008v.008H3V18zm9 0h.008v.008H12V18zm3 0h.008v.008H15V18zM6 12h.008v.008H6V12zm3 6h.008v.008H9V18zm6 0h.008v.008H15V18z" />
                        </svg>
                        <p className="text-2xl text-gray-700 font-semibold mb-3">No appointments found.</p>
                        <p className="text-md text-gray-600">There are currently no appointments to display.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                onClick={() => handleCardClick(appointment)}
                                className="bg-white p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 border-blue-500 flex flex-col justify-between"
                            >
                                <div className="flex items-center mb-3">
                                    <img
                                        src={appointment.customer?.image || 'https://via.placeholder.com/40'}
                                        alt={appointment.name}
                                        className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{appointment.name}</h3>
                                        <p className="text-gray-600 text-sm">{appointment.age} years old</p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="text-gray-700 font-medium">Dr. {appointment.doctor?.name}</p>
                                    <p className="text-gray-600 text-sm">{appointment.doctor?.specialization}</p>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="text-gray-700">Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                        <p className="text-gray-600">Time: {appointment.appointmentTime.substring(0, 5)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        appointment.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-800'
                                            : appointment.status === 'PENDING_PAYMENT'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : appointment.status === 'CANCELLED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-indigo-100 text-indigo-800'
                                    }`}>
                                        {appointment.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for detailed view */}
                {isModalOpen && selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform scale-95 animate-zoom-in border border-blue-200">
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-start mb-6 border-b-2 border-gray-200 pb-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointment Details</h2>
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

                                {/* Display modal-specific error if any */}
                                {error && isModalOpen && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        {error}
                                    </div>
                                )}

                                {/* Customer Details */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-xl text-gray-800 mb-3 pb-2 border-b border-gray-200">Customer Information</h3>
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={selectedAppointment.customer?.image || 'https://via.placeholder.com/80'}
                                            alt={selectedAppointment.name}
                                            className="w-20 h-20 rounded-full object-cover mr-4 ring-2 ring-blue-300"
                                        />
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{selectedAppointment.name}</p>
                                            <p className="text-gray-700 text-sm">Age: {selectedAppointment.age || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                        <p><span className="font-medium text-gray-700">Phone:</span> {selectedAppointment.phone || selectedAppointment.customer?.user?.phone || 'N/A'}</p>
                                        <p><span className="font-medium text-gray-700">Email:</span> {selectedAppointment.customer?.user?.email || 'N/A'}</p>
                                        <p className="sm:col-span-2"><span className="font-medium text-gray-700">Address:</span> {selectedAppointment.customer?.address || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Doctor Details */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-xl text-gray-800 mb-3 pb-2 border-b border-gray-200">Doctor Information</h3>
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={selectedAppointment.doctor?.image || 'https://via.placeholder.com/80'}
                                            alt={selectedAppointment.doctor?.name}
                                            className="w-20 h-20 rounded-full object-cover mr-4 ring-2 ring-green-300"
                                        />
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">{selectedAppointment.doctor?.name}</p>
                                            <p className="text-gray-700 text-sm">{selectedAppointment.doctor?.specialization || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                        <p><span className="font-medium text-gray-700">Clinic:</span> {selectedAppointment.doctor?.clinic?.name || 'N/A'}</p>
                                        <p><span className="font-medium text-gray-700">Clinic Address:</span> {selectedAppointment.doctor?.clinic?.address || 'N/A'}</p>
                                        <p><span className="font-medium text-gray-700">Doctor's Phone:</span> {selectedAppointment.doctor?.user?.phone || 'N/A'}</p>
                                        <p><span className="font-medium text-gray-700">Doctor's Email:</span> {selectedAppointment.doctor?.user?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Appointment & Financial Details */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-xl text-gray-800 mb-3 pb-2 border-b border-gray-200">Appointment Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                        <div>
                                            <p><span className="font-medium text-gray-700">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                                            <p><span className="font-medium text-gray-700">Time:</span> {selectedAppointment.appointmentTime.substring(0, 5)}</p>
                                            <p className="mb-2">
                                                <span className="font-medium text-gray-700">Status:</span>
                                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                    selectedAppointment.status === 'COMPLETED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : selectedAppointment.status === 'PENDING_PAYMENT'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : selectedAppointment.status === 'CANCELLED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                    {selectedAppointment.status.replace(/_/g, ' ')}
                                                </span>
                                            </p>
                                            {selectedAppointment.prescription && (
                                                <p><span className="font-medium text-gray-700">Prescription:</span>
                                                    <a
                                                        href={selectedAppointment.prescription}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline ml-2 text-sm"
                                                    >
                                                        View File
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <p><span className="font-medium text-gray-700">Base Amount:</span> ₹{selectedAppointment.baseAmount?.toFixed(2) || '0.00'}</p>
                                            <p><span className="font-medium text-gray-700">Service Charge:</span> ₹{selectedAppointment.serviceCharge?.toFixed(2) || '0.00'}</p>
                                            <p><span className="font-medium text-gray-700">Extra Charge:</span> ₹{selectedAppointment.extraCharge?.toFixed(2) || '0.00'}</p>
                                            <p className="text-lg font-bold text-gray-900 mt-2 border-t pt-2 border-gray-200">Total Amount: ₹{selectedAppointment.totalAmount?.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end mt-8">
                                    {selectedAppointment.status !== 'COMPLETED' && selectedAppointment.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => updateAppointmentStatus(
                                                selectedAppointment.id,
                                                selectedAppointment.status === 'PENDING_PAYMENT' ? 'CONFIRMED' : 'COMPLETED'
                                            )}
                                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetails;