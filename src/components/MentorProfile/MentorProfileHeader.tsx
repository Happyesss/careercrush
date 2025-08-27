"use client";

import { Badge, Text, Rating } from "@mantine/core";
import { IconMapPin, IconTrophy, IconUser, IconClock } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";

interface MentorProfileHeaderProps {
  mentor: Mentor;
}

const MentorProfileHeader = ({ mentor }: MentorProfileHeaderProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="xl:w-1/3 w-full">
      <div className="flex flex-col items-center xl:items-start">
        <div className="relative mt-2 sm:mt-0 lg:mt-0 mb-4">
          {mentor.picture ? (
            <img
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              src={`data:image/png;base64,${mentor.picture}`}
              alt={mentor.name}
            />
          ) : (
            <div className={`h-32 w-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold shadow-lg ${
              isDarkMode ? 'bg-cape-cod-800 text-blue-400' : 'bg-gray-200 text-blue-600'
            }`}>
              {mentor.name?.charAt(0)}
            </div>
          )}
          {mentor.isAvailable && (
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          )}
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center xl:text-left">{mentor.name}</h1>
        <p className={`text-lg mb-4 text-center xl:text-left ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
          {mentor.jobTitle} at {mentor.company}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <Rating value={4.5} readOnly />
          <span className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
            4.5 (23 reviews)
          </span>
        </div>
        
        <div className={`flex flex-col gap-2 text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} mb-6 w-full`}>
          <div className="flex items-center gap-2 justify-center xl:justify-start">
            <IconMapPin size={16} />
            <span>{mentor.location}</span>
          </div>
          <div className="flex items-center gap-2 justify-center xl:justify-start">
            <IconTrophy size={16} />
            <span>{mentor.totalExp}+ years experience</span>
          </div>
          <div className="flex items-center gap-2 justify-center xl:justify-start">
            <IconClock size={16} />
            <span>{mentor.timezone}</span>
          </div>
          <div className="flex items-center gap-2 justify-center xl:justify-start">
            <IconUser size={16} />
            <span>{mentor.currentMentees}/{mentor.maxMentees} mentees</span>
          </div>
        </div>
        
        <div className="text-center">
          <Text className={`font-bold text-lg ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
            {mentor.hourlyRate ? `₹${mentor.hourlyRate}/hour` : "Rate not specified"}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileHeader;