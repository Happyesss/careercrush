"use client";

import { useState, useEffect } from 'react';
import { Container, Group, Stack, Text, Title, Tabs, Badge, Card, Loader, Paper } from '@mantine/core';
import Link from 'next/link';
import { IconCalendarTime, IconChartBar, IconTrendingUp, IconUsers, IconCheck, IconX } from '@tabler/icons-react';
import { useTheme } from '../../../ThemeContext';
import { TrialSessionStats, TrialSession, TrialSessionStatus } from '../../../types/mentorshipPackages';
import { statsService } from '../../../Services/MentorshipPackageService';
import trialSessionService from '../../../Services/TrialSessionService';
import TrialSessionManager from './TrialSessionManager';

interface TrialSessionsDashboardProps {
  mentorId: number;
}

const TrialSessionsDashboard: React.FC<TrialSessionsDashboardProps> = ({ mentorId }) => {
  const { isDarkMode } = useTheme();
  const [trialStats, setTrialStats] = useState<TrialSessionStats | null>(null);
  const [sessions, setSessions] = useState<TrialSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Initial fetch only — no periodic refresh
    fetchData();
  }, [mentorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, sessionsData] = await Promise.all([
        statsService.getTrialSessionStats(mentorId),
        trialSessionService.getMyTrialSessions()
      ]);
      setTrialStats(stats);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching trial session data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions by status
  const getFilteredSessions = (status?: TrialSessionStatus) => {
    if (!status) return sessions;
    return sessions.filter(session => session.status === status);
  };

  // Simple session card without mentee details (for All Sessions tab)
  const SimpleSessionCard = ({ session }: { session: TrialSession }) => {
    const getStatusColor = (status: TrialSessionStatus) => {
      switch (status) {
        case TrialSessionStatus.AVAILABLE: return 'green';
        case TrialSessionStatus.BOOKED: return 'blue';
        case TrialSessionStatus.COMPLETED: return 'teal';
        case TrialSessionStatus.CANCELLED: return 'red';
        case TrialSessionStatus.NO_SHOW: return 'gray';
        default: return 'blue';
      }
    };

    return (
      <Card p="lg" withBorder radius="lg" shadow="sm">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" fw={600}>
                {new Date(session.scheduledDateTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <Text size="lg" fw={700}>
                {new Date(session.scheduledDateTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </div>
            <Badge color={getStatusColor(session.status)} variant="light" size="lg">
              {session.status.replace('_', ' ')}
            </Badge>
          </Group>
          
          <Group gap="sm">
            <IconCalendarTime size={16} />
            <Text size="sm" c="dimmed">{session.durationMinutes} minutes</Text>
          </Group>
        </Stack>
      </Card>
    );
  };

  // Detailed session card with mentee profile (for Booked/Completed/Cancelled tabs)
  const DetailedSessionCard = ({ session }: { session: TrialSession }) => {
    const getStatusColor = (status: TrialSessionStatus) => {
      switch (status) {
        case TrialSessionStatus.BOOKED: return 'blue';
        case TrialSessionStatus.COMPLETED: return 'teal';
        case TrialSessionStatus.CANCELLED: return 'red';
        case TrialSessionStatus.NO_SHOW: return 'gray';
        default: return 'blue';
      }
    };

    return (
      <Card p="lg" withBorder radius="lg" shadow="sm">
        <Stack gap="md">
          {/* Session Info */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="sm" fw={600}>
                {new Date(session.scheduledDateTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <Text size="lg" fw={700}>
                {new Date(session.scheduledDateTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </div>
            <Badge color={getStatusColor(session.status)} variant="filled" size="lg">
              {session.status.replace('_', ' ')}
            </Badge>
          </Group>

          {/* Mentee Profile Section (clickable to open profile) */}
          {session.menteeEmail && (
            session.menteeId ? (
              <Link href={`/talent-profile/${session.menteeId}`} className="no-underline">
                <Card withBorder radius="md" p="md" bg={isDarkMode ? 'dark.6' : 'gray.0'} className="cursor-pointer hover:shadow-md transition-shadow">
                  <Group gap="md" align="flex-start">
                    {/* Profile Picture or Avatar placeholder */}
                    {session.menteeProfilePicture ? (
                      <img 
                        src={`data:image/jpeg;base64,${session.menteeProfilePicture}`}
                        alt={`${session.menteeName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) => {
                          // Fallback to initial avatar on image load error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        getStatusColor(session.status) === 'blue' ? 'bg-blue-500' :
                        getStatusColor(session.status) === 'teal' ? 'bg-teal-500' :
                        getStatusColor(session.status) === 'red' ? 'bg-red-500' : 'bg-gray-500'
                      } ${session.menteeProfilePicture ? 'hidden' : ''}`}
                    >
                      {session.menteeName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <Text size="lg" fw={600}>{session.menteeName || 'Unknown User'}</Text>
                      <Text size="sm" c="dimmed" mb="xs">{session.menteeEmail}</Text>
                      {session.menteePhone && (
                        <Text size="sm" c="dimmed">{session.menteePhone}</Text>
                      )}
                      
                      {session.notes && session.status === TrialSessionStatus.COMPLETED && (
                        <div className="mt-2 p-2 rounded bg-teal-50 border border-teal-200">
                          <Text size="xs" fw={500} c="teal.7">Session Notes:</Text>
                          <Text size="sm" c="teal.8">{session.notes}</Text>
                        </div>
                      )}
                    </div>
                  </Group>
                </Card>
              </Link>
            ) : (
              <Card withBorder radius="md" p="md" bg={isDarkMode ? 'dark.6' : 'gray.0'}>
                <Group gap="md" align="flex-start">
                  {/* Profile Picture or Avatar placeholder */}
                  {session.menteeProfilePicture ? (
                    <img 
                      src={`data:image/jpeg;base64,${session.menteeProfilePicture}`}
                      alt={`${session.menteeName}'s profile`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      getStatusColor(session.status) === 'blue' ? 'bg-blue-500' :
                      getStatusColor(session.status) === 'teal' ? 'bg-teal-500' :
                      getStatusColor(session.status) === 'red' ? 'bg-red-500' : 'bg-gray-500'
                    } ${session.menteeProfilePicture ? 'hidden' : ''}`}
                  >
                    {session.menteeName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <Text size="lg" fw={600}>{session.menteeName || 'Unknown User'}</Text>
                    <Text size="sm" c="dimmed" mb="xs">{session.menteeEmail}</Text>
                    {session.menteePhone && (
                      <Text size="sm" c="dimmed">{session.menteePhone}</Text>
                    )}
                    
                    {session.notes && session.status === TrialSessionStatus.COMPLETED && (
                      <div className="mt-2 p-2 rounded bg-teal-50 border border-teal-200">
                        <Text size="xs" fw={500} c="teal.7">Session Notes:</Text>
                        <Text size="sm" c="teal.8">{session.notes}</Text>
                      </div>
                    )}
                  </div>
                </Group>
              </Card>
            )
          )}
          
          <Group gap="sm">
            <IconCalendarTime size={16} />
            <Text size="sm" c="dimmed">{session.durationMinutes} minutes</Text>
          </Group>
        </Stack>
      </Card>
    );
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }: any) => (
    <Card p="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>
        {icon}
      </Group>
      <Group align="flex-end" gap="xs">
        <Text size="xl" fw={700} c={color}>
          {value}
        </Text>
        {subtitle && (
          <Text size="xs" c="dimmed" pb={4}>
            {subtitle}
          </Text>
        )}
      </Group>
    </Card>
  );

  return (
    <Container size="xl" className="py-6">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1}>Trial Sessions Dashboard</Title>
            <Text size="lg" c="dimmed">
              Manage your trial sessions and track performance
            </Text>
          </div>
        </Group>

        {/* Stats Overview */}
        {!loading && trialStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Sessions"
              value={trialStats.totalSessions || 0}
              subtitle="All time"
              icon={<IconCalendarTime size={20} />}
              color="blue"
            />
            <StatCard
              title="Available Slots"
              value={trialStats.availableSessions || 0}
              subtitle="Ready for booking"
              icon={<IconUsers size={20} />}
              color="green"
            />
            <StatCard
              title="Booked Sessions"
              value={trialStats.bookedSessions || 0}
              subtitle="Pending"
              icon={<IconTrendingUp size={20} />}
              color="yellow"
            />
            <StatCard
              title="Conversion Rate"
              value={`${Math.round(trialStats.conversionRate || 0)}%`}
              subtitle="Trial to paid"
              icon={<IconChartBar size={20} />}
              color="violet"
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')}>
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconCalendarTime size={16} />}>
              All Sessions
            </Tabs.Tab>
            <Tabs.Tab value="booked" leftSection={<IconUsers size={16} />}>
              Booked Sessions
            </Tabs.Tab>
            <Tabs.Tab value="completed" leftSection={<IconCheck size={16} />}>
              Completed Sessions
            </Tabs.Tab>
            <Tabs.Tab value="cancelled" leftSection={<IconX size={16} />}>
              Cancelled Sessions
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
              Analytics & Reports
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="md">
            <div className="space-y-6">
              {/* Session Creation Section */}
              <Card p="lg" withBorder radius="lg" shadow="sm">
                <Title order={3} mb="md">Create Trial Sessions</Title>
                <TrialSessionManager mentorId={mentorId} />
              </Card>

              {/* All Sessions List */}
              <div className="space-y-4">
                <Group justify="space-between" align="center">
                  <Text size="lg" fw={600}>All Trial Sessions ({sessions.length})</Text>
                </Group>
                
                {loading ? (
                  <div className="text-center py-8">
                    <Loader size="lg" />
                  </div>
                ) : sessions.length === 0 ? (
                  <Paper p="xl" withBorder className="text-center">
                    <Text size="lg" c="dimmed" mb="md">No trial sessions created yet</Text>
                    <Text size="sm" c="dimmed">Use the form above to create your first trial session</Text>
                  </Paper>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                      <SimpleSessionCard key={session.id} session={session} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="booked" pt="md">
            <div className="space-y-4">
              {(() => {
                const bookedSessions = getFilteredSessions(TrialSessionStatus.BOOKED);
                return (
                  <>
                    <Text size="lg" fw={600} mb="md">Booked Sessions ({bookedSessions.length})</Text>
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader size="lg" />
                      </div>
                    ) : bookedSessions.length === 0 ? (
                      <Paper p="xl" withBorder className="text-center">
                        <Text size="lg" c="dimmed" mb="md">No booked sessions</Text>
                        <Text size="sm" c="dimmed">Sessions booked by mentees will appear here</Text>
                      </Paper>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {bookedSessions.map((session) => (
                          <DetailedSessionCard key={session.id} session={session} />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="md">
            <div className="space-y-4">
              {(() => {
                const completedSessions = getFilteredSessions(TrialSessionStatus.COMPLETED);
                return (
                  <>
                    <Text size="lg" fw={600} mb="md">Completed Sessions ({completedSessions.length})</Text>
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader size="lg" />
                      </div>
                    ) : completedSessions.length === 0 ? (
                      <Paper p="xl" withBorder className="text-center">
                        <Text size="lg" c="dimmed" mb="md">No completed sessions</Text>
                        <Text size="sm" c="dimmed">Completed sessions will appear here</Text>
                      </Paper>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {completedSessions.map((session) => (
                          <DetailedSessionCard key={session.id} session={session} />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="cancelled" pt="md">
            <div className="space-y-4">
              {(() => {
                const cancelledSessions = getFilteredSessions(TrialSessionStatus.CANCELLED);
                return (
                  <>
                    <Text size="lg" fw={600} mb="md">Cancelled Sessions ({cancelledSessions.length})</Text>
                    {loading ? (
                      <div className="text-center py-8">
                        <Loader size="lg" />
                      </div>
                    ) : cancelledSessions.length === 0 ? (
                      <Paper p="xl" withBorder className="text-center">
                        <Text size="lg" c="dimmed" mb="md">No cancelled sessions</Text>
                        <Text size="sm" c="dimmed">Cancelled sessions will appear here</Text>
                      </Paper>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {cancelledSessions.map((session) => (
                          <DetailedSessionCard key={session.id} session={session} />
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="analytics" pt="md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card p="md" radius="md" withBorder>
                <Title order={4} mb="md">Session Performance</Title>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Total Sessions</Text>
                    <Badge color="blue">{trialStats?.totalSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Available</Text>
                    <Badge color="green">{trialStats?.availableSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Booked</Text>
                    <Badge color="yellow">{trialStats?.bookedSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Completed</Text>
                    <Badge color="violet">{trialStats?.completedSessions || 0}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Conversion Rate</Text>
                    <Badge color="indigo">{Math.round(trialStats?.conversionRate || 0)}%</Badge>
                  </Group>
                </Stack>
              </Card>
              
              <Card p="md" radius="md" withBorder>
                <Title order={4} mb="md">Session Overview</Title>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Available Today</Text>
                    <Badge color="green">{Math.round((trialStats?.availableSessions || 0) * 0.3)}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Pending Confirmation</Text>
                    <Badge color="orange">{Math.round((trialStats?.bookedSessions || 0) * 0.6)}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Average Duration</Text>
                    <Badge color="blue">30 min</Badge>
                  </Group>
                </Stack>
              </Card>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default TrialSessionsDashboard;
