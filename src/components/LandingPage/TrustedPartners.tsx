"use client";

import { useTheme } from '../../ThemeContext';

const TrustedPartners = () => {
  const { isDarkMode } = useTheme();

  const companies = [
    {
      name: "Asana",
      logo: "asana"
    },
    {
      name: "Fidelity", 
      logo: "Fidelity"
    },
    {
      name: "CenturyLink",
      logo: "CenturyLink"
    },
    {
      name: "Coinbase",
      logo: "coinbase"
    },
    {
      name: "Binance",
      logo: "BINANCE"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ececec9c] text-black mt-[250px] dark:bg-cape-cod-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
            >
              <div className="text-white font-medium text-lg sm:text-xl lg:text-2xl tracking-wide">
                {company.logo === "asana" && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>asana</span>
                  </div>
                )}
                {company.logo === "Fidelity" && (
                  <div className="italic font-semibold">Fidelity</div>
                )}
                {company.logo === "CenturyLink" && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>CenturyLink</span>
                  </div>
                )}
                {company.logo === "coinbase" && (
                  <div className="font-semibold">coinbase</div>
                )}
                {company.logo === "BINANCE" && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 transform rotate-45 flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-900 transform -rotate-45"></div>
                    </div>
                    <span className="font-semibold">BINANCE</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedPartners;
