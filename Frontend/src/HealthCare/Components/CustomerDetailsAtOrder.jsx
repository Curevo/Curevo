import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


export default function CustomerDetailsAtOrder() {
    const SESSION_STORAGE_KEY = 'customerFormData';
    const mapRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (!parsedData.location || (parsedData.location.lat === 0 && parsedData.location.lng === 0)) {
                    parsedData.location = null;
                }
                return parsedData;
            } catch (e) {
                console.error("Failed to parse sessionStorage data:", e);
                sessionStorage.removeItem(SESSION_STORAGE_KEY);
            }
        }
        return {
            name: '',
            phone: '',
            email: '',
            address: '',
            instructions: '',
            location: null,
            prescription: null
        };
    });

    const [submitMessage, setSubmitMessage] = useState('');
    const [isAddressEditable, setIsAddressEditable] = useState(false);

    useEffect(() => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const MAX_FILE_SIZE_MB = 3;
            const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

            if (file.size > MAX_FILE_SIZE_BYTES) {
                setSubmitMessage(`Error: File size exceeds ${MAX_FILE_SIZE_MB}MB. Please select a smaller file.`);
                setFormData(prev => ({ ...prev, prescription: null }));
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    prescription: reader.result
                }));
                setSubmitMessage('');
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                setSubmitMessage('Failed to read prescription file.');
                setFormData(prev => ({ ...prev, prescription: null }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, prescription: null }));
            setSubmitMessage('');
        }
    };

    const LocationMarker = useCallback(() => {
        const map = useMapEvents({
            async click(e) {
                const { lat, lng } = e.latlng;
                setFormData(prev => ({
                    ...prev,
                    location: { lat, lng },
                }));
                map.flyTo(e.latlng, map.getZoom());

                const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

                try {
                    const response = await fetch(nominatimApiUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
                    }
                    const data = await response.json();

                    if (data.display_name) {
                        setFormData(prev => ({
                            ...prev,
                            address: data.display_name,
                        }));
                        setIsAddressEditable(false);
                        setSubmitMessage('');
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            address: '',
                        }));
                        setIsAddressEditable(true);
                        setSubmitMessage('Address could not be determined by map. Please enter it manually.');
                    }
                } catch (error) {
                    console.error('Error fetching address from Nominatim:', error);
                    setFormData(prev => ({
                        ...prev,
                        address: '',
                    }));
                    setIsAddressEditable(true);
                    setSubmitMessage('Failed to fetch address from map. Please enter it manually.');
                }
            },
        });

        useEffect(() => {
            if (formData.location && map) {
                map.setView([formData.location.lat, formData.location.lng], map.getZoom() || 13);
            }
        }, [formData.location, map]);

        return formData.location ? (
            <Marker position={formData.location}>
                <Popup>
                    Latitude: {formData.location.lat.toFixed(4)} <br />
                    Longitude: {formData.location.lng.toFixed(4)}
                </Popup>
            </Marker>
        ) : null;
    }, [formData.location]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.location) {
            setSubmitMessage('Please fill all required fields and select a location on the map.');
            return;
        }

        navigate('/payment/store');
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            instructions: '',
            location: null,
            prescription: null
        });
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setSubmitMessage('');
        setIsAddressEditable(false);
    };

    const initialMapCenter = useMemo(() => {
        return formData.location || { lat: 22.6937, lng: 88.4716 };
    }, [formData.location]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Registration</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                                Special Instructions
                            </label>
                            <input
                                type="text"
                                id="instructions"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address *
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border ${isAddressEditable ? '' : 'bg-gray-100 cursor-not-allowed'}`}
                            placeholder={isAddressEditable ? "Enter address manually" : "Click on map to set address"}
                            readOnly={!isAddressEditable}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location on Map *
                        </label>
                        <div className="h-64 mb-4 rounded-md overflow-hidden border border-gray-300">
                            <MapContainer
                                center={initialMapCenter}
                                zoom={formData.location ? 13 : 8}
                                scrollWheelZoom={true}
                                className="h-full w-full rounded-lg"
                                whenCreated={mapInstance => { mapRef.current = mapInstance; }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                        {formData.location && (
                            <p className="mt-2 text-sm text-gray-600">
                                Coordinates: Latitude {formData.location.lat.toFixed(4)}, Longitude {formData.location.lng.toFixed(4)}
                            </p>
                        )}
                        {!formData.location && (
                            <p className="mt-2 text-sm text-gray-600">
                                Click on the map to set a precise location and auto-generate the address.
                            </p>
                        )}
                        {formData.location && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, location: null, address: '' }));
                                    setSubmitMessage('');
                                    setIsAddressEditable(false);
                                }}
                                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                            >
                                Clear Map Location
                            </button>
                        )}
                    </div>

                    <div>
                        <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
                            Upload Prescription (PDF/Image)
                        </label>
                        <input
                            type="file"
                            id="prescription"
                            name="prescription"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {formData.prescription && typeof formData.prescription === 'string' && formData.prescription.startsWith('data:image/') && (
                            <div className="mt-2">
                                <img src={formData.prescription} alt="Prescription Preview" className="max-w-xs h-auto border rounded-md" />
                            </div>
                        )}
                        {formData.prescription && typeof formData.prescription === 'string' && formData.prescription.startsWith('data:application/pdf') && (
                            <p className="mt-2 text-sm text-gray-600">
                                PDF file selected. Preview not available.
                            </p>
                        )}
                        {formData.prescription && (formData.prescription instanceof File) && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected file: {formData.prescription.name}
                            </p>
                        )}
                        {!formData.prescription && (
                            <p className="mt-2 text-sm text-gray-600">No file selected.</p>
                        )}
                    </div>

                    {submitMessage && (
                        <div className={`p-3 rounded-md ${submitMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {submitMessage}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}