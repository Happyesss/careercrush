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
      <Card shadow="sm" p="md" radius="md" className={`bg-white dark:bg-[var(--color-third)]`}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg" className="text-gray-900 dark:text-white">
            Schedule
          </Text>
        </Group>
        <div className="flex items-center justify-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-400">
            Loading schedule...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card shadow="sm" p="md" radius="md" className={`bg-white dark:bg-[var(--color-third)]`}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg" className="text-gray-900 dark:text-white">
          Schedule
        </Text>
        <Badge size="sm" variant="light" color="blue">
          {events.length} Events
        </Badge>
      </Group>

      <Stack gap="md">
        {/* Calendar */}
        <Calendar
          onChange={handleDateChange as any}
          size="sm"
          renderDay={renderDay}
          excludeDate={(date: Date) => isPastDate(date)}
          className="dark:[&_.mantine-Calendar-month]:text-white dark:[&_.mantine-Calendar-weekday]:text-gray-400 dark:[&_.mantine-Calendar-day]:text-gray-200 dark:[&_.mantine-Calendar-day_today]:border dark:[&_.mantine-Calendar-day_today]:border-gray-600 dark:[&_.mantine-Calendar-day_disabled]:opacity-30"
        />

        {/* Event Legend */}
        <Stack gap="xs">
          <Text size="sm" fw={500} className="text-gray-900 dark:text-white">
            Event Types
          </Text>
          <Group gap="xs">
            <Badge 
              size="xs" 
              variant="light" 
              color="blue" 
              leftSection={<IconUsers size={12} />}
            >
              Interview
            </Badge>
            <Badge 
              size="xs" 
              variant="light" 
              color="orange" 
              leftSection={<IconClock size={12} />}
            >
              Trial
            </Badge>
            <Badge 
              size="xs" 
              variant="light" 
              color="green" 
              leftSection={<IconCalendarEvent size={12} />}
            >
              Mentorship
            </Badge>
          </Group>
        </Stack>

        {/* Selected Date Events */}
        {selectedDate && (
          <Stack gap="xs">
            <Text size="sm" fw={500} className="text-gray-900 dark:text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            {getDayEvents(selectedDate).length > 0 ? (
              <Stack gap="xs">
                {getDayEvents(selectedDate).map((event, index) => (
                  <div 
                    key={index}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <Group gap="xs">
                      <Badge 
                        size="xs" 
                        variant="light" 
                        color={getEventTypeColor(event.type)}
                        leftSection={getEventTypeIcon(event.type)}
                      >
                        {event.type}
                      </Badge>
                      <Text size="xs" className="text-gray-600 dark:text-gray-300">
                        {event.title}
                      </Text>
                    </Group>
                  </div>
                ))}
              </Stack>
            ) : (
              <Text size="xs" className="text-gray-500 dark:text-gray-400">
                No events scheduled for this date
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default ScheduleCalendar;
