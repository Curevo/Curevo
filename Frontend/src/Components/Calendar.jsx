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
} from "date-fns";

const Calendar = ({ availableSlotsPerDate, selectedDate, onSelect }) => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);

    const [currentMonth, setCurrentMonth] = useState(today);

    // Generate calendar dates (within current month's range)
    const generateCalendarDates = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

        return eachDayOfInterval({ start: startDate, end: endDate });
    };

    const handlePrevMonth = () => {
        if (!isViewingCurrentMonth()) {
            setCurrentMonth(subMonths(currentMonth, 1));
        }
    };

    const handleNextMonth = () => {
        if (!isViewingNextMonth()) {
            setCurrentMonth(addMonths(currentMonth, 1));
        }
    };

    const isViewingCurrentMonth = () =>
        currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

    const isViewingNextMonth = () =>
        currentMonth.getMonth() === nextMonth.getMonth() && currentMonth.getFullYear() === nextMonth.getFullYear();

    const renderCalendarCells = () => {
        const dates = generateCalendarDates();

        return dates.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const slot = availableSlotsPerDate[dateStr];
            const slotsAvailable = slot?.maxAppointments ?? 0;
            const isSelected = selectedDate && isSameDay(parseISO(selectedDate), date);

            let bgColor = "bg-gray-300 opacity-50 text-gray-500";
            if (isSameMonth(date, currentMonth)) {
                if (slotsAvailable > 0) {
                    bgColor =
                        slotsAvailable >= 4
                            ? "bg-green-500 text-white"
                            : "bg-orange-400 text-white"; // Use orange instead of greyish for clarity
                }
            }

            const isInteractive = isSameMonth(date, currentMonth) && date >= today && slotsAvailable > 0;
            const additionalStyles = isInteractive
                ? "hover:brightness-110 cursor-pointer"
                : "cursor-not-allowed";

            return (
                <div
                    key={dateStr}
                    onClick={() => isInteractive && onSelect(dateStr)}
                    className={`h-16 flex items-center justify-center p-1 rounded-md transition-all border ${bgColor} ${
                        isSelected ? "ring-2 ring-blue-400" : ""
                    } ${additionalStyles}`}
                >
                    {format(date, "d")}
                </div>
            );
        });

    };

    return (
        <div className="calendar max-w-lg mx-auto">
            {/* Header: Navigation */}
            <div className="flex justify-between items-center py-4 px-6 border-b">
                {!isViewingCurrentMonth() && (
                    <button
                        onClick={handlePrevMonth}
                        className="px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                    >
                        Previous
                    </button>
                )}
                <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
                {!isViewingNextMonth() && (
                    <button
                        onClick={handleNextMonth}
                        className="px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300"
                    >
                        Next
                    </button>
                )}
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 text-center font-medium text-gray-700 pt-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Dates */}
            <div className="grid grid-cols-7 gap-y-2 gap-1 p-3">{renderCalendarCells()}</div>
        </div>
    );
};

export default Calendar;