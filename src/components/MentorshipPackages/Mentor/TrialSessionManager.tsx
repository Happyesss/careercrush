"use client";

import { useState, useEffect } from 'react';
import { Card, Group, Text, Button, Stack, Title, Badge, ActionIcon, Menu, Select, Grid, Modal, NumberInput, Container, Paper, Box, Divider, ThemeIcon, Flex } from '@mantine/core';
import { IconPlus, IconCalendarTime, IconDots, IconEdit, IconTrash, IconClock, IconUser, IconMail, IconPhone, IconCalendar, IconFilter, IconCheck, IconX, IconEye } from '@tabler/icons-react';
import { TrialSession, TrialSessionStatus } from '../../../types/mentorshipPackages';
import trialSessionService from '../../../Services/TrialSessionService';
import { packageUtils } from '../../../Services/MentorshipPackageService';
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
      // Use secure endpoint that gets sessions for authenticated mentor only
      const data = await trialSessionService.getMyTrialSessions();
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
      // Fix timezone issue: Keep the selected time as intended in local timezone
      // Convert local time to UTC while preserving the selected time values
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth();
      const date = dateTime.getDate();
      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      
      // Create UTC date with the same time values (not timezone-converted)
      const utcDateTime = new Date(Date.UTC(year, month, date, hours, minutes, 0, 0));
      
      // 🔒 No need to pass mentorId - backend gets it from JWT token
      await trialSessionService.createAvailableSlot({
        scheduledDateTime: utcDateTime.toISOString(),
        durationMinutes: duration,
        sessionType: 'Video Call',
      });
      
      notifications.show({
        title: 'Success',
        message: 'Trial slot created successfully',
        color: 'green',
      });
      
      fetchSessions();
    } catch (error: any) {
      console.error('Error creating trial slot:', error);
      
      // 🔥 Enhanced error handling for conflicts
      if (error.response?.data?.includes('TIME_SLOT_CONFLICT')) {
        notifications.show({
          title: 'Time Conflict',
          message: 'A session already exists at this time. Please choose a different time slot.',
          color: 'orange',
          autoClose: 6000,
        });
      } else if (error.response?.status === 404 || 
          error.response?.data?.includes?.('MENTOR_PROFILE_NOT_FOUND') ||
          error.response?.data?.includes?.('does not have a mentor profile')) {
        notifications.show({
          title: 'Mentor Profile Required',
          message: 'You need to create a mentor profile before creating trial sessions.',
          color: 'orange',
          autoClose: 8000,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to create trial slot',
          color: 'red',
        });
      }
    }
  };

  const handleBatchCreateSlots = async (slots: Date[], duration: number = 30) => {
    try {
      const dateTimeStrings = slots.map(slot => slot.toISOString());
      // 🔒 No need to pass mentorId - backend gets it from JWT token
      await trialSessionService.createMultipleAvailableSlots(dateTimeStrings, duration);
      
      notifications.show({
        title: 'Success',
        message: `${slots.length} trial slots created successfully`,
        color: 'green',
      });
      
      setBatchCreateModalOpen(false);
      setSelectedSlots([]);
      // Refetch sessions to show the newly created ones
      await fetchSessions();
    } catch (error: any) {
      console.error('Error creating trial slots:', error);
      
      // Handle specific mentor profile error
      if (error.response?.status === 404 || 
          error.response?.data?.includes?.('MENTOR_PROFILE_NOT_FOUND') ||
          error.response?.data?.includes?.('does not have a mentor profile')) {
        notifications.show({
          title: 'Mentor Profile Required',
          message: 'You need to create a mentor profile before creating trial sessions. Please complete your mentor profile setup first.',
          color: 'orange',
          autoClose: 8000,
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to create trial slots. Please try again.',
          color: 'red',
        });
      }
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
            
            <Group gap="xs">
              {/* Quick Action Buttons for Available Sessions */}
              {session.status === TrialSessionStatus.AVAILABLE && (
                <Button 
                  variant="light" 
                  size="xs" 
                  color="blue"
                  leftSection={<IconEdit size={12} />}
                  onClick={() => {
                    // TODO: Add edit session modal functionality here
                    notifications.show({
                      title: 'Edit Session',
                      message: 'Edit session functionality coming soon!',
                      color: 'blue',
                    });
                  }}
                >
                  Edit
                </Button>
              )}
              
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
            
            {/* 🔥 ENHANCED: Show mentee details prominently for booked sessions */}
            {session.status === TrialSessionStatus.BOOKED && session.menteeEmail && (
              <Paper p="md" radius="md" bg="blue.0" style={{ border: '1px solid #e7f5ff' }}>
                <Group gap="sm" mb="xs">
                  <ThemeIcon variant="light" size="sm" color="blue">
                    <IconUser size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={600} c="blue.7">Booked by:</Text>
                </Group>
                <Stack gap="xs" pl="md">
                  <Group gap="sm">
                    <Text size="sm" fw={500}>{session.menteeName || 'Unknown User'}</Text>
                  </Group>
                  <Group gap="sm">
                    <ThemeIcon variant="light" size="xs" color="indigo">
                      <IconMail size={10} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">{session.menteeEmail}</Text>
                  </Group>
                  {session.menteePhone && (
                    <Group gap="sm">
                      <ThemeIcon variant="light" size="xs" color="teal">
                        <IconPhone size={10} />
                      </ThemeIcon>
                      <Text size="xs" c="dimmed">{session.menteePhone}</Text>
                    </Group>
                  )}
                </Stack>
              </Paper>
            )}
            
            {/* Show mentee details for other statuses (completed, cancelled, etc.) */}
            {session.status !== TrialSessionStatus.AVAILABLE && session.status !== TrialSessionStatus.BOOKED && session.menteeEmail && (
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeSlots, setTimeSlots] = useState<Array<{time: string, duration: number}>>([
      {time: '09:00', duration: 30}
    ]);

    const handleCreateSlots = () => {
      if (!selectedDate || timeSlots.length === 0) {
        notifications.show({
          title: 'Error',
          message: 'Please select a date and at least one time slot',
          color: 'red',
        });
        return;
      }

      const slots = timeSlots.map(slot => {
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hours, minutes, 0, 0);
        return slotDateTime;
      });
      
      // Create slots with different durations
      const createPromises = timeSlots.map((slot, index) => {
        return handleCreateSlot(slots[index], slot.duration);
      });

      Promise.all(createPromises).then(() => {
        setBatchCreateModalOpen(false);
        setSelectedDate(null);
        setTimeSlots([{time: '09:00', duration: 30}]);
      });
    };

    const addTimeSlot = () => {
      setTimeSlots([...timeSlots, {time: '09:00', duration: 30}]);
    };

    const removeTimeSlot = (index: number) => {
      if (timeSlots.length > 1) {
        setTimeSlots(timeSlots.filter((_, i) => i !== index));
      }
    };

    const updateTimeSlot = (index: number, field: 'time' | 'duration', value: string | number) => {
      const newSlots = [...timeSlots];
      if (field === 'time') {
        newSlots[index].time = value as string;
      } else {
        newSlots[index].duration = value as number;
      }
      setTimeSlots(newSlots);
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
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              multiSelect={false}
              size="sm"
              className={styles.batchCalendar}
            />
          </Paper>

          <div>
            <Group justify="space-between" mb="md">
              <Text size="sm" fw={500}>Time Slots for Selected Date</Text>
              <Button 
                variant="light" 
                size="xs" 
                leftSection={<IconPlus size={14} />}
                onClick={addTimeSlot}
              >
                Add Time Slot
              </Button>
            </Group>

            <Stack gap="sm">
              {timeSlots.map((slot, index) => (
                <Paper key={index} p="sm" radius="md" withBorder>
                  <Group justify="space-between">
                    <Group gap="md" style={{ flex: 1 }}>
                      <div>
                        <Text size="xs" fw={500} mb="xs">Time</Text>
                        <Select
                          value={slot.time}
                          onChange={(value) => updateTimeSlot(index, 'time', value || '09:00')}
                          data={[
                            { value: '09:00', label: '9:00 AM' },
                            { value: '10:00', label: '10:00 AM' },
                            { value: '11:00', label: '11:00 AM' },
                            { value: '12:00', label: '12:00 PM' },
                            { value: '13:00', label: '1:00 PM' },
                            { value: '14:00', label: '2:00 PM' },
                            { value: '15:00', label: '3:00 PM' },
                            { value: '16:00', label: '4:00 PM' },
                            { value: '17:00', label: '5:00 PM' },
                            { value: '18:00', label: '6:00 PM' },
                            { value: '19:00', label: '7:00 PM' },
                            { value: '20:00', label: '8:00 PM' },
                          ]}
                          size="xs"
                          w={120}
                        />
                      </div>
                      
                      <NumberInput
                        label="Duration (mins)"
                        value={slot.duration}
                        onChange={(value) => updateTimeSlot(index, 'duration', Number(value))}
                        min={15}
                        max={120}
                        step={15}
                        size="xs"
                        w={100}
                      />
                    </Group>

                    {timeSlots.length > 1 && (
                      <ActionIcon 
                        color="red" 
                        variant="light" 
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    )}
                  </Group>
                </Paper>
              ))}
            </Stack>
          </div>

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
              disabled={!selectedDate || timeSlots.length === 0}
              leftSection={<IconPlus size={16} />}
              radius="md"
            >
              Create {timeSlots.length} Time Slot{timeSlots.length !== 1 ? 's' : ''}
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  return (
    <Container size="xl" className={styles.container}>
      <Stack gap="xl">
        {/* Header removed - title moved into filters area */}

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
                  { value: 'BOOKED', label: '🔥 Booked Sessions' },
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
            <Group align="center" gap="sm">
              {/* 🔥 Enhanced Badge with breakdown */}
              <Group gap="xs">
                <Badge
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  size="lg"
                  className={styles.sessionsBadge}
                >
                  {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
                </Badge>
                
                {/* Show breakdown when not filtering */}
                {statusFilter === 'ALL' && (
                  <Group gap="xs">
                    <Badge color="green" size="sm" variant="light">
                      {sessions.filter(s => s.status === TrialSessionStatus.AVAILABLE).length} Available
                    </Badge>
                    <Badge color="blue" size="sm" variant="light">
                      {sessions.filter(s => s.status === TrialSessionStatus.BOOKED).length} Booked
                    </Badge>
                    <Badge color="teal" size="sm" variant="light">
                      {sessions.filter(s => s.status === TrialSessionStatus.COMPLETED).length} Completed
                    </Badge>
                  </Group>
                )}
              </Group>

              <Group>
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
              </Group>
            </Group>
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