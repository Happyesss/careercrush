"use client";

import { useState } from 'react';
import { Card, Group, Text, Badge, Button, Menu, ActionIcon, Stack, Divider, Progress, Title } from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconEye, IconToggleLeft, IconToggleRight, IconCalendarTime, IconCurrencyRupee, IconUsers, IconClock } from '@tabler/icons-react';
import { MentorshipPackage } from '../../../types/mentorshipPackages';
import { packageUtils } from '../../../Services/MentorshipPackageService';

interface PackageCardProps {
  package: MentorshipPackage;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  onView?: (id: number) => void;
  onBookTrial?: (id: number) => void;
  showMentorActions?: boolean;
  showBookingActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  onBookTrial,
  showMentorActions = false,
  showBookingActions = false,
  variant = 'default',
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDescription = pkg.description.length > 120 
    ? pkg.description.substring(0, 120) + '...' 
    : pkg.description;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'blue';
    }
  };

  const difficulty = packageUtils.getPackageDifficulty(pkg.durationMonths, pkg.totalSessions);

  if (variant === 'compact') {
    return (
      <Card p="md" radius="md" withBorder>
        <Group justify="space-between" mb="sm">
          <Text fw={600} lineClamp={1}>{pkg.packageName}</Text>
          <Badge color={pkg.isActive ? 'green' : 'gray'} size="sm">
            {pkg.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </Group>
        
        <Group gap="lg" mb="sm">
          <div>
            <Text size="xs" c="dimmed">Duration</Text>
            <Text size="sm" fw={500}>{packageUtils.formatDuration(pkg.durationMonths)}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Price</Text>
            <Text size="sm" fw={500}>{packageUtils.formatPrice(pkg.pricePerMonth)}/mo</Text>
          </div>
        </Group>

        {showBookingActions && (
          <Button 
            fullWidth 
            size="sm" 
            onClick={() => onBookTrial?.(pkg.id!)}
            disabled={!pkg.isActive}
          >
            Book Free Trial
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card p="lg" radius="md" withBorder className="h-full flex flex-col">
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Badge color={pkg.isActive ? 'green' : 'gray'} size="lg">
          {pkg.isActive ? 'Active' : 'Inactive'}
        </Badge>
        
        {showMentorActions && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onView?.(pkg.id!)}>
                View Details
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit?.(pkg.id!)}>
                Edit Package
              </Menu.Item>
              <Menu.Item 
                leftSection={pkg.isActive ? <IconToggleLeft size={14} /> : <IconToggleRight size={14} />}
                onClick={() => onToggleStatus?.(pkg.id!)}
              >
                {pkg.isActive ? 'Deactivate' : 'Activate'}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<IconTrash size={14} />} 
                color="red"
                onClick={() => onDelete?.(pkg.id!)}
              >
                Delete Package
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* Title and Description */}
      <div className="flex-grow">
        <Title order={3} mb="sm" lineClamp={2}>
          {pkg.packageName}
        </Title>
        
        <Text size="sm" c="dimmed" mb="md">
          {showFullDescription ? pkg.description : truncatedDescription}
          {pkg.description.length > 120 && (
            <Button 
              variant="subtle" 
              size="xs" 
              p={0} 
              onClick={() => setShowFullDescription(!showFullDescription)}
              style={{ marginLeft: 4 }}
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </Button>
          )}
        </Text>

        {/* Package Stats */}
        <div className="grid grid-cols-2 gap-3 mb-md">
          <div className="flex items-center gap-2">
            <IconCalendarTime size={16} color="gray" />
            <div>
              <Text size="xs" c="dimmed">Duration</Text>
              <Text size="sm" fw={500}>{packageUtils.formatDuration(pkg.durationMonths)}</Text>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconUsers size={16} color="gray" />
            <div>
              <Text size="xs" c="dimmed">Sessions</Text>
              <Text size="sm" fw={500}>{pkg.totalSessions} total</Text>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconCurrencyRupee size={16} color="gray" />
            <div>
              <Text size="xs" c="dimmed">Monthly</Text>
              <Text size="sm" fw={500}>{packageUtils.formatPrice(pkg.pricePerMonth)}</Text>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconClock size={16} color="gray" />
            <div>
              <Text size="xs" c="dimmed">Per Session</Text>
              <Text size="sm" fw={500}>{pkg.sessionDurationMinutes}min</Text>
            </div>
          </div>
        </div>

        {/* Topics Covered */}
        {pkg.topicsCovered && pkg.topicsCovered.length > 0 && (
          <div className="mb-md">
            <Text size="sm" fw={500} mb="xs">Topics Covered</Text>
            <Group gap="xs">
              {pkg.topicsCovered.slice(0, 3).map((topic, index) => (
                <Badge key={index} variant="light" size="sm">
                  {topic}
                </Badge>
              ))}
              {pkg.topicsCovered.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{pkg.topicsCovered.length - 3} more
                </Badge>
              )}
            </Group>
          </div>
        )}

        {/* Package Inclusions (as per Preplaced documentation) */}
        <div className="mb-md">
          <Text size="sm" fw={500} mb="xs">Package Inclusions</Text>
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Text size="sm">1:1 Live Sessions</Text>
              <Badge color="green" variant="light" size="sm">Included</Badge>
            </Group>
            
            {pkg.hasUnlimitedChat && (
              <Group justify="space-between" align="center">
                <Text size="sm">Unlimited Chat with Mentor</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
            
            {pkg.hasCuratedTasks && (
              <Group justify="space-between" align="center">
                <Text size="sm">Task & Curated Resources</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
            
            {pkg.hasRegularFollowups && (
              <Group justify="space-between" align="center">
                <Text size="sm">Regular Follow-ups</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
            
            {pkg.hasJobReferrals && (
              <Group justify="space-between" align="center">
                <Text size="sm">Job Referrals</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
            
            {pkg.hasCertification && (
              <Group justify="space-between" align="center">
                <Text size="sm">Certification</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
            
            {pkg.hasRescheduling && (
              <Group justify="space-between" align="center">
                <Text size="sm">Reschedule Anytime</Text>
                <Badge color="green" variant="light" size="sm">Included</Badge>
              </Group>
            )}
          </Stack>
        </div>

        {/* Package Features */}
        <Stack gap="xs" mb="md">
          <Group justify="space-between" align="center">
            <Text size="sm">Difficulty Level</Text>
            <Badge color={getDifficultyColor(difficulty)} variant="light" size="sm">
              {difficulty}
            </Badge>
          </Group>
          
          <Group justify="space-between" align="center">
            <Text size="sm">Session Type</Text>
            <Badge variant="outline" size="sm">{pkg.sessionType}</Badge>
          </Group>
          
          {pkg.isFreeTrialIncluded && (
            <Group justify="space-between" align="center">
              <Text size="sm">Free Trial</Text>
              <Badge color="green" variant="light" size="sm">Included</Badge>
            </Group>
          )}
        </Stack>
      </div>

      <Divider mb="md" />

      {/* Pricing and Actions */}
      <div>
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Text size="xl" fw={700} c="blue">
              {packageUtils.formatPrice(pkg.totalPrice)}
            </Text>
            <Text size="xs" c="dimmed">
              Total • {packageUtils.formatPrice(Math.round(pkg.totalPrice / pkg.totalSessions))} per session
            </Text>
          </div>
          <Text size="sm" c="dimmed" ta="right">
            {pkg.sessionsPerMonth} sessions/month
          </Text>
        </Group>

        {/* Action Buttons */}
        {showBookingActions && (
          <Stack gap="xs">
            {pkg.isFreeTrialIncluded && (
              <Button 
                variant="light" 
                fullWidth 
                onClick={() => onBookTrial?.(pkg.id!)}
                disabled={!pkg.isActive}
              >
                Book Free Trial
              </Button>
            )}
            <Button 
              fullWidth 
              onClick={() => onView?.(pkg.id!)}
              disabled={!pkg.isActive}
            >
              View Details
            </Button>
          </Stack>
        )}

        {showMentorActions && (
          <Group justify="flex-end">
            <Button variant="light" size="sm" onClick={() => onEdit?.(pkg.id!)}>
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onToggleStatus?.(pkg.id!)}
            >
              {pkg.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Group>
        )}
      </div>
    </Card>
  );
};

export default PackageCard;