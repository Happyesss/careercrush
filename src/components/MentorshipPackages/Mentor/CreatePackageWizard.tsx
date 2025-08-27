"use client";

import { useState, useEffect } from 'react';
import { 
  Modal, 
  TextInput, 
  Textarea, 
  NumberInput, 
  Select, 
  Button, 
  Stack, 
  Group, 
  Card, 
  Title, 
  Text, 
  ActionIcon, 
  Badge,
  Stepper,
  Progress,
  Paper,
  ThemeIcon,
  Chip,
  Grid,
  Alert,
  Divider,
  Container,
  Box
} from '@mantine/core';
import { 
  IconPlus, 
  IconTrash, 
  IconArrowRight, 
  IconArrowLeft, 
  IconCheck, 
  IconPackage,
  IconSettings,
  IconCalendar,
  IconCurrencyRupee,
  IconInfoCircle,
  IconTarget,
  IconBulb
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { MentorshipPackage, PackageModule, CreatePackageRequest } from '../../../types/mentorshipPackages';
import { notifications } from '@mantine/notifications';
import styles from './CreatePackageWizard.module.css';

interface CreatePackageWizardProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (packageData: CreatePackageRequest) => void;
  initialData?: MentorshipPackage | null;
  mentorId: number;
}

interface WizardStep {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    key: 'basic',
    title: 'Package Information',
    description: 'Basic details about your mentorship package',
    icon: <IconPackage size={20} />
  },
  {
    key: 'pricing',
    title: 'Pricing & Sessions',
    description: 'Set duration, sessions and pricing',
    icon: <IconCurrencyRupee size={20} />
  },
  {
    key: 'topics',
    title: 'Topics Covered',
    description: 'Add topics you will cover',
    icon: <IconTarget size={20} />
  },
  {
    key: 'curriculum',
    title: 'Monthly Curriculum',
    description: 'Design month-wise learning path',
    icon: <IconCalendar size={20} />
  },
  {
    key: 'summary',
    title: 'Package Summary',
    description: 'Review and create your package',
    icon: <IconCheck size={20} />
  }
];

const CreatePackageWizard: React.FC<CreatePackageWizardProps> = ({
  opened,
  onClose,
  onSubmit,
  initialData,
  mentorId,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [modules, setModules] = useState<PackageModule[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      packageName: '',
      description: '',
      durationMonths: 6,
      sessionsPerMonth: 8,
      pricePerMonth: 10000,
      sessionType: 'Video Call',
      sessionDurationMinutes: 60,
      isFreeTrialIncluded: true,
    },
    validate: {
      packageName: (value) => {
        if (!value || value.length < 3) return 'Package name must be at least 3 characters';
        if (value.length > 100) return 'Package name must be less than 100 characters';
        return null;
      },
      description: (value) => {
        if (!value || value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 500) return 'Description must be less than 500 characters';
        return null;
      },
      durationMonths: (value) => {
        if (value < 1 || value > 24) return 'Duration must be between 1-24 months';
        return null;
      },
      sessionsPerMonth: (value) => {
        if (value < 1 || value > 20) return 'Sessions must be between 1-20 per month';
        return null;
      },
      pricePerMonth: (value) => {
        if (value < 1000 || value > 100000) return 'Price must be between ₹1,000-₹100,000';
        return null;
      },
      sessionDurationMinutes: (value) => {
        if (value < 30 || value > 180) return 'Duration must be between 30-180 minutes';
        return null;
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        packageName: initialData.packageName,
        description: initialData.description,
        durationMonths: initialData.durationMonths,
        sessionsPerMonth: initialData.sessionsPerMonth,
        pricePerMonth: initialData.pricePerMonth,
        sessionType: initialData.sessionType,
        sessionDurationMinutes: initialData.sessionDurationMinutes,
        isFreeTrialIncluded: initialData.isFreeTrialIncluded,
      });
      setTopics(initialData.topicsCovered || []);
      setModules(initialData.modules || []);
    } else if (opened && !initialData) {
      // Reset form when modal opens for new package
      form.reset();
      setTopics([]);
      setCurrentTopic('');
      setCurrentStep(0);
      // Generate default modules with default values
      const defaultModules: PackageModule[] = [];
      for (let i = 1; i <= 6; i++) {
        defaultModules.push({
          monthNumber: i,
          moduleNumber: i,
          moduleTitle: `Month ${i} of Mentorship`,
          moduleName: `Month ${i} of Mentorship`,
          moduleDescription: 'This Module Contains Following:',
          description: 'This Module Contains Following:',
          sessionsInMonth: 8,
          sessionsCount: 8,
          durationWeeks: 4,
          topicsInMonth: [`Advanced Topics for Month ${i}`],
          learningObjectives: [`Master concepts in month ${i}`],
          deliverables: ['Practice problems', 'Mock interviews'],
        });
      }
      setModules(defaultModules);
    }
  }, [initialData, opened]);

  useEffect(() => {
    if (form.values.durationMonths && currentStep >= 1 && !initialData) {
      generateDefaultModules(form.values.durationMonths, form.values.sessionsPerMonth);
    }
  }, [form.values.durationMonths, form.values.sessionsPerMonth, currentStep, initialData]);

  const generateDefaultModules = (durationMonths: number, sessionsPerMonth: number) => {
    const defaultModules: PackageModule[] = [];
    for (let i = 1; i <= durationMonths; i++) {
      defaultModules.push({
        monthNumber: i,
        moduleNumber: i,
        moduleTitle: `Month ${i} of Mentorship`,
        moduleName: `Month ${i} of Mentorship`,
        moduleDescription: 'This Module Contains Following:',
        description: 'This Module Contains Following:',
        sessionsInMonth: sessionsPerMonth,
        sessionsCount: sessionsPerMonth,
        durationWeeks: 4,
        topicsInMonth: [`Advanced Topics for Month ${i}`],
        learningObjectives: [`Master concepts in month ${i}`],
        deliverables: ['Practice problems', 'Mock interviews'],
      });
    }
    setModules(defaultModules);
  };

  const addTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  const updateModule = (index: number, field: keyof PackageModule, value: any) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const addTopicToModule = (moduleIndex: number, topic: string) => {
    if (topic.trim()) {
      const updatedModules = [...modules];
      const currentTopics = updatedModules[moduleIndex].topicsInMonth || [];
      if (!currentTopics.includes(topic.trim())) {
        updatedModules[moduleIndex].topicsInMonth = [...currentTopics, topic.trim()];
        setModules(updatedModules);
      }
    }
  };

  const removeTopicFromModule = (moduleIndex: number, topicIndex: number) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].topicsInMonth.splice(topicIndex, 1);
    setModules(updatedModules);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        // Validate package name and description
        const nameValid = !!(form.values.packageName && form.values.packageName.length >= 3 && form.values.packageName.length <= 100);
        const descValid = !!(form.values.description && form.values.description.length >= 10 && form.values.description.length <= 500);
        return nameValid && descValid;
      case 1:
        // Validate pricing and sessions
        const durationValid = form.values.durationMonths >= 1 && form.values.durationMonths <= 24;
        const sessionsValid = form.values.sessionsPerMonth >= 1 && form.values.sessionsPerMonth <= 20;
        const priceValid = form.values.pricePerMonth >= 1000 && form.values.pricePerMonth <= 100000;
        const sessionDurationValid = form.values.sessionDurationMinutes >= 30 && form.values.sessionDurationMinutes <= 180;
        return durationValid && sessionsValid && priceValid && sessionDurationValid;
      case 2:
        return topics.length > 0;
      case 3:
        return modules.every(module => 
          module.moduleTitle && 
          module.moduleDescription && 
          module.topicsInMonth.length > 0
        );
      default:
        return true;
    }
  };

  const validateCurrentStep = (): boolean => {
    return validateStep(currentStep);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    } else {
      notifications.show({
        title: 'Incomplete Step',
        message: 'Please complete all required fields before proceeding',
        color: 'orange',
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    const allStepsValid = [0, 1, 2, 3].every(step => {
      const oldStep = currentStep;
      const isValid = validateStep(step);
      return isValid;
    });

    if (!allStepsValid) {
      notifications.show({
        title: 'Incomplete Form',
        message: 'Please complete all required fields',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const totalSessions = form.values.durationMonths * form.values.sessionsPerMonth;
      const totalPrice = form.values.durationMonths * form.values.pricePerMonth;

      const packageData: CreatePackageRequest = {
        mentorId,
        packageName: form.values.packageName,
        description: form.values.description,
        durationMonths: form.values.durationMonths,
        totalSessions,
        sessionsPerMonth: form.values.sessionsPerMonth,
        pricePerMonth: form.values.pricePerMonth,
        totalPrice,
        topicsCovered: topics,
        modules,
        isActive: true,
        isFreeTrialIncluded: form.values.isFreeTrialIncluded,
        sessionType: form.values.sessionType,
        sessionDurationMinutes: form.values.sessionDurationMinutes,
      };

      await onSubmit(packageData);
      onClose();
    } catch (error) {
      console.error('Error creating package:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light" className={styles.alertBox}>
              Start by providing basic information about your mentorship package
            </Alert>
            
            <TextInput
              label="Package Name"
              placeholder="e.g., 6 Months Complete Software Engineering Mentorship"
              {...form.getInputProps('packageName')}
              required
              size="md"
              className={styles.inputField}
            />
            
            <Textarea
              label="Description"
              placeholder="Describe what your mentorship package covers..."
              rows={4}
              {...form.getInputProps('description')}
              required
              size="md"
              className={styles.inputField}
            />
          </Stack>
        );

      case 1:
        return (
          <Stack gap="md">
            <Alert icon={<IconCurrencyRupee size={16} />} color="green" variant="light" className={styles.alertBox}>
              Configure the duration, sessions, and pricing for your package
            </Alert>
            
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Duration (Months)"
                  min={1}
                  max={24}
                  {...form.getInputProps('durationMonths')}
                  required
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Sessions per Month"
                  min={1}
                  max={20}
                  {...form.getInputProps('sessionsPerMonth')}
                  required
                  size="md"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Price per Month (₹)"
                  min={1000}
                  max={100000}
                  step={1000}
                  thousandSeparator=","
                  {...form.getInputProps('pricePerMonth')}
                  required
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Session Duration (Minutes)"
                  min={30}
                  max={180}
                  step={15}
                  {...form.getInputProps('sessionDurationMinutes')}
                  required
                  size="md"
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Session Type"
                  data={[
                    { value: 'Video Call', label: 'Video Call' },
                    { value: 'Audio Call', label: 'Audio Call' },
                    { value: 'Chat', label: 'Chat' },
                    { value: 'In-Person', label: 'In-Person' },
                  ]}
                  {...form.getInputProps('sessionType')}
                  required
                  size="md"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Box>
                  <Text size="sm" fw={500} mb="xs">Package Options</Text>
                  <Chip
                    checked={form.values.isFreeTrialIncluded}
                    onChange={(checked) => form.setFieldValue('isFreeTrialIncluded', checked)}
                    size="md"
                  >
                    Include Free Trial
                  </Chip>
                </Box>
              </Grid.Col>
            </Grid>
          </Stack>
        );

      case 2:
        return (
          <Stack gap="md">
            <Alert icon={<IconTarget size={16} />} color="violet" variant="light" className={styles.alertBox}>
              Add the main topics you will cover in your mentorship program
            </Alert>
            
            <Group>
              <TextInput
                placeholder="Add a topic..."
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                flex={1}
                size="md"
                className={styles.inputField}
              />
              <Button onClick={addTopic} variant="light" size="md">
                <IconPlus size={16} />
              </Button>
            </Group>
            
            {topics.length > 0 && (
              <Paper p="md" radius="md" className={styles.topicsContainer}>
                <Text size="sm" fw={500} mb="sm">Topics Added ({topics.length})</Text>
                <Group gap="xs">
                  {topics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      size="lg"
                      className={styles.topicBadge}
                      rightSection={
                        <ActionIcon size="xs" color="red" variant="transparent" onClick={() => removeTopic(topic)}>
                          <IconTrash size={10} />
                        </ActionIcon>
                      }
                    >
                      {topic}
                    </Badge>
                  ))}
                </Group>
              </Paper>
            )}

            {topics.length === 0 && (
              <Paper p="xl" radius="md" ta="center" className={styles.emptyState}>
                <ThemeIcon size={60} variant="light" color="gray" mx="auto" mb="md">
                  <IconBulb size={30} />
                </ThemeIcon>
                <Text c="dimmed">Add topics to help mentees understand what they&apos;ll learn</Text>
              </Paper>
            )}
          </Stack>
        );

      case 3:
        return (
          <Stack gap="md">
            <Alert icon={<IconCalendar size={16} />} color="teal" variant="light" className={styles.alertBox}>
              Design the monthly curriculum for your {form.values.durationMonths}-month program
            </Alert>
            
            <Stack gap="lg" className={styles.moduleScroll}>
              {modules.map((module, moduleIndex) => (
                <Paper key={moduleIndex} p="md" withBorder radius="md" className={styles.moduleCard}>
                  <Group justify="space-between" mb="md">
                    <Badge color="blue" size="lg">Month {module.monthNumber}</Badge>
                    <Text size="sm" c="dimmed">{module.sessionsInMonth} sessions</Text>
                  </Group>

                  <Stack gap="sm">
                    <TextInput
                      label="Module Title"
                      value={module.moduleTitle}
                      onChange={(e) => updateModule(moduleIndex, 'moduleTitle', e.target.value)}
                      size="sm"
                      className={styles.inputField}
                    />
                    
                    <Textarea
                      label="Module Description"
                      value={module.moduleDescription}
                      onChange={(e) => updateModule(moduleIndex, 'moduleDescription', e.target.value)}
                      rows={2}
                      size="sm"
                      className={styles.inputField}
                    />

                    <div>
                      <Text size="sm" fw={500} mb="xs">Topics in this month</Text>
                      <Group gap="xs" mb="xs">
                        {module.topicsInMonth?.map((topic, topicIndex) => (
                          <Badge
                            key={topicIndex}
                            variant="outline"
                            rightSection={
                              <ActionIcon 
                                size="xs" 
                                color="red" 
                                variant="transparent"
                                onClick={() => removeTopicFromModule(moduleIndex, topicIndex)}
                              >
                                <IconTrash size={10} />
                              </ActionIcon>
                            }
                          >
                            {topic}
                          </Badge>
                        ))}
                      </Group>
                      <TextInput
                        placeholder="Add topic for this month..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTopicToModule(moduleIndex, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        size="xs"
                        className={styles.inputField}
                      />
                    </div>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        );

      case 4:
        const totalSessions = form.values.durationMonths * form.values.sessionsPerMonth;
        const totalPrice = form.values.durationMonths * form.values.pricePerMonth;
        const pricePerSession = Math.round(form.values.pricePerMonth / form.values.sessionsPerMonth);

        return (
          <Stack gap="md">
            <Alert icon={<IconCheck size={16} />} color="green" variant="light" className={styles.alertBox}>
              Review your package details before creating
            </Alert>
            
            <Grid>
              <Grid.Col span={12}>
                <Paper p="md" withBorder radius="md" className={styles.summaryCard}>
                  <Title order={4} mb="md">Package Overview</Title>
                  <Stack gap="sm">
                    <Group>
                      <Text fw={500}>Name:</Text>
                      <Text>{form.values.packageName}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>Duration:</Text>
                      <Text>{form.values.durationMonths} months</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>Session Type:</Text>
                      <Text>{form.values.sessionType}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>Free Trial:</Text>
                      <Badge color={form.values.isFreeTrialIncluded ? 'green' : 'red'} variant="light">
                        {form.values.isFreeTrialIncluded ? 'Included' : 'Not Included'}
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={6}>
                <Paper p="md" withBorder radius="md" h="100%" className={styles.summaryCard}>
                  <Title order={5} mb="md">Pricing Summary</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Total Sessions</Text>
                      <Text fw={600}>{totalSessions}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Total Price</Text>
                      <Text fw={600}>₹{totalPrice.toLocaleString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Price per Session</Text>
                      <Text fw={600}>₹{pricePerSession.toLocaleString()}</Text>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={6}>
                <Paper p="md" withBorder radius="md" h="100%" className={styles.summaryCard}>
                  <Title order={5} mb="md">Topics ({topics.length})</Title>
                  <Stack gap="xs" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    {topics.slice(0, 5).map((topic, index) => (
                      <Badge key={index} variant="light" size="sm">{topic}</Badge>
                    ))}
                    {topics.length > 5 && (
                      <Text size="xs" c="dimmed">+{topics.length - 5} more topics</Text>
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconPackage size={20} />
          </ThemeIcon>
          <div>
            <Text fw={600} size="lg">
              {initialData ? 'Edit Package' : 'Create New Mentorship Package'}
            </Text>
            <Text size="sm" c="dimmed">
              {WIZARD_STEPS[currentStep].description}
            </Text>
          </div>
        </Group>
      }
      size="lg"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
      padding="xl"
      className={styles.wizardModal}
    >
      <Container size="md" p={0}>
        <Stack gap="xl">
          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <Progress 
              value={(currentStep / (WIZARD_STEPS.length - 1)) * 100} 
              size="sm" 
              radius="xl" 
              mb="md"
              className={styles.progressBar}
            />
            <Group justify="center" gap="xs" className={styles.stepIndicator}>
              {WIZARD_STEPS.map((step, index) => (
                <Button
                  key={step.key}
                  variant={index === currentStep ? 'filled' : index < currentStep ? 'light' : 'subtle'}
                  size="xs"
                  leftSection={step.icon}
                  color={index <= currentStep ? 'blue' : 'gray'}
                  className={styles.stepButton}
                  style={{ pointerEvents: 'none' }}
                >
                  {step.title}
                </Button>
              ))}
            </Group>
          </div>

          {/* Step Content */}
          <Paper p="xl" radius="md" className={styles.stepContent}>
            <Title order={3} mb="md" ta="center" className={styles.wizardHeader}>
              {WIZARD_STEPS[currentStep].title}
            </Title>
            {renderStepContent()}
          </Paper>

          {/* Navigation */}
          <Group justify="space-between" className={styles.navigationContainer}>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={styles.navigationButton}
            >
              Previous
            </Button>

            <Text size="sm" c="dimmed">
              Step {currentStep + 1} of {WIZARD_STEPS.length}
            </Text>

            {currentStep === WIZARD_STEPS.length - 1 ? (
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleSubmit}
                loading={loading}
                className={styles.createButton}
              >
                {initialData ? 'Update Package' : 'Create Package'}
              </Button>
            ) : (
              <Button
                rightSection={<IconArrowRight size={16} />}
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className={styles.navigationButton}
              >
                Next
              </Button>
            )}
          </Group>
        </Stack>
      </Container>
    </Modal>
  );
};

export default CreatePackageWizard;