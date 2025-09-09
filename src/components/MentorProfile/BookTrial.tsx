"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconClock, 
  IconMapPin,
  IconCheck,
  IconRefresh
} from "@tabler/icons-react";
import { trialSessionService } from "../../Services/TrialSessionService";
import { TrialSession, TrialSessionStatus } from "../../types/mentorshipPackages";
import { useSelector } from "react-redux";

interface BookTrialProps {
  mentor: Mentor;
}

interface TimeSlot {
  time: string;
  available: boolean;
  sessionId?: number;
  duration?: number;
  sessionTitle?: string;
  sessionDescription?: string;
  allowRescheduling?: boolean;
  requireConfirmation?: boolean;
  specialInstructions?: string;
  timeZone?: string;
}

interface DateSlot {
  date: string;
  day: string;
  dayOfMonth: string;
  slots: number;
  timeSlots?: TimeSlot[];
  isRecommended?: boolean;
}

const BookTrial = ({ mentor }: BookTrialProps) => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const [selectedDate, setSelectedDate] = useState<DateSlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [availableDates, setAvailableDates] = useState<DateSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Fetch available trial sessions for the mentor
  useEffect(() => {
    const fetchAvailableSessions = async () => {
      try {
        setLoading(true);
        const sessions: TrialSession[] = await trialSessionService.getAvailableSessionsByMentor(Number(mentor.id));
        
        // Group sessions by date
        const dateMap = new Map<string, TrialSession[]>();
        sessions.forEach(session => {
          const date = new Date(session.scheduledDateTime).toISOString().split('T')[0];
          if (!dateMap.has(date)) {
            dateMap.set(date, []);
          }
          dateMap.get(date)!.push(session);
        });

        // Convert to DateSlot format with enhanced information
        const dates: DateSlot[] = Array.from(dateMap.entries()).map(([dateStr, sessionsForDate], index) => {
          const date = new Date(dateStr);
          const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          
          // Convert sessions to enhanced time slots
          const enhancedTimeSlots: TimeSlot[] = sessionsForDate
            .sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime())
            .map(session => {
              const dateTime = new Date(session.scheduledDateTime);
              const timeString = dateTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              return {
                time: timeString,
                available: session.status === TrialSessionStatus.AVAILABLE,
                sessionId: session.id,
                duration: session.durationMinutes,
                sessionTitle: session.sessionTitle,
                sessionDescription: session.sessionDescription,
                allowRescheduling: session.allowRescheduling,
                requireConfirmation: session.requireConfirmation,
                specialInstructions: session.specialInstructions,
                timeZone: session.timeZone
              };
            });
          
          return {
            date: dateStr,
            day: dayNames[date.getDay()],
            dayOfMonth: date.getDate().toString(),
            slots: sessionsForDate.length,
            timeSlots: enhancedTimeSlots,
            isRecommended: index === 0 // Mark first available date as recommended
          };
        });

        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching available sessions:', error);
        setAvailableDates([]);
      } finally {
        setLoading(false);
      }
    };

    if (mentor.id) {
      fetchAvailableSessions();
    }
  }, [mentor.id]);

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

  const handleDateSelect = async (date: DateSlot) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSessionId(null);
    setSelectedSlot(null);
    
    // Use enhanced time slots if available
    if (date.timeSlots) {
      setTimeSlots(date.timeSlots);
      setCurrentTimeIndex(0);
    } else {
      // Fallback to original logic for backward compatibility
      try {
        const sessions: TrialSession[] = await trialSessionService.getAvailableSessionsByMentor(Number(mentor.id));
        const sessionsForDate = sessions.filter(session => {
          const sessionDate = new Date(session.scheduledDateTime).toISOString().split('T')[0];
          return sessionDate === date.date;
        });

        const slots: TimeSlot[] = sessionsForDate.map(session => {
          const dateTime = new Date(session.scheduledDateTime);
          const timeString = dateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          return {
            time: timeString,
            available: session.status === TrialSessionStatus.AVAILABLE,
            sessionId: session.id
          };
        });

        setTimeSlots(slots);
        setCurrentTimeIndex(0);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setTimeSlots([]);
      }
    }
  };

  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedTime(slot.time);
    setSelectedSlot(slot);
    setSelectedSessionId(slot.sessionId || null);
  };

  const handleBookTrial = async () => {
    if (selectedSessionId && user) {
      try {
        const bookingData = {
          sessionId: selectedSessionId,
          menteeName: user.name || "Anonymous User",
          menteeEmail: user.email || "",
          menteePhone: user.phone || ""
        };
        
        const bookedSession = await trialSessionService.bookTrialSession(bookingData);
        console.log('Trial session booked successfully:', bookedSession);
        
        // Enhanced success message with session details
        let successMessage = selectedSlot?.requireConfirmation
          ? `Trial session request sent! ${mentor.name} will confirm your booking soon.`
          : `Trial session booked successfully with ${mentor.name}!`;
        
        if (selectedSlot) {
          successMessage += `\n\nDetails:
          Date: ${selectedDate?.day} ${selectedDate?.dayOfMonth}
          Time: ${selectedSlot.time}`;
          
          if (selectedSlot.duration) {
            successMessage += `\nDuration: ${selectedSlot.duration} minutes`;
          }
          
          if (selectedSlot.sessionTitle) {
            successMessage += `\nSession: ${selectedSlot.sessionTitle}`;
          }
          
          if (selectedSlot.specialInstructions) {
            successMessage += `\nInstructions: ${selectedSlot.specialInstructions}`;
          }
          
          if (selectedSlot.timeZone && selectedSlot.timeZone !== 'UTC') {
            successMessage += `\nTime Zone: ${selectedSlot.timeZone}`;
          }
        }
        
        alert(successMessage);
        
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedSessionId(null);
        setSelectedSlot(null);
        setTimeSlots([]);
        
      } catch (error) {
        console.error('Error booking trial session:', error);
        alert('Failed to book trial session. Please try again.');
      }
    } else if (!user) {
      alert('Please log in to book a trial session.');
    }
  };

  // Set default selected date to recommended one when data loads
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const recommendedDate = availableDates.find(date => date.isRecommended) || availableDates[0];
      if (recommendedDate) {
        handleDateSelect(recommendedDate);
      }
    }
  }, [availableDates]);

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-cape-cod-900 text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-sm p-6 max-w-md`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading available slots...</span>
        </div>
      </div>
    );
  }

  if (availableDates.length === 0) {
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
        <div className="text-center py-8">
          <p className="text-gray-500">No trial sessions available at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Please check back later or contact the mentor directly.</p>
        </div>
      </div>
    );
  }

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

        {timeSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {visibleTimes.map((slot, index) => (
              <button
                key={`${slot.time}-${slot.sessionId || index}`}
                onClick={() => slot.available && handleTimeSelect(slot)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedTime === slot.time
                    ? 'border-blue-500 bg-blue-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {slot.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.requireConfirmation && (
                      <IconCheck size={12} className="text-orange-500" title="Requires confirmation" />
                    )}
                    {slot.allowRescheduling && (
                      <IconRefresh size={12} className="text-green-500" title="Can be rescheduled" />
                    )}
                    {slot.timeZone && slot.timeZone !== 'UTC' && (
                      <IconMapPin size={12} className="text-blue-500" title={`Time zone: ${slot.timeZone}`} />
                    )}
                  </div>
                </div>
                {slot.duration && (
                  <div className="text-xs text-gray-500 mt-1">
                    {slot.duration} min
                  </div>
                )}
                {slot.sessionTitle && (
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    {slot.sessionTitle}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : selectedDate ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No available slots for this date.</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Select a date to see available slots.</p>
          </div>
        )}
      </div>

      {/* Enhanced Session Information */}
      {selectedSlot && (
        <div className="mb-4 space-y-2">
          {selectedSlot.sessionDescription && (
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
              <p className="text-sm text-gray-600">{selectedSlot.sessionDescription}</p>
            </div>
          )}
          
          {selectedSlot.specialInstructions && (
            <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-blue-50'}`}>
              <h5 className="font-medium text-blue-700 mb-1">Special Instructions:</h5>
              <p className="text-sm text-blue-600">{selectedSlot.specialInstructions}</p>
            </div>
          )}
          
          {selectedSlot.requireConfirmation && (
            <div className={`p-3 rounded-lg border-l-4 border-orange-500 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-orange-50'}`}>
              <div className="flex items-center gap-2 text-orange-700 mb-1">
                <IconCheck size={16} />
                <h5 className="font-medium">Confirmation Required</h5>
              </div>
              <p className="text-sm text-orange-600">
                This session requires confirmation from the mentor before it's finalized.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookTrial}
        disabled={!selectedSessionId || !user}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          selectedSessionId && user
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {!user 
          ? 'Please log in to book'
          : selectedSessionId 
            ? `Book${selectedSlot?.requireConfirmation ? ' (Pending Confirmation)' : ''} - ${selectedDate?.day} ${selectedDate?.dayOfMonth}, ${selectedTime}`
            : 'Select date and time to book'
        }
      </button>

      {/* Additional Info */}
      <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
        <IconClock className="mt-0.5 flex-shrink-0" size={16} />
        <div>
          <p className="font-medium">
            {selectedSlot?.duration || '30'} mins 1:1 call with the mentor
          </p>
          <p>Trial session with mentor helps you understand the required structure, effort & duration to achieve your personal goals.</p>
          {selectedSlot?.timeZone && selectedSlot.timeZone !== 'UTC' && (
            <p className="mt-1 text-blue-600">
              <IconMapPin className="inline mr-1" size={12} />
              Times shown in {selectedSlot.timeZone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTrial;
