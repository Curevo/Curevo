import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/Config/axiosConfig.js';
import Calendar from '@/Components/Calendar';
import useDoctorAvailability from '@/Hooks/useDoctorAvailability';
import { toast } from 'react-hot-toast';
import assets from '@/Assets/Assets.js';


const AppointmentForm = () => {
    const { doctorId } = useParams();
    const doctorIdNumber = Number(doctorId); // or parseInt(doctorId, 10)
    const navigate = useNavigate();
    const { availabilityTimes, availableDates, availableSlotsPerDate, isLoading, error } = useDoctorAvailability(doctorIdNumber);
    const [customer, setCustomer] = useState(null);

    // 1️⃣ Fetch logged-in user's profile (simulate /api/customers/me)
    useEffect(() => {
        axios.get('/api/customers/me')
            .then(res => setCustomer(res.data.data))
            .catch(err => console.error('Failed to fetch profile', err.res.data.message))
    }, []);


    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        prescription: null
    });

    const [submitting, setSubmitting] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to manage popup visibility

    const handleDateSelect = (date) => {
        const availableTimes = getAvailableTimesForDate(date);
        setFormData((prev) => ({
            ...prev,
            date,
            time: availableTimes.length === 1 ? availableTimes[0] : '', // Auto-select the time
        }));
    };


    const getAvailableTimesForDate = (date) => {
        if (!date) return [];

        const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        const availability = availabilityTimes[dayOfWeek];

        console.log("Day of week:", dayOfWeek);
        console.log("Availability object:", availability);

        return availability && availability.time ? [availability.time] : [];
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'prescription') {
            const file = files[0];
            if (file) {
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (!validTypes.includes(file.type)) {
                    toast.error('Please upload only images (JPEG, PNG) or PDF files');
                    return;
                }

                if (file.size > maxSize) {
                    toast.error('File size should be less than 5MB');
                    return;
                }

                setFormData((prev) => ({ ...prev, prescription: file }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.fullName.trim()) errors.push('Full name is required');
        if (!formData.email.trim()) errors.push('Email is required');
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.push('Invalid email format');
        if (!formData.phone.trim()) errors.push('Phone number is required');
        if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) errors.push('Invalid phone number');
        if (!formData.date) errors.push('Please select an appointment date');
        if (!formData.time) errors.push('Please select an appointment time');
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(error));
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();

            // Prepare the appointment object
            const appointment = {
                name: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                appointmentDate: formData.date,
                appointmentTime: formData.time,
                doctor: {
                    doctorId: doctorId
                },
                customer: {
                    customerId: customer.customerId
                }
            };

            // Append the appointment JSON
            data.append('appointment', new Blob([JSON.stringify(appointment)], {
                type: 'application/json'
            }));

            // Change 'prescriptionFile' to 'image' to match backend expectation
            if (formData.prescription) {
                data.append('image', formData.prescription);
            }

            await axios.post('/api/appointments/book', data);

            toast.success('Appointment booked successfully!');
            navigate('/'
            //     {
            //     state: {
            //         appointmentId: response.data.data.id,
            //         appointmentDetails: {
            //             date: formData.date,
            //             time: formData.time,
            //         }
            //     }
            // }
            );
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
                <p>Error loading availability: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-blue-50 px-4 py-10 sm:px-6 lg:px-8">
            <img src={assets.appointment} alt="" className='max-w-7xl rounded-xl w-full object-cover"'/>
            <div className="max-w-7xl w-full bg-white rounded-xl shadow-md p-6 sm:p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book Appointment Now</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1"
                            required
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="xyz@example.com"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1"
                            required
                        />
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Select Date</label>
                        <button
                            type="button"
                            onClick={() => setIsCalendarOpen(true)}
                            className="inline-flex items-center px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                            {formData.date ? `Selected Date: ${formData.date}` : 'Select a Date'}
                        </button>
                    </div>

                    {/* Time Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Selected Time</label>
                        <div
                            className={`px-3 py-2 mt-1 block w-full rounded-md border-2 ${
                                formData.time
                                    ? 'border-gray-300 bg-gray-100 text-gray-700'
                                    : 'border-red-300 bg-red-50 text-red-600'
                            }`}
                        >
                            {formData.time || 'Select a date to see available time'}
                        </div>
                    </div>

                    {/* Prescription Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 px-2">Upload Prescription (Optional)</label>
                        <input
                            type="file"
                            name="prescription"
                            accept="application/pdf,image/jpeg,image/png"
                            onChange={handleChange}
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: PDF, JPEG, PNG</p>
                    </div>

                    {/* Calendar Popup */}
                    {isCalendarOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white rounded-xl p-5 shadow-lg w-[700px]"> {/* Adjustable Width */}
                                <Calendar
                                    availableDates={availableDates}
                                    availableSlotsPerDate={availableSlotsPerDate}
                                    selectedDate={formData.date}
                                    onSelect={handleDateSelect}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="mt-4 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="sm:col-span-2 flex justify-between items-center">
                        {/*<p className="text-sm text-gray-600">Available on selected days only</p>*/}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`inline-flex items-center px-6 py-2 ${
                                submitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white rounded-md transition-colors`}
                        >
                            {submitting ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;