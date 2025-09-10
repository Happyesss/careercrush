"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";
import { IconClock, IconUser, IconCalendar } from "@tabler/icons-react";
import trialSessionService from "../../Services/TrialSessionService";
import { TrialSession } from "../../types/mentorshipPackages";

// Use TrialSession interface from types
type Props = {
  mentor: Mentor;
  onBookTrial?: (selectedDate: string, selectedTime: string) => void;
};

interface AvailableSlot {
  date: string;
  dayName: string;
  day: number;
  month: string;
  slots: TrialSession[];
  times: string[];
}

export default function BookingTrial({ mentor, onBookTrial }: Props) {
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Fetch real available sessions from API
  useEffect(() => {
    fetchAvailableSlots();
  }, [mentor]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      if (!mentor.id) {
        console.error("Mentor ID is required");
        return;
      }

      // Convert mentor.id to number if it's a string
      const mentorId = typeof mentor.id === 'string' ? parseInt(mentor.id) : mentor.id;
      
      // 🌐 Get available sessions using the public endpoint
      const sessions: TrialSession[] = await trialSessionService.getAvailableSessionsByMentor(mentorId);
      
      // Group sessions by date
      const slotsMap = new Map<string, AvailableSlot>();
      
      sessions.forEach((session: TrialSession) => {
        const sessionDate = new Date(session.scheduledDateTime);
        const dateString = sessionDate.toISOString().split('T')[0];
        const timeString = sessionDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        if (!slotsMap.has(dateString)) {
          slotsMap.set(dateString, {
            date: dateString,
            dayName: sessionDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            day: sessionDate.getDate(),
            month: sessionDate.toLocaleDateString('en-US', { month: 'short' }),
            slots: [],
            times: []
          });
        }
        
        const slot = slotsMap.get(dateString)!;
        slot.slots.push(session);
        slot.times.push(timeString);
      });
      
      const availableSlotsList = Array.from(slotsMap.values());
      setAvailableSlots(availableSlotsList);
      
      // Auto-select first available date and time
      if (availableSlotsList.length > 0) {
        setSelectedDate(availableSlotsList[0].date);
        setSelectedTime(availableSlotsList[0].times[0]);
        setSelectedSessionId(availableSlotsList[0].slots[0].id || null);
      }
    } catch (error) {
      console.error("Error fetching available sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrial = async () => {
    if (!selectedSessionId || !selectedDate || !selectedTime) {
      alert("Please select a date and time to book");
      return;
    }

    try {
      setBookingLoading(true);
      
      // Get user details from localStorage or context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const menteeEmail = user.email || "guest@example.com";
      const menteeName = user.name || "Guest User";
      const menteePhone = user.phone;

      if (onBookTrial) {
        onBookTrial(selectedDate, selectedTime);
      } else {
        // 🌐 Call the booking API using the service
        const bookedSession = await trialSessionService.bookTrialSession({
          sessionId: selectedSessionId,
          menteeEmail,
          menteeName,
          menteePhone
        });
        
        alert(`Trial session booked successfully! Session ID: ${bookedSession.id}`);
        
        // 🔄 Refresh the available slots after booking
        await fetchAvailableSlots();
        
        // Reset selections after successful booking
        setSelectedDate("");
        setSelectedTime("");
        setSelectedSessionId(null);
      }
    } catch (error) {
      console.error("Error booking trial session:", error);
      alert("Failed to book trial session. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const getSelectedSlot = () => {
    return availableSlots.find(slot => slot.date === selectedDate);
  };

  const findSessionByTime = (time: string) => {
    const selectedSlot = getSelectedSlot();
    if (!selectedSlot) return null;
    
    const timeIndex = selectedSlot.times.indexOf(time);
    return timeIndex !== -1 ? selectedSlot.slots[timeIndex] : null;
  };

  const nameInitial = mentor.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <section className={`w-full ${isDarkMode ? "bg-cape-cod-950 text-gray-100" : "bg-white text-gray-900"} rounded-xl overflow-hidden shadow-sm border ${isDarkMode ? "border-cape-cod-800" : "border-gray-200"}`}>
      <div className="p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Book a Free Trial: To Plan Your Mentorship with {mentor.name || 'this mentor'}
              </h3>
              
              <div className="flex items-start gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <IconClock size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                    30 mins 1:1 call with the mentor
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm mt-2">
                <IconUser size={16} className={`flex-shrink-0 mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Trial session with mentor helps you understand the required structure, effort & duration to achieve your personal goals.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Dates */}
        {loading ? (
          <div className="mb-6 text-center">
            <p className="text-gray-500">Loading available dates...</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="mb-6 text-center">
            <p className="text-gray-500">No available slots for this mentor at the moment.</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Available Dates</h4>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                →
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedDate === slot.date;
                const isRecommended = slot === availableSlots[0]; // First slot is recommended
                
                return (
                  <button
                    key={slot.date}
                    onClick={() => {
                      setSelectedDate(slot.date);
                      setSelectedTime(slot.times[0]); // Auto-select first time
                      setSelectedSessionId(slot.slots[0].id || null);
                    }}
                    className={`flex-shrink-0 relative p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : isDarkMode
                        ? "border-cape-cod-700 bg-cape-cod-800 hover:border-cape-cod-600"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="text-center">
                      <div className={`text-xs font-medium ${isSelected ? "text-blue-600" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {slot.dayName}
                      </div>
                      <div className={`text-lg font-bold mt-1 ${isSelected ? "text-blue-600" : ""}`}>
                        {slot.day} {slot.month}
                      </div>
                      <div className={`text-xs mt-1 ${isSelected ? "text-blue-600" : "text-green-600"}`}>
                        {slot.slots.length} Slots
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Slots */}
        {selectedDate && !loading && getSelectedSlot() && (
          <div className="mb-6">
            <h4 className="font-semibold mb-4">Available Slots</h4>
            
            <div className="flex gap-3 flex-wrap">
              {getSelectedSlot()?.times.map((time, index) => {
                const isSelected = selectedTime === time;
                const isRecommended = index === 0; // First time is recommended
                
                return (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      const session = findSessionByTime(time);
                      setSelectedSessionId(session?.id || null);
                    }}
                    className={`relative px-4 py-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : isDarkMode
                        ? "border-cape-cod-700 bg-cape-cod-800 hover:border-cape-cod-600"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <span className="font-medium">{time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Book Button */}
        <div className="flex justify-center">
          <button
            onClick={handleBookTrial}
            disabled={!selectedDate || !selectedTime || !selectedSessionId || bookingLoading || loading}
            className={`w-full max-w-md px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              selectedDate && selectedTime && selectedSessionId && !bookingLoading && !loading
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {bookingLoading ? (
              "Booking..."
            ) : loading ? (
              "Loading..."
            ) : selectedDate && selectedTime ? (
              `Book a Free Trial for ${getSelectedSlot()?.dayName} ${getSelectedSlot()?.day} ${getSelectedSlot()?.month}, ${selectedTime}`
            ) : (
              "Select date and time to book"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}