"use client";

import { Badge, Text, Button, Rating } from "@mantine/core";
import { IconMapPin, IconClock, IconUserCheck, IconStar, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";
import { useTheme } from "../../ThemeContext";

const MentorCard = (props: any) => {
  const { isDarkMode } = useTheme();

  return (
    <Link href={`/mentor/${props.id}`} 
      className={`flex flex-col gap-4 rounded-xl p-6 w-80 hover:shadow-[0_0_5px_1px_blue] transition-all ${
        isDarkMode ? 'bg-cape-cod-900 !shadow-blue-300' : 'bg-white !shadow-gray-300'
      }`}>
      
      <div className="flex gap-4 items-start">
        <div className="relative">
          {props.picture ? (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={`data:image/png;base64,${props.picture}`}
              alt={`${props.name} avatar`}
            />
          ) : (
            <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold ${
              isDarkMode ? 'bg-cape-cod-800 text-blue-400' : 'bg-gray-200 text-blue-600'
            }`}>
              {props.name?.charAt(0) || 'M'}
            </div>
          )}
          {props.isAvailable && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="font-semibold text-lg">{props.name}</div>
          <div className={`text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
            {props.jobTitle} at {props.company}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Rating value={4.5} readOnly size="sm" />
            <span className={`text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
              ({props.currentMentees || 0}/{props.maxMentees || 5} mentees)
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {props.mentorshipAreas?.slice(0, 3).map((area: string, index: number) => (
          <Badge
            key={index}
            size="sm"
            variant={isDarkMode ? "filled" : "light"}
            color="blue"
          >
            {area}
          </Badge>
        ))}
        {props.mentorshipAreas?.length > 3 && (
          <Badge size="sm" variant="outline" color="gray">
            +{props.mentorshipAreas.length - 3}
          </Badge>
        )}
      </div>

      <Text className={`!text-sm text-justify ${isDarkMode ? '!text-cape-cod-300' : '!text-gray-600'}`} lineClamp={2}>
        {props.bio || props.about}
      </Text>

      <div className={`flex gap-4 text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-1">
          <IconMapPin className="w-4 h-4" />
          <span>{props.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconTrophy className="w-4 h-4" />
          <span>{props.totalExp}+ years</span>
        </div>
        <div className="flex items-center gap-1">
          <IconClock className="w-4 h-4" />
          <span>{props.timezone}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={`font-semibold ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
          {props.hourlyRate ? `₹${props.hourlyRate}/hour` : "Rate not specified"}
        </div>
        <Badge
          color={props.isAvailable ? "green" : "red"}
          variant={isDarkMode ? "filled" : "light"}
          size="sm"
        >
          {props.isAvailable ? "Available" : "Busy"}
        </Badge>
      </div>
    </Link>
  );
};

export default MentorCard;