"use client";

import { useState, useEffect } from 'react';
import { Card, Text, Group, Badge, Stack } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconCalendarEvent, IconClock, IconUsers } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';
import { trialSessionService } from '../../Services/TrialSessionService';
import { getJobPostedBy } from '../../Services/JobService';

interface ScheduleEvent {
  date: Date;
  type: 'interview' | 'trial' | 'mentorship';
  title: string;
  id?: string;
}

const ScheduleCalendar = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, [user, profile]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const allEvents: ScheduleEvent[] = [];

      // 1. Fetch trial sessions (if user is a mentor)
      if (user?.accountType === 'MENTOR') {
        try {
          const trialSessions = await trialSessionService.getMyTrialSessions();
          const trialEvents = trialSessions
            .filter(session => session.status === 'BOOKED')
            .map(session => ({
              date: new Date(session.scheduledDateTime),
              type: 'trial' as const,
              title: `Trial Session - ${session.menteeName}`,
              id: session.id?.toString()
            }));
          allEvents.push(...trialEvents);
        } catch (error) {
          console.log('No trial sessions found or not a mentor');
        }
      }

      // 2. Fetch booked trial sessions (if user is an applicant)
      if (user?.accountType === 'APPLICANT' && user?.email) {
        try {
          const bookedSessions = await trialSessionService.getBookedSessionsByEmail(user.email);
          const bookedEvents = bookedSessions.map(session => ({
            date: new Date(session.scheduledDateTime),
            type: 'trial' as const,
            title: `Trial Session with Mentor`,
            id: session.id?.toString()
          }));
          allEvents.push(...bookedEvents);
        } catch (error) {
          console.log('No booked sessions found');
        }
      }

      // 3. Fetch interview schedules (from job applications)
      if (user?.accountType === 'COMPANY' && user?.id) {
        try {
          const postedJobs = await getJobPostedBy(user.id);
          const interviewEvents: ScheduleEvent[] = [];
          
          postedJobs.forEach((job: any) => {
            if (job.applicants) {
              job.applicants.forEach((applicant: any) => {
                if (applicant.applicationStatus === 'INTERVIEWING' && applicant.interviewTime) {
                  interviewEvents.push({
                    date: new Date(applicant.interviewTime),
                    type: 'interview',
                    title: `Interview - ${applicant.name} for ${job.jobTitle}`,
                    id: `${job.id}_${applicant.applicantId}`
                  });
                }
              });
            }
          });
          allEvents.push(...interviewEvents);
        } catch (error) {
          console.log('No interviews found');
        }
      }

      // TODO: Add mentorship sessions when backend API is available
      // This would require a mentorship sessions API similar to trial sessions

      setEvents(allEvents);
      setHighlightedDates(allEvents.map(event => event.date));
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'blue';
      case 'trial':
        return 'orange';
      case 'mentorship':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <IconUsers size={14} />;
      case 'trial':
        return <IconClock size={14} />;
      case 'mentorship':
        return <IconCalendarEvent size={14} />;
      default:
        return <IconCalendarEvent size={14} />;
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Helper to check if a date is before today (compares only Y/M/D)
  const isPastDate = (d: Date) => {
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const now = new Date();
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dateOnly < todayOnly;
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    if (isPastDate(date)) {
      // ignore selections for past dates
      return;
    }
    setSelectedDate(date);
  };

  const renderDay = (date: Date) => {
    const dayEvents = getDayEvents(date);
    const hasEvents = dayEvents.length > 0;
  const past = isPastDate(date);

    // Get the color for the first event (or primary event type)
    const primaryEvent = dayEvents[0];
    const eventColor = primaryEvent ? getEventTypeColor(primaryEvent.type) : 'gray';

    // Base container for every day cell — when past, apply faded styles
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${past ? 'text-gray-400 dark:text-gray-500' : ''}`}>
        {hasEvents ? (
          <>
            <div
              className={`absolute inset-0 rounded-full ${
                past ? 'bg-gray-400' : (
                  eventColor === 'blue' ? 'bg-blue-500' :
                  eventColor === 'orange' ? 'bg-orange-500' :
                  eventColor === 'green' ? 'bg-green-500' :
                  'bg-gray-500'
                )
              }`}
              style={{ opacity: past ? 0.08 : 0.2 }}
            ></div>
            <div className={`relative z-10 ${past ? 'text-gray-700 dark:text-gray-200' : ''}`}>
              {date.getDate()}
            </div>
            {dayEvents.length > 1 && (
              <div className={`absolute -top-1 -right-1 w-2 h-2 ${past ? 'bg-gray-600' : 'bg-red-500'} rounded-full`}></div>
            )}
          </>
        ) : (
          <div className="relative z-10">{date.getDate()}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-third border border-gray-700/30' 
          : 'bg-white border border-gray-200/60'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <IconCalendarEvent className="h-5 w-5 text-blue-600" stroke={1.5} />
          </div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Schedule
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse space-y-3 w-full">
            <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
            <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
            <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
      isDarkMode 
        ? 'bg-third border border-gray-700/30' 
        : 'bg-white border border-gray-200/60'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <IconCalendarEvent className="h-5 w-5 text-blue-600" stroke={1.5} />
          </div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Schedule
          </h3>
        </div>
        <Badge 
          size="sm" 
          variant="light" 
          color="blue"
          className={isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}
        >
          {events.length} Events
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Calendar */}
        <div className={`flex justify-center ${isDarkMode ? '[&_.mantine-Calendar-month]:text-white [&_.mantine-Calendar-weekday]:text-gray-400 [&_.mantine-Calendar-day]:text-gray-200 [&_.mantine-Calendar-day:hover]:bg-gray-700 [&_.mantine-Calendar-calendarHeader]:text-white [&_.mantine-Calendar-calendarHeaderControl]:text-gray-300 [&_.mantine-Calendar-calendarHeaderControl:hover]:bg-gray-700' : ''}`}>
          <Calendar
            onChange={handleDateChange as any}
            size="sm"
            renderDay={renderDay}
            excludeDate={(date: Date) => isPastDate(date)}
          />
        </div>

        {/* Event Legend */}
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Event Types
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge 
              size="xs" 
              variant="light" 
              color="blue" 
              leftSection={<IconUsers size={12} />}
              className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            >
              Interview
            </Badge>
            <Badge 
              size="xs" 
              variant="light" 
              color="orange" 
              leftSection={<IconClock size={12} />}
              className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
            >
              Trial
            </Badge>
            <Badge 
              size="xs" 
              variant="light" 
              color="green" 
              leftSection={<IconCalendarEvent size={12} />}
              className="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
            >
              Mentorship
            </Badge>
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="space-y-3">
            <h4 className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            {getDayEvents(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getDayEvents(selectedDate).map((event, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge 
                        size="xs" 
                        variant="light" 
                        color={getEventTypeColor(event.type)}
                        leftSection={getEventTypeIcon(event.type)}
                      >
                        {event.type}
                      </Badge>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {event.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs text-center py-4 italic ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No events scheduled for this date
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
