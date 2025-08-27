"use client";

import { useState, useEffect } from "react";
import { Button, Text } from "@mantine/core";
import { IconArrowRight, IconStar, IconUsers } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";
import Link from "next/link";
import { getAvailableMentors } from "../../Services/MentorService";
import { Mentor } from "../../types/mentor";

const FeaturedMentors = () => {
  const { isDarkMode } = useTheme();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMentors();
  }, []);

  const fetchFeaturedMentors = async () => {
    try {
      const data = await getAvailableMentors();
      setMentors(data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Connect with Expert Mentors</h2>
          <p className={`text-lg ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Get personalized guidance from industry professionals to accelerate your career growth
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className={`rounded-xl p-6 animate-pulse ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`}></div>
                  <div className="flex-1">
                    <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-3 rounded w-3/4 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`}></div>
                  </div>
                </div>
                <div className={`h-3 rounded mb-2 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`}></div>
                <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mentors.map((mentor) => (
              <Link key={mentor.id} href={`/mentor/${mentor.id}`}>
                <div className={`rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                  isDarkMode ? 'bg-cape-cod-800 hover:bg-cape-cod-700' : 'bg-gray-50 hover:bg-white hover:shadow-xl'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    {mentor.picture ? (
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={`data:image/png;base64,${mentor.picture}`}
                        alt={mentor.name}
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                        isDarkMode ? 'bg-cape-cod-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {mentor.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
                        {mentor.jobTitle}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <IconStar size={14} className="text-yellow-500" />
                        <span className="text-sm">4.5</span>
                        <IconUsers size={14} className={`ml-2 ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`} />
                        <span className="text-sm">{mentor.currentMentees || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {mentor.mentorshipAreas?.slice(0, 2).map((area: string, index: number) => (
                        <span key={index} className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-cape-cod-700 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {area}
                        </span>
                      ))}
                    </div>
                    
                    <Text size="sm" className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`} lineClamp={2}>
                      {mentor.bio || mentor.about}
                    </Text>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className={`font-semibold ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
                        {mentor.hourlyRate ? `₹${mentor.hourlyRate}/hr` : "Free"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        mentor.isAvailable 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {mentor.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/find-mentors">
            <Button size="lg" rightSection={<IconArrowRight size={20} />}>
              Explore All Mentors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMentors;