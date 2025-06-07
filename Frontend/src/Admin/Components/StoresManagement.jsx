import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAxiosInstance } from "@/Config/axiosConfig.js"; // Using your custom Axios instance hook
import 'leaflet/dist/leaflet.css';
import { PlusCircle, X, Edit3, Trash2 } from 'lucide-react'; // Icons for Add, Close, Edit, Delete

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const StoresManagement = () => {
    const axios = useAxiosInstance(); // Using the custom Axios instance
    const [stores, setStores] = useState([]);
    const [showStoreModal, setShowStoreModal] = useState(false); // Renamed for dual purpose (add/edit)
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentStore, setCurrentStore] = useState({ // Renamed for dual purpose
        name: '',
        phoneNumber: '',
        address: '',
        latitude: 0,
        longitude: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState([22.6937, 88.4716]); // Default to Kolkata area

    // Function to reset form data
    const resetFormData = () => {
        setCurrentStore({
            name: '',
            phoneNumber: '',
            address: '',
            latitude: 0,
            longitude: 0,
        });
        setError(null);
    };

    // Open Add Store Modal
    const openAddModal = () => {
        setModalMode('add');
        resetFormData();
        setMapCenter([22.6937, 88.4716]); // Default center for adding
        setShowStoreModal(true);
    };

    // Open Edit Store Modal
    const openEditModal = (store) => {
        setModalMode('edit');
        setCurrentStore({ ...store }); // Populate form with existing store data
        setMapCenter([store.latitude, store.longitude]); // Center map on store's location
        setError(null);
        setShowStoreModal(true);
    };

    // Fetch stores from backend
    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stores'); // Corrected path to use the base URL from axios instance
            setStores(response.data.data); // Assuming response.data.data holds the array like Clinics
            setError(null);

            if (response.data.data && response.data.data.length > 0) {
                setMapCenter([response.data.data[0].latitude, response.data.data[0].longitude]);
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentStore(prev => ({ ...prev, [name]: value }));
    };

    // Handle submission (Add or Edit)
    const handleSubmit = async () => {
        // Validation: Ensure all required fields are filled
        if (!currentStore.name || !currentStore.phoneNumber || !currentStore.address ||
            !currentStore.latitude || !currentStore.longitude) {
            setError('Please fill all required fields and select a location on the map.');
            return;
        }

        try {
            setLoading(true);
            let response;
            if (modalMode === 'add') {
                response = await axios.post('/api/stores', currentStore); // POST for adding
                setStores(prev => [...prev, response.data.data]); // Assuming response.data.data for success
            } else { // modalMode === 'edit'
                // Assuming the backend uses storeId for updates, similar to clinicId
                response = await axios.put(`/api/stores/${currentStore.storeId}`, currentStore); // PUT for editing
                setStores(prev => prev.map(s => s.storeId === response.data.data.storeId ? response.data.data : s));
            }
            resetFormData();
            setShowStoreModal(false);
            setError(null);
        } catch (err) {
            setError(`Failed to ${modalMode} store. Please try again.`);
            console.error(`Error ${modalMode}ing store:`, err);
        } finally {
            setLoading(false);
        }
    };

    // Delete store from backend
    const handleDeleteStore = async (id) => {
        if (window.confirm("Are you sure you want to delete this store?")) {
            try {
                setLoading(true);
                await axios.delete(`/api/stores/${id}`); // Corrected API path
                setStores(stores.filter(store => store.storeId !== id)); // Filter by storeId (assuming 'storeId')
                setError(null);
            } catch (err) {
                setError('Failed to delete store. Please try again.');
                console.error('Error deleting store:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle map click for location selection
    const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        setCurrentStore(prev => ({
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
            setCurrentStore(prev => ({
                ...prev,
                address,
            }));
        } catch (error) {
            console.error('Error fetching address:', error);
            setError('Could not fetch address for selected location.');
        }
    };

    // Location marker component for the map
    const LocationMarker = () => {
        const map = useMapEvents({
            click: handleMapClick,
        });

        // Effect to update map center if currentStore latitude/longitude changes within the modal
        useEffect(() => {
            if (currentStore.latitude && currentStore.longitude && showStoreModal) {
                map.setView([currentStore.latitude, currentStore.longitude]);
            }
        }, [currentStore.latitude, currentStore.longitude, showStoreModal, map]);


        return currentStore.latitude && currentStore.longitude ? (
            <Marker position={[currentStore.latitude, currentStore.longitude]} />
        ) : null;
    };

    return (
        <div className="w-full p-6 mt-10"> {/* Added mt-10 for consistent spacing */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Stores</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={loading}
                >
                    <PlusCircle size={18} />
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
                    {stores.length === 0 ? (
                        <p className="text-center text-gray-500">No stores found. Add one!</p>
                    ) : (
                        stores.map(store => (
                            <div key={store.storeId} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-4 border-blue-500">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{store.name}</h3>
                                    <p className="text-sm text-gray-600 mb-0.5"><span className="font-medium">Address:</span> {store.address}</p>
                                    <p className="text-sm text-gray-600 mb-0.5"><span className="font-medium">Phone:</span> {store.phoneNumber}</p> {/* Displaying phone */}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Lat: {store.latitude.toFixed(4)}, Lng: {store.longitude.toFixed(4)}
                                    </p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => openEditModal(store)}
                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                        aria-label={`Edit ${store.name}`}
                                    >
                                        <Edit3 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStore(store.storeId)} // Assuming storeId for deletion
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition" // Styled as clinic/doctor page
                                        aria-label={`Delete ${store.name}`}
                                    >
                                        <Trash2 size={20} /> {/* Added Trash2 icon */}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add/Edit Store Modal */}
            {showStoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"> {/* Max width for modal */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {modalMode === "add" ? "Add New Store" : "Edit Store"}
                            </h2>
                            <button
                                onClick={() => { setShowStoreModal(false); resetFormData(); }}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentStore.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Store name"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                                <input
                                    type="text"
                                    name="phoneNumber" // Changed 'name' from "phone" to "phoneNumber"
                                    value={currentStore.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Phone number"
                                    disabled={loading} // Keep disabled state based on loading
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={currentStore.address}
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
                                    value={currentStore.latitude}
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
                                    value={currentStore.longitude}
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
                                onClick={() => { setShowStoreModal(false); resetFormData(); }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                disabled={loading || !currentStore.name || !currentStore.phone || !currentStore.address || !currentStore.latitude || !currentStore.longitude}
                            >
                                {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Store' : 'Update Store')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoresManagement;