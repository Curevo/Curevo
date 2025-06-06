import { useEffect, useState } from "react";
import {useAxiosInstance} from '@/Config/axiosConfig.js';

function useDoctorAvailability(doctorId, weeksToShow = 3) {
    const axios = useAxiosInstance();
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const [availabilityTimes, setAvailabilityTimes] = useState({});
    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlotsPerDate, setAvailableSlotsPerDate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!doctorId) return;

        setIsLoading(true);
        setError(null);

        axios
            .get(`/api/doctors/availability/${doctorId}`)
            .then((response) => {
                const data = response.data.data;
                if (!data || !Array.isArray(data)) {
                    throw new Error("Invalid data format received");
                }

                // Simplified: map each day to a single time and maxAppointments
                const availabilityByDay = {};
                console.log(data);

                data.forEach(({ day, time, maxAppointments }) => {
                    const dayUpper = day.toUpperCase();
                    availabilityByDay[dayUpper] = {
                        time: time || null,
                        maxAppointments: maxAppointments || 0,
                    };
                });

                setAvailabilityTimes(availabilityByDay);

                // Extract available days (e.g., ['MONDAY', 'TUESDAY'])
                const days = Object.keys(availabilityByDay);
                setAvailabilityDays(days);

                // Get all upcoming dates matching these weekdays
                const dates = getAvailableDatesFromDays(days, weeksToShow);
                setAvailableDates(dates);

                // Map each date (YYYY-MM-DD) to its slot info using weekday lookup
                const mappedSlots = {};
                dates.forEach((dateStr) => {
                    const date = new Date(dateStr);
                    const weekday = date.toLocaleDateString("en-US", { weekday: "long",timeZone:"Asia/Kolkata"}).toUpperCase();
                    const availability = availabilityByDay[weekday];
                    if (availability) {
                        mappedSlots[dateStr] = {
                            time: availability.time,
                            maxAppointments: availability.maxAppointments,
                        };
                    } else {
                        console.warn("No availability found for weekday:", weekday);
                    }
                });


                setAvailableSlotsPerDate(mappedSlots);

            })
            .catch((error) => {
                console.error("Error fetching doctor availability:", error);
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [doctorId] );

    useEffect(() => {
        console.log("Available Dates", availableDates);
    }, [availableDates]);

    useEffect(() => {
        console.log("Available Days", availabilityDays);
    }, [availabilityDays]);
    useEffect(() => {
        console.log("Available Times", availabilityTimes);
    }, [availabilityTimes]);
    useEffect(() => {
        console.log("Available Slots", availableSlotsPerDate);
    }, [availableSlotsPerDate]);


    return {
        availabilityDays,
        availabilityTimes,
        availableDates,
        availableSlotsPerDate,
        isLoading,
        error,
    };
}

function getAvailableDatesFromDays(availabilityDays, weeksToShow = 3) {
    const dayToNumber = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };

    const today = new Date();
    const availableDates = [];

    for (let i = 0; i < weeksToShow * 7; i++) {
        const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i); // 🛡️ local time
        const weekday = futureDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(); // local weekday

        if (availabilityDays.includes(weekday)) {
            const yyyy = futureDate.getFullYear();
            const mm = String(futureDate.getMonth() + 1).padStart(2, '0');
            const dd = String(futureDate.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            availableDates.push(dateStr);
        }
    }

    return availableDates;
}


function calculateSlotsForDates(availableDates, slotsPerDayAndTime) {
    const slotsPerDate = {};

    availableDates.forEach((date) => {
        const dayName = new Date(date).toLocaleString("en-US", {
            weekday: "long",
        });
        const slotKeys = Object.keys(slotsPerDayAndTime).filter((key) =>
            key.startsWith(dayName)
        );

        const slotsForDate = slotKeys.reduce(
            (sum, key) => sum + slotsPerDayAndTime[key],
            0
        );

        slotsPerDate[date] = slotsForDate;
    });

    return slotsPerDate;
}

export default useDoctorAvailability;