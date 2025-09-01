"use client";

import { useState } from 'react';
import { IconStar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTheme } from '../../ThemeContext';
import Image from 'next/image';
import Heading from './Heading';

// Sample mentor data
const mentorCategories = [
  'Engineering',
  'Data Science', 
  'Business',
  'Product',
  'Marketing',
  'Design'
];

const mentorData = [
  {
    name: "Shishir Chandra",
    title: "Engineering lead",
    experience: "16 Years of Experience",
    rating: 4.9,
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    id: 1
  },
  {
    name: "Shivansh Bajpai", 
    title: "Devops Engineer 3",
    experience: "5 Years of Experience",
    rating: 4.9,
    company: "Amazon",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    id: 2
  },
  {
    name: "Manish Pushkar",
    title: "Software Engineer 2", 
    experience: "8 Years of Experience",
    rating: 5.0,
    company: "PayPal",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    id: 3
  },
  {
    name: "Priya Sharma",
    title: "Product Manager",
    experience: "12 Years of Experience", 
    rating: 5.0,
    company: "Microsoft",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    id: 4
  },
  {
    name: "Rahul Verma",
    title: "Data Scientist",
    experience: "10 Years of Experience",
    rating: 4.8,
    company: "Netflix", 
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    id: 5
  },
  {
    name: "Anita Singh",
    title: "UX Designer",
    experience: "7 Years of Experience",
    rating: 4.9,
    company: "Adobe",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    id: 6
  }
];

const MentorSec = () => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Engineering');
  const [currentPage, setCurrentPage] = useState(0);
  const mentorsPerPage = 3;
  
  // Filter mentors based on selected category
  const filteredMentors = mentorData.filter(mentor => {
    if (selectedCategory === 'Engineering') return mentor.title.toLowerCase().includes('engineer') || mentor.title.toLowerCase().includes('lead');
    if (selectedCategory === 'Data Science') return mentor.title.toLowerCase().includes('data');
    if (selectedCategory === 'Product') return mentor.title.toLowerCase().includes('product');
    if (selectedCategory === 'Design') return mentor.title.toLowerCase().includes('designer') || mentor.title.toLowerCase().includes('ux');
    return true;
  });

  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  
  const getCurrentMentors = () => {
    const startIndex = currentPage * mentorsPerPage;
    return filteredMentors.slice(startIndex, startIndex + mentorsPerPage);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  return (
    <div className="relative mx-4 mb-28 rounded-3xl py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-orange-100 to-primary/10 dark:from-orange-900/5 dark:via-orange-800/5 dark:to-primary/5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0  opacity-20">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10   items-center  flex flex-col mx-auto">
        {/* Header Section */}
       <div className="text-center mb-8">
          <Heading heading={"Free Trial Session away!"} subheading={"Choose your ideal mentor and get started with a FREE trial session"} />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {mentorCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full font-medium text-[12px] tracking-normal  ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : isDarkMode
                    ? 'bg-third text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className='flex justify-end w-[65%] mb-2'> 
  <div className="flex justify-end mb-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={totalPages <= 1}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-cape-cod-800 hover:bg-cape-cod-700 text-white border border-cape-cod-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              } shadow-sm hover:shadow-md`}
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={totalPages <= 1}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'bg-cape-cod-800 hover:bg-cape-cod-700 text-white border border-cape-cod-600' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              } shadow-sm hover:shadow-md`}
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>
        </div>
      

        {/* Mentor Cards Grid */}
        <div className="grid  w-[900px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCurrentMentors().map((mentor, index) => (
            <div
              key={`${mentor.id}-${currentPage}`}
              className={`group relative bg-white dark:bg-third ${isDarkMode ? "border-none" : "border"} rounded-2xl border p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer  ${
                isDarkMode 
                  ? 'border-cape-cod-700 hover:border-cape-cod-600 shadow-cape-cod-800/20' 
                  : 'border-gray-200  shadow-gray-200/50'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Rating Badge */}

      <div className='flex items-center justify-between'>


                                         <div className="absolute top-6 right-6 flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                <IconStar size={14} className="text-yellow-500 fill-current" />
                <span className="text-[12px] font-medium text-yellow-700 dark:text-yellow-400">
                  {mentor.rating}
                </span>
              </div>

              {/* Mentor Avatar */}
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden  ">
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="80px"
                  />
                </div>
              </div>
       </div>
             

              {/* Mentor Info */}
              <div className="text-start mb-4">
                <h3 className={`text-md tracking-tight  font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {mentor.name}
                </h3>
                <p className={`  ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[12px] tracking-normal mb-1`}>{mentor.title}</p>
                <p className={`text-[12px] tracking-normal ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {mentor.experience}
                </p>
              </div>

              {/* Company */}
              <div className="flex  items-start justify-start gap-2 mb-6 mt-6">
                <div className="w-6 h-6 relative">
                  <div className={`w-full h-full rounded flex items-center justify-center text-xs font-bold ${
                    mentor.company === 'Google' ? 'bg-blue-500 text-white' :
                    mentor.company === 'Amazon' ? 'bg-orange-500 text-white' :
                    mentor.company === 'PayPal' ? 'bg-blue-600 text-white' :
                    mentor.company === 'Microsoft' ? 'bg-green-500 text-white' :
                    mentor.company === 'Netflix' ? 'bg-red-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>
                    {mentor.company.charAt(0)}
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {mentor.company}
                </span>
              </div>

              {/* CTA Button */}
              <button className={`w-full ${isDarkMode ? 'bg-secondary text-primary' : 'bg-black text-white'} text-white font-semibold text-[12px] py-3 rounded-lg  transition-all duration-300 hover:scale-105`}>
                Book a FREE Trial
              </button>

              {/* Hover Gradient Overlay */}
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === index 
                    ? 'bg-primary w-8' 
                    : isDarkMode 
                      ? 'bg-cape-cod-600 hover:bg-cape-cod-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default MentorSec;
