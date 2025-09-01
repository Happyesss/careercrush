"use client";

import { useTheme } from '../../ThemeContext';
import comp from "../../assets/images/comp.png"
import Image from 'next/image';


interface JobSearchFeaturesProps {
  position?: 'left' | 'right';
}

const JobSearchFeatures = ({ position = 'right' }: JobSearchFeaturesProps) => {
  const { isDarkMode } = useTheme();

  const workExperience = [
    {
      company: "Gojek Indonesia",
      role: "UI Designer",
      period: "2021 - 2022",
      logo: "🟢", // Green circle for Gojek
    },
    {
      company: "Halo Lab", 
      role: "UI Designer",
      period: "2022 - 2023",
      logo: "⚫", // Black circle for Halo Lab
    }
  ];

  const skills = [
    "User Interface",
    "Research", 
    "Motion Design",
    "Wireframe",
    "Illustration",
    "3D Designer"
  ];

  const features = [
    "Search by our advance search engine",
    "Filter by your own personalized location", 
    "Refining jobs with popular industry"
  ];

  const LeftContent = () => (
<div 
  className='h-[314px] w-[380px] shadow-md rounded-xl bg-cover bg-center bg-no-repeat'
  style={{ backgroundImage: `url(${comp.src})` }}
>
</div>
  );

  const RightContent = () => (
    <div className="">
      <div>
        <h2 className={`text-[35px]  leading-tight font-semibold mb-10 tracking-tighter ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Streamline Your Job Search
          <br />
          <span className="text-primary">with Advanced Features</span>
        </h2>
        <p className={`text-md mb-6 leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Our advanced job search feature saves you time and helps you find your dream job more efficiently. 
          You can quickly search to find the most relevant job opportunities.
        </p>
      </div>

      {/* Features List */}
      <div className="">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4 mb-3">
            <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
            <p className={`text-sm  ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {feature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`py-16 px-4 max-w-5xl sm:px-6 lg:px-8 ${
      isDarkMode 
        ? 'bg-transparent ' 
        : 'bg-transparent '
    }`}>
      <div className="max-w-7xl  mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
          position === 'left' ? 'lg:grid-cols-2' : 'lg:grid-cols-2'
        }`}>
          {position === 'left' ? (
            <>
              <div className="order-2 lg:order-1">
                <LeftContent />
              </div>
              <div className="order-1 lg:order-2">
                <RightContent />
              </div>
            </>
          ) : (
            <>
              <div className="order-2 lg:order-2">
                <LeftContent />
              </div>
              <div className="order-1 lg:order-1">
                <RightContent />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchFeatures;
