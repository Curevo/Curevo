import React, { useState, useEffect } from 'react';
import axios from '@/Config/axiosConfig.js';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        message: '',
        date: '',
        time: '',
        prescription: null,
    });

    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        // Fetch available slots using Axios
        axios.get('/api/appointments/slots')
            .then(response => {
                setAvailableDates(response.data.dates);
                setAvailableTimes(response.data.times);
            })
            .catch(error => {
                console.error('Error fetching slots:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'prescription') {
            setFormData({ ...formData, prescription: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('preferredDate', formData.date);
        data.append('preferredTime', formData.time);
        data.append('message', formData.message);
        data.append('prescription', formData.prescription);

        try {
            const response = await axios.post('/api/appointments', data);
            alert(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to book appointment. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center bg-blue-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full bg-white rounded-xl shadow-md p-6 sm:p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book Appointment Now</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="xyz@example.com"
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Preferred Date</label>
                        <select
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        >
                            <option value="">Select a date</option>
                            {availableDates.map((date) => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Preferred Time</label>
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        >
                            <option value="">Select a time</option>
                            {availableTimes.map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="px-2 block text-sm font-medium text-gray-700">Upload Prescription</label>
                        <input
                            type="file"
                            name="prescription"
                            accept="application/pdf,image/*"
                            onChange={handleChange}
                            className="px-3 py-1 mt-1 block w-full text-sm border-2 border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="px-2 block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type message here..."
                            rows={4}
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300"
                            required
                        />
                    </div>
                    <div className="sm:col-span-2 flex justify-between items-center">
                        <p className="text-sm text-gray-600">Monday to Saturday: 09AM - 10PM</p>
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Book Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;
