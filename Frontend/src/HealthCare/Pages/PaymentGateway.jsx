/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import Calendar from '@/Components/Calendar';
import useDoctorAvailability from '@/Hooks/useDoctorAvailability';
import { toast } from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '@/Hooks/LocationContext';

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

    const { doctorDetails, availabilityTimes, availableDates, availableSlotsPerDate, isLoading, error } = useDoctorAvailability(doctorIdNumber);
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);

    const { location: userLocation, isLoading: isLocationLoading, error: locationError } = useLocation();

    const handleBookingSuccess = (response) => {
        const appointmentId = response.data.data.id;
        navigate(`/payment/appointment/${appointmentId}`);
    };

    useEffect(() => {
        axios.get('/api/customers/me')
            .then(res => {
                setCustomer(res.data.data);
                setFormData(prev => ({
                    ...prev,
                    fullName: res.data.data.fullName || '',
                    phone: res.data.data.phone || '',
                    email: res.data.data.email || '',
                }));
            })
            .catch(err => {
                console.error('Failed to fetch profile:', err.response?.data?.message || err.message);
                toast.error('Failed to load your profile. Please try again.');
            });
    }, [axios]);

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

    const [submitting, setSubmitting] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markersRef = useRef([]);
    const routeLayerRef = useRef(null);

    const currentClinic = doctorDetails?.clinic;

    useEffect(() => {
        if (currentClinic && currentClinic.clinicId && formData.clinicId === '') {
            setFormData(prev => ({
                ...prev,
                clinicId: currentClinic.clinicId
            }));
        }
    }, [currentClinic, formData.clinicId]);

    // LOGGING ADDED HERE
    useEffect(() => {
        console.log("AppointmentForm: userLocation context updated.", { userLocation, isLocationLoading, locationError });
        if (userLocation) {
            setFormData(prev => ({
                ...prev,
                userLatitude: userLocation.latitude,
                userLongitude: userLocation.longitude,
            }));
            console.log("AppointmentForm: formData updated with user location:", userLocation.latitude, userLocation.longitude);
        } else {
            setFormData(prev => ({
                ...prev,
                userLatitude: '',
                userLongitude: '',
            }));
            console.log("AppointmentForm: formData cleared as userLocation is not available.");
        }
    }, [userLocation, isLocationLoading, locationError]); // Added isLocationLoading and locationError for more comprehensive logging

    // LOGGING ADDED HERE
    useEffect(() => {
        if (typeof window !== 'undefined' && mapContainerRef.current && !mapRef.current) {
            console.log("AppointmentForm: Attempting to initialize map.");
            let initialCenter = [20.5937, 78.9629];
            let initialZoom = 5;

            if (userLocation && userLocation.latitude && userLocation.longitude) {
                initialCenter = [userLocation.latitude, userLocation.longitude];
                initialZoom = 14;
                console.log("AppointmentForm: Map initialized with user location as center.");
            } else if (currentClinic && currentClinic.latitude && currentClinic.longitude) {
                initialCenter = [currentClinic.latitude, currentClinic.longitude];
                initialZoom = 14;
                console.log("AppointmentForm: Map initialized with clinic location as center.");
            } else {
                console.log("AppointmentForm: Map initialized with default center.");
            }

            const mapInstance = L.map(mapContainerRef.current, {
                zoomControl: false,
                preferCanvas: true
            }).setView(initialCenter, initialZoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);

            L.control.zoom({ position: 'topright' }).addTo(mapInstance);

            mapRef.current = mapInstance;

            return () => {
                if (mapRef.current) {
                    console.log("AppointmentForm: Cleaning up map instance.");
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }
    }, [mapContainerRef, currentClinic, userLocation]); // userLocation is crucial here for re-evaluation

    // LOGGING ADDED HERE
    useEffect(() => {
        console.log("AppointmentForm: Map rendering effect triggered.", { userLat: formData.userLatitude, userLng: formData.userLongitude, currentClinic });

        if (!mapRef.current || !currentClinic) {
            console.log("AppointmentForm: Map or clinic not ready for marker/route update.");
            return;
        }

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (routeLayerRef.current) {
            mapRef.current.removeLayer(routeLayerRef.current);
            routeLayerRef.current = null;
        }
        if (mapRef.current.routeControlRef) {
            mapRef.current.removeControl(mapRef.current.routeControlRef);
            mapRef.current.routeControlRef = null;
        }

        const userLat = formData.userLatitude;
        const userLng = formData.userLongitude;
        const selectedClinic = currentClinic;

        let userMarker = null;
        if (userLat && userLng) {
            console.log("AppointmentForm: Adding user marker.");
            const userIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });
            userMarker = L.marker([userLat, userLng], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("Your Location");
            markersRef.current.push(userMarker);
        } else {
            console.log("AppointmentForm: User location not available for marker.");
        }

        console.log("AppointmentForm: Adding clinic marker.");
        const clinicIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
        const clinicMarker = L.marker([selectedClinic.latitude, selectedClinic.longitude], { icon: clinicIcon })
            .addTo(mapRef.current)
            .bindPopup(`<b>${selectedClinic.name}</b><br>${selectedClinic.address}`)
            .openPopup();
        markersRef.current.push(clinicMarker);

        if (userLat && userLng) {
            console.log("AppointmentForm: Calculating route.");
            const calculateRoute = async () => {
                try {
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${selectedClinic.longitude},${selectedClinic.latitude}?overview=full&geometries=geojson`
                    );

                    const data = await response.json();

                    if (data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                        routeLayerRef.current = L.polyline(routeCoordinates, {
                            color: '#3b82f6',
                            weight: 4,
                            opacity: 0.7,
                            dashArray: '5, 5'
                        }).addTo(mapRef.current);

                        if (mapRef.current.routeControlRef) {
                            mapRef.current.removeControl(mapRef.current.routeControlRef);
                        }

                        const distance = (route.distance / 1000).toFixed(1);
                        const duration = (route.duration / 60).toFixed(0);

                        const routeControl = L.control({ position: 'bottomright' });
                        routeControl.onAdd = function() {
                            const div = L.DomUtil.create('div', 'route-info');
                            div.innerHTML = `
                                <div class="bg-white p-2 rounded shadow-md text-sm">
                                    <p class="font-semibold">Route Info:</p>
                                    <p>Distance: ${distance} km</p>
                                    <p>Duration: ~${duration} min</p>
                                </div>
                            `;
                            return div;
                        };
                        routeControl.addTo(mapRef.current);
                        mapRef.current.routeControlRef = routeControl;

                        const bounds = L.latLngBounds(routeCoordinates).extend(userMarker.getLatLng()).extend(clinicMarker.getLatLng());
                        mapRef.current.fitBounds(bounds.pad(0.2));
                        console.log("AppointmentForm: Route calculated and map fitted to bounds.");
                    } else {
                        console.log("AppointmentForm: No routes found by OSRM. Fitting bounds to markers.");
                        const group = new L.FeatureGroup(markersRef.current);
                        mapRef.current.fitBounds(group.getBounds().pad(0.2));
                    }
                } catch (routeError) {
                    console.error('Error calculating route:', routeError);
                    toast.error('Could not calculate route. Displaying straight line between points.');
                    routeLayerRef.current = L.polyline([
                        [userLat, userLng],
                        [selectedClinic.latitude, selectedClinic.longitude]
                    ], { color: '#3b82f6', dashArray: '5, 5' }).addTo(mapRef.current);

                    const group = new L.FeatureGroup(markersRef.current);
                    mapRef.current.fitBounds(group.getBounds().pad(0.2));
                }
            };
            calculateRoute();
        } else if (markersRef.current.length > 0) {
            console.log("AppointmentForm: User location not available, fitting map to clinic marker only.");
            const group = new L.FeatureGroup(markersRef.current);
            mapRef.current.fitBounds(group.getBounds().pad(0.2));
        }

    }, [formData.userLatitude, formData.userLongitude, currentClinic]);

    const handleDateSelect = (date) => {
        const selectedDaySlot = availableSlotsPerDate[date];
        let timeToSet = '';

        if (selectedDaySlot && selectedDaySlot.time) {
            timeToSet = selectedDaySlot.time;
        } else {
            toast.error("No specific time slot found for the selected date. Please choose a date with available slots.");
        }

        setFormData(prev => ({
            ...prev,
            date,
            time: timeToSet,
        }));
        setIsCalendarOpen(false);
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
                    setFormData(prev => ({ ...prev, prescription: null }));
                    return;
                }

                if (file.size > maxSize) {
                    toast.error('File size should be less than 5MB');
                    setFormData(prev => ({ ...prev, prescription: null }));
                    return;
                }

                setFormData(prev => ({ ...prev, prescription: file }));
            } else {
                setFormData(prev => ({ ...prev, prescription: null }));
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
        if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) errors.push('Invalid phone number (min 10 digits)');
        if (!formData.date) errors.push('Please select an appointment date');
        if (!formData.time) errors.push('Please select an appointment time');
        if (!currentClinic || !currentClinic.clinicId) errors.push('Clinic details are not loaded. Please refresh the page.');
        if (!formData.userLatitude || !formData.userLongitude) errors.push('Your location is required to proceed with booking (for clinic routing). Please ensure location services are enabled.');
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
                doctor: { doctorId: doctorIdNumber }
            };

            data.append('appointment', new Blob([JSON.stringify(appointment)], {
                type: 'application/json'
            }));

            if (formData.prescription) {
                data.append('image', formData.prescription);
            }

            const res =await axios.post('/api/appointments/book', data);

            toast.success('Appointment booked successfully!');

            handleBookingSuccess(res);
        } catch (submitError) {
            console.error('Error submitting form:', submitError);
            toast.error(submitError.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-700">Loading doctor availability...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg max-w-md mx-auto my-10 shadow-md">
                <p className="font-semibold text-lg mb-3">Error loading doctor's information:</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center bg-blue-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full bg-white rounded-xl shadow-lg p-6 sm:p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book Your Appointment</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="px-4 py-2 mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="px-4 py-2 mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="xyz@example.com"
                            className="px-4 py-2 mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                        <button
                            type="button"
                            onClick={() => setIsCalendarOpen(true)}
                            className="w-full flex items-center justify-between px-4 py-2 mt-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 ease-in-out shadow-sm"
                        >
                            <span>{formData.date ? `Date: ${formData.date}` : 'Select a Date'}</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M12 15h.01M16 15h.01M12 19h.01M16 19h.01M5 19V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2z"></path></svg>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                        <div
                            className={`px-4 py-2 mt-1 block w-full rounded-md border ${
                                formData.time
                                    ? 'border-gray-300 bg-gray-100 text-gray-700'
                                    : 'border-red-300 bg-red-50 text-red-600'
                            }`}
                        >
                            {formData.time || 'Select a date to see available time'}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">Upload Prescription (Optional)</label>
                        <input
                            type="file"
                            id="prescription"
                            name="prescription"
                            accept="application/pdf,image/jpeg,image/png"
                            onChange={handleChange}
                            className="px-4 py-2 mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 ease-in-out file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: PDF, JPEG, PNG</p>
                        {formData.prescription && (
                            <p className="text-sm text-gray-600 mt-1">Selected: {formData.prescription.name}</p>
                        )}
                    </div>

                    <div className="sm:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Location</label>
                        {isLocationLoading ? (
                            <p className="text-sm text-gray-600 mt-1">Detecting your location...</p>
                        ) : locationError ? (
                            <p className="text-red-500 text-sm mt-1">
                                Location Error: {locationError.message}. Please enable location services in your browser settings.
                            </p>
                        ) : formData.userLatitude && formData.userLongitude ? (
                            <p className="text-sm text-green-700 mt-1">
                                Your location detected successfully for routing.
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">
                                Location permission may be denied or not available. Please enable location access in your browser settings for routing.
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinic for Appointment</label>
                        <div className="px-4 py-2 mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 text-gray-700">
                            {currentClinic ? (
                                <>
                                    <h4 className="font-semibold text-lg">{currentClinic.name}</h4>
                                    <p className="text-sm">{currentClinic.address}</p>
                                </>
                            ) : 'Loading clinic details...'}
                        </div>
                        <input type="hidden" name="clinicId" value={formData.clinicId} />
                    </div>

                    <div className="sm:col-span-2 w-full h-80 mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-md relative z-0">
                        <div ref={mapContainerRef} id="map" className="w-full h-full"></div>
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || isLocationLoading || !formData.userLatitude}
                            className={`inline-flex items-center px-8 py-3 rounded-md transition-colors text-lg font-semibold shadow-md ${
                                submitting || isLocationLoading || !formData.userLatitude
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Booking...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {isCalendarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                    <div className="bg-white rounded-xl p-5 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto relative">
                        <Calendar
                            availableDates={availableDates}
                            availableSlotsPerDate={availableSlotsPerDate}
                            selectedDate={formData.date}
                            onSelect={handleDateSelect}
                        />
                        <button
                            type="button"
                            onClick={() => setIsCalendarOpen(false)}
                            className="mt-6 w-full px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-200 ease-in-out"
                        >
                            Close Calendar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentForm;