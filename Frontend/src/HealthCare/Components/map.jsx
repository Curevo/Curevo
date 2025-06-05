import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

function LocationMarker({ position, setPosition, setAddress }) {
    const map = useMapEvents({
        async click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        
        try {
            const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
            );
            const data = await response.json();
            if (data.address) {
            const addressParts = [];
            if (data.address.road) addressParts.push(data.address.road);
            if (data.address.house_number) addressParts.push(data.address.house_number);
            if (data.address.city) addressParts.push(data.address.city);
            if (data.address.country) addressParts.push(data.address.country);
            setAddress(addressParts.join(', '));
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
        },
    });

    return position === null ? null : (
        <Marker position={position}>
        <Popup>Selected Location</Popup>
        </Marker>
    );
}

export default function AddressMap({ onLocationSelect, setAddress, address, initialPosition }) {
    const [position, setPosition] = useState(initialPosition || null);
    const mapRef = useRef();

    // Forward geocoding (address to coordinates)
    const searchAddress = useCallback(async (address) => {
        if (!address || address.trim() === '') return;
        
        try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Take the first result (most relevant)
            const { lat, lon, display_name } = data[0];
            const newPosition = { lat: parseFloat(lat), lng: parseFloat(lon) };
            
            setPosition(newPosition);
            onLocationSelect(newPosition);
            
            // Zoom to the location
            if (mapRef.current) {
            mapRef.current.flyTo(newPosition, 8); // Zoom level 8 shows country-level view
            }
            
            // Update address with the full formatted address from the search
            setAddress(display_name);
        }
        } catch (error) {
        console.error('Error searching address:', error);
        }
    }, [onLocationSelect, setAddress]);

    // Search address when the prop changes
    useEffect(() => {
        if (address) {
        const timer = setTimeout(() => {
            searchAddress(address);
        }, 1000); // Debounce 1 second
            
        return () => clearTimeout(timer);
        }
    }, [address, searchAddress]);

    const handleLocationSelect = useCallback((location) => {
        onLocationSelect(location);
    }, [onLocationSelect]);

    useEffect(() => {
        if (position) {
        handleLocationSelect({
            lat: position.lat,
            lng: position.lng,
        });
        }
    }, [position, handleLocationSelect]);

    useEffect(() => {
        const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-96 w-full rounded-lg border border-gray-300 relative">
        <MapContainer
            center={position || [51.505, -0.09]}
            zoom={position ? 13 : 2}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg"
            ref={mapRef}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            setAddress={setAddress}
            />
        </MapContainer>
        {position && (
            <button
            onClick={() => {
                setPosition(null);
                setAddress('');
            }}
            className="absolute top-2 left-2 z-[1000] bg-white p-2 rounded shadow text-xs"
            >
            Clear Location
            </button>
        )}
        </div>
    );
}