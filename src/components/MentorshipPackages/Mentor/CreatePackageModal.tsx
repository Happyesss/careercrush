"use client";

import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, NumberInput, Select, Button, Stack, Group, Card, Title, Text, ActionIcon, Divider, Chip, Badge } from '@mantine/core';
import { IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react';
import { useForm, hasLength, isNotEmpty } from '@mantine/form';
import { MentorshipPackage, PackageModule, CreatePackageRequest } from '../../../types/mentorshipPackages';

interface CreatePackageModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (packageData: CreatePackageRequest) => void;
  initialData?: MentorshipPackage | null;
  mentorId: number;
}

const CreatePackageModal: React.FC<CreatePackageModalProps> = ({
  opened,
  onClose,
  onSubmit,
  initialData,
  mentorId,
}) => {
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [modules, setModules] = useState<PackageModule[]>([]);

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
      packageName: hasLength({ min: 3, max: 100 }, 'Package name must be 3-100 characters'),
      description: hasLength({ min: 10, max: 500 }, 'Description must be 10-500 characters'),
      durationMonths: (value) => (value >= 1 && value <= 24 ? null : 'Duration must be 1-24 months'),
      sessionsPerMonth: (value) => (value >= 1 && value <= 20 ? null : 'Sessions must be 1-20 per month'),
      pricePerMonth: (value) => (value >= 1000 && value <= 100000 ? null : 'Price must be ₹1,000-₹100,000'),
      sessionDurationMinutes: (value) => (value >= 30 && value <= 180 ? null : 'Duration must be 30-180 minutes'),
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
    } else {
      // Generate default modules based on duration
      generateDefaultModules(form.values.durationMonths);
    }
  }, [initialData, opened]);

  useEffect(() => {
    if (opened && !initialData) {
      generateDefaultModules(form.values.durationMonths);
    }
  }, [form.values.durationMonths, opened]);

  const generateDefaultModules = (durationMonths: number) => {
    const defaultModules: PackageModule[] = [];
    for (let i = 1; i <= durationMonths; i++) {
      defaultModules.push({
        monthNumber: i,
        moduleNumber: i,
        moduleTitle: `Month ${i} of Mentorship`,
        moduleName: `Month ${i} of Mentorship`,
        moduleDescription: 'This Module Contains Following:',
        description: 'This Module Contains Following:',
        sessionsInMonth: form.values.sessionsPerMonth,
        sessionsCount: form.values.sessionsPerMonth,
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

  const handleSubmit = (values: typeof form.values) => {
    const totalSessions = values.durationMonths * values.sessionsPerMonth;
    const totalPrice = values.durationMonths * values.pricePerMonth;

    const packageData: CreatePackageRequest = {
      mentorId,
      packageName: values.packageName,
      description: values.description,
      durationMonths: values.durationMonths,
      totalSessions,
      sessionsPerMonth: values.sessionsPerMonth,
      pricePerMonth: values.pricePerMonth,
      totalPrice,
      topicsCovered: topics,
      modules,
      isActive: true,
      isFreeTrialIncluded: values.isFreeTrialIncluded,
      sessionType: values.sessionType,
      sessionDurationMinutes: values.sessionDurationMinutes,
    };

    onSubmit(packageData);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initialData ? 'Edit Package' : 'Create New Mentorship Package'}
      size="xl"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Basic Information */}
          <Card p="md" withBorder>
            <Title order={4} mb="md">Package Information</Title>
            <Stack gap="md">
              <TextInput
                label="Package Name"
                placeholder="e.g., 6 Months Complete Software Engineering Mentorship"
                {...form.getInputProps('packageName')}
                required
              />
              
              <Textarea
                label="Description"
                placeholder="Describe what your mentorship package covers..."
                rows={3}
                {...form.getInputProps('description')}
                required
              />

              <Group grow>
                <NumberInput
                  label="Duration (Months)"
                  min={1}
                  max={24}
                  {...form.getInputProps('durationMonths')}
                  required
                />
                <NumberInput
                  label="Sessions per Month"
                  min={1}
                  max={20}
                  {...form.getInputProps('sessionsPerMonth')}
                  required
                />
              </Group>

              <Group grow>
                <NumberInput
                  label="Price per Month (₹)"
                  min={1000}
                  max={100000}
                  step={1000}
                  thousandSeparator=","
                  {...form.getInputProps('pricePerMonth')}
                  required
                />
                <NumberInput
                  label="Session Duration (Minutes)"
                  min={30}
                  max={180}
                  step={15}
                  {...form.getInputProps('sessionDurationMinutes')}
                  required
                />
              </Group>

              <Group grow>
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
                />
                <div>
                  <Text size="sm" fw={500} mb="xs">Package Options</Text>
                  <Chip
                    checked={form.values.isFreeTrialIncluded}
                    onChange={(checked) => form.setFieldValue('isFreeTrialIncluded', checked)}
                  >
                    Include Free Trial
                  </Chip>
                </div>
              </Group>
            </Stack>
          </Card>

          {/* Topics Covered */}
          <Card p="md" withBorder>
            <Title order={4} mb="md">Topics Covered</Title>
            <Group mb="md">
              <TextInput
                placeholder="Add a topic..."
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                flex={1}
              />
              <Button onClick={addTopic} variant="light">Add</Button>
            </Group>
            
            <Group gap="xs">
              {topics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="light"
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
          </Card>

          {/* Monthly Modules */}
          <Card p="md" withBorder>
            <Title order={4} mb="md">Monthly Curriculum</Title>
            <Text size="sm" c="dimmed" mb="md">
              Define what will be covered in each month of your mentorship program
            </Text>

            <Stack gap="lg">
              {modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} p="md" withBorder radius="sm">
                  <Group justify="space-between" mb="md">
                    <Badge color="blue" size="lg">Month {module.monthNumber}</Badge>
                    <Text size="sm" c="dimmed">{module.sessionsInMonth} sessions</Text>
                  </Group>

                  <Stack gap="sm">
                    <TextInput
                      label="Module Title"
                      value={module.moduleTitle}
                      onChange={(e) => updateModule(moduleIndex, 'moduleTitle', e.target.value)}
                    />
                    
                    <Textarea
                      label="Module Description"
                      value={module.moduleDescription}
                      onChange={(e) => updateModule(moduleIndex, 'moduleDescription', e.target.value)}
                      rows={2}
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
                      />
                    </div>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>

          {/* Package Summary */}
          <Card p="md" withBorder>
            <Title order={4} mb="md">Package Summary</Title>
            <Group grow>
              <div>
                <Text size="sm" c="dimmed">Total Sessions</Text>
                <Text fw={700}>{form.values.durationMonths * form.values.sessionsPerMonth}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Total Price</Text>
                <Text fw={700}>₹{(form.values.durationMonths * form.values.pricePerMonth).toLocaleString()}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Price per Session</Text>
                <Text fw={700}>₹{Math.round(form.values.pricePerMonth / form.values.sessionsPerMonth).toLocaleString()}</Text>
              </div>
            </Group>
          </Card>

          {/* Action Buttons */}
          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Package' : 'Create Package'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreatePackageModal;