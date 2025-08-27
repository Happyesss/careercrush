"use client";

import { useState, useEffect } from 'react';
import { MentorshipPackage, TrialSession, TrialSessionStatus } from '../../../types/mentorshipPackages';
import { trialSessionService } from '../../../Services/MentorshipPackageService';
import { 
  Modal, 
  Stack, 
  Group, 
  Text, 
  Title, 
  Button, 
  Card,
  Select,
  Textarea,
  Stepper,
  Alert,
  Badge,
  List,
  ThemeIcon,
  Avatar,
  Divider
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { 
  IconCalendar, 
  IconClock, 
  IconUser, 
  IconCheck, 
  IconAlertCircle,
  IconVideo,
  IconMessage,
  IconPhone
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface TrialBookingModalProps {
  package: MentorshipPackage;
  opened: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  id?: string;
}

const TrialBookingModal: React.FC<TrialBookingModalProps> = ({
  package: pkg,
  opened,
  onClose,
  onBookingSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [sessionType, setSessionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Mock time slots for demo
  const mockTimeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '05:00 PM', available: true },
    { time: '06:00 PM', available: true },
  ];

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAvailableSlots(mockTimeSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load available time slots',
        color: 'red',
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot('');
      setActiveStep(1);
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setActiveStep(2);
  };

  const handleSessionTypeSelect = (type: 'video' | 'audio' | 'chat') => {
    setSessionType(type);
    setActiveStep(3);
  };

  const handleBookTrial = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      notifications.show({
        title: 'Error',
        message: 'Please select date and time',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const trialSession: Partial<TrialSession> = {
        packageId: pkg.id,
        menteeId: 1, // Get from auth context
        scheduledDateTime: new Date(`${selectedDate.toDateString()} ${selectedTimeSlot}`),
        sessionType: sessionType,
        menteeMessage: message,
        status: 'SCHEDULED' as TrialSessionStatus,
      };

      await trialSessionService.createTrialSession(trialSession);
      onBookingSuccess();
    } catch (error) {
      console.error('Error booking trial:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to book trial session',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setActiveStep(0);
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setSessionType('video');
    setMessage('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Filter dates to show only future dates and business days
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const day = date.getDay();
    return date < today || day === 0 || day === 6; // Disable past dates and weekends
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <IconVideo size={20} />;
      case 'audio': return <IconPhone size={20} />;
      case 'chat': return <IconMessage size={20} />;
      default: return <IconVideo size={20} />;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="lg"
      title={
        <Group>
          <IconCalendar size={20} />
          <div>
            <Title order={3}>Book Free Trial</Title>
            <Text size="sm" c="dimmed">{pkg.packageName}</Text>
          </div>
        </Group>
      }
    >
      <Stack gap="lg">
        {/* Package Info Summary */}
        <Card p="md" bg="blue.0" withBorder>
          <Group>
            <Avatar name={pkg.mentorName} size="md" />
            <div>
              <Text fw={500}>{pkg.mentorName}</Text>
              <Text size="sm" c="dimmed">30-minute trial session</Text>
            </div>
            <Badge ml="auto" size="lg" variant="gradient">
              FREE
            </Badge>
          </Group>
        </Card>

        {/* Booking Steps */}
        <Stepper active={activeStep}>
          <Stepper.Step
            label="Select Date"
            description="Choose a convenient date"
            icon={<IconCalendar size={18} />}
          >
            <Card p="md" withBorder>
              <Title order={4} mb="md">Select Date</Title>
              <DatePicker
                value={selectedDate}
                onChange={handleDateSelect}
                excludeDate={isDateDisabled}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
              />
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Select Time"
            description="Choose available time slot"
            icon={<IconClock size={18} />}
          >
            <Card p="md" withBorder>
              <Title order={4} mb="md">
                Available Slots for {selectedDate?.toDateString()}
              </Title>
              
              {loadingSlots ? (
                <Text>Loading available slots...</Text>
              ) : (
                <Group gap="sm">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTimeSlot === slot.time ? 'filled' : 'outline'}
                      disabled={!slot.available}
                      onClick={() => handleTimeSlotSelect(slot.time)}
                      size="sm"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </Group>
              )}
              
              {availableSlots.filter(slot => slot.available).length === 0 && !loadingSlots && (
                <Alert icon={<IconAlertCircle size={16} />} color="orange">
                  No available slots for this date. Please select another date.
                </Alert>
              )}
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Session Type"
            description="Choose session format"
            icon={<IconVideo size={18} />}
          >
            <Card p="md" withBorder>
              <Title order={4} mb="md">Session Format</Title>
              <Stack gap="sm">
                {[
                  { type: 'video', label: 'Video Call', description: 'Face-to-face interaction (recommended)' },
                  { type: 'audio', label: 'Audio Call', description: 'Voice-only conversation' },
                  { type: 'chat', label: 'Text Chat', description: 'Written conversation' },
                ].map((option) => (
                  <Card
                    key={option.type}
                    p="md"
                    withBorder
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: sessionType === option.type ? 'var(--mantine-color-blue-0)' : undefined
                    }}
                    onClick={() => handleSessionTypeSelect(option.type as any)}
                  >
                    <Group>
                      <ThemeIcon variant="light">
                        {getSessionTypeIcon(option.type)}
                      </ThemeIcon>
                      <div>
                        <Text fw={500}>{option.label}</Text>
                        <Text size="sm" c="dimmed">{option.description}</Text>
                      </div>
                      {sessionType === option.type && (
                        <IconCheck size={20} color="green" style={{ marginLeft: 'auto' }} />
                      )}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Stepper.Step>

          <Stepper.Step
            label="Message"
            description="Add a personal message"
            icon={<IconMessage size={18} />}
          >
            <Card p="md" withBorder>
              <Title order={4} mb="md">Additional Information</Title>
                <Textarea
                placeholder={"Tell the mentor about your goals, questions, or anything specific you\'d like to discuss during the trial session..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={4}
                maxRows={6}
              />
            </Card>
          </Stepper.Step>

          <Stepper.Completed>
            <Card p="md" withBorder>
              <Stack gap="md">
                <Group>
                  <ThemeIcon color="green" size="lg">
                    <IconCheck size={20} />
                  </ThemeIcon>
                  <div>
                    <Title order={4}>Booking Summary</Title>
                    <Text size="sm" c="dimmed">Review your trial session details</Text>
                  </div>
                </Group>

                <Divider />

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text>Package</Text>
                    <Text fw={500}>{pkg.packageName}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Mentor</Text>
                    <Text fw={500}>{pkg.mentorName}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Date</Text>
                    <Text fw={500}>{selectedDate?.toDateString()}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Time</Text>
                    <Text fw={500}>{selectedTimeSlot}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Format</Text>
                    <Badge variant="light">{sessionType}</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>Duration</Text>
                    <Text fw={500}>30 minutes</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Cost</Text>
                    <Badge size="lg" variant="gradient">FREE</Badge>
                  </Group>
                </Stack>

                {message && (
                  <>
                    <Divider />
                    <div>
                      <Text size="sm" fw={500} mb="xs">Your Message:</Text>
                      <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                        {`"${message}"`}
                      </Text>
                    </div>
                  </>
                )}
              </Stack>
            </Card>
          </Stepper.Completed>
        </Stepper>

        {/* Navigation Buttons */}
        <Group justify="space-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          <Group>
            {activeStep > 0 && activeStep < 4 && (
              <Button variant="subtle" onClick={() => setActiveStep(activeStep - 1)}>
                Back
              </Button>
            )}
            
            {activeStep === 4 && (
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleBookTrial}
                loading={loading}
              >
                Confirm Booking
              </Button>
            )}
          </Group>
        </Group>

        {/* Info Alert */}
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          <Text size="sm">
            <strong>Trial Session Benefits:</strong> Get to know your mentor, discuss your goals, 
            and see if this package is right for you. No commitment required!
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );
};

export default TrialBookingModal;