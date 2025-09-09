"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconClock, 
  IconCalendar,
  IconMapPin,
  IconRefresh,
  IconCheck,
  IconX,
  IconSettings,
  IconFilter
} from "@tabler/icons-react";
import { trialSessionService } from "../../Services/TrialSessionService";
import { TrialSession, TrialSessionStatus } from "../../types/mentorshipPackages";
import { useSelector } from "react-redux";

interface BookTrialEnhancedProps {
  mentor: Mentor;
}

interface TimeSlot {
  time: string;
  duration: number;
  available: boolean;
  sessionId?: number;
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
  slots: TimeSlot[];
  isRecommended?: boolean;
  totalSlots: number;
  availableSlots: number;
}

interface BookingFilters {
  duration?: number;
  sessionType?: string;
  timeZone?: string;
  showRecurringOnly?: boolean;
  allowRescheduling?: boolean;
}

const BookTrialEnhanced = ({ mentor }: BookTrialEnhancedProps) => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  
  // Selection state
  const [selectedDate, setSelectedDate] = useState<DateSlot | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  
  // Navigation state
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  
  // Data state
  const [availableDates, setAvailableDates] = useState<DateSlot[]>([]);
  const [allSessions, setAllSessions] = useState<TrialSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<BookingFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // View state
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Fetch available trial sessions for the mentor
  useEffect(() => {
    const fetchAvailableSessions = async () => {
      try {
        setLoading(true);
        const sessions: TrialSession[] = await trialSessionService.getAvailableSessionsByMentor(Number(mentor.id));
        setAllSessions(sessions);
        processSessionsIntoDateSlots(sessions);
      } catch (error) {
        console.error('Error fetching available sessions:', error);
        setAllSessions([]);
        setAvailableDates([]);
      } finally {
        setLoading(false);
      }
    };

    if (mentor.id) {
      fetchAvailableSessions();
    }
  }, [mentor.id]);

  // Process sessions when filters change
  useEffect(() => {
    if (allSessions.length > 0) {
      const filteredSessions = applyFilters(allSessions);
      processSessionsIntoDateSlots(filteredSessions);
    }
  }, [filters, allSessions]);

  const applyFilters = (sessions: TrialSession[]): TrialSession[] => {
    return sessions.filter(session => {
      // Duration filter
      if (filters.duration && session.durationMinutes !== filters.duration) {
        return false;
      }
      
      // Session type filter
      if (filters.sessionType && session.sessionType !== filters.sessionType) {
        return false;
      }
      
      // Time zone filter
      if (filters.timeZone && session.timeZone !== filters.timeZone) {
        return false;
      }
      
      // Recurring filter
      if (filters.showRecurringOnly && !session.isRecurring) {
        return false;
      }
      
      // Rescheduling filter
      if (filters.allowRescheduling !== undefined && session.allowRescheduling !== filters.allowRescheduling) {
        return false;
      }
      
      return true;
    });
  };

  const processSessionsIntoDateSlots = (sessions: TrialSession[]) => {
    // Group sessions by date
    const dateMap = new Map<string, TrialSession[]>();
    sessions.forEach(session => {
      const date = new Date(session.scheduledDateTime).toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, []);
      }
      dateMap.get(date)!.push(session);
    });

    // Convert to DateSlot format
    const dates: DateSlot[] = Array.from(dateMap.entries())
      .map(([dateStr, sessionsForDate], index) => {
        const date = new Date(dateStr);
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        
        // Convert sessions to time slots
        const timeSlots: TimeSlot[] = sessionsForDate
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
              duration: session.durationMinutes,
              available: session.status === TrialSessionStatus.AVAILABLE,
              sessionId: session.id,
              sessionTitle: session.sessionTitle,
              sessionDescription: session.sessionDescription,
              allowRescheduling: session.allowRescheduling,
              requireConfirmation: session.requireConfirmation,
              specialInstructions: session.specialInstructions,
              timeZone: session.timeZone
            };
          });

        const availableSlots = timeSlots.filter(slot => slot.available).length;
        
        return {
          date: dateStr,
          day: dayNames[date.getDay()],
          dayOfMonth: date.getDate().toString(),
          slots: timeSlots,
          totalSlots: timeSlots.length,
          availableSlots,
          isRecommended: index === 0 && availableSlots > 0 // Mark first available date as recommended
        };
      })
      .filter(dateSlot => dateSlot.availableSlots > 0) // Only show dates with available slots
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setAvailableDates(dates);
  };

  const visibleDates = availableDates.slice(currentDateIndex, currentDateIndex + 4);
  const visibleTimes = selectedDate?.slots.slice(currentTimeIndex, currentTimeIndex + 4) || [];

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
    if (selectedDate && currentTimeIndex + 4 < selectedDate.slots.length) {
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
    setSelectedTimeSlot(null);
    setSelectedSessionId(null);
    setCurrentTimeIndex(0);
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedSessionId(timeSlot.sessionId || null);
  };

  const handleBookTrial = async () => {
    if (selectedSessionId && user && selectedTimeSlot) {
      try {
        setBooking(true);
        const bookingData = {
          sessionId: selectedSessionId,
          menteeName: user.name || "Anonymous User",
          menteeEmail: user.email || "",
          menteePhone: user.phone || ""
        };
        
        const bookedSession = await trialSessionService.bookTrialSession(bookingData);
        console.log('Trial session booked successfully:', bookedSession);
        
        // Show success message with session details
        const successMessage = selectedTimeSlot.requireConfirmation 
          ? `Trial session request sent! ${mentor.name} will confirm your booking soon.`
          : `Trial session booked successfully with ${mentor.name}!`;
        
        alert(successMessage + 
          `\n\nDetails:
          Date: ${selectedDate?.day} ${selectedDate?.dayOfMonth}
          Time: ${selectedTimeSlot.time}
          Duration: ${selectedTimeSlot.duration} minutes
          ${selectedTimeSlot.specialInstructions ? '\nSpecial Instructions: ' + selectedTimeSlot.specialInstructions : ''}`
        );
        
        // Reset selections and refresh data
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        setSelectedSessionId(null);
        
        // Refresh sessions
        const updatedSessions = await trialSessionService.getAvailableSessionsByMentor(Number(mentor.id));
        setAllSessions(updatedSessions);
        
      } catch (error) {
        console.error('Error booking trial session:', error);
        alert('Failed to book trial session. Please try again.');
      } finally {
        setBooking(false);
      }
    } else if (!user) {
      alert('Please log in to book a trial session.');
    }
  };

  const getSessionTypeOptions = () => {
    const types = [...new Set(allSessions.map(s => s.sessionType))];
    return types;
  };

  const getTimeZoneOptions = () => {
    const zones = [...new Set(allSessions.map(s => s.timeZone || 'UTC'))];
    return zones;
  };

  const getDurationOptions = () => {
    const durations = [...new Set(allSessions.map(s => s.durationMinutes))].sort((a, b) => a - b);
    return durations;
  };

  // Set default selected date when data loads
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">
            <span className="text-purple-600">Book a</span>{" "}
            <span className="text-orange-500">Free 1:1 Trial:</span>{" "}
            <span className="text-gray-600">To Plan Your</span>
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Filter sessions"
          >
            <IconFilter size={16} />
          </button>
        </div>
        <p className="text-gray-600 font-medium">
          Mentorship with <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'} font-semibold`}>{mentor.name}</span>
        </p>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className="font-medium mb-3">Filter Options</h4>
          <div className="space-y-3">
            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select
                value={filters.duration || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value ? parseInt(e.target.value) : undefined }))}
                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-cape-cod-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="">All durations</option>
                {getDurationOptions().map(duration => (
                  <option key={duration} value={duration}>{duration} minutes</option>
                ))}
              </select>
            </div>

            {/* Session Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Session Type</label>
              <select
                value={filters.sessionType || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, sessionType: e.target.value || undefined }))}
                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-cape-cod-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="">All types</option>
                {getSessionTypeOptions().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Time Zone Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Time Zone</label>
              <select
                value={filters.timeZone || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, timeZone: e.target.value || undefined }))}
                className={`w-full p-2 border rounded ${isDarkMode ? 'bg-cape-cod-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="">All time zones</option>
                {getTimeZoneOptions().map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showRecurringOnly || false}
                  onChange={(e) => setFilters(prev => ({ ...prev, showRecurringOnly: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm">Recurring only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.allowRescheduling !== undefined ? filters.allowRescheduling : false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    allowRescheduling: e.target.checked ? true : undefined 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Can reschedule</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({})}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Available Dates */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Available Dates ({availableDates.length})
          </h4>
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
              <div className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-1`}>
                {date.dayOfMonth} Sep
              </div>
              <div className="text-xs text-green-500 font-medium">
                {date.availableSlots} / {date.totalSlots} slots
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Available Slots
            {selectedDate && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({selectedDate.availableSlots} available)
              </span>
            )}
          </h4>
          {selectedDate && selectedDate.slots.length > 4 && (
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
                disabled={currentTimeIndex + 4 >= selectedDate.slots.length}
                className={`p-1 rounded ${currentTimeIndex + 4 >= selectedDate.slots.length ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {visibleTimes.length > 0 ? (
          <div className="space-y-2">
            {visibleTimes.map((slot) => (
              <button
                key={`${slot.time}-${slot.sessionId}`}
                onClick={() => slot.available && handleTimeSelect(slot)}
                disabled={!slot.available}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  selectedTimeSlot?.sessionId === slot.sessionId
                    ? 'border-blue-500 bg-blue-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconClock size={16} className="text-gray-400" />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {slot.time}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({slot.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.requireConfirmation && (
                      <IconCheck size={14} className="text-orange-500" title="Requires confirmation" />
                    )}
                    {slot.allowRescheduling && (
                      <IconRefresh size={14} className="text-green-500" title="Can be rescheduled" />
                    )}
                    {slot.timeZone && slot.timeZone !== 'UTC' && (
                      <IconMapPin size={14} className="text-blue-500" title={`Time zone: ${slot.timeZone}`} />
                    )}
                  </div>
                </div>
                {slot.sessionTitle && (
                  <div className="text-sm font-medium text-gray-700 mt-1">
                    {slot.sessionTitle}
                  </div>
                )}
                {slot.sessionDescription && (
                  <div className="text-sm text-gray-500 mt-1">
                    {slot.sessionDescription}
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

      {/* Special Instructions */}
      {selectedTimeSlot?.specialInstructions && (
        <div className={`mb-4 p-3 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-blue-50'}`}>
          <h5 className="font-medium text-blue-700 mb-1">Special Instructions:</h5>
          <p className="text-sm text-blue-600">{selectedTimeSlot.specialInstructions}</p>
        </div>
      )}

      {/* Confirmation Notice */}
      {selectedTimeSlot?.requireConfirmation && (
        <div className={`mb-4 p-3 rounded-lg border-l-4 border-orange-500 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-orange-50'}`}>
          <div className="flex items-center gap-2 text-orange-700 mb-1">
            <IconCheck size={16} />
            <h5 className="font-medium">Confirmation Required</h5>
          </div>
          <p className="text-sm text-orange-600">
            This session requires confirmation from the mentor before it's finalized.
          </p>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookTrial}
        disabled={!selectedSessionId || !user || booking}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          selectedSessionId && user && !booking
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {booking 
          ? 'Booking...'
          : !user 
            ? 'Please log in to book'
            : selectedSessionId 
              ? `Book${selectedTimeSlot?.requireConfirmation ? ' (Pending Confirmation)' : ''} - ${selectedDate?.day} ${selectedDate?.dayOfMonth}, ${selectedTimeSlot?.time}`
              : 'Select date and time to book'
        }
      </button>

      {/* Session Information */}
      <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
        <IconClock className="mt-0.5 flex-shrink-0" size={16} />
        <div>
          <p className="font-medium">
            {selectedTimeSlot?.duration || '30'} mins 1:1 call with the mentor
          </p>
          <p>
            Trial session with mentor helps you understand the required structure, 
            effort & duration to achieve your personal goals.
          </p>
          {selectedTimeSlot?.timeZone && selectedTimeSlot.timeZone !== 'UTC' && (
            <p className="mt-1 text-blue-600">
              <IconMapPin className="inline mr-1" size={12} />
              Times shown in {selectedTimeSlot.timeZone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTrialEnhanced;
