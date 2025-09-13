"use client";

import { useState, useEffect } from 'react';
import { Card, Text, Group, Badge, Stack, Button, Avatar, ActionIcon, Grid } from '@mantine/core';
import { IconUsers, IconBriefcase, IconTrendingUp, IconEye, IconHeart, IconMessage, IconPlus } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';
import Link from 'next/link';

interface ProfilePreview {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar?: string;
  skills: string[];
  experience: number;
  type: 'talent' | 'mentor' | 'company';
  matchPercentage?: number;
  isOnline?: boolean;
}

const ExploreGallery = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const [profiles, setProfiles] = useState<ProfilePreview[]>([]);
  const [activeTab, setActiveTab] = useState<'suggested' | 'trending' | 'all'>('suggested');

  useEffect(() => {
    // Mock data - Replace with actual API calls
    const mockProfiles: ProfilePreview[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        title: 'Full Stack Developer',
        company: 'Tech Solutions',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'TypeScript'],
        experience: 3,
        type: 'talent',
        matchPercentage: 92,
        isOnline: true
      },
      {
        id: '2',
        name: 'Sarah Kim',
        title: 'React Native Mentor',
        company: 'Mobile Expert',
        location: 'Seattle, WA',
        skills: ['React Native', 'iOS', 'Android'],
        experience: 7,
        type: 'mentor',
        matchPercentage: 87,
        isOnline: false
      },
      {
        id: '3',
        name: 'TechCorp Inc.',
        title: 'Software Company',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        skills: ['Hiring', 'Full Stack', 'Remote'],
        experience: 0,
        type: 'company',
        matchPercentage: 78,
        isOnline: true
      },
      {
        id: '4',
        name: 'Mike Chen',
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'Los Angeles, CA',
        skills: ['Figma', 'Design Systems', 'Prototyping'],
        experience: 5,
        type: 'talent',
        matchPercentage: 85,
        isOnline: true
      }
    ];

    setProfiles(mockProfiles);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'talent':
        return 'blue';
      case 'mentor':
        return 'green';
      case 'company':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'talent':
        return <IconUsers size={12} />;
      case 'mentor':
        return <IconTrendingUp size={12} />;
      case 'company':
        return <IconBriefcase size={12} />;
      default:
        return <IconUsers size={12} />;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    switch (activeTab) {
      case 'suggested':
        return (profile.matchPercentage || 0) > 80;
      case 'trending':
        return profile.isOnline;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <Card shadow="sm" p="md" radius="md" className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
      <Group justify="space-between" mb="md">
        <Text fw={500} size="lg" className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          Explore
        </Text>
        <ActionIcon 
          size="sm" 
          variant="light" 
          color="blue"
          title="View all"
        >
          <IconPlus size={14} />
        </ActionIcon>
      </Group>

      {/* Tabs */}
      <Group gap="xs" mb="md">
        {['suggested', 'trending', 'all'].map((tab) => (
          <Button
            key={tab}
            size="xs"
            variant={activeTab === tab ? 'filled' : 'light'}
            color="blue"
            onClick={() => setActiveTab(tab as any)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </Group>

      {/* Profiles Grid */}
      {filteredProfiles.length > 0 ? (
        <Stack gap="sm">
          {filteredProfiles.slice(0, 4).map((profile) => (
            <Card
              key={profile.id}
              p="sm"
              radius="md"
              className={`${isDarkMode ? 'bg-cape-cod-800 border-cape-cod-700' : 'bg-gray-50 border-gray-200'} border cursor-pointer hover:shadow-md transition-shadow`}
              component={Link}
              href={`/talent-profile/${profile.id}`}
            >
              <Stack gap="xs">
                {/* Header */}
                <Group justify="space-between">
                  <Group gap="xs">
                    <div className="relative">
                      <Avatar 
                        src={profile.avatar} 
                        size="sm" 
                        radius="xl"
                      >
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {profile.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Text size="sm" fw={500} className={`${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                        {profile.name}
                      </Text>
                      <Text size="xs" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                        {profile.title}
                      </Text>
                    </div>
                  </Group>

                  <Badge 
                    size="xs" 
                    variant="light" 
                    color={getTypeColor(profile.type)}
                    leftSection={getTypeIcon(profile.type)}
                  >
                    {profile.type}
                  </Badge>
                </Group>

                {/* Details */}
                <Stack gap="xs">
                  <Group gap="xs">
                    <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                      {profile.company} • {profile.location}
                    </Text>
                  </Group>

                  {profile.experience > 0 && (
                    <Text size="xs" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                      {profile.experience} years experience
                    </Text>
                  )}

                  {/* Skills */}
                  <Group gap="xs">
                    {profile.skills.slice(0, 3).map((skill, index) => (
                      <Badge
                        key={index}
                        size="xs"
                        variant="light"
                        color="gray"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 3 && (
                      <Text size="xs" className={isDarkMode ? 'text-cape-cod-500' : 'text-gray-400'}>
                        +{profile.skills.length - 3}
                      </Text>
                    )}
                  </Group>

                  {/* Match percentage and actions */}
                  <Group justify="space-between">
                    {profile.matchPercentage && (
                      <Badge size="xs" variant="light" color="green">
                        {profile.matchPercentage}% match
                      </Badge>
                    )}
                    
                    <Group gap="xs">
                      <ActionIcon size="xs" variant="light" color="blue">
                        <IconEye size={12} />
                      </ActionIcon>
                      <ActionIcon size="xs" variant="light" color="red">
                        <IconHeart size={12} />
                      </ActionIcon>
                      <ActionIcon size="xs" variant="light" color="green">
                        <IconMessage size={12} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          ))}

          {/* View More Button */}
          {filteredProfiles.length > 4 && (
            <Button 
              variant="light" 
              size="xs" 
              fullWidth
              component={Link}
              href="/find-talent"
            >
              Explore More Profiles
            </Button>
          )}
        </Stack>
      ) : (
        <Stack align="center" gap="sm" className="py-8">
          <IconUsers size={48} className={isDarkMode ? 'text-cape-cod-600' : 'text-gray-400'} />
          <div className="text-center">
            <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
              No profiles found
            </Text>
            <Text size="xs" className={isDarkMode ? 'text-cape-cod-500' : 'text-gray-500'}>
              Try switching to a different tab or check back later
            </Text>
          </div>
        </Stack>
      )}
    </Card>
  );
};

export default ExploreGallery;
