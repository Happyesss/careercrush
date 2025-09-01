"use client";

import { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconArrowRight } from '@tabler/icons-react';
import { useTheme } from '../../ThemeContext';
import Image from 'next/image';

// Import company logos
import CiscoLogo from '../../assets/Companies/Cisco.png';
import GoogleLogo from '../../assets/Companies/Google.png';
import MetaLogo from '../../assets/Companies/Meta.png';
import NetflixLogo from '../../assets/Companies/Netflix.png';
import OracleLogo from '../../assets/Companies/Oracle.png';
import PinterestLogo from '../../assets/Companies/Pinterest.png';
import SpotifyLogo from '../../assets/Companies/Spotify.png';
import WalmartLogo from '../../assets/Companies/Walmart.png';
import MasterCardLogo from '../../assets/Companies/pngwing.com.png';
import Heading from './Heading';

// Company data with actual logos
const roleCategories = [
  {
    title: "Full-Stack Roles",
    openings: "300+ Openings",
    companies: [
      { name: "Cisco", logo: CiscoLogo },
      { name: "MasterCard", logo: MasterCardLogo },
      { name: "Netflix", logo: NetflixLogo },
      { name: "Meta", logo: MetaLogo }
    ]
  },
  {
    title: "Product Management",
    openings: "246+ Openings", 
    companies: [
      { name: "Google", logo: GoogleLogo },
      { name: "Oracle", logo: OracleLogo },
      { name: "Pinterest", logo: PinterestLogo },
      { name: "Spotify", logo: SpotifyLogo }
    ]
  },
  {
    title: "Marketing",
    openings: "300+ Openings",
    companies: [
      { name: "Spotify", logo: SpotifyLogo },
      { name: "Walmart", logo: WalmartLogo },
      { name: "Netflix", logo: NetflixLogo },
      { name: "Google", logo: GoogleLogo }
    ]
  },
  {
    title: "Finance",
    openings: "230+ Openings",
    companies: [
      { name: "Oracle", logo: OracleLogo },
      { name: "Meta", logo: MetaLogo },
      { name: "Walmart", logo: WalmartLogo },
      { name: "Pinterest", logo: PinterestLogo }
    ]
  },
  {
    title: "Data Science",
    openings: "180+ Openings",
    companies: [
      { name: "Netflix", logo: NetflixLogo },
      { name: "Oracle", logo: OracleLogo },
      { name: "Pinterest", logo: PinterestLogo },
      { name: "Cisco", logo: CiscoLogo }
    ]
  },
  {
    title: "DevOps & Cloud",
    openings: "160+ Openings",
    companies: [
      { name: "Google", logo: GoogleLogo },
      { name: "Meta", logo: MetaLogo },
      { name: "Spotify", logo: SpotifyLogo },
      { name: "Walmart", logo: WalmartLogo }
    ]
  }
];

const RightRole = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(roleCategories.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const getCurrentItems = () => {
    const startIndex = currentPage * itemsPerPage;
    return roleCategories.slice(startIndex, startIndex + itemsPerPage);
  };

  // Keyboard navigation
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <div 
      className={`py-16  tracking-tighter ${isDarkMode ? 'bg-third' : 'bg-[#ececec9c]'} mt-28 mb-28 focus:outline-none`}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>

               <div className={`flex items-start   w-[80%] md:w-[100%] text-center justify-center flex-col gap-3 ${isDarkMode ? ' text-white' : ' text-black'}`}>
                        <h1 className="md:text-3xl text-xl font-medium tracking-tight">Find The Right Role For You</h1>
                        <p className="text-center tracking-normal text-lightBlack">Apply to roles matching your skills from 500+ trending options.</p>
                </div> 

          </div>
          
          <div className="flex items-center gap-2">
           
            
            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                className={`p-2 rounded-full border  ${
                  isDarkMode 
                    ? 'border-primary bg-secondary  text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                } shadow-sm hover:shadow-md`}
              >
                <IconChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className={`p-2 rounded-full border  ${
                  isDarkMode 
                    ? 'border-primary bg-secondary  text-white' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                } shadow-sm hover:shadow-md`}
              >
                <IconChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1s sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {getCurrentItems().map((category, index) => (
            <div
              key={`${category.title}-${currentPage}`}
              className={`group relative overflow-hidden rounded-xl border hover:scale-100 hover:shadow-xl cursor-pointer ${
                isDarkMode 
                  ? 'bg-secondary border-none' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="p-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.title}
                  </h3>
                  <IconArrowRight 
                    size={16} 
                    className={`text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1`}
                  />
                </div>
                <p className={`text-sm tracking-normal ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {category.openings}
                </p>
              </div>

              {/* Company Logos */}
              <div className="px-6 pb-6">
                <div className="flex">
                  {category.companies.map((company, companyIndex) => (
                    <div
                      key={company.name}
                      className={`rounded-full border ml-[-12px] flex items-center  justify-center p-2 transition-all duration-300 hover:scale-105 group/logo ${
                        isDarkMode 
                          ? 'bg-third border-primary' 
                          : 'bg-white border-gray-200  '
                      }`}
                    >
                      <div className="w-8 h-8 relative">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          fill
                          className="object-contain filter group-hover/logo:brightness-110 transition-all duration-300"
                          sizes="32px"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
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

        
      </div>
    </div>
  );
};

export default RightRole;
