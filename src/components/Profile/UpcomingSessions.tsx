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
      <div className={`p-6 rounded-2xl shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-third border border-gray-700/30' 
          : 'bg-white border border-gray-200/60'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <IconCalendarTime className="h-5 w-5 text-purple-600" stroke={1.5} />
          </div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Sessions
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
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
            <IconCalendarTime className="h-5 w-5 text-purple-600" stroke={1.5} />
          </div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Sessions
          </h3>
        </div>
        <Badge 
          size="sm" 
          variant="light" 
          color="purple"
          className={isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}
        >
          {sessions.length}
        </Badge>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.slice(0, 3).map((session, index) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50' 
                  : 'bg-gray-50 border-gray-200/60 hover:bg-gray-100'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      size="sm" 
                      variant="light" 
                      color={getTypeColor(session.type)}
                      leftSection={getTypeIcon(session.type)}
                      className={`${
                        getTypeColor(session.type) === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                        getTypeColor(session.type) === 'orange' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                        getTypeColor(session.type) === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                        'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
                      }`}
                    >
                      {session.type}
                    </Badge>
                    <Badge 
                      size="xs" 
                      variant="light" 
                      color={getStatusColor(session.status)}
                      className={`${
                        getStatusColor(session.status) === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                        getStatusColor(session.status) === 'yellow' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400' :
                        getStatusColor(session.status) === 'orange' ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                        'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400'
                      }`}
                    >
                      {session.status}
                    </Badge>
                  </div>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    in {getTimeUntilSession(session.date)}
                  </span>
                </div>

                {/* Session Info */}
                <div className="flex items-start gap-3">
                  <Avatar 
                    src={session.contact.avatar} 
                    size="sm" 
                    radius="xl"
                    className="flex-shrink-0"
                  >
                    {session.contact.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {session.title}
                    </h4>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      with {session.contact.name}
                      {session.contact.company && ` • ${session.contact.company}`}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {session.description}
                    </p>
                  </div>
                </div>

                {/* Time and Duration */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <IconCalendarTime size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {formatDate(session.date)} at {formatTime(session.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {session.duration} min
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {session.meetingLink && (
                      <Button 
                        size="xs" 
                        variant="light" 
                        leftSection={<IconVideo size={14} />}
                        onClick={() => joinMeeting(session.meetingLink)}
                        className={`${
                          isDarkMode 
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        Join
                      </Button>
                    )}
                    <ActionIcon 
                      size="sm" 
                      variant="light" 
                      color="blue"
                      title="Send message"
                      className={`${
                        isDarkMode 
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      <IconMessage size={14} />
                    </ActionIcon>
                  </div>
                  
                  {session.location && (
                    <div className="flex items-center gap-1">
                      <IconMapPin size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {session.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {sessions.length > 3 && (
            <Button 
              variant="light" 
              size="sm" 
              fullWidth
              className={`mt-4 ${
                isDarkMode 
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              View All Sessions ({sessions.length})
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <IconCalendarTime size={48} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
          <div className="space-y-1">
            <h4 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              No upcoming sessions
            </h4>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {user?.accountType === 'MENTOR' && 'Students can book trial sessions with you'}
              {user?.accountType === 'APPLICANT' && 'Book trial sessions with mentors or check for interview invitations'}
              {user?.accountType === 'COMPANY' && 'Schedule interviews with job applicants'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
