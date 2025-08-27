"use client";
import DreamJob from '../LandingPage/DreamJob';
import Companies from '../LandingPage/Companies';
import Working from '../LandingPage/Working';
import Information from '../LandingPage/Information';
import QuickSection from '../LandingPage/QuickSection';
import { useTheme } from '@/ThemeContext';
import { Divider } from '@mantine/core';
import Testimonials from '../LandingPage/Testimonial';
import FAQ from '../LandingPage/FAQ';

const HomePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[100vh] mt-[-80px] bg-secondary ${isDarkMode ? 'dark' : ''}`}>
      <DreamJob />
      <Companies />
      <QuickSection />
      {/* <Information /> */}
      <Working />
      <Testimonials />
      <FAQ/>
      <Divider mx="md" size="xs" color={isDarkMode ? 'dark' : 'gray'} />
    </div>
  );
};

export default HomePage;
