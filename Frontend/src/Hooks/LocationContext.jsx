import React, { createContext, useEffect, useState, useContext, useRef, useMemo } from 'react';
import axios from 'axios'; // Ensure axios is imported here if useAxiosInstance is in the same file or for context

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
        // Ensure isLoading is true at the start of the effect
        if (!isLoading) setIsLoading(true);
        if (error) setError(null);

        navigator.permissions
            ?.query({ name: 'geolocation' })
            .then(permissionStatus => {
                if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const newLoc = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                            setLocation(newLoc);
                            setError(null);
                            setIsLoading(false);
                            locationPromiseRef.current.resolve(newLoc);
                        },
                        (err) => {
                            console.error('Error getting location:', err);
                            setLocation(null);
                            setError(err);
                            setIsLoading(false);
                            locationPromiseRef.current.reject(err);
                        },
                        { timeout: 10000, enableHighAccuracy: true } // Options for getCurrentPosition
                    );
                } else { // 'denied' or other states
                    const permError = new Error('Geolocation permission not granted or available.');
                    console.error(permError.message);
                    setLocation(null);
                    setError(permError);
                    setIsLoading(false);
                    locationPromiseRef.current.reject(permError);
                }
            })
            .catch(permCheckError => {
                console.error('Error checking permissions:', permCheckError);
                setLocation(null);
                setError(permCheckError);
                setIsLoading(false);
                locationPromiseRef.current.reject(permCheckError);
            });
    }, []); // Empty dependency array, runs once on mount

    const contextValue = useMemo(() => ({
        location,
        isLoading,
        error,
        getAsyncLocation: () => locationPromiseRef.current.promise,
    }), [location, isLoading, error]);

    return (
        <LocationContext.Provider value={contextValue}>
            {children}
        </LocationContext.Provider>
    );
};