"use client";

import { useState, useEffect } from 'react';
import { Card, Text, Group, Badge, Stack, Button, Avatar, ActionIcon } from '@mantine/core';
import { IconCalendarTime, IconClock, IconUsers, IconVideo, IconMessage, IconMapPin, IconBriefcase, IconUser } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';
import { trialSessionService } from '../../Services/TrialSessionService';
import { getJobPostedBy } from '../../Services/JobService';
import { getMentor } from '../../Services/MentorService';

interface UpcomingSession {
  id: string;
  type: 'interview' | 'trial' | 'mentorship';
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  contact: {
    name: string;
    avatar?: string;
    company?: string;
  };
  status: 'confirmed' | 'pending' | 'rescheduled';
}

const UpcomingSessions = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingSessions();
  }, [user, profile]);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      const allSessions: UpcomingSession[] = [];

      // 1. Fetch upcoming trial sessions (if user is a mentor)
      if (user?.accountType === 'MENTOR') {
        try {
          const trialSessions = await trialSessionService.getMyTrialSessions();
          const upcomingTrials = trialSessions
            .filter(session => {
              const sessionDate = new Date(session.scheduledDateTime);
              return session.status === 'BOOKED' && sessionDate > new Date();
            })
            .map(session => ({
              id: session.id?.toString() || '',
              type: 'trial' as const,
              title: 'Trial Session',
              description: `Trial session with ${session.menteeName}`,
              date: new Date(session.scheduledDateTime),
              duration: 60, // Default trial session duration
              meetingLink: session.meetingLink,
              contact: {
                name: session.menteeName || 'Unknown Student',
                company: 'Student',
                avatar: ''
              },
              status: 'confirmed' as const
            }));
          allSessions.push(...upcomingTrials);
        } catch (error) {
          console.log('No trial sessions found or not a mentor');
        }
      }

      // 2. Fetch booked trial sessions (if user is an applicant)
      if (user?.accountType === 'APPLICANT' && user?.email) {
        try {
          const bookedSessions = await trialSessionService.getBookedSessionsByEmail(user.email);
          // Build mentorId -> name map to show mentor names
          const mentorIds = Array.from(new Set((bookedSessions || [])
            .map((s: any) => s.mentorId)
            .filter((id: any) => id !== null && id !== undefined)));
          const mentorNameMap: Record<string, string> = {};
          if (mentorIds.length > 0) {
            await Promise.all(mentorIds.map(async (id: any) => {
              try {
                const mentor = await getMentor(id);
                const name = mentor?.name || [mentor?.firstName, mentor?.lastName].filter(Boolean).join(' ');
                mentorNameMap[String(id)] = name || 'Mentor';
              } catch (e) {
                mentorNameMap[String(id)] = 'Mentor';
              }
            }));
          }

          const upcomingBookedSessions = bookedSessions
            .filter(session => {
              const sessionDate = new Date(session.scheduledDateTime);
              return sessionDate > new Date();
            })
            .map(session => ({
              id: session.id?.toString() || '',
              type: 'trial' as const,
              title: 'Trial Session with Mentor',
              description: 'Your scheduled trial session',
              date: new Date(session.scheduledDateTime),
              duration: 60,
              meetingLink: session.meetingLink,
              contact: {
                name: mentorNameMap[String(session.mentorId)] || 'Mentor',
                company: 'Mentor',
                avatar: ''
              },
              status: 'confirmed' as const
            }));
          allSessions.push(...upcomingBookedSessions);
        } catch (error) {
          console.log('No booked sessions found');
        }
      }

      // 3. Fetch upcoming interviews (if user is a company)
      if (user?.accountType === 'COMPANY' && user?.id) {
        try {
          const postedJobs = await getJobPostedBy(user.id);
          const upcomingInterviews: UpcomingSession[] = [];
          
          postedJobs.forEach((job: any) => {
            if (job.applicants) {
              job.applicants.forEach((applicant: any) => {
                if (applicant.applicationStatus === 'INTERVIEWING' && applicant.interviewTime) {
                  const interviewDate = new Date(applicant.interviewTime);
                  if (interviewDate > new Date()) {
                    upcomingInterviews.push({
                      id: `${job.id}_${applicant.applicantId}`,
                      type: 'interview',
                      title: `Interview - ${job.jobTitle}`,
                      description: `Interview for ${job.jobTitle} position`,
                      date: interviewDate,
                      duration: 45, // Default interview duration
                      contact: {
                        name: applicant.name || 'Candidate',
                        company: 'Job Applicant',
                        avatar: ''
                      },
                      status: 'confirmed'
                    });
                  }
                }
              });
            }
          });
          allSessions.push(...upcomingInterviews);
        } catch (error) {
          console.log('No interviews found');
        }
      }

      // 4. Fetch scheduled interviews (if user is an applicant)
      if (user?.accountType === 'APPLICANT' && user?.id) {
        try {
          // This would require an API to get applied jobs with interview schedules
          // For now, we'll skip this as the API structure wasn't clear in the search results
          console.log('Interview fetch for applicants not yet implemented');
        } catch (error) {
          console.log('No scheduled interviews found');
        }
      }

      // Sort sessions by date
      allSessions.sort((a, b) => a.date.getTime() - b.date.getTime());

      setSessions(allSessions);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <IconBriefcase size={14} />;
      case 'trial':
        return <IconUsers size={14} />;
      case 'mentorship':
        return <IconUser size={14} />;
      default:
        return <IconCalendarTime size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rescheduled':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getTimeUntilSession = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return 'Past';
    if (diffHours < 1) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h ${diffMins}m`;
    return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`;
  };

  const joinMeeting = (meetingLink?: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  if (loading) {
    return (
      <Card shadow="sm" p="md" radius="md" className={`bg-white dark:bg-[var(--color-third)]`}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg" className="text-gray-900 dark:text-white">
            Upcoming Sessions
          </Text>
        </Group>
        <div className="flex items-center justify-center py-8">
          <Text size="sm" className="text-gray-500 dark:text-gray-400">
            Loading sessions...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card shadow="sm" p="md" radius="md" className={`bg-white dark:bg-[var(--color-third)]`}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg" className="text-gray-900 dark:text-white">
          Upcoming Sessions
        </Text>
        <Badge size="sm" variant="light" color="blue">
          {sessions.length}
        </Badge>
      </Group>

      {sessions.length > 0 ? (
        <Stack gap="sm">
          {sessions.slice(0, 3).map((session) => (
            <Card 
              key={session.id} 
              p="sm" 
              radius="md" 
              className={`border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-200`}
            >
              <Stack gap="xs">
                {/* Header */}
                <Group justify="space-between">
                  <Group gap="xs">
                    <Badge 
                      size="sm" 
                      variant="light" 
                      color={getTypeColor(session.type)}
                      leftSection={getTypeIcon(session.type)}
                    >
                      {session.type}
                    </Badge>
                    <Badge 
                      size="xs" 
                      variant="light" 
                      color={getStatusColor(session.status)}
                    >
                      {session.status}
                    </Badge>
                  </Group>
                  <Text size="xs" className="text-gray-500 dark:text-gray-400">
                    in {getTimeUntilSession(session.date)}
                  </Text>
                </Group>

                {/* Session Info */}
                <Group gap="sm" align="flex-start">
                  <Avatar 
                    src={session.contact.avatar} 
                    size="sm" 
                    radius="xl"
                    className="flex-shrink-0"
                  >
                    {session.contact.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <Text size="sm" fw={500} className={`truncate text-gray-900 dark:text-white`}>
                      {session.title}
                    </Text>
                    <Text size="xs" className="text-gray-600 dark:text-gray-300">
                      with {session.contact.name}
                      {session.contact.company && ` • ${session.contact.company}`}
                    </Text>
                    <Text size="xs" className="text-gray-500 dark:text-gray-400">
                      {session.description}
                    </Text>
                  </div>
                </Group>

                {/* Time and Duration */}
                <Group gap="sm" className="text-xs">
                  <Group gap="xs">
                    <IconCalendarTime size={14} className="text-gray-500 dark:text-gray-400" />
                    <Text size="xs" className="text-gray-600 dark:text-gray-300">
                      {formatDate(session.date)} at {formatTime(session.date)}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconClock size={14} className="text-gray-500 dark:text-gray-400" />
                    <Text size="xs" className="text-gray-600 dark:text-gray-300">
                      {session.duration} min
                    </Text>
                  </Group>
                </Group>

                {/* Actions */}
                <Group justify="space-between">
                  <Group gap="xs">
                    {session.meetingLink && (
                      <Button 
                        size="xs" 
                        variant="light" 
                        leftSection={<IconVideo size={14} />}
                        onClick={() => joinMeeting(session.meetingLink)}
                      >
                        Join
                      </Button>
                    )}
                    <ActionIcon 
                      size="sm" 
                      variant="light" 
                      color="blue"
                      title="Send message"
                    >
                      <IconMessage size={14} />
                    </ActionIcon>
                  </Group>
                  
          {session.location && (
                    <Group gap="xs">
            <IconMapPin size={14} className="text-gray-500 dark:text-gray-400" />
            <Text size="xs" className="text-gray-500 dark:text-gray-400">
                        {session.location}
                      </Text>
                    </Group>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}

          {sessions.length > 3 && (
            <Button 
              variant="light" 
              size="xs" 
              fullWidth
              className="mt-2"
            >
              View All Sessions ({sessions.length})
            </Button>
          )}
        </Stack>
      ) : (
        <Stack align="center" gap="sm" className="py-8">
          <IconCalendarTime size={48} className="text-gray-400 dark:text-gray-500" />
          <div className="text-center">
            <Text size="sm" fw={500} className="text-gray-600 dark:text-gray-300">
              No upcoming sessions
            </Text>
            <Text size="xs" className="text-gray-500 dark:text-gray-400">
              {user?.accountType === 'MENTOR' && 'Students can book trial sessions with you'}
              {user?.accountType === 'APPLICANT' && 'Book trial sessions with mentors or check for interview invitations'}
              {user?.accountType === 'COMPANY' && 'Schedule interviews with job applicants'}
            </Text>
          </div>
        </Stack>
      )}
    </Card>
  );
};

export default UpcomingSessions;
