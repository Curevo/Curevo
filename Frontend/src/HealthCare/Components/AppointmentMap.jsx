import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icons
const createMarkerIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Clinic data (would normally come from API)
const clinics = [
  { id: 1, name: "City Medical Center", position: [51.505, -0.09], address: "123 Medical St" },
  { id: 2, name: "Downtown Clinic", position: [51.51, -0.1], address: "456 Health Ave" },
  { id: 3, name: "Health Plus", position: [51.515, -0.09], address: "789 Wellness Blvd" }
];

const Routing = ({ userPosition, clinicPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userPosition || !clinicPosition) return;

    createMarkerIcon();

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userPosition[0], userPosition[1]),
        L.latLng(clinicPosition[0], clinicPosition[1])
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 5 }]
      }
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, userPosition, clinicPosition]);

  return null;
};

const AppointmentMap = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  // Get user's location
  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Could not get your location. Using default location.");
          setUserPosition([51.505, -0.09]); // Default to London
          setLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation not supported. Using default location.");
      setUserPosition([51.505, -0.09]);
      setLoading(false);
    }
  }, []);

  // Center map when positions change
  useEffect(() => {
    if (mapRef.current && userPosition) {
      mapRef.current.flyTo(userPosition, 13);
    }
  }, [userPosition]);

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    if (mapRef.current) {
      mapRef.current.flyTo(clinic.position, 13);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Book Your Appointment</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        {/* Clinic selection panel */}
        <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Available Clinics</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-3 mb-4 bg-yellow-100 text-yellow-800 rounded">{error}</div>
          ) : null}

          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
            {clinics.map((clinic) => (
              <div
                key={clinic.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedClinic?.id === clinic.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleClinicSelect(clinic)}
              >
                <h3 className="font-medium text-gray-800">{clinic.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{clinic.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {clinic.position[0].toFixed(4)}, {clinic.position[1].toFixed(4)}
                  </span>
                  <button 
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClinicSelect(clinic);
                    }}
                  >
                    View Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map container */}
        <div className="w-full lg:w-2/3 h-full rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-full bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={userPosition || [51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={true}
              className="h-full w-full"
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User position marker */}
              {userPosition && (
                <Marker position={userPosition}>
                  <Popup className="font-medium">
                    <div className="text-blue-600">Your Location</div>
                    <div className="text-xs text-gray-600">
                      {userPosition[0].toFixed(6)}, {userPosition[1].toFixed(6)}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Clinic markers */}
              {clinics.map((clinic) => (
                <Marker
                  key={clinic.id}
                  position={clinic.position}
                  eventHandlers={{
                    click: () => handleClinicSelect(clinic),
                  }}
                >
                  <Popup className="font-medium">
                    <div className="text-green-600">{clinic.name}</div>
                    <div className="text-xs text-gray-600">{clinic.address}</div>
                  </Popup>
                </Marker>
              ))}

              {/* Routing */}
              {userPosition && selectedClinic && (
                <Routing 
                  userPosition={userPosition} 
                  clinicPosition={selectedClinic.position} 
                />
              )}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Booking form section */}
      {selectedClinic && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Book Appointment at {selectedClinic.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Confirm Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentMap;