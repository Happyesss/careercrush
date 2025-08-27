"use client";

import { useState } from 'react';
import { MentorshipPackage } from '../../../types/mentorshipPackages';
import { 
  Modal, 
  Stack, 
  Group, 
  Text, 
  Title, 
  Badge, 
  Card, 
  Button, 
  Divider,
  List,
  ThemeIcon,
  Grid,
  Progress,
  Timeline,
  Avatar,
  ScrollArea,
  Tabs,
  ActionIcon
} from '@mantine/core';
import { 
  IconCalendar, 
  IconUsers, 
  IconClock, 
  IconCurrencyRupee, 
  IconCheck, 
  IconBook,
  IconTarget,
  IconTrophy,
  IconStar,
  IconHeart,
  IconShare,
  IconBookmark
} from '@tabler/icons-react';

interface PackageDetailsModalProps {
  package: MentorshipPackage;
  opened: boolean;
  onClose: () => void;
  onBookTrial: () => void;
}

const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  package: pkg,
  opened,
  onClose,
  onBookTrial
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.packageName,
        text: pkg.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  const monthlyPrice = pkg.totalPrice / pkg.durationMonths;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={
        <Group justify="space-between" style={{ width: '100%' }}>
          <div>
            <Title order={3}>{pkg.packageName}</Title>
            <Text size="sm" c="dimmed">by {pkg.mentorName}</Text>
          </div>
          <Group gap="xs">
            <ActionIcon
              variant={isBookmarked ? 'filled' : 'subtle'}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <IconBookmark size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handleShare}>
              <IconShare size={16} />
            </ActionIcon>
          </Group>
        </Group>
      }
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Key Metrics Cards */}
        <Grid>
          <Grid.Col span={6}>
            <Card p="md" bg="blue.0" radius="md">
              <Group>
                <ThemeIcon variant="light" size="lg">
                  <IconCalendar size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>{pkg.durationMonths}</Text>
                  <Text size="sm" c="dimmed">Months</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card p="md" bg="green.0" radius="md">
              <Group>
                <ThemeIcon variant="light" size="lg" color="green">
                  <IconUsers size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>{pkg.totalSessions}</Text>
                  <Text size="sm" c="dimmed">Sessions</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card p="md" bg="orange.0" radius="md">
              <Group>
                <ThemeIcon variant="light" size="lg" color="orange">
                  <IconCurrencyRupee size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>{formatPrice(monthlyPrice)}</Text>
                  <Text size="sm" c="dimmed">Per Month</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={6}>
            <Card p="md" bg="violet.0" radius="md">
              <Group>
                <ThemeIcon variant="light" size="lg" color="violet">
                  <IconClock size={20} />
                </ThemeIcon>
                <div>
                  <Text size="xl" fw={700}>{pkg.sessionDurationMinutes}</Text>
                  <Text size="sm" c="dimmed">Minutes/Session</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconBook size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="curriculum" leftSection={<IconTarget size={16} />}>
              Curriculum
            </Tabs.Tab>
            <Tabs.Tab value="mentor" leftSection={<IconStar size={16} />}>
              Mentor
            </Tabs.Tab>
            <Tabs.Tab value="pricing" leftSection={<IconCurrencyRupee size={16} />}>
              Pricing
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Stack gap="md">
              {/* Description */}
              <Card p="md" withBorder>
                <Title order={4} mb="sm">About This Package</Title>
                <Text>{pkg.description}</Text>
              </Card>

              {/* Key Features */}
              <Card p="md" withBorder>
                <Title order={4} mb="sm">What&apos;s Included</Title>
                <List
                  spacing="sm"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                      <IconCheck size={12} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>{pkg.totalSessions} {pkg.sessionType} sessions</List.Item>
                  <List.Item>{pkg.sessionDurationMinutes}-minute sessions</List.Item>
                  <List.Item>Personalized learning path</List.Item>
                  <List.Item>Progress tracking and feedback</List.Item>
                  <List.Item>Career guidance and industry insights</List.Item>
                  {pkg.isFreeTrialIncluded && (
                    <List.Item>Free 30-minute trial session</List.Item>
                  )}
                </List>
              </Card>

              {/* Topics Covered */}
              <Card p="md" withBorder>
                <Title order={4} mb="sm">Topics Covered</Title>
                <Group gap="xs">
                  {pkg.topicsCovered.map((topic, index) => (
                    <Badge key={index} variant="light" size="md">
                      {topic}
                    </Badge>
                  ))}
                </Group>
              </Card>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="curriculum" pt="md">
            <Card p="md" withBorder>
              <Title order={4} mb="lg">Learning Journey</Title>
              {pkg.modules && pkg.modules.length > 0 ? (
                <Timeline active={-1} bulletSize={24} lineWidth={2}>
                  {pkg.modules.map((module, index) => (
                    <Timeline.Item
                      key={module.id}
                      bullet={<IconTarget size={12} />}
                      title={`Module ${module.moduleNumber}: ${module.moduleName}`}
                    >
                      <Text c="dimmed" size="sm" mt={4}>
                        {module.description}
                      </Text>
                      <Text size="xs" mt={4}>
                        <strong>Duration:</strong> {module.durationWeeks} weeks • 
                        <strong> Sessions:</strong> {module.sessionsCount}
                      </Text>
                      {module.learningObjectives && module.learningObjectives.length > 0 && (
                        <List size="xs" mt="xs">
                          {module.learningObjectives.map((objective, idx) => (
                            <List.Item key={idx}>{objective}</List.Item>
                          ))}
                        </List>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text c="dimmed">Detailed curriculum will be shared after enrollment.</Text>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="mentor" pt="md">
            <Card p="md" withBorder>
              <Group mb="md">
                <Avatar size="lg" name={pkg.mentorName} color="blue" />
                <div>
                  <Title order={4}>{pkg.mentorName}</Title>
                  <Text c="dimmed">Senior Mentor</Text>
                  <Group gap="xs" mt="xs">
                    <Badge leftSection={<IconStar size={12} />} variant="light">
                      4.9/5 Rating
                    </Badge>
                    <Badge leftSection={<IconTrophy size={12} />} variant="light">
                      150+ Mentees
                    </Badge>
                  </Group>
                </div>
              </Group>

              <Text size="sm" mb="md">
                Experienced professional with 8+ years in the industry. 
                Specialized in career development, technical skills, and industry best practices.
                Passionate about helping professionals reach their full potential.
              </Text>

              <Divider my="md" />

              <Stack gap="xs">
                <Text size="sm" fw={500}>Expertise Areas:</Text>
                <Group gap="xs">
                  {['Leadership', 'Technical Strategy', 'Career Growth', 'Industry Insights'].map((skill) => (
                    <Badge key={skill} size="sm" variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="pricing" pt="md">
            <Stack gap="md">
              <Card p="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Title order={4}>Package Pricing</Title>
                  <Badge size="lg" variant="gradient">
                    {formatPrice(pkg.totalPrice)}
                  </Badge>
                </Group>

                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text>Total Package Cost</Text>
                    <Text fw={500}>{formatPrice(pkg.totalPrice)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Monthly Payment</Text>
                    <Text fw={500}>{formatPrice(monthlyPrice)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Cost per Session</Text>
                    <Text fw={500}>{formatPrice(pkg.totalPrice / pkg.totalSessions)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Duration</Text>
                    <Text fw={500}>{pkg.durationMonths} months</Text>
                  </Group>
                </Stack>

                <Divider my="md" />

                <Stack gap="xs">
                  <Text size="sm" fw={500}>Payment Options:</Text>
                  <List size="sm">
                    <List.Item>Full payment (5% discount)</List.Item>
                    <List.Item>Monthly installments</List.Item>
                    <List.Item>Quarterly payments</List.Item>
                  </List>
                </Stack>
              </Card>

              {pkg.isFreeTrialIncluded && (
                <Card p="md" bg="green.0" withBorder>
                  <Group>
                    <ThemeIcon color="green" size="lg">
                      <IconHeart size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500}>Free Trial Included!</Text>
                      <Text size="sm" c="dimmed">
                        Book a 30-minute trial session to get started
                      </Text>
                    </div>
                  </Group>
                </Card>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* Action Buttons */}
        <Group justify="space-between" pt="md">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Group>
            {pkg.isFreeTrialIncluded && (
              <Button
                variant="light"
                leftSection={<IconCalendar size={16} />}
                onClick={onBookTrial}
              >
                Book Free Trial
              </Button>
            )}
            <Button
              leftSection={<IconCurrencyRupee size={16} />}
            >
              Enroll Now - {formatPrice(pkg.totalPrice)}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PackageDetailsModal;