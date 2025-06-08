/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import Calendar from '@/Components/Calendar';
import useDoctorAvailability from '@/Hooks/useDoctorAvailability';
import { toast } from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AppointmentForm = () => {
    const { doctorId } = useParams();
    const axios = useAxiosInstance();
    const doctorIdNumber = Number(doctorId);
    const navigate = useNavigate();
    const { availabilityTimes, availableDates, availableSlotsPerDate, isLoading, error } = useDoctorAvailability(doctorIdNumber);
    const [customer, setCustomer] = useState(null);

    // Fetch logged-in user's profile
    useEffect(() => {
        axios.get('/api/customers/me')
            .then(res => setCustomer(res.data.data))
            .catch(err => console.error('Failed to fetch profile', err.response?.data?.message))
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        prescription: null,
        userLatitude: '',
        userLongitude: '',
        clinicId: ''
    });

    const [clinics, setClinics] = useState([]);
    const [locationError, setLocationError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    const mapRef = useRef(null);
    const routeControlRef = useRef(null);

    // Fetch clinics for the doctor
    useEffect(() => {
        if (doctorId) {
            axios.get(`/api/doctors/${doctorId}/clinics`)
                .then(res => setClinics(res.data.data))
                .catch(err => console.error('Failed to fetch clinics', err));
        }
    }, [doctorId]);

    // Initialize map
    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current) {
            const mapInstance = L.map('map', {
                zoomControl: false,
                preferCanvas: true
            }).setView([20.5937, 78.9629], 5);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);

            L.control.zoom({ position: 'topright' }).addTo(mapInstance);
            
            mapRef.current = mapInstance;

            return () => {
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, []);

    // Update map with routing
    useEffect(() => {
        if (!mapRef.current || !formData.userLatitude || !formData.userLongitude || !formData.clinicId) return;

        const selectedClinic = clinics.find(c => c.clinicId === formData.clinicId);
        if (!selectedClinic) return;

        // Clear previous layers
        mapRef.current.eachLayer(layer => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Control) {
                mapRef.current.removeLayer(layer);
            }
        });

        // Add markers
        const userIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const clinicIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const userMarker = L.marker([formData.userLatitude, formData.userLongitude], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup("Your Location");
        
        const clinicMarker = L.marker([selectedClinic.latitude, selectedClinic.longitude], { icon: clinicIcon })
            .addTo(mapRef.current)
            .bindPopup(`<b>${selectedClinic.name}</b><br>${selectedClinic.address}`);

        // Calculate route using OSRM
        const calculateRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${formData.userLongitude},${formData.userLatitude};${selectedClinic.longitude},${selectedClinic.latitude}?overview=full&geometries=geojson`
                );
                
                const data = await response.json();
                
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    
                    // Draw the route
                    L.polyline(routeCoordinates, {
                        color: '#3b82f6',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '5, 5'
                    }).addTo(mapRef.current);
                    
                    // Add route info control
                    const distance = (route.distance / 1000).toFixed(1);
                    const duration = (route.duration / 60).toFixed(0);
                    
                    const routeControl = L.control({ position: 'bottomright' });
                    routeControl.onAdd = function() {
                        const div = L.DomUtil.create('div', 'route-info');
                        div.innerHTML = `
                            <div class="bg-white p-2 rounded shadow-md">
                                <p class="font-semibold">Route Information</p>
                                <p>Distance: ${distance} km</p>
                                <p>Duration: ~${duration} min</p>
                            </div>
                        `;
                        return div;
                    };
                    routeControl.addTo(mapRef.current);
                    routeControlRef.current = routeControl;
                    
                    // Fit bounds to show route
                    const bounds = L.latLngBounds(routeCoordinates);
                    mapRef.current.fitBounds(bounds.pad(0.2));
                }
            } catch (error) {
                console.error('Error calculating route:', error);
                // Fallback to straight line
                L.polyline([
                    [formData.userLatitude, formData.userLongitude],
                    [selectedClinic.latitude, selectedClinic.longitude]
                ], { color: '#3b82f6', dashArray: '5, 5' }).addTo(mapRef.current);
                
                const group = new L.FeatureGroup([userMarker, clinicMarker]);
                mapRef.current.fitBounds(group.getBounds().pad(0.2));
            }
        };

        calculateRoute();

        return () => {
            if (routeControlRef.current) {
                mapRef.current.removeControl(routeControlRef.current);
            }
        };
    }, [formData.userLatitude, formData.userLongitude, formData.clinicId, clinics]);

    const handleLocationRequest = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        userLatitude: position.coords.latitude,
                        userLongitude: position.coords.longitude
                    }));
                    setLocationError(null);
                    toast.success("Location captured successfully!");
                },
                (error) => {
                    setLocationError("Unable to retrieve your location. Please enable location services.");
                    toast.error("Location access denied");
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    const handleDateSelect = (date) => {
        const availableTimes = getAvailableTimesForDate(date);
        setFormData(prev => ({
            ...prev,
            date,
            time: availableTimes.length === 1 ? availableTimes[0] : '',
        }));
    };

    const getAvailableTimesForDate = (date) => {
        if (!date) return [];
        const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        const availability = availabilityTimes[dayOfWeek];
        return availability && availability.time ? [availability.time] : [];
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'prescription') {
            const file = files[0];
            if (file) {
                const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                const maxSize = 5 * 1024 * 1024;

                if (!validTypes.includes(file.type)) {
                    toast.error('Please upload only images (JPEG, PNG) or PDF files');
                    return;
                }

                if (file.size > maxSize) {
                    toast.error('File size should be less than 5MB');
                    return;
                }

                setFormData(prev => ({ ...prev, prescription: file }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!formData.clinicId) errors.push('Please select a clinic');
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
            const appointment = {
                name: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                appointmentDate: formData.date,
                appointmentTime: formData.time,
                doctor: { doctorId },
                customer: { customerId: customer.customerId },
                clinic: { clinicId: formData.clinicId }
            };

            data.append('appointment', new Blob([JSON.stringify(appointment)], {
                type: 'application/json'
            }));

            if (formData.prescription) {
                data.append('image', formData.prescription);
            }

            await axios.post('/api/appointments/book', data);
            toast.success('Appointment booked successfully!');
            navigate('/');
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
            <div className="max-w-7xl w-full bg-white rounded-xl shadow-md p-6 sm:p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book Appointment Now</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Personal Information Fields */}
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

                    {/* Appointment Scheduling */}
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

                    {/* Location Services */}
                    <div className="sm:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 px-2">Your Location</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                name="userLatitude"
                                value={formData.userLatitude}
                                readOnly
                                placeholder="Latitude"
                                className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-100"
                            />
                            <input
                                type="text"
                                name="userLongitude"
                                value={formData.userLongitude}
                                readOnly
                                placeholder="Longitude"
                                className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-100"
                            />
                            <button
                                type="button"
                                onClick={handleLocationRequest}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md whitespace-nowrap"
                            >
                                Get My Location
                            </button>
                        </div>
                        {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
                    </div>

                    {/* Clinic Selection */}
                    <div className="sm:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 px-2">Select Clinic</label>
                        <select
                            name="clinicId"
                            value={formData.clinicId}
                            onChange={handleChange}
                            className="px-3 py-2 mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-1"
                            required
                        >
                            <option value="">Select a clinic</option>
                            {clinics.map(clinic => (
                                <option key={clinic.clinicId} value={clinic.clinicId}>
                                    {clinic.name} - {clinic.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Map Container */}
                    <div className="sm:col-span-2 w-full h-64 mt-4 rounded-lg overflow-hidden border-2 border-gray-300 relative z-0">
                        <div id="map" className="w-full h-full"></div>
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 flex justify-end">
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

            {/* Calendar Popup */}
            {isCalendarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-5 shadow-lg w-[90%] max-w-[700px] max-h-[90vh] overflow-auto relative z-50">
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
        </div>
    );
};

export default AppointmentForm;