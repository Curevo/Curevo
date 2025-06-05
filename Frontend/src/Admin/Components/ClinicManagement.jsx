import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Axios instance with base URL
const api = axios.create({
    baseURL: '/api/clinics',
    headers: {
        'Content-Type': 'application/json',
    },
});

const ClinicManagement = () => {
    const [clinics, setClinics] = useState([]);
    const [showAddClinicModal, setShowAddClinicModal] = useState(false);
    const [newClinic, setNewClinic] = useState({
        name: '',
        phone: '',
        address: '',
        latitude: 0,
        longitude: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

    // Fetch clinics from backend
    const fetchClinics = async () => {
        try {
        setLoading(true);
        const response = await api.get('/clinics');
        setClinics(response.data);
        setError(null);
        
        if (response.data.length > 0) {
            setMapCenter([response.data[0].latitude, response.data[0].longitude]);
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

    // Add new clinic to backend
    const handleAddClinic = async () => {
        if (!newClinic.name || !newClinic.phone || !newClinic.address || 
            !newClinic.latitude || !newClinic.longitude) {
        setError('Please fill all required fields');
        return;
        }

        try {
        setLoading(true);
        const response = await api.post('/clinics', newClinic);
        setClinics([...clinics, response.data]);
        setNewClinic({
            name: '',
            phone: '',
            address: '',
            latitude: 0,
            longitude: 0,
        });
        setShowAddClinicModal(false);
        setError(null);
        } catch (err) {
        setError('Failed to add clinic. Please try again.');
        console.error('Error adding clinic:', err);
        } finally {
        setLoading(false);
        }
    };

    // Delete clinic from backend
    const handleDeleteClinic = async (id) => {
        try {
        setLoading(true);
        await api.delete(`/clinics/${id}`);
        setClinics(clinics.filter(clinic => clinic.id !== id));
        setError(null);
        } catch (err) {
        setError('Failed to delete clinic. Please try again.');
        console.error('Error deleting clinic:', err);
        } finally {
        setLoading(false);
        }
    };

    // Handle map click for location selection
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        setNewClinic(prev => ({
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
        setNewClinic(prev => ({
            ...prev,
            address,
        }));
        } catch (error) {
        console.error('Error fetching address:', error);
        }
    };

    const LocationMarker = () => {
        useMapEvents({
        click: handleMapClick,
        });

        return newClinic.latitude && newClinic.longitude ? (
        <Marker position={[newClinic.latitude, newClinic.longitude]} />
        ) : null;
    };

    return (
        <div className="w-full p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Clinics</h1>
            <button
            onClick={() => setShowAddClinicModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={loading}
            >
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
            {clinics.map(clinic => (
                <div key={clinic.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center h-16 border-l-4 border-green-500">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{clinic.name}</h3>
                    <p className="text-sm text-gray-600">{clinic.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-800">{clinic.phone}</p>
                    <p className="text-xs text-gray-500">
                    Lat: {clinic.latitude.toFixed(4)}, Lng: {clinic.longitude.toFixed(4)}
                    </p>
                </div>
                <button
                    onClick={() => handleDeleteClinic(clinic.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                    disabled={loading}
                >
                    Delete
                </button>
                </div>
            ))}
            </div>
        )}

        {/* Add Clinic Modal */}
        {showAddClinicModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Add New Clinic</h2>
                
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
                    value={newClinic.name}
                    onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Clinic name"
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                    type="text"
                    value={newClinic.phone}
                    onChange={(e) => setNewClinic({...newClinic, phone: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Phone number"
                    disabled={loading}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                    <input
                    type="text"
                    value={newClinic.address}
                    onChange={(e) => setNewClinic({...newClinic, address: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Address will auto-fill from map"
                    readOnly
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude*</label>
                    <input
                    type="number"
                    value={newClinic.latitude}
                    onChange={(e) => setNewClinic({...newClinic, latitude: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Click on map to set"
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude*</label>
                    <input
                    type="number"
                    value={newClinic.longitude}
                    onChange={(e) => setNewClinic({...newClinic, longitude: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Click on map to set"
                    disabled={loading}
                    />
                </div>
                </div>

                <div className="h-64 mb-4 rounded-md overflow-hidden">
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
                    onClick={() => setShowAddClinicModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddClinic}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading || !newClinic.name || !newClinic.phone || !newClinic.address}
                >
                    {loading ? 'Adding...' : 'Add Clinic'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default ClinicManagement;