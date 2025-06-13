import React, { useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useLocation } from '@/Hooks/LocationContext';
import { useNavigate } from 'react-router-dom';

export function useAxiosInstance() {
    const locationContext = useLocation();
    const navigate = useNavigate();
    const axiosInstance = useMemo(() => {
        console.log("Creating new Axios instance. Location context available:", !!locationContext);
        const instance = axios.create({
            baseURL: import.meta.env.VITE_BACKEND_URL || 'https://api.example.com/v1', // Provide a fallback for safety
            timeout: 60000, // Overall request timeout
        });

        instance.interceptors.request.use(async (config) => {
            console.log("Axios Interceptor: Processing request for:", config.url);
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            let effectiveLocation = locationContext?.location;

            if (!effectiveLocation && locationContext && locationContext.isLoading) {
                console.log("Axios Interceptor: Location not immediately available, context is loading. Waiting...");
                try {
                    const locationFetchTimeoutDuration = 7000;

                    effectiveLocation = await Promise.race([
                        locationContext.getAsyncLocation(),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Location fetch timed out within interceptor.')), locationFetchTimeoutDuration)
                        )
                    ]);
                    console.log("Axios Interceptor: Location obtained after waiting:", effectiveLocation);
                } catch (locError) {
                    console.warn("Axios Interceptor: Failed to obtain location while waiting or timed out.", locError.message);
                    effectiveLocation = null;
                }
            } else if (!effectiveLocation && locationContext && locationContext.error) {
                console.warn("Axios Interceptor: Location fetching previously failed with error:", locationContext.error.message);
            } else if (!locationContext) {
                console.warn("Axios Interceptor: LocationContext is not available. This might happen if useAxiosInstance is used outside LocationProvider.");
            }


            if (effectiveLocation?.latitude && effectiveLocation?.longitude) {
                config.headers['userLat'] = effectiveLocation.latitude;
                config.headers['userLon'] = effectiveLocation.longitude;
                console.log("Axios Interceptor: Location headers added.", { lat: effectiveLocation.latitude, lon: effectiveLocation.longitude });
            } else {
                console.warn("Axios Interceptor: Location not available or invalid. Proceeding without location headers.");
            }
            return config;
        }, (error) => {
            console.error("Axios Interceptor: Error in request interceptor setup", error);
            return Promise.reject(error);
        });

        instance.interceptors.response.use(
            response => response,
            error => {
                if (axios.isCancel(error)) {
                    console.log('Axios Interceptor: Request canceled by interceptor:', error.message);
                } else if (error.response?.status === 401 || error.response?.status === 403) {
                    console.warn("Axios Interceptor: Auth error, redirecting to login.");
                    localStorage.removeItem('token');
                    if (typeof window !== 'undefined') {
                        navigate('/login', { state: { showAuthErrorModal: true } })
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [locationContext]); // Re-create if locationContext object identity changes

    return axiosInstance;
}