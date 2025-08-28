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
    key: 'inclusions',
    title: 'Package Inclusions',
    description: 'Configure what your package includes',
    icon: <IconSettings size={20} />
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
      basePricePerMonth: 12500, // Base monthly price
      threeMonthDiscount: 0, // Discount % for 3-month plan (0-50%)
      sixMonthDiscount: 0, // Discount % for 6-month plan (0-50%)
      sessionsPerMonth: 8, // Expected sessions per month
      sessionType: 'Video Call',
      sessionDurationMinutes: 60,
      isFreeTrialIncluded: true,
      // Package Inclusions (as per Preplaced documentation)
      hasUnlimitedChat: true,
      hasCuratedTasks: true,
      hasRegularFollowups: true,
      hasJobReferrals: false,
      hasCertification: true,
      hasRescheduling: true,
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
      basePricePerMonth: (value) => {
        if (value < 5000 || value > 100000) return 'Base price must be between ₹5,000-₹100,000';
        return null;
      },
      threeMonthDiscount: (value) => {
        if (value < 0 || value > 50) return 'Discount must be between 0-50%';
        return null;
      },
      sixMonthDiscount: (value) => {
        if (value < 0 || value > 50) return 'Discount must be between 0-50%';
        return null;
      },
      sessionsPerMonth: (value) => {
        if (value < 2 || value > 20) return 'Sessions must be between 2-20 per month';
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
        basePricePerMonth: initialData.pricePerMonth, // Map old field to new
        threeMonthDiscount: 0, // Default to 0 for existing packages
        sixMonthDiscount: 0, // Default to 0 for existing packages
        sessionsPerMonth: initialData.sessionsPerMonth,
        sessionType: initialData.sessionType,
        sessionDurationMinutes: initialData.sessionDurationMinutes,
        isFreeTrialIncluded: initialData.isFreeTrialIncluded,
        // Package Inclusions
        hasUnlimitedChat: initialData.hasUnlimitedChat ?? true,
        hasCuratedTasks: initialData.hasCuratedTasks ?? true,
        hasRegularFollowups: initialData.hasRegularFollowups ?? true,
        hasJobReferrals: initialData.hasJobReferrals ?? false,
        hasCertification: initialData.hasCertification ?? true,
        hasRescheduling: initialData.hasRescheduling ?? true,
      });
      setTopics(initialData.topicsCovered || []);
      setModules(initialData.modules || []);
    } else if (opened && !initialData) {
      // Reset form when modal opens for new package
      form.reset();
      setTopics([]);
      setCurrentTopic('');
      setCurrentStep(0);
      // Generate default modules with default values (fixed to 6 months as standard)
      const defaultModules: PackageModule[] = [];
      for (let i = 1; i <= 6; i++) {
        defaultModules.push({
          monthNumber: i,
          moduleNumber: i,
          moduleTitle: `Month ${i} Learning Path`,
          moduleName: `Month ${i} Learning Path`,
          moduleDescription: 'Comprehensive learning objectives for this month',
          description: 'Comprehensive learning objectives for this month',
          sessionsInMonth: form.values.sessionsPerMonth,
          sessionsCount: form.values.sessionsPerMonth,
          durationWeeks: 4,
          topicsInMonth: [`Advanced Topics for Month ${i}`],
          learningObjectives: [`Master key concepts in month ${i}`],
          deliverables: ['Hands-on projects', 'Practice assignments', 'Progress assessments'],
        });
      }
      setModules(defaultModules);
    }
  }, [initialData, opened]);

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
        const priceValid = form.values.basePricePerMonth >= 5000 && form.values.basePricePerMonth <= 100000;
        const sessionsValid = form.values.sessionsPerMonth >= 2 && form.values.sessionsPerMonth <= 20;
        const sessionDurationValid = form.values.sessionDurationMinutes >= 30 && form.values.sessionDurationMinutes <= 180;
        const threeMonthDiscountValid = form.values.threeMonthDiscount >= 0 && form.values.threeMonthDiscount <= 50;
        const sixMonthDiscountValid = form.values.sixMonthDiscount >= 0 && form.values.sixMonthDiscount <= 50;
        return priceValid && sessionsValid && sessionDurationValid && threeMonthDiscountValid && sixMonthDiscountValid;
      case 2:
        // Package inclusions - always valid since they have defaults
        return true;
      case 3:
        return topics.length > 0;
      case 4:
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
    const allStepsValid = [0, 1, 2, 3, 4].every(step => {
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
      // Use mentor's custom pricing strategy
      const mentorBasePrice = form.values.basePricePerMonth;
      const finalSixMonthPrice = Math.round(mentorBasePrice * (1 - form.values.sixMonthDiscount / 100));
      
      // Create 6-month package with mentor's chosen pricing
      const packageData: CreatePackageRequest = {
        mentorId,
        packageName: form.values.packageName,
        description: form.values.description,
        durationMonths: 6, // Fixed 6-month as primary package
        totalSessions: 6 * form.values.sessionsPerMonth,
        sessionsPerMonth: form.values.sessionsPerMonth,
        pricePerMonth: finalSixMonthPrice, // Mentor's chosen price after their discount
        totalPrice: 6 * finalSixMonthPrice,
        topicsCovered: topics,
        modules,
        isActive: true,
        isFreeTrialIncluded: form.values.isFreeTrialIncluded,
        sessionType: form.values.sessionType,
        sessionDurationMinutes: form.values.sessionDurationMinutes,
        // Package Inclusions
        hasUnlimitedChat: form.values.hasUnlimitedChat,
        hasCuratedTasks: form.values.hasCuratedTasks,
        hasRegularFollowups: form.values.hasRegularFollowups,
        hasJobReferrals: form.values.hasJobReferrals,
        hasCertification: form.values.hasCertification,
        hasRescheduling: form.values.hasRescheduling,
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
        // Calculate pricing based on mentor's chosen discounts
        const mentorBasePrice = form.values.basePricePerMonth;
        const threeMonthPrice = Math.round(mentorBasePrice * (1 - form.values.threeMonthDiscount / 100));
        const sixMonthPrice = Math.round(mentorBasePrice * (1 - form.values.sixMonthDiscount / 100));
        
        return (
          <Stack gap="md">
            <Alert icon={<IconCurrencyRupee size={16} />} color="green" variant="light" className={styles.alertBox}>
              Set your pricing strategy - you control all discounts and pricing
            </Alert>
            
            <Paper p="lg" withBorder radius="md" className={styles.pricingContainer}>
              <Title order={4} mb="md">Base Pricing Configuration</Title>
              
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Base Price per Month (₹)"
                    description="Your full monthly rate"
                    min={5000}
                    max={100000}
                    step={500}
                    thousandSeparator=","
                    {...form.getInputProps('basePricePerMonth')}
                    required
                    size="md"
                    leftSection="₹"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Expected Sessions per Month"
                    description="Average sessions you'll provide"
                    min={2}
                    max={20}
                    {...form.getInputProps('sessionsPerMonth')}
                    required
                    size="md"
                  />
                </Grid.Col>
              </Grid>

              <Grid mt="md">
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
                <Grid.Col span={6}>
                  <Select
                    label="Session Type"
                    data={[
                      { value: 'Video Call', label: '📹 Video Call' },
                      { value: 'Audio Call', label: '📞 Audio Call' },
                      { value: 'Chat', label: '💬 Chat' },
                      { value: 'In-Person', label: '👥 In-Person' },
                    ]}
                    {...form.getInputProps('sessionType')}
                    required
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper p="lg" withBorder radius="md" className={styles.discountContainer}>
              <Title order={4} mb="md">Discount Strategy (Optional)</Title>
              <Text size="sm" c="dimmed" mb="lg">
                Set discounts for longer commitments to encourage mentees to choose extended plans
              </Text>
              
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="3-Month Plan Discount (%)"
                    description="Discount for 3-month commitment"
                    min={0}
                    max={50}
                    step={5}
                    {...form.getInputProps('threeMonthDiscount')}
                    size="md"
                    rightSection="%"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="6-Month Plan Discount (%)"
                    description="Discount for 6-month commitment"
                    min={0}
                    max={50}
                    step={5}
                    {...form.getInputProps('sixMonthDiscount')}
                    size="md"
                    rightSection="%"
                  />
                </Grid.Col>
              </Grid>

              <Alert color="blue" variant="light" mt="md">
                <Text size="sm">
                  💡 <strong>Tip:</strong> Higher discounts for longer plans can increase conversion rates. Set 0% for no discount.
                </Text>
              </Alert>
            </Paper>

            <Paper p="lg" withBorder radius="md" className={styles.planPreviewContainer}>
              <Title order={4} mb="md">Plan Pricing Preview</Title>
              <Text size="sm" c="dimmed" mb="lg">
                This is how your pricing will appear to mentees
              </Text>
              
              <div className={styles.planCards}>
                {/* Monthly Plan */}
                <Paper p="md" withBorder radius="md" className={styles.planCard}>
                  <Badge color="gray" variant="light" mb="sm">Monthly Plan</Badge>
                  <Text size="lg" fw={700} c="blue">₹{mentorBasePrice.toLocaleString()}</Text>
                  <Text size="xs" c="dimmed">per month</Text>
                  <Text size="xs" mt="xs">No commitment</Text>
                </Paper>

                {/* 3 Month Plan */}
                <Paper p="md" withBorder radius="md" className={`${styles.planCard} ${form.values.threeMonthDiscount > 0 ? styles.popularPlan : ''}`}>
                  <Badge color={form.values.threeMonthDiscount > 0 ? "blue" : "gray"} variant={form.values.threeMonthDiscount > 0 ? "filled" : "light"} mb="sm">
                    3 Months
                  </Badge>
                  <Group gap="xs" align="baseline">
                    <Text size="lg" fw={700} c="blue">₹{threeMonthPrice.toLocaleString()}</Text>
                    {form.values.threeMonthDiscount > 0 && (
                      <Text size="sm" td="line-through" c="dimmed">₹{mentorBasePrice.toLocaleString()}</Text>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">per month</Text>
                  {form.values.threeMonthDiscount > 0 ? (
                    <Badge color="green" variant="light" size="xs" mt="xs">Save {form.values.threeMonthDiscount}%</Badge>
                  ) : (
                    <Text size="xs" mt="xs">No discount</Text>
                  )}
                </Paper>

                {/* 6 Month Plan */}
                <Paper p="md" withBorder radius="md" className={`${styles.planCard} ${form.values.sixMonthDiscount > 0 ? styles.bestValuePlan : ''}`}>
                  <Badge color={form.values.sixMonthDiscount > 0 ? "green" : "gray"} variant={form.values.sixMonthDiscount > 0 ? "filled" : "light"} mb="sm">
                    6 Months
                  </Badge>
                  <Group gap="xs" align="baseline">
                    <Text size="lg" fw={700} c="blue">₹{sixMonthPrice.toLocaleString()}</Text>
                    {form.values.sixMonthDiscount > 0 && (
                      <Text size="sm" td="line-through" c="dimmed">₹{mentorBasePrice.toLocaleString()}</Text>
                    )}
                  </Group>
                  <Text size="xs" c="dimmed">per month</Text>
                  {form.values.sixMonthDiscount > 0 ? (
                    <Badge color="orange" variant="light" size="xs" mt="xs">Save {form.values.sixMonthDiscount}%</Badge>
                  ) : (
                    <Text size="xs" mt="xs">No discount</Text>
                  )}
                </Paper>
              </div>

              <Alert color="blue" variant="light" mt="md">
                <Text size="sm">
                  <strong>Your pricing flexibility:</strong> You can always update these discounts later
                </Text>
              </Alert>
            </Paper>

            <Group>
              <Chip
                checked={form.values.isFreeTrialIncluded}
                onChange={(checked) => form.setFieldValue('isFreeTrialIncluded', checked)}
                size="md"
                color="green"
              >
                Include Free Trial (30 minutes)
              </Chip>
            </Group>
          </Stack>
        );

      case 2:
        return (
          <Stack gap="md">
            <Alert icon={<IconSettings size={16} />} color="indigo" variant="light" className={styles.alertBox}>
              Configure what your mentorship package includes (based on Preplaced.in standards)
            </Alert>
            
            <Paper p="md" withBorder radius="md" className={styles.inclusionsContainer}>
              <Title order={4} mb="md">Package Inclusions</Title>
              <Text size="sm" c="dimmed" mb="lg">
                Select the features and services included in your mentorship package. These align with industry standards for long-term mentorship programs.
              </Text>
              
              <Stack gap="lg">
                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">1:1 Live Sessions</Text>
                      <Text size="xs" c="dimmed">Regular one-on-one video/audio sessions</Text>
                    </div>
                    <Badge color="blue" variant="light">Always Included</Badge>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Unlimited Chat with Mentor</Text>
                      <Text size="xs" c="dimmed">24/7 chat support and quick queries</Text>
                    </div>
                    <Chip
                      checked={form.values.hasUnlimitedChat}
                      onChange={(checked) => form.setFieldValue('hasUnlimitedChat', checked)}
                      size="md"
                      color="green"
                    >
                      {form.values.hasUnlimitedChat ? 'Included' : 'Add (+₹2,000/mo)'}
                    </Chip>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Task & Curated Resources</Text>
                      <Text size="xs" c="dimmed">Weekly assignments and learning materials</Text>
                    </div>
                    <Chip
                      checked={form.values.hasCuratedTasks}
                      onChange={(checked) => form.setFieldValue('hasCuratedTasks', checked)}
                      size="md"
                      color="violet"
                    >
                      {form.values.hasCuratedTasks ? 'Included' : 'Add (+₹1,500/mo)'}
                    </Chip>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Regular Follow-ups</Text>
                      <Text size="xs" c="dimmed">Accountability check-ins and progress tracking</Text>
                    </div>
                    <Chip
                      checked={form.values.hasRegularFollowups}
                      onChange={(checked) => form.setFieldValue('hasRegularFollowups', checked)}
                      size="md"
                      color="teal"
                    >
                      {form.values.hasRegularFollowups ? 'Included' : 'Add (+₹1,000/mo)'}
                    </Chip>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Job Referrals</Text>
                      <Text size="xs" c="dimmed">Referrals to companies in mentor network</Text>
                    </div>
                    <Chip
                      checked={form.values.hasJobReferrals}
                      onChange={(checked) => form.setFieldValue('hasJobReferrals', checked)}
                      size="md"
                      color="orange"
                    >
                      {form.values.hasJobReferrals ? 'Included' : 'Add (+₹5,000/mo)'}
                    </Chip>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Certification</Text>
                      <Text size="xs" c="dimmed">Certificate of completion with skills validation</Text>
                    </div>
                    <Chip
                      checked={form.values.hasCertification}
                      onChange={(checked) => form.setFieldValue('hasCertification', checked)}
                      size="md"
                      color="cyan"
                    >
                      {form.values.hasCertification ? 'Included' : 'Add (+₹500/mo)'}
                    </Chip>
                  </Group>
                </Paper>

                <Paper p="sm" radius="sm" className={styles.inclusionItem}>
                  <Group justify="space-between" align="center">
                    <div>
                      <Text fw={500} size="sm">Reschedule Anytime</Text>
                      <Text size="xs" c="dimmed">Flexible session rescheduling (≥3 hours notice)</Text>
                    </div>
                    <Chip
                      checked={form.values.hasRescheduling}
                      onChange={(checked) => form.setFieldValue('hasRescheduling', checked)}
                      size="md"
                      color="pink"
                    >
                      {form.values.hasRescheduling ? 'Included' : 'Standard Policy'}
                    </Chip>
                  </Group>
                </Paper>
              </Stack>

              <Divider my="md" />
              
              <Group justify="space-between" align="center">
                <Text fw={600} size="sm">Package Value Summary:</Text>
                <Text fw={700} size="lg" c="blue">
                  ₹{(
                    form.values.basePricePerMonth + 
                    (form.values.hasUnlimitedChat ? 2000 : 0) +
                    (form.values.hasCuratedTasks ? 1500 : 0) +
                    (form.values.hasRegularFollowups ? 1000 : 0) +
                    (form.values.hasJobReferrals ? 5000 : 0) +
                    (form.values.hasCertification ? 500 : 0)
                  ).toLocaleString()}/month worth of value
                </Text>
              </Group>
            </Paper>
          </Stack>
        );

      case 3:
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

      case 4:
        return (
          <Stack gap="md">
            <Alert icon={<IconCalendar size={16} />} color="teal" variant="light" className={styles.alertBox}>
              Design the monthly curriculum for your 6-month mentorship program (Preplaced Standard)
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

      case 5:
        const mentorBasePriceForSummary = form.values.basePricePerMonth;
        const finalSixMonthPrice = Math.round(mentorBasePriceForSummary * (1 - form.values.sixMonthDiscount / 100));
        const totalSessions = 6 * form.values.sessionsPerMonth; // Fixed 6-month package
        const totalPrice = 6 * finalSixMonthPrice;
        const pricePerSession = Math.round(finalSixMonthPrice / form.values.sessionsPerMonth);

        return (
          <Stack gap="md">
            <Alert icon={<IconCheck size={16} />} color="green" variant="light" className={styles.alertBox}>
              Review your package details before creating (6-Month Package)
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
                      <Text>6 months (Premium Plan)</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>Session Type:</Text>
                      <Text>{form.values.sessionType}</Text>
                    </Group>
                    <Group>
                      <Text fw={500}>Free Trial:</Text>
                      <Badge color={form.values.isFreeTrialIncluded ? 'green' : 'red'} variant="light">
                        {form.values.isFreeTrialIncluded ? 'Included (30 min)' : 'Not Included'}
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={4}>
                <Paper p="md" withBorder radius="md" h="100%" className={styles.summaryCard}>
                  <Title order={5} mb="md">Your Pricing Strategy</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Base Monthly Price</Text>
                      <Text fw={600}>₹{mentorBasePriceForSummary.toLocaleString()}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">3-Month Discount</Text>
                      <Text fw={600}>{form.values.threeMonthDiscount}%</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">6-Month Discount</Text>
                      <Text fw={600}>{form.values.sixMonthDiscount}%</Text>
                    </Group>
                    <Divider my="xs" />
                    <Group justify="space-between">
                      <Text size="sm" c="blue">6-Month Plan Price</Text>
                      <Text fw={600} c="blue">₹{finalSixMonthPrice.toLocaleString()}/mo</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Total 6-Month Price</Text>
                      <Text fw={600}>₹{totalPrice.toLocaleString()}</Text>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={4}>
                <Paper p="md" withBorder radius="md" h="100%" className={styles.summaryCard}>
                  <Title order={5} mb="md">Package Inclusions</Title>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm">1:1 Live Sessions</Text>
                      <Badge color="blue" variant="light" size="sm">Always Included</Badge>
                    </Group>
                    {form.values.hasUnlimitedChat && (
                      <Group justify="space-between">
                        <Text size="sm">Unlimited Chat</Text>
                        <Badge color="green" variant="light" size="sm">Included</Badge>
                      </Group>
                    )}
                    {form.values.hasCuratedTasks && (
                      <Group justify="space-between">
                        <Text size="sm">Curated Tasks</Text>
                        <Badge color="violet" variant="light" size="sm">Included</Badge>
                      </Group>
                    )}
                    {form.values.hasRegularFollowups && (
                      <Group justify="space-between">
                        <Text size="sm">Regular Follow-ups</Text>
                        <Badge color="teal" variant="light" size="sm">Included</Badge>
                      </Group>
                    )}
                    {form.values.hasJobReferrals && (
                      <Group justify="space-between">
                        <Text size="sm">Job Referrals</Text>
                        <Badge color="orange" variant="light" size="sm">Included</Badge>
                      </Group>
                    )}
                    {form.values.hasCertification && (
                      <Group justify="space-between">
                        <Text size="sm">Certification</Text>
                        <Badge color="cyan" variant="light" size="sm">Included</Badge>
                      </Group>
                    )}
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={4}>
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