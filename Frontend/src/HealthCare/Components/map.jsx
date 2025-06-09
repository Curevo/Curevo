import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility'; // Ensures default markers work
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// It's good practice to ensure default icons load correctly.
// This block ensures Leaflet's default marker icons are properly referenced,
// which can sometimes be an issue with bundlers.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// This component handles map clicks and marker updates.
// It directly updates the parent's location and address via props.
function LocationMarker({ currentPosition, setCurrentPosition, setAddress }) {
    const map = useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setCurrentPosition({ lat, lng });
            map.flyTo(e.latlng, map.getZoom()); // Fly to the clicked location

            // Reverse geocoding to get the address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                if (data.display_name) {
                    setAddress(data.display_name); // Update the address in the parent form
                } else {
                    setAddress('Address not found for this location');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
                setAddress('Could not fetch address for selected location.');
            }
        },
    });

    // Keep the map centered on the currentPosition if it changes
    useEffect(() => {
        if (currentPosition && map) {
            map.setView([currentPosition.lat, currentPosition.lng], map.getZoom() || 13);
        }
    }, [currentPosition, map]);

    return currentPosition ? (
        <Marker position={currentPosition}>
            <Popup>
                Latitude: {currentPosition.lat.toFixed(4)} <br />
                Longitude: {currentPosition.lng.toFixed(4)}
            </Popup>
        </Marker>
    ) : null;
}

export default function AddressMap({ onLocationSelect, setAddress, address, initialPosition }) {
    // The internal state 'position' for the marker and map center,
    // which will be synced with initialPosition prop.
    const [position, setPosition] = useState(initialPosition || { lat: 22.6738, lng: 88.4357 }); // Default to Kolkata area
    const mapRef = useRef(); // Reference to the Leaflet map instance

    // --- Forward Geocoding (Address String to Coordinates) ---
    // This effect runs when the 'address' prop changes (e.g., user types in the form).
    // It debounces the search to avoid too many API calls while typing.
    useEffect(() => {
        // Only perform forward geocoding if the 'address' prop is not empty
        // and if it differs from the current address associated with the map's position
        // (to avoid looping if reverse geocoding just set the address).
        if (address && address.trim() !== '') {
            const delayDebounceFn = setTimeout(async () => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=1`
                    );
                    const data = await response.json();

                    if (data && data.length > 0) {
                        const { lat, lon, display_name } = data[0];
                        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };

                        // Update internal map position state
                        setPosition(newPos);
                        // Notify parent of the new coordinates
                        onLocationSelect(newPos);
                        // Optionally update parent's address to the canonical one from Nominatim
                        setAddress(display_name);

                        // Fly to the new location on the map
                        if (mapRef.current) {
                            mapRef.current.flyTo(newPos, 13); // Zoom to a reasonable level
                        }
                    } else {
                        // If no result, clear the location in the parent
                        onLocationSelect(null);
                    }
                } catch (error) {
                    console.error('Error in forward geocoding:', error);
                    onLocationSelect(null); // Clear location on error
                }
            }, 700); // Debounce time in ms

            return () => clearTimeout(delayDebounceFn); // Cleanup on component unmount or address change
        } else if (!address && position) {
            // If address is cleared from parent, also clear position from map
            setPosition(null);
            onLocationSelect(null);
        }
    }, [address, onLocationSelect, setAddress]);


    // --- Syncing `initialPosition` prop with internal `position` state ---
    // This handles cases where the parent directly provides an initial position,
    // ensuring the map and marker reflect it.
    useEffect(() => {
        if (initialPosition && (initialPosition.lat !== 0 || initialPosition.lng !== 0)) {
            // Check if the current position is significantly different to avoid unnecessary updates
            if (!position || position.lat !== initialPosition.lat || position.lng !== initialPosition.lng) {
                setPosition(initialPosition);
                // Also perform reverse geocoding if a new initial position is set to get the address
                const fetchInitialAddress = async () => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialPosition.lat}&lon=${initialPosition.lng}`
                        );
                        const data = await response.json();
                        if (data.display_name) {
                            setAddress(data.display_name);
                        }
                    } catch (error) {
                        console.error('Error fetching initial address:', error);
                    }
                };
                fetchInitialAddress();
            }
        }
    }, [initialPosition, position, setAddress]);


    // --- Notify parent when internal `position` state changes (e.g., from map click) ---
    // This is crucial for `onLocationSelect` to be called when the user picks a location on the map.
    useEffect(() => {
        if (position) {
            onLocationSelect(position);
        } else {
            onLocationSelect(null); // If position is null, notify parent it's cleared
        }
    }, [position, onLocationSelect]);


    // Workaround for Leaflet maps not rendering correctly when hidden initially (e.g., in a modal)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize(); // Force map to recalculate its size
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []); // Run once on mount

    return (
        <div className="h-96 w-full rounded-lg border border-gray-300 relative">
            <MapContainer
                center={position || [22.6738, 88.4357]} // Fallback center (Kolkata)
                zoom={position ? 13 : 8} // Zoom in if position is set, otherwise a wider view
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg"
                whenCreated={mapInstance => { mapRef.current = mapInstance; }} // Get map instance
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    currentPosition={position}
                    setCurrentPosition={setPosition}
                    setAddress={setAddress}
                />
            </MapContainer>
            {/* Clear button for map position */}
            {position && (
                <button
                    onClick={() => {
                        setPosition(null);
                        setAddress(''); // Clear address in parent too
                    }}
                    className="absolute top-2 left-2 z-[1000] bg-white p-2 rounded shadow text-xs hover:bg-gray-100"
                >
                    Clear Location
                </button>
            )}
        </div>
    );
}