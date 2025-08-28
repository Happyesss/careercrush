"use client";

import { useState, useEffect } from 'react';
import { Card, Group, Text, Button, Stack, Title, Badge, ActionIcon, Menu, Select, Grid, Modal, NumberInput, Container, Paper, Box, Divider, ThemeIcon, Flex } from '@mantine/core';
import { IconPlus, IconCalendarTime, IconDots, IconEdit, IconTrash, IconClock, IconUser, IconMail, IconPhone, IconCalendar, IconFilter, IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { TrialSession, TrialSessionStatus } from '../../../types/mentorshipPackages';
import { trialSessionService, packageUtils } from '../../../Services/MentorshipPackageService';
import { notifications } from '@mantine/notifications';
import CustomCalendar from './CustomCalendar';
import styles from './TrialSessionManager.module.css';

interface TrialSessionManagerProps {
  mentorId: number;
}

const TrialSessionManager: React.FC<TrialSessionManagerProps> = ({ mentorId }) => {
  const [sessions, setSessions] = useState<TrialSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TrialSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [createSlotModalOpen, setCreateSlotModalOpen] = useState(false);
  const [batchCreateModalOpen, setBatchCreateModalOpen] = useState(false);
  const [dateFilterModalOpen, setDateFilterModalOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);

  useEffect(() => {
    fetchSessions();
  }, [mentorId]);

  useEffect(() => {
    applyFilters();
  }, [sessions, statusFilter, selectedDate]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await trialSessionService.getTrialSessionsByMentor(mentorId);
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching trial sessions:', error);
      setSessions([]); // Set empty array on error
      notifications.show({
        title: 'Error',
        message: 'Failed to load trial sessions',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sessions];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    if (selectedDate) {
      const dateStr = selectedDate.toDateString();
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.scheduledDateTime);
        return sessionDate.toDateString() === dateStr;
      });
    }

    setFilteredSessions(filtered);
  };

  const handleCreateSlot = async (dateTime: Date, duration: number = 30) => {
    try {
      await trialSessionService.createAvailableSlot({
        mentorId,
        scheduledDateTime: dateTime.toISOString(),
        durationMinutes: duration,
        sessionType: 'Video Call',
      });
      
      notifications.show({
        title: 'Success',
        message: 'Trial slot created successfully',
        color: 'green',
      });
      
      fetchSessions();
    } catch (error) {
      console.error('Error creating trial slot:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create trial slot',
        color: 'red',
      });
    }
  };

  const handleBatchCreateSlots = async (slots: Date[], duration: number = 30) => {
    try {
      const dateTimeStrings = slots.map(slot => slot.toISOString());
      await trialSessionService.createMultipleAvailableSlots(mentorId, dateTimeStrings, duration);
      
      notifications.show({
        title: 'Success',
        message: `${slots.length} trial slots created successfully`,
        color: 'green',
      });
      
      setBatchCreateModalOpen(false);
      setSelectedSlots([]);
      // Refetch sessions to show the newly created ones
      await fetchSessions();
    } catch (error) {
      console.error('Error creating trial slots:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create trial slots',
        color: 'red',
      });
    }
  };

  const handleUpdateSessionStatus = async (sessionId: number, status: TrialSessionStatus) => {
    try {
      await trialSessionService.updateTrialSessionStatus(sessionId, status);
      notifications.show({
        title: 'Success',
        message: 'Session status updated',
        color: 'green',
      });
      fetchSessions();
    } catch (error) {
      console.error('Error updating session status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update session status',
        color: 'red',
      });
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this trial session?')) {
      try {
        await trialSessionService.deleteTrialSession(sessionId);
        notifications.show({
          title: 'Success',
          message: 'Trial session deleted',
          color: 'green',
        });
        fetchSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete session',
          color: 'red',
        });
      }
    }
  };

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

  const getStatusIcon = (status: TrialSessionStatus) => {
    switch (status) {
      case TrialSessionStatus.AVAILABLE: return IconCalendar;
      case TrialSessionStatus.BOOKED: return IconEye;
      case TrialSessionStatus.COMPLETED: return IconCheck;
      case TrialSessionStatus.CANCELLED: return IconX;
      case TrialSessionStatus.NO_SHOW: return IconX;
      default: return IconCalendar;
    }
  };

  const TrialSessionCard = ({ session }: { session: TrialSession }) => {
    const StatusIcon = getStatusIcon(session.status);
    
    return (
      <Card p="lg" withBorder radius="lg" className={styles.sessionCard} shadow="sm">
        <Stack gap="md">
          {/* Header with status */}
          <Group justify="space-between">
            <Group gap="sm">
              <ThemeIcon color={getStatusColor(session.status)} variant="light" size="md" radius="xl">
                <StatusIcon size={16} />
              </ThemeIcon>
              <div>
                <Text size="sm" fw={600} c={getStatusColor(session.status)}>
                  {session.status.replace('_', ' ')}
                </Text>
                <Text size="xs" c="dimmed">
                  {packageUtils.formatDateTime(session.scheduledDateTime.toString())}
                </Text>
              </div>
            </Group>
            
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm" className={styles.menuButton}>
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {session.status === TrialSessionStatus.AVAILABLE && (
                  <Menu.Item 
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleUpdateSessionStatus(session.id!, TrialSessionStatus.BOOKED)}
                  >
                    Mark as Booked
                  </Menu.Item>
                )}
                {session.status === TrialSessionStatus.BOOKED && (
                  <>
                    <Menu.Item 
                      leftSection={<IconCheck size={14} />}
                      onClick={() => handleUpdateSessionStatus(session.id!, TrialSessionStatus.COMPLETED)}
                    >
                      Mark as Completed
                    </Menu.Item>
                    <Menu.Item 
                      leftSection={<IconX size={14} />}
                      onClick={() => handleUpdateSessionStatus(session.id!, TrialSessionStatus.CANCELLED)}
                    >
                      Cancel Session
                    </Menu.Item>
                  </>
                )}
                <Menu.Divider />
                <Menu.Item 
                  leftSection={<IconTrash size={14} />} 
                  color="red"
                  onClick={() => handleDeleteSession(session.id!)}
                >
                  Delete Session
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Divider />

          {/* Session details */}
          <Stack gap="sm">
            <Group gap="sm">
              <ThemeIcon variant="light" size="sm" color="blue">
                <IconClock size={12} />
              </ThemeIcon>
              <Text size="sm">{session.durationMinutes} minutes</Text>
            </Group>
            
            {session.menteeEmail && (
              <>
                <Group gap="sm">
                  <ThemeIcon variant="light" size="sm" color="violet">
                    <IconUser size={12} />
                  </ThemeIcon>
                  <Text size="sm">{session.menteeName}</Text>
                </Group>
                <Group gap="sm">
                  <ThemeIcon variant="light" size="sm" color="indigo">
                    <IconMail size={12} />
                  </ThemeIcon>
                  <Text size="sm">{session.menteeEmail}</Text>
                </Group>
                {session.menteePhone && (
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="sm" color="teal">
                      <IconPhone size={12} />
                    </ThemeIcon>
                    <Text size="sm">{session.menteePhone}</Text>
                  </Group>
                )}
              </>
            )}
            
            {session.notes && (
              <Box className={styles.notesSection}>
                <Text size="sm" c="dimmed" fs="italic">
                  Notes: {session.notes}
                </Text>
              </Box>
            )}
          </Stack>
        </Stack>
      </Card>
    );
  };

  const DateFilterModal = () => {
    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setDateFilterModalOpen(false);
    };

    const handleClearDate = () => {
      setSelectedDate(null);
      setDateFilterModalOpen(false);
    };

    return (
      <Modal
        opened={dateFilterModalOpen}
        onClose={() => setDateFilterModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue">
              <IconCalendar size={16} />
            </ThemeIcon>
            <Text fw={600}>Filter by Date</Text>
          </Group>
        }
        size="sm"
        radius="lg"
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <Stack gap="md">
          <CustomCalendar
            value={selectedDate}
            onChange={handleDateSelect}
            size="sm"
            className={styles.modalCalendar}
          />
          
          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              onClick={handleClearDate}
              radius="md"
              size="sm"
            >
              Clear Filter
            </Button>
            <Button 
              variant="subtle" 
              onClick={() => setDateFilterModalOpen(false)}
              radius="md"
              size="sm"
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  const BatchCreateModal = () => {
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [duration, setDuration] = useState(30);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const handleCreateSlots = () => {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const slots = selectedDates.map(date => {
        const slot = new Date(date);
        slot.setHours(hours, minutes, 0, 0);
        return slot;
      });
      
      handleBatchCreateSlots(slots, duration);
    };

    return (
      <Modal
        opened={batchCreateModalOpen}
        onClose={() => setBatchCreateModalOpen(false)}
        title={
          <Group gap="sm">
            <ThemeIcon variant="light" color="blue">
              <IconPlus size={16} />
            </ThemeIcon>
            <Text fw={600}>Create Multiple Trial Slots</Text>
          </Group>
        }
        size="md"
        radius="lg"
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <Stack gap="lg">
          <Paper p="md" radius="md" bg="gray.0" className={styles.calendarContainer}>
            <CustomCalendar
              selectedDates={selectedDates}
              onMultiSelect={setSelectedDates}
              minDate={new Date()}
              multiSelect={true}
              size="sm"
              className={styles.batchCalendar}
            />
          </Paper>

          <Group grow>
            <div>
              <Text size="sm" fw={500} mb="xs">Time</Text>
              <Select
                value={selectedTime}
                onChange={(value) => setSelectedTime(value || '09:00')}
                data={[
                  { value: '09:00', label: '9:00 AM' },
                  { value: '10:00', label: '10:00 AM' },
                  { value: '11:00', label: '11:00 AM' },
                  { value: '14:00', label: '2:00 PM' },
                  { value: '15:00', label: '3:00 PM' },
                  { value: '16:00', label: '4:00 PM' },
                  { value: '17:00', label: '5:00 PM' },
                  { value: '18:00', label: '6:00 PM' },
                  { value: '19:00', label: '7:00 PM' },
                  { value: '20:00', label: '8:00 PM' },
                  { value: '21:00', label: '9:00 PM' },
                  { value: '21:30', label: '9:30 PM' },
                ]}
                radius="md"
              />
            </div>
            
            <NumberInput
              label="Duration (minutes)"
              value={duration}
              onChange={(value) => setDuration(Number(value))}
              min={15}
              max={120}
              step={15}
              radius="md"
            />
          </Group>

          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              onClick={() => setBatchCreateModalOpen(false)}
              radius="md"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSlots}
              disabled={selectedDates.length === 0}
              leftSection={<IconPlus size={16} />}
              radius="md"
            >
              Create {selectedDates.length} {selectedDates.length === 1 ? 'Slot' : 'Slots'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  return (
    <Container size="xl" className={styles.container}>
      <Stack gap="xl">
        {/* Header */}
        <Paper p="xl" radius="lg" className={styles.headerSection} withBorder>
          <Group justify="space-between">
            <div>
              <Group gap="sm" mb="xs">
                <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} size="lg">
                  <IconCalendarTime size={24} />
                </ThemeIcon>
                <Title order={2} className={styles.title}>Trial Session Management</Title>
              </Group>
              <Text c="dimmed" size="lg">
                Manage your trial session availability and bookings
              </Text>
            </div>
            
            <Group gap="md">
              <Button
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<IconPlus size={16} />}
                onClick={() => setBatchCreateModalOpen(true)}
                radius="md"
                size="md"
                className={styles.primaryButton}
              >
                Batch Create Slots
              </Button>
              <Button
                variant="outline"
                color="blue"
                onClick={fetchSessions}
                radius="md"
                size="md"
                loading={loading}
              >
                Refresh
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Filters */}
        <Paper p="lg" radius="lg" withBorder className={styles.filtersSection}>
          <Group gap="lg" justify="space-between" align="center">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className={styles.filterItem}>
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" color="violet" size="sm">
                  <IconFilter size={14} />
                </ThemeIcon>
                <Text size="sm" fw={500}>Filter by Status</Text>
              </Group>
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value || 'ALL')}
                data={[
                  { value: 'ALL', label: 'All Sessions' },
                  { value: 'AVAILABLE', label: 'Available' },
                  { value: 'BOOKED', label: 'Booked' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
                w={200}
                radius="md"
              />
            </div>
            
              <div className={styles.filterItem}>
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" color="blue" size="sm">
                  <IconCalendar size={14} />
                </ThemeIcon>
                <Text size="sm" fw={500}>Filter by Date</Text>
              </Group>
              <Button
                variant="light"
                color="blue"
                leftSection={<IconCalendar size={16} />}
                onClick={() => setDateFilterModalOpen(true)}
                radius="md"
                size="sm"
              >
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
              </Button>
            </div>
            </div>
            <Badge
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              size="lg"
              className={styles.sessionsBadge}
            >
              {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
            </Badge>
          </Group>
        </Paper>

        {/* Sessions Grid */}
        <div>
          {loading ? (
            <Paper p="xl" radius="lg" withBorder className={styles.loadingCard}>
              <Flex align="center" justify="center" gap="md">
                <ThemeIcon variant="light" size="lg" color="blue">
                  <IconCalendarTime size={24} />
                </ThemeIcon>
                <Text>Loading sessions...</Text>
              </Flex>
            </Paper>
          ) : (
            <>
              
              {filteredSessions.length === 0 ? (
            <Paper p="xl" radius="lg" withBorder className={styles.emptyStateCard}>
              <Stack align="center" gap="lg">
                <ThemeIcon variant="light" size={80} color="gray" radius="xl">
                  <IconCalendarTime size={48} />
                </ThemeIcon>
                <div style={{ textAlign: 'center' }}>
                  <Title order={4} mb="xs">No trial sessions found</Title>
                  <Text c="dimmed" mb="lg" size="lg">
                    {sessions.length === 0 
                      ? 'No sessions created yet. Create your first trial session slot'
                      : selectedDate 
                        ? `No sessions scheduled for ${selectedDate.toLocaleDateString()}`
                        : statusFilter !== 'ALL' 
                          ? `No ${statusFilter.toLowerCase()} sessions found`
                          : 'No sessions match your current filters'
                    }
                  </Text>
                  <Button 
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    onClick={() => setBatchCreateModalOpen(true)}
                    leftSection={<IconPlus size={16} />}
                    size="md"
                    radius="md"
                  >
                    Create Trial Slots
                  </Button>
                </div>
              </Stack>
            </Paper>
          ) : (
            <Grid>
              {filteredSessions.map((session) => (
                <Grid.Col key={session.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <TrialSessionCard session={session} />
                </Grid.Col>
              ))}
            </Grid>
          )}
            </>
          )}
        </div>

        <DateFilterModal />
        <BatchCreateModal />
      </Stack>
    </Container>
  );
};

export default TrialSessionManager;