"use client";

import { useEffect } from 'react';
import MenteePackageBrowser from '../../../components/MentorshipPackages/Mentee/MenteePackageBrowser';
import { Container } from '@mantine/core';

const MenteePackagesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Explore Mentorship Packages - CareerCrush';
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <MenteePackageBrowser />
    </div>
  );
};

export default MenteePackagesPage;