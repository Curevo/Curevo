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
    baseURL: '/api/stores', // Update with your Spring Boot backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

const StoresManagement = () => {
    const [stores, setStores] = useState([]);
    const [showAddStoreModal, setShowAddStoreModal] = useState(false);
    const [newStore, setNewStore] = useState({
        name: '',
        phone: '',
        address: '',
        latitude: 0,
        longitude: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center (London)

    // Fetch stores from backend
    const fetchStores = async () => {
        try {
        setLoading(true);
        const response = await api.get('/stores');
        setStores(response.data);
        setError(null);
        
        // Set map center to first store if available
        if (response.data.length > 0) {
            setMapCenter([response.data[0].latitude, response.data[0].longitude]);
        }
        } catch (err) {
        setError('Failed to fetch stores. Please try again later.');
        console.error('Error fetching stores:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    // Add new store to backend
    const handleAddStore = async () => {
        if (!newStore.name || !newStore.phone || !newStore.address || !newStore.latitude || !newStore.longitude) {
        setError('Please fill all required fields');
        return;
        }

        try {
        setLoading(true);
        const response = await api.post('/stores', newStore);
        setStores([...stores, response.data]);
        setNewStore({
            name: '',
            phone: '',
            address: '',
            latitude: 0,
            longitude: 0,
        });
        setShowAddStoreModal(false);
        setError(null);
        } catch (err) {
        setError('Failed to add store. Please try again.');
        console.error('Error adding store:', err);
        } finally {
        setLoading(false);
        }
    };

    // Delete store from backend
    const handleDeleteStore = async (id) => {
        try {
        setLoading(true);
        await api.delete(`/stores/${id}`);
        setStores(stores.filter(store => store.id !== id));
        setError(null);
        } catch (err) {
        setError('Failed to delete store. Please try again.');
        console.error('Error deleting store:', err);
        } finally {
        setLoading(false);
        }
    };

    // Handle map click for location selection
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        setNewStore(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        }));
        
        try {
        // Reverse geocoding to get human-readable address
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const address = data.display_name || 'Address not found';
        setNewStore(prev => ({
            ...prev,
            address,
        }));
        } catch (error) {
        console.error('Error fetching address:', error);
        }
    };

    // Location marker component for the map
    const LocationMarker = () => {
        useMapEvents({
        click: handleMapClick,
        });

        return newStore.latitude && newStore.longitude ? (
        <Marker position={[newStore.latitude, newStore.longitude]} />
        ) : null;
    };

    return (
        <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Stores</h1>
            <button
            onClick={() => setShowAddStoreModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={loading}
            >
            {loading ? 'Loading...' : 'Add New Store'}
            </button>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
            </div>
        )}

        {loading && stores.length === 0 ? (
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        ) : (
            <div className="space-y-4">
            {stores.map(store => (
                <div key={store.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center h-16 border-l-4 border-blue-500">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-800">{store.phone}</p>
                    <p className="text-xs text-gray-500">Lat: {store.latitude.toFixed(4)}, Lng: {store.longitude.toFixed(4)}</p>
                </div>
                <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                    disabled={loading}
                >
                    Delete
                </button>
                </div>
            ))}
            </div>
        )}

        {/* Add Store Modal */}
        {showAddStoreModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Add New Store</h2>
                
                {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name*</label>
                    <input
                    type="text"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Store name"
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                    type="text"
                    value={newStore.phone}
                    onChange={(e) => setNewStore({...newStore, phone: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Phone number"
                    disabled={loading}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                    <input
                    type="text"
                    value={newStore.address}
                    onChange={(e) => setNewStore({...newStore, address: e.target.value})}
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
                    value={newStore.latitude}
                    onChange={(e) => setNewStore({...newStore, latitude: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Click on map to set"
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude*</label>
                    <input
                    type="number"
                    value={newStore.longitude}
                    onChange={(e) => setNewStore({...newStore, longitude: parseFloat(e.target.value) || 0})}
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
                    onClick={() => setShowAddStoreModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddStore}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading || !newStore.name || !newStore.phone || !newStore.address}
                >
                    {loading ? 'Adding...' : 'Add Store'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default StoresManagement;