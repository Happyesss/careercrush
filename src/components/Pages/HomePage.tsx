"use client";
import DreamJob from '../LandingPage/DreamJob';
import Companies from '../LandingPage/Companies';
import Working from '../LandingPage/Working';
import RightRole from '../LandingPage/RightRole';
import QuickSection from '../LandingPage/QuickSection';
import { useTheme } from '@/ThemeContext';
import { Divider } from '@mantine/core';
import Testimonial from '../LandingPage/Testimonial';
import FAQ from '../LandingPage/FAQ';
import MentorSec from '../LandingPage/MentorSec';
import JobSearchFeatures from '../LandingPage/JobSearchFeatures';
import TrustedCompanies from '../LandingPage/TrustedCompanies';
import TrustedPartners from '../LandingPage/TrustedPartners';

const HomePage = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen bg-secondary tracking-tight ${isDarkMode ? 'dark' : ''}`}>
      <DreamJob />
      <Companies />

      <div className='mt-[10px] mb-20 flex flex-col items-center'>
           <JobSearchFeatures position='left' />
      </div>


            <MentorSec />


      <QuickSection />
       <RightRole />

       <Testimonial />






      {/* <Working /> */}

      {/* <Testimonials /> */}
      <FAQ/>
    </div>
  );
};

export default HomePage;
