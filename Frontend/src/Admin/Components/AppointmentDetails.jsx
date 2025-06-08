import { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentDetails = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch appointments from Spring Boot backend
    useEffect(() => {
        const fetchAppointments = async () => {
        try {
            const response = await axios.post('/api/appointments');
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            console.error('Error fetching appointments:', err);
        }
        };

        fetchAppointments();
    }, []);

    const handleCardClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    // Handle appointment status update
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
        await axios.put(`/api/appointments/${appointmentId}/status`, {
            status: newStatus
        });
        
        // Update local state
        setAppointments(appointments.map(app => 
            app.id === appointmentId ? { ...app, status: newStatus } : app
        ));
        
        if (selectedAppointment?.id === appointmentId) {
            setSelectedAppointment({
            ...selectedAppointment,
            status: newStatus
            });
        }
        } catch (err) {
        console.error('Error updating appointment status:', err);
        }
    };

    if (loading) {
        return (
        <div className="w-[80%] mx-auto p-4 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="w-[80%] mx-auto p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            </div>
        </div>
        );
    }

    return (
        <div className="w-[80%] mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointment Management</h1>
        
        {appointments.length === 0 ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            No appointments found.
            </div>
        ) : (
            <div className="space-y-4">
            {appointments.map((appointment) => (
                <div 
                key={appointment.id}
                onClick={() => handleCardClick(appointment)}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg border-l-4 border-blue-500"
                >
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                    <h3 className="font-semibold text-lg text-gray-800">{appointment.patient.name}</h3>
                    <p className="text-gray-600">{appointment.patient.age} years</p>
                    </div>
                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                    <p className="text-gray-700">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">{appointment.appointmentTime}</p>
                    </div>
                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                    <p className="text-gray-700">{appointment.doctor.name}</p>
                    <p className="text-gray-600 text-sm">{appointment.doctor.specialization}</p>
                    </div>
                    <div className="w-full md:w-1/4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {appointment.status}
                    </span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedAppointment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                    <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Patient Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Patient Information</h3>
                    <div className="space-y-3">
                        <p><span className="font-medium">Name:</span> {selectedAppointment.patient.name}</p>
                        <p><span className="font-medium">Age:</span> {selectedAppointment.patient.age}</p>
                        <p><span className="font-medium">Phone:</span> {selectedAppointment.patient.phone}</p>
                        <p><span className="font-medium">Email:</span> {selectedAppointment.patient.email}</p>
                        <p><span className="font-medium">Address:</span> {selectedAppointment.patient.address}</p>
                        <p><span className="font-medium">Medical History:</span> {selectedAppointment.patient.medicalHistory || 'None'}</p>
                    </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Doctor Information</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                        {selectedAppointment.doctor.image ? (
                            <img 
                            src={selectedAppointment.doctor.image} 
                            alt={selectedAppointment.doctor.name}
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                            No Image
                            </div>
                        )}
                        </div>
                        <div className="flex-1 space-y-3">
                        <p><span className="font-medium">Name:</span> {selectedAppointment.doctor.name}</p>
                        <p><span className="font-medium">Specialization:</span> {selectedAppointment.doctor.specialization}</p>
                        <p><span className="font-medium">Clinic:</span> {selectedAppointment.doctor.clinic}</p>
                        <p><span className="font-medium">Contact:</span> {selectedAppointment.doctor.phone}</p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Appointment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p><span className="font-medium">Date:</span> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
                        <p><span className="font-medium">Time:</span> {selectedAppointment.appointmentTime}</p>
                        <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            selectedAppointment.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedAppointment.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {selectedAppointment.status}
                        </span>
                        </p>
                    </div>
                    <div>
                        <p><span className="font-medium">Reason:</span> {selectedAppointment.reason || 'Not specified'}</p>
                        {selectedAppointment.prescriptionUrl && (
                        <p><span className="font-medium">Prescription:</span> 
                            <a 
                            href={selectedAppointment.prescriptionUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-2"
                            >
                            View File
                            </a>
                        </p>
                        )}
                    </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-3 border-b pb-2">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <p><span className="font-medium">Account Holder:</span> {selectedAppointment.account?.name || selectedAppointment.patient.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedAppointment.account?.email || selectedAppointment.patient.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedAppointment.account?.phone || selectedAppointment.patient.phone}</p>
                    </div>
                    <div>
                    <p><span className="font-medium">Account Created:</span> {new Date(selectedAppointment.account?.createdAt || selectedAppointment.patient.registrationDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last Login:</span> {selectedAppointment.account?.lastLogin ? new Date(selectedAppointment.account.lastLogin).toLocaleDateString() : 'Never logged in'}</p>
                    <p><span className="font-medium">Account Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedAppointment.account?.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800' 
                            : selectedAppointment.account?.status === 'SUSPENDED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {selectedAppointment.account?.status || 'UNKNOWN'}
                        </span>
                    </p>
                    </div>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-end gap-3 mt-6">
                    <button 
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'CANCELLED')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                    Cancel Appointment
                    </button>
                    <button 
                    onClick={() => updateAppointmentStatus(selectedAppointment.id, 'CONFIRMED')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                    Confirm Appointment
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                    Reschedule
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default AppointmentDetails;