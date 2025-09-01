"use client";

import { useTheme } from '../../ThemeContext';

const TrustedCompanies = () => {
  const { isDarkMode } = useTheme();

  const companies = [
    {
      name: "Google",
      logo: "Google"
    },
    {
      name: "Laravel", 
      logo: "Laravel"
    },
    {
      name: "Pipedrive",
      logo: "pipedrive"
    },
    {
      name: "Huawei",
      logo: "HUAWEI"
    },
    {
      name: "Discord",
      logo: "Discord"
    }
  ];

  return (
    <div className={`py-12 px-4 sm:px-6 lg:px-8 mt-[280px] ${
      isDarkMode 
        ? 'bg-cape-cod-950/50' 
        : 'bg-[#ffefd9]'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group transition-all duration-300 "
            >
              <div className={`text-2xl sm:text-3xl font-bold transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-500 group-hover:text-gray-400' 
                  : 'text-[#00000096] group-hover:text-gray-600'
              }`}>
                {company.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedCompanies;
