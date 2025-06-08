import { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import {
    addMonths,
    format,
    startOfDay,
    isAfter,
    getDay,
    addDays,
    isSameDay
} from 'date-fns';

const useDoctorAvailability = (doctorId) => {
    const axios = useAxiosInstance();
    const [doctorDetails, setDoctorDetails] = useState(null); // Stores the full doctor object
    const [availabilityTimes, setAvailabilityTimes] = useState({}); // Mapping of DAY -> { time, maxAppointments }
    const [availableSlotsPerDate, setAvailableSlotsPerDate] = useState({}); // Mapping of "YYYY-MM-DD" -> { time, maxAppointments }
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/doctors/${doctorId}`);
                const data = response.data.data;
                setDoctorDetails(data); // Set the full doctor details

                // Process availabilities into an easier-to-use map (Day of week -> { time, maxAppointments })
                const processedAvailabilities = {};
                data.availabilities.forEach(avail => {
                    if (avail.day) {
                        processedAvailabilities[avail.day.toUpperCase()] = {
                            time: avail.time,
                            // Ensure maxAppointments is treated as 0 if null or undefined
                            maxAppointments: avail.maxAppointments ?? 0
                        };
                    }
                });
                setAvailabilityTimes(processedAvailabilities);

                // Generate available slots for specific future dates
                const today = startOfDay(new Date());
                const twoMonthsFromNow = addMonths(today, 2); // Generate for roughly 2 months from today (including current month)
                const generatedSlots = {};

                let currentDate = today;
                while (isAfter(twoMonthsFromNow, currentDate) || isSameDay(twoMonthsFromNow, currentDate)) {
                    const dayName = format(currentDate, 'EEEE').toUpperCase(); // e.g., "WEDNESDAY"
                    const doctorDayAvailability = processedAvailabilities[dayName];
                    const dateStr = format(currentDate, 'yyyy-MM-dd');

                    // Crucial Change Here:
                    // ONLY add an entry to generatedSlots if the doctor has a defined availability record for this day.
                    // If no record (doctorDayAvailability is undefined), `availableSlotsPerDate[dateStr]`
                    // will correctly be `undefined`, which the calendar can interpret as "Not Available".
                    if (doctorDayAvailability) {
                        generatedSlots[dateStr] = {
                            time: doctorDayAvailability.time,
                            maxAppointments: doctorDayAvailability.maxAppointments,
                            dayOfWeek: getDay(currentDate) // Add dayOfWeek for potential future use
                        };
                    }

                    // Move to the next day
                    currentDate = addDays(currentDate, 1);
                }

                setAvailableSlotsPerDate(generatedSlots);

            } catch (err) {
                console.error("Failed to fetch doctor availability:", err);
                setError(err.response?.data?.message || "Could not load doctor availability.");
            } finally {
                setIsLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctorData();
        }
    }, [doctorId, axios]);

    // Removed `availableDates` from return as it's not directly used by Calendar's coloring logic.
    return { doctorDetails, availabilityTimes, availableSlotsPerDate, isLoading, error };
};

export default useDoctorAvailability;