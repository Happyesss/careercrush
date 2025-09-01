"use client";

import { Avatar, Button, TextInput } from '@mantine/core';
import landingImage from '../../assets/images/Connecting.png';
import { IconSearch, IconTie } from '@tabler/icons-react';
import { useTheme } from "../../ThemeContext";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DreamJob = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (jobTitle) query.append('title', jobTitle);
    if (jobType) query.append('type', jobType);

  router.push(`/find-jobs?${query.toString()}`);
  };
  return (
  
    <div className='flex  min-h-[100vh] items-start justify-center bg-secondary px-20 bs-mx:px-10 md-mx:px-5 sm-mx:px-2 sm-mx:flex-col-reverse '>
      <div className=' h-[100vh]  w-full flex flex-col  justify-start items-center'>


            <div className='flex items-center justify-center mt-20'>
                        <div className='flex items-center justify-center'>
                                <div className='h-6 w-6 items-center flex justify-center bg-blue-500 rounded-full text-[12px] text-white border border-white font-bold'>k</div>
                                <div className='h-6 w-6 items-center flex ml-[-6px] justify-center bg-green-500 rounded-full text-[12px] text-white border border-white font-bold'>n</div>
                                <div className='h-6 w-6 items-center flex ml-[-6px] justify-center bg-violet-500 rounded-full text-[12px] text-white border border-white font-bold'>c</div>
                        </div>

                        <h1 className='text-[14px] font-medium ml-2 text-lightBlack'> <span className='text-black'>10K+</span> Jobs placed</h1>
            </div>

            <div className=' mt-4 text-center  px-8 flex items-center flex-col'>
                   <h1 className='md:text-5xl text-3xl tracking-tighter font-medium text-black leading-[35px]  w-full md:w-[90%] lg:w-[70%] md:leading-[60px]'>Kickstart your career journey today step into your <span className='text-primary'>dream career</span></h1>
                   <p className='font-medium text-[16px] text-lightBlack mt-4 tracking-tight'>Break into your dream career with expert guidance, proven strategies, and mentorship</p>
            </div>

    <div className='mt-6 flex items-center justify-center gap-4'>
      <button
        onClick={() => router.push('/find-jobs')}
        aria-label='Browse jobs as a jobseeker'
        className='bg-white px-4 py-2 border text-black font-medium border-gray-200 dark:bg-third dark:border-none rounded-lg text-sm hover:bg-gray-50 active:scale-[0.99]'>
          Jobseeker
      </button>

      <button
        onClick={() => router.push('/find-mentors')}
        aria-label='Find mentors'
        className='bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 active:scale-[0.99]'>
          Mentor
      </button>
    </div>


      </div>

      <div className='h-[80vh] bg-primary p-2 overflow-hidden absolute w-[95%] md:w-[85%] rounded-xl top-[480px]'>
      </div>
           
    </div>


  )
}

export default DreamJob;