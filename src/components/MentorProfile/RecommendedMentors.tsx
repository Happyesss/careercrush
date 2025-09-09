"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "../../ThemeContext";
import { getAllMentors } from "../../Services/MentorService";
import { Mentor } from "../../types/mentor";
import Link from "next/link";
import { IconStar, IconBriefcase, IconMapPin } from "@tabler/icons-react";

const RecommendedMentors = () => {
  const { isDarkMode } = useTheme();
  const params = useParams();
  const currentMentorId = params?.id as string;
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedMentors();
  }, [currentMentorId]);

  const fetchRecommendedMentors = async () => {
    try {
      setLoading(true);
      const data = await getAllMentors();
      // Filter out current mentor and get first 4 recommendations
      const recommended = data
        .filter((mentor: Mentor) => String(mentor.id) !== String(currentMentorId))
        .slice(0, 4);
      setMentors(recommended);
    } catch (error) {
      console.error("Error fetching recommended mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full lg:w-1/4">
        <div className="text-xl font-semibold my-5">Recommended Mentors</div>
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-4 animate-pulse ${
                isDarkMode ? 'bg-cape-cod-800' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <div className={`h-4 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'} rounded mb-2`} />
                  <div className={`h-3 ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'} rounded w-3/4`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/4">
      <div className="text-xl font-semibold my-5">Recommended Mentors</div>
      <div className="flex flex-wrap lg:flex-col gap-4">
        {mentors.map((mentor) => (
          <Link 
            key={mentor.id} 
            href={`/mentor/${mentor.id}`}
            className={`block rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg ${
              isDarkMode 
                ? 'bg-cape-cod-900 hover:bg-cape-cod-800 border border-cape-cod-800' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {mentor.picture ? (
                  <img
                    src={`data:image/png;base64,${mentor.picture}`}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    isDarkMode ? 'bg-cape-cod-800 text-blue-400' : 'bg-gray-200 text-blue-600'
                  }`}>
                    {mentor.name?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                )}
                {mentor.isAvailable && (
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white -mt-3 ml-9" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">{mentor.name}</h4>
                <p className={`text-xs mb-1 truncate ${
                  isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'
                }`}>
                  {mentor.jobTitle}
                </p>
                <p className={`text-xs mb-2 truncate ${
                  isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'
                }`}>
                  {mentor.company}
                </p>

                {/* Quick stats */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <IconStar size={12} className="text-yellow-500" />
                    <span>{mentor.rating || "4.8"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconBriefcase size={12} className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} />
                    <span className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                      {mentor.totalExp || 0}+ yrs
                    </span>
                  </div>
                </div>

                {/* Skills preview */}
                {mentor.skills && mentor.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mentor.skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          isDarkMode 
                            ? 'bg-cape-cod-800 text-blue-300' 
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 2 && (
                      <span className={`text-xs ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                        +{mentor.skills.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View all mentors link */}
      <Link 
        href="/find-mentors"
        className={`block mt-4 p-3 text-center text-sm font-medium rounded-lg transition-colors ${
          isDarkMode 
            ? 'bg-cape-cod-800 hover:bg-cape-cod-700 text-blue-400' 
            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        }`}
      >
        View All Mentors
      </Link>
    </div>
  );
};

export default RecommendedMentors;
