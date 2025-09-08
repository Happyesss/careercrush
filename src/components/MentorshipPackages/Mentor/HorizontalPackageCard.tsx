"use client";

import { useState } from 'react';
import { Card, Group, Text, Badge, Button, Stack, Divider, Title, Paper, Grid, Container } from '@mantine/core';
import { IconCalendarTime, IconCurrencyRupee, IconUsers, IconClock, IconCheck } from '@tabler/icons-react';
import { MentorshipPackage } from '../../../types/mentorshipPackages';
import { packageUtils } from '../../../Services/MentorshipPackageService';
import styles from './HorizontalPackageCard.module.css';

interface HorizontalPackageCardProps {
  package: MentorshipPackage;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  onView?: (id: number) => void;
  showMentorActions?: boolean;
}

interface PlanDetails {
  duration: number;
  label: string;
  monthlyPrice: number;
  totalPrice: number;
  discount: number;
  originalPrice?: number;
  popular?: boolean;
  bestValue?: boolean;
}

const HorizontalPackageCard: React.FC<HorizontalPackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  showMentorActions = false,
}) => {
  // Calculate pricing for different durations based on package data
  const baseMonthlyPrice = pkg.originalPricePerMonth || pkg.pricePerMonth;
  
  // Create different plan options using actual discount data from package
  const plans: PlanDetails[] = [
    {
      duration: 1,
      label: '1 Month',
      monthlyPrice: baseMonthlyPrice,
      totalPrice: baseMonthlyPrice,
      discount: 0,
    },
    {
      duration: 3,
      label: '3 Months',
      monthlyPrice: pkg.threeMonthDiscount ? 
        Math.round(baseMonthlyPrice * (1 - pkg.threeMonthDiscount / 100)) : 
        Math.round(baseMonthlyPrice * 0.85), // fallback 15% discount
      totalPrice: (pkg.threeMonthDiscount ? 
        Math.round(baseMonthlyPrice * (1 - pkg.threeMonthDiscount / 100)) : 
        Math.round(baseMonthlyPrice * 0.85)) * 3,
      discount: pkg.threeMonthDiscount || 15,
      originalPrice: baseMonthlyPrice,
      popular: true,
    },
    {
      duration: 6,
      label: '6 Months',
      monthlyPrice: pkg.sixMonthDiscount ? 
        Math.round(baseMonthlyPrice * (1 - pkg.sixMonthDiscount / 100)) : 
        Math.round(baseMonthlyPrice * 0.7), // fallback 30% discount
      totalPrice: (pkg.sixMonthDiscount ? 
        Math.round(baseMonthlyPrice * (1 - pkg.sixMonthDiscount / 100)) : 
        Math.round(baseMonthlyPrice * 0.7)) * 6,
      discount: pkg.sixMonthDiscount || 30,
      originalPrice: baseMonthlyPrice,
      bestValue: true,
    },
  ];

  const getSessionsPerWeek = () => {
    const sessionsPerMonth = pkg.sessionsPerMonth || 8;
    return Math.round((sessionsPerMonth * 12) / 52); // Convert to weekly average
  };

  const renderPlanCard = (plan: PlanDetails) => (
    <Paper 
      key={plan.duration}
      p="md" 
      radius="md" 
      withBorder
      className={`${styles.planCard} ${plan.popular ? styles.popularCard : ''} ${plan.bestValue ? styles.bestValueCard : ''}`}
    >
      {plan.popular && (
        <Badge 
          color="orange" 
          variant="filled" 
          size="sm"
          className={styles.planBadge}
        >
          Most Popular
        </Badge>
      )}
      {plan.bestValue && (
        <Badge 
          color="blue" 
          variant="filled" 
          size="sm"
          className={styles.planBadge}
        >
          Best Value
        </Badge>
      )}
      
      <Stack gap="sm" align="center" style={{ paddingTop: plan.popular || plan.bestValue ? 16 : 0 }}>
        <Text fw={600} size="md" ta="center">{plan.label}</Text>
        
        <div className={styles.priceContainer}>
          <Group justify="center" gap="xs" align="baseline">
            <Text size="xl" fw={700} c="blue">₹{plan.monthlyPrice.toLocaleString()}</Text>
            {plan.originalPrice && (
              <Text size="sm" td="line-through" c="dimmed">₹{plan.originalPrice.toLocaleString()}</Text>
            )}
          </Group>
          <Text size="xs" c="dimmed" ta="center">/Month</Text>
        </div>

        {plan.discount > 0 && (
          <Badge className={styles.discountBadge} size="sm">
            Extra {plan.discount}% OFF
          </Badge>
        )}

        <Text size="xs" c="dimmed" ta="center">
          {getSessionsPerWeek()}x Sessions Per Week
        </Text>

        <Divider style={{ width: '100%' }} />

        <Stack gap="4px" style={{ width: '100%', fontSize: '11px' }}>
          <Group justify="space-between">
            <Text size="xs">Referrals in Top Companies</Text>
            <Text size="xs" c="blue">+12 More</Text>
          </Group>
        </Stack>

        <Text size="md" fw={600} ta="center" mt="xs" c="blue">
          ₹{plan.totalPrice.toLocaleString()}
          <Text size="xs" c="dimmed" span style={{ display: 'block' }}>
            {plan.duration === 1 ? 'No commitment' : `${plan.duration} month total`}
          </Text>
        </Text>
      </Stack>
    </Paper>
  );

  return (
    <Card p="xl" radius="md" withBorder className={styles.horizontalCard}>
      <Container size="lg" p={0}>
        <Grid>
          {/* Left Side - Package Information */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              <Group justify="space-between">
                <Badge color={pkg.isActive ? 'green' : 'gray'} size="lg">
                  {pkg.isActive ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
                {showMentorActions && (
                  <Group gap="xs">
                    <Button variant="light" size="xs" onClick={() => onEdit?.(pkg.id!)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => onToggleStatus?.(pkg.id!)}>
                      {pkg.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </Group>
                )}
              </Group>

              {/* Package Title */}
              <div>
                <Title order={3} mb="xs" className={styles.packageTitle}>{pkg.packageName}</Title>
                <Text size="sm" c="dimmed" lineClamp={3}>
                  {pkg.description}
                </Text>
              </div>

              {/* Package Details */}
              <Stack gap="sm">
                <div className={styles.packageStats}>
                  <div className={styles.statItem}>
                    <IconCalendarTime size={16} style={{ color: 'gray' }} />
                    <div>
                      <Text size="xs" c="dimmed">Duration</Text>
                      <Text size="sm" fw={500}>{packageUtils.formatDuration(pkg.durationMonths)}</Text>
                    </div>
                  </div>
                  
                  <div className={styles.statItem}>
                    <IconUsers size={16} style={{ color: 'gray' }} />
                    <div>
                      <Text size="xs" c="dimmed">Sessions</Text>
                      <Text size="sm" fw={500}>{pkg.totalSessions} total</Text>
                    </div>
                  </div>
                  
                  <div className={styles.statItem}>
                    <IconClock size={16} style={{ color: 'gray' }} />
                    <div>
                      <Text size="xs" c="dimmed">Per Session</Text>
                      <Text size="sm" fw={500}>{pkg.sessionDurationMinutes}min</Text>
                    </div>
                  </div>
                </div>

                {/* Package Inclusions */}
                <div>
                  <Text size="sm" fw={500} mb="xs">Package Inclusions</Text>
                  <div className={styles.inclusionGrid}>
                    <div className={styles.inclusionItem}>
                      <IconCheck size={14} style={{ color: 'green' }} />
                      <Text size="xs">1:1 Live Sessions</Text>
                    </div>
                    
                    {pkg.hasUnlimitedChat && (
                      <div className={styles.inclusionItem}>
                        <IconCheck size={14} style={{ color: 'green' }} />
                        <Text size="xs">Unlimited Chat with Mentor</Text>
                      </div>
                    )}
                    
                    {pkg.hasCuratedTasks && (
                      <div className={styles.inclusionItem}>
                        <IconCheck size={14} style={{ color: 'green' }} />
                        <Text size="xs">Task & Curated Resources</Text>
                      </div>
                    )}
                    
                    {pkg.hasRegularFollowups && (
                      <div className={styles.inclusionItem}>
                        <IconCheck size={14} style={{ color: 'green' }} />
                        <Text size="xs">Regular Follow-ups</Text>
                      </div>
                    )}
                    
                    {pkg.hasJobReferrals && (
                      <div className={styles.inclusionItem}>
                        <IconCheck size={14} style={{ color: 'green' }} />
                        <Text size="xs">Job Referrals</Text>
                      </div>
                    )}
                  </div>
                </div>

                {/* Topics Covered */}
                {pkg.topicsCovered && pkg.topicsCovered.length > 0 && (
                  <div>
                    <Text size="sm" fw={500} mb="xs">Topics Covered</Text>
                    <div className={styles.topicsGrid}>
                      {pkg.topicsCovered.slice(0, 4).map((topic, index) => (
                        <Badge key={index} variant="light" size="sm">
                          {topic}
                        </Badge>
                      ))}
                      {pkg.topicsCovered.length > 4 && (
                        <Badge variant="outline" size="sm">
                          +{pkg.topicsCovered.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Right Side - Pricing Plans */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div>
              <Text size="lg" fw={600} mb="md" ta="center">Choose Your Plan</Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {plans.map(plan => renderPlanCard(plan))}
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </Container>
    </Card>
  );
};

export default HorizontalPackageCard;