"use client";

import { Card, Group, Text, Progress, Stack, Title, Badge, RingProgress, Center } from '@mantine/core';
import { IconPackage, IconCurrencyRupee, IconCalendarTime, IconTrendingUp } from '@tabler/icons-react';
import { PackageStats } from '../../../types/mentorshipPackages';
import { packageUtils } from '../../../Services/MentorshipPackageService';

interface PackageStatsCardProps {
  stats: PackageStats | null;
}

const PackageStatsCard: React.FC<PackageStatsCardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <Card p="md" radius="md" withBorder>
        <Text c="dimmed">No statistics available</Text>
      </Card>
    );
  }

  const activePercentage = stats.totalPackages > 0 
    ? (stats.activePackages / stats.totalPackages) * 100 
    : 0;

  return (
    <Card p="md" radius="md" withBorder>
      <Title order={4} mb="md">Package Statistics</Title>
      
      <Stack gap="lg">
        {/* Packages Overview */}
        <div>
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <IconPackage size={16} />
              <Text size="sm" fw={500}>Package Status</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {stats.activePackages} of {stats.totalPackages} active
            </Text>
          </Group>
          <Progress 
            value={activePercentage} 
            color="green" 
            size="lg" 
            radius="xl"
          />
          <Group justify="space-between" mt="xs">
            <Text size="xs" c="dimmed">
              {activePercentage.toFixed(1)}% active
            </Text>
            <Badge variant="light" color="green" size="sm">
              {stats.activePackages} Active
            </Badge>
          </Group>
        </div>

        {/* Revenue Overview */}
        <div>
          <Group gap="xs" mb="xs">
            <IconCurrencyRupee size={16} />
            <Text size="sm" fw={500}>Revenue Overview</Text>
          </Group>
          
          <Group justify="space-between" mb="sm">
            <div>
              <Text size="xl" fw={700} c="blue">
                {packageUtils.formatPrice(stats.totalRevenue)}
              </Text>
              <Text size="xs" c="dimmed">Total Potential Revenue</Text>
            </div>
            <RingProgress
              size={60}
              thickness={6}
              sections={[
                { value: 100, color: 'blue' }
              ]}
              label={
                <Center>
                  <IconCurrencyRupee size={16} />
                </Center>
              }
            />
          </Group>
          
          <Text size="sm" c="dimmed">
            Average package value: {packageUtils.formatPrice(stats.averagePrice)}
          </Text>
        </div>

        {/* Sessions Overview */}
        <div>
          <Group gap="xs" mb="xs">
            <IconCalendarTime size={16} />
            <Text size="sm" fw={500}>Sessions Overview</Text>
          </Group>
          
          <Group justify="space-between" align="center">
            <div>
              <Text size="lg" fw={600}>
                {stats.totalSessions}
              </Text>
              <Text size="xs" c="dimmed">Total Sessions</Text>
            </div>
            <Badge variant="light" color="violet" size="lg">
              {stats.totalSessions > 0 ? Math.round(stats.totalRevenue / stats.totalSessions) : 0} ₹/session
            </Badge>
          </Group>
        </div>

        {/* Performance Metrics */}
        <div>
          <Group gap="xs" mb="xs">
            <IconTrendingUp size={16} />
            <Text size="sm" fw={500}>Performance Metrics</Text>
          </Group>
          
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm">Package Efficiency</Text>
              <Badge 
                color={stats.totalPackages > 0 ? 'green' : 'gray'} 
                variant="light"
              >
                {stats.totalPackages > 0 ? 'Good' : 'No Data'}
              </Badge>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm">Revenue per Package</Text>
              <Text size="sm" fw={500}>
                {packageUtils.formatPrice(stats.averagePrice)}
              </Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm">Sessions per Package</Text>
              <Text size="sm" fw={500}>
                {stats.totalPackages > 0 ? Math.round(stats.totalSessions / stats.totalPackages) : 0}
              </Text>
            </Group>
          </Stack>
        </div>
      </Stack>
    </Card>
  );
};

export default PackageStatsCard;