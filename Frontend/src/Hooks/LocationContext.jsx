import React, { createContext, useEffect, useState, useContext, useRef, useMemo } from 'react';
import axios from 'axios';

const LocationContext = createContext(null);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const locationPromiseRef = useRef(null);

    if (!locationPromiseRef.current) {
        let resolvePromise, rejectPromise;
        const promise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
        });
        locationPromiseRef.current = { promise, resolve: resolvePromise, reject: rejectPromise };
    }

    useEffect(() => {
        // Only attempt to fetch if location is not already set and no error has occurred
        if (location === null && error === null) {
            console.log("LocationContext: Initializing location fetch process.");
            setIsLoading(true);
            setError(null);

            navigator.permissions
                ?.query({ name: 'geolocation' })
                .then(permissionStatus => {
                    console.log(`LocationContext: Geolocation permission state: ${permissionStatus.state}`);

                    if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                // --- CONSOLE LOG ADDED: Fetched location with accuracy ---
                                const { latitude, longitude, accuracy } = position.coords;
                                const newLoc = {
                                    latitude,
                                    longitude,
                                    accuracy // Store accuracy in state
                                };
                                setLocation(newLoc);
                                setError(null);
                                setIsLoading(false);
                                locationPromiseRef.current.resolve(newLoc);
                                console.log(`LocationContext: Location fetched: Lat ${latitude}, Lng ${longitude}, Accuracy ${accuracy}m`);
                            },
                            (err) => {
                                console.error('LocationContext: Error getting location:', err.code, err.message);
                                setLocation(null);
                                setError(err);
                                setIsLoading(false);
                                locationPromiseRef.current.reject(err);
                            },
                            // --- OPTIONS UPDATED: Increased timeout, added maximumAge ---
                            { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 } // 15 seconds timeout, no cached position
                        );
                    } else { // 'denied' or other states
                        const permError = new Error('Geolocation permission not granted or available.');
                        console.error('LocationContext:', permError.message);
                        setLocation(null);
                        setError(permError);
                        setIsLoading(false);
                        locationPromiseRef.current.reject(permError);
                    }
                })
                .catch(permCheckError => {
                    console.error('LocationContext: Error checking permissions:', permCheckError);
                    setLocation(null);
                    setError(permCheckError);
                    setIsLoading(false);
                    locationPromiseRef.current.reject(permCheckError);
                });
        } else {
            console.log("LocationContext: Location already fetched or error occurred, skipping initial fetch.");
        }
    }, [location, error]); // Depend on location and error to prevent unnecessary re-fetches

    const contextValue = useMemo(() => ({
        location,
        isLoading,
        error,
        getAsyncLocation: () => {
            // This function now primarily returns the promise,
            // the actual fetching is handled by the useEffect on mount.
            // If location is already available, resolve immediately.
            if (location) {
                return Promise.resolve(location);
            }
            // If still loading or error, return the existing promise
            // which will resolve/reject when the initial fetch completes.
            return locationPromiseRef.current.promise;
        },
    }), [location, isLoading, error]);

    return (
        <LocationContext.Provider value={contextValue}>
            {children}
        </LocationContext.Provider>
    );
};