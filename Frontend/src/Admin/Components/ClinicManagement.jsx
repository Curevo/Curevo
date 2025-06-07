import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAxiosInstance } from "@/Config/axiosConfig.js";
import 'leaflet/dist/leaflet.css';
import { PlusCircle, X, Edit3, Trash2 } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ClinicManagement = () => {
    const axios = useAxiosInstance();
    const [clinics, setClinics] = useState([]);
    const [showClinicModal, setShowClinicModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentClinic, setCurrentClinic] = useState({
        name: '',
        phoneNumber: '', // Changed from 'phone' to 'phoneNumber'
        address: '',
        latitude: 0,
        longitude: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([22.6937, 88.4716]);

    // Function to reset form data
    const resetFormData = () => {
        setCurrentClinic({
            name: '',
            phoneNumber: '', // Changed to 'phoneNumber'
            address: '',
            latitude: 0,
            longitude: 0,
        });
        setError(null);
    };

    // Open Add Clinic Modal
    const openAddModal = () => {
        setModalMode('add');
        resetFormData();
        setMapCenter([22.6937, 88.4716]);
        setShowClinicModal(true);
    };

    // Open Edit Clinic Modal
    const openEditModal = (clinic) => {
        setModalMode('edit');
        // Ensure that 'phoneNumber' is used when populating the form
        setCurrentClinic({ ...clinic, phoneNumber: clinic.phoneNumber || '' });
        setMapCenter([clinic.latitude, clinic.longitude]);
        setError(null);
        setShowClinicModal(true);
    };

    // Fetch clinics from backend
    const fetchClinics = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/clinics');
            setClinics(response.data.data);
            setError(null);

            if (response.data.data && response.data.data.length > 0) {
                setMapCenter([response.data.data[0].latitude, response.data.data[0].longitude]);
            }
        } catch (err) {
            setError('Failed to fetch clinics. Please try again later.');
            console.error('Error fetching clinics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentClinic(prev => ({ ...prev, [name]: value }));
    };

    // Handle submission (Add or Edit)
    const handleSubmit = async () => {
        if (!currentClinic.name || !currentClinic.phoneNumber || !currentClinic.address || // Changed to 'phoneNumber'
            !currentClinic.latitude || !currentClinic.longitude) {
            setError('Please fill all required fields and select a location on the map.');
            return;
        }

        try {
            setLoading(true);
            let response;
            if (modalMode === 'add') {
                response = await axios.post('/api/clinics', currentClinic);
                setClinics(prev => [...prev, response.data.data]);
            } else { // modalMode === 'edit'
                response = await axios.put(`/api/clinics/${currentClinic.clinicId}`, currentClinic);
                setClinics(prev => prev.map(c => c.clinicId === response.data.data.clinicId ? response.data.data : c));
            }
            resetFormData();
            setShowClinicModal(false);
            setError(null);
        } catch (err) {
            setError(`Failed to ${modalMode} clinic. Please try again.`);
            console.error(`Error ${modalMode}ing clinic:`, err);
        } finally {
            setLoading(false);
        }
    };

    // Delete clinic from backend
    const handleDeleteClinic = async (id) => {
        if (window.confirm("Are you sure you want to delete this clinic?")) {
            try {
                setLoading(true);
                await axios.delete(`/api/clinics/${id}`);
                setClinics(clinics.filter(clinic => clinic.clinicId !== id));
                setError(null);
            } catch (err) {
                setError('Failed to delete clinic. Please try again.');
                console.error('Error deleting clinic:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle map click for location selection
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        setCurrentClinic(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const address = data.display_name || 'Address not found';
            setCurrentClinic(prev => ({
                ...prev,
                address,
            }));
        } catch (error) {
            console.error('Error fetching address:', error);
            setError('Could not fetch address for selected location.');
        }
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click: handleMapClick,
        });

        useEffect(() => {
            if (currentClinic.latitude && currentClinic.longitude && showClinicModal) {
                map.setView([currentClinic.latitude, currentClinic.longitude]);
            }
        }, [currentClinic.latitude, currentClinic.longitude, showClinicModal, map]);


        return currentClinic.latitude && currentClinic.longitude ? (
            <Marker position={[currentClinic.latitude, currentClinic.longitude]} />
        ) : null;
    };

    return (
        <div className="w-full p-6 mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Clinics</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={loading}
                >
                    <PlusCircle size={18} />
                    {loading ? 'Loading...' : 'Add New Clinic'}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {loading && clinics.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {clinics.length === 0 ? (
                        <p className="text-center text-gray-500">No clinics found. Add one!</p>
                    ) : (
                        clinics.map(clinic => (
                            <div key={clinic.clinicId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-green-500">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{clinic.name}</h3>
                                    <p className="text-sm text-gray-600 mb-0.5"><span className="font-medium">Address:</span> {clinic.address}</p>
                                    <p className="text-sm text-gray-600 mb-0.5"><span className="font-medium">Phone:</span> {clinic.phoneNumber}</p> {/* Changed to 'phoneNumber' */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Lat: {clinic.latitude.toFixed(4)}, Lng: {clinic.longitude.toFixed(4)}
                                    </p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => openEditModal(clinic)}
                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                        aria-label={`Edit ${clinic.name}`}
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClinic(clinic.clinicId)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                                        aria-label={`Delete ${clinic.name}`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add/Edit Clinic Modal */}
            {showClinicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {modalMode === "add" ? "Add New Clinic" : "Edit Clinic"}
                            </h2>
                            <button
                                onClick={() => { setShowClinicModal(false); resetFormData(); }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentClinic.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Clinic name"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                                <input
                                    type="text"
                                    name="phoneNumber" // Changed name to 'phoneNumber'
                                    value={currentClinic.phoneNumber} // Changed value to 'currentClinic.phoneNumber'
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Phone number"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={currentClinic.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Click on map to set address"
                                    readOnly
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude*</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={currentClinic.latitude}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Set by map click"
                                    readOnly
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude*</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={currentClinic.longitude}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Set by map click"
                                    readOnly
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="h-64 mb-4 rounded-md overflow-hidden border border-gray-300">
                            <MapContainer
                                center={mapCenter}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => { setShowClinicModal(false); resetFormData(); }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                disabled={loading || !currentClinic.name || !currentClinic.phoneNumber || !currentClinic.address || !currentClinic.latitude || !currentClinic.longitude}
                            >
                                {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Clinic' : 'Update Clinic')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicManagement;