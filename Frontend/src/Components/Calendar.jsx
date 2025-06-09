import React, { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    isSameDay,
    isSameMonth,
    parseISO,
    isPast,
    isToday,
} from "date-fns";

const Calendar = ({ availableSlotsPerDate, selectedDate, onSelect }) => {

    const today = new Date();
    const navigationMonthLimit = addMonths(today, 2);

    const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

    const generateCalendarDates = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
        return eachDayOfInterval({ start: startDate, end: endDate });
    };

    const handlePrevMonth = () => {
        if (!isSameMonth(currentMonth, startOfMonth(today))) {
            setCurrentMonth(subMonths(currentMonth, 1));
        }
    };

    const handleNextMonth = () => {
        if (!isSameMonth(currentMonth, startOfMonth(navigationMonthLimit))) {
            setCurrentMonth(addMonths(currentMonth, 1));
        }
    };

    const renderCalendarCells = () => {
        const dates = generateCalendarDates();

        return dates.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const slotData = availableSlotsPerDate[dateStr];
            const slotsAvailable = slotData?.maxAppointments ?? 0;

            // console.group(`Date: ${dateStr}`); // Keep for debugging if needed
            // console.log("  slotData:", slotData);
            // console.log("  slotsAvailable (after ?? 0):", slotsAvailable);

            const hasDoctorAvailabilityRecordForThisDay = slotData !== undefined;
            // console.log("  hasDoctorAvailabilityRecordForThisDay:", hasDoctorAvailabilityRecordForThisDay);


            const isSelected = selectedDate && isSameDay(parseISO(selectedDate), date);
            const isDateOfCurrentMonth = isSameMonth(date, currentMonth);
            const isDateInPast = isPast(date) && !isToday(date);

            // Start with core, non-dynamic classes that are always present
            let dynamicClasses = "h-16 flex flex-col items-center justify-center p-1 rounded-md transition-all border text-center relative overflow-hidden";
            let content = null;
            let isInteractive = false;
            let slotIndicator = null;

            // Determine specific background, text, border, and cursor classes based on conditions
            let bgColorClass = "";
            let textColorClass = "";
            let borderColorClass = "";
            let cursorClass = "";


            if (isDateOfCurrentMonth) {
                content = (
                    <>
                        <span className="text-lg font-semibold leading-none">{format(date, "d")}</span>
                    </>
                );

                if (isDateInPast) {
                    bgColorClass = "bg-gray-100";
                    textColorClass = "text-gray-400";
                    borderColorClass = "border-gray-200";
                    cursorClass = "cursor-not-allowed";
                    slotIndicator = <span className="text-xs text-gray-500">Past</span>;
                    isInteractive = false;
                } else if (!hasDoctorAvailabilityRecordForThisDay) {
                    // Doctor has no availability record for this day (e.g., they never work Mondays)
                    bgColorClass = "bg-gray-100";
                    textColorClass = "text-gray-400";
                    borderColorClass = "border-gray-200";
                    cursorClass = "cursor-not-allowed";
                    slotIndicator = <span className="text-xs text-gray-500">N/A</span>;
                    isInteractive = false;
                } else { // Doctor HAS an availability record for this day
                    if (slotsAvailable === 0) {
                        bgColorClass = "bg-red-400";
                        textColorClass = "text-white";
                        borderColorClass = "border-red-500";
                        cursorClass = "cursor-not-allowed";
                        // slotIndicator = <span className="text-xs font-medium">Fully Booked</span>;
                        isInteractive = false;
                    } else if (slotsAvailable > 0 && slotsAvailable < 4) {
                        bgColorClass = "bg-orange-400 hover:brightness-110";
                        textColorClass = "text-white";
                        borderColorClass = "border-orange-500";
                        cursorClass = "cursor-pointer";
                        isInteractive = true;
                        // slotIndicator = <span className="text-xs font-medium">{slotsAvailable} Slots</span>;
                    } else { // slotsAvailable >= 4 (Green)
                        bgColorClass = "bg-green-500 hover:brightness-110";
                        textColorClass = "text-white";
                        borderColorClass = "border-green-600";
                        cursorClass = "cursor-pointer";
                        isInteractive = true;
                        // slotIndicator = <span className="text-xs font-medium">{slotsAvailable} Slots</span>;
                    }
                }

                // Apply Today's highlight (overlay)
                if (isToday(date)) {
                    dynamicClasses += " ring-2 ring-indigo-400 ring-offset-1";
                }

            } else {

                bgColorClass = "bg-transparent"; // Make background transparent
                textColorClass = "text-gray-400"; // Keep text grey for padding days
                borderColorClass = "border-transparent"; // Transparent border
                cursorClass = "cursor-default"; // Default cursor
                content = null; // Hide date number for days not in the current view month
                isInteractive = false;
            }

            dynamicClasses += ` ${bgColorClass} ${textColorClass} ${borderColorClass} ${cursorClass}`;


            // Apply Selected Date highlight (overlay)
            if (isSelected) {
                dynamicClasses += " ring-2 ring-blue-600 ring-offset-2";
            }



            return (
                <div
                    key={dateStr}

                    onClick={() => isInteractive && onSelect(dateStr)}
                    className={dynamicClasses}
                >
                    {content}
                    {/* Display slot indicator only for dates within the current month */}
                    {isDateOfCurrentMonth && (
                        <div className="absolute bottom-1 w-full flex justify-center items-center text-xs">
                            {slotIndicator}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="calendar max-w-lg mx-auto bg-white rounded-lg shadow-md p-4">
            {/* Header: Navigation */}
            <div className="flex justify-between items-center py-3 px-2 border-b mb-3">
                <button
                    onClick={handlePrevMonth}

                    disabled={isSameMonth(currentMonth, startOfMonth(today))}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                    {format(currentMonth, "MMMMyyyy")} {/* Display current month and year */}
                </h2>
                <button
                    onClick={handleNextMonth}

                    disabled={isSameMonth(currentMonth, startOfMonth(navigationMonthLimit))}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-center font-medium text-gray-700 pb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-sm">{day}</div>
                ))}
            </div>

            {/* Calendar Dates Grid */}
            <div className="grid grid-cols-7 gap-y-2 gap-1 p-1">
                {renderCalendarCells()}
            </div>
        </div>
    );
};

export default Calendar;