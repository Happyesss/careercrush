"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";
import { IconChevronLeft, IconChevronRight, IconClock } from "@tabler/icons-react";

interface BookTrialProps {
  mentor: Mentor;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DateSlot {
  date: string;
  day: string;
  dayOfMonth: string;
  slots: number;
  isRecommended?: boolean;
}

const BookTrial = ({ mentor }: BookTrialProps) => {
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState<DateSlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  // Mock data - in real app, this would come from API
  const availableDates: DateSlot[] = [
    { date: "2025-09-09", day: "TUE", dayOfMonth: "9", slots: 15 },
    { date: "2025-09-10", day: "WED", dayOfMonth: "10", slots: 41 },
    { date: "2025-09-11", day: "THU", dayOfMonth: "11", slots: 36, isRecommended: true },
    { date: "2025-09-15", day: "MON", dayOfMonth: "15", slots: 49 },
    { date: "2025-09-16", day: "TUE", dayOfMonth: "16", slots: 28 },
    { date: "2025-09-17", day: "WED", dayOfMonth: "17", slots: 33 },
  ];

  const timeSlots: TimeSlot[] = [
    { time: "12:00 AM", available: true },
    { time: "12:15 AM", available: true },
    { time: "12:30 AM", available: true },
    { time: "12:45 AM", available: false },
    { time: "1:00 AM", available: true },
    { time: "1:15 AM", available: true },
    { time: "1:30 AM", available: true },
    { time: "1:45 AM", available: true },
  ];

  const visibleDates = availableDates.slice(currentDateIndex, currentDateIndex + 4);
  const visibleTimes = timeSlots.slice(currentTimeIndex, currentTimeIndex + 4);

  const handleDateNext = () => {
    if (currentDateIndex + 4 < availableDates.length) {
      setCurrentDateIndex(currentDateIndex + 4);
    }
  };

  const handleDatePrev = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(Math.max(0, currentDateIndex - 4));
    }
  };

  const handleTimeNext = () => {
    if (currentTimeIndex + 4 < timeSlots.length) {
      setCurrentTimeIndex(currentTimeIndex + 4);
    }
  };

  const handleTimePrev = () => {
    if (currentTimeIndex > 0) {
      setCurrentTimeIndex(Math.max(0, currentTimeIndex - 4));
    }
  };

  const handleDateSelect = (date: DateSlot) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookTrial = () => {
    if (selectedDate && selectedTime) {
      // Handle booking logic here
      console.log(`Booking trial for ${selectedDate.date} at ${selectedTime}`);
    }
  };

  // Set default selected date to recommended one
  useEffect(() => {
    const recommendedDate = availableDates.find(date => date.isRecommended);
    if (recommendedDate && !selectedDate) {
      setSelectedDate(recommendedDate);
    }
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-cape-cod-900 text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-sm p-6 max-w-md`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">
          <span className="text-purple-600">Book a</span>{" "}
          <span className="text-orange-500">Free 1:1 Trial:</span>{" "}
          <span className="text-gray-600">To Plan Your</span>
        </h3>
        <p className="text-gray-600 font-medium">
          Mentorship with <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} font-semibold`}>{mentor.name}</span>
        </p>
      </div>

      {/* Available Dates */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Available Dates</h4>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDatePrev}
              disabled={currentDateIndex === 0}
              className={`p-1 rounded ${currentDateIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <IconChevronLeft size={20} />
            </button>
            <button 
              onClick={handleDateNext}
              disabled={currentDateIndex + 4 >= availableDates.length}
              className={`p-1 rounded ${currentDateIndex + 4 >= availableDates.length ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {visibleDates.map((date) => (
            <button
              key={date.date}
              onClick={() => handleDateSelect(date)}
              className={`relative p-3 rounded-lg border text-center transition-all ${
                selectedDate?.date === date.date
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {date.isRecommended && (
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </span>
              )}
              <div className="text-xs text-gray-500 mb-1">{date.day}</div>
              <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`}>{date.dayOfMonth} Sep</div>
              <div className="text-xs text-green-500 font-medium">{date.slots} Slots</div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Slots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Available Slots</h4>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleTimePrev}
              disabled={currentTimeIndex === 0}
              className={`p-1 rounded ${currentTimeIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <IconChevronLeft size={20} />
            </button>
            <button 
              onClick={handleTimeNext}
              disabled={currentTimeIndex + 4 >= timeSlots.length}
              className={`p-1 rounded ${currentTimeIndex + 4 >= timeSlots.length ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {visibleTimes.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`p-3 rounded-lg border text-center transition-all ${
                selectedTime === slot.time
                  ? 'border-blue-500 bg-blue-50'
                  : slot.available
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
              }`}
            >
              <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{slot.time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBookTrial}
        disabled={!selectedDate || !selectedTime}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          selectedDate && selectedTime
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {selectedDate && selectedTime 
          ? `Book a Free Trial for ${selectedDate.day} ${selectedDate.dayOfMonth}, ${selectedTime}`
          : 'Select date and time to book'
        }
      </button>

      {/* Additional Info */}
      <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
        <IconClock className="mt-0.5 flex-shrink-0" size={16} />
        <div>
          <p className="font-medium">30 mins 1:1 call with the mentor</p>
          <p>Trial session with mentor helps you understand the required structure, effort & duration to achieve your personal goals.</p>
        </div>
      </div>
    </div>
  );
};

export default BookTrial;
