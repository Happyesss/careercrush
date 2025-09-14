"use client";

import { Text } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";
import SocialLink from "../common/SocialLink";

interface MentorProfileTabsProps {
  mentor: Mentor;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mentorshipPackages?: any[];
  packageLoading?: boolean;
}

const MentorProfileTabs = ({ mentor, activeTab, setActiveTab, mentorshipPackages = [], packageLoading = false }: MentorProfileTabsProps) => {
  const { isDarkMode } = useTheme();

  const tabs = [
    { id: 'overview', label: 'All', icon: '📊' },
    { id: 'experience', label: '1:1 Call', icon: '💼' },
    { id: 'skills', label: 'Query', icon: '🔧' },
    { id: 'certifications', label: 'Resources', icon: '🏆' }
  ];

  return (
    <div className="p-1 tracking-tight">
      {/* Modern Tab Navigation */}
      <div
  className={`py-2 px-2 shadow-sm border border-gray-200 dark:border-none gap-2 rounded-full w-fit ${isDarkMode ? 'bg-third' : 'bg-white'} mb-6`}
>
  <div className="flex items-center gap-1 ">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`
          px-4 py-1.5 text-xs sm:px-6 sm:py-2.5 rounded-full sm:text-sm font-medium transition-all duration-200
          ${
            activeTab === tab.id
              ? `${isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'}  shadow-sm`
              : `${
                  isDarkMode
                    ? 'hover:text-white hover:bg-primary'
                    : 'hover:text-white hover:bg-primary'
                } hover:bg-white/50`
          }
        `}
      >
        <span className="flex items-center gap-2 ">{tab.label}</span>
      </button>
    ))}
  </div>
</div>

      {/* Tab Content */}
      <div className="min-h-[320px] md:min-h-[420px] px-2">
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div >
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>About</h3>
              <Text className={`!text-[14px] font-normal tracking-normal ${isDarkMode ? 'text-gray-300' : 'text-[#8489a4]'}`}>
                {mentor.bio || mentor.about}
              </Text>
            </div>
            
            <div >
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Mentorship Areas</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorshipAreas?.map((area, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1.5 rounded-md tracking-normal text-xs font-normal ${
                      isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'
                    }`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            
            {/* <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Session Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text className={`font-medium tracking-normal !mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Preferred Method</Text>
                  <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-normal text-xs `}>
                    {mentor.sessionPreference}
                  </Text>
                </div>
                <div>
                  <Text className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Available Days</Text>
                  <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {Array.isArray(mentor.availableDays) ? mentor.availableDays.join(", ") : mentor.availableDays}
                  </Text>
                </div>
              </div>
            </div>
             */}
            <div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>Languages</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.languages?.map((language, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links in Overview */}
            {(mentor.linkedinUrl || mentor.portfolioUrl) && (
  <div>
    <h3
      className={`text-lg font-semibold mb-3 ${
        isDarkMode ? 'text-white' : 'text-black'
      }`}
    >
      Connect & Portfolio
    </h3>

    <div className="flex flex-wrap gap-3">
      {mentor.linkedinUrl && (
        <a
          href={mentor.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md  text-black bg-primary text-white  text-sm font-medium hover:opacity-90 transition"
        >
          LinkedIn
        </a>
      )}

      {mentor.portfolioUrl && (
        <a
          href={mentor.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md  text-sm font-medium bg-primary text-white "
        >
          Portfolio
        </a>
      )}
    </div>
  </div>
)}

          </div>
        )}
        
        {activeTab === "experience" && (
          <div className="space-y-4">
            {mentor.experiences && mentor.experiences.length > 0 ? (
              mentor.experiences.map((exp, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-secondary' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {exp.companyLogo && (
                          <div className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <img 
                              className="h-8 w-8 object-cover rounded" 
                              src={`data:image/jpeg;base64,${exp.companyLogo}`} 
                              alt={`${exp.company} logo`} 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{exp.title}</h4>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {exp.startDate && exp.endDate 
                          ? `${new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - ${exp.working ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`
                          : 'Duration not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No experience information available
                </Text>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "skills" && (
          <div className="flex flex-wrap gap-3">
            {mentor.skills && mentor.skills.length > 0 ? (
              mentor.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'
                  }`}
                >
                  {skill}
                </span>
              ))
            ) : (
              <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No skills listed
              </Text>
            )}
          </div>
        )}
        
        {activeTab === "certifications" && (
          <div className="space-y-4">
            {mentor.certifications && mentor.certifications.length > 0 ? (
              mentor.certifications.map((cert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-secondary' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {cert.certificateImage && (
                          <div className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <img 
                              className="h-8 w-8 object-cover rounded" 
                              src={`data:image/jpeg;base64,${cert.certificateImage}`} 
                              alt={`${cert.name} certificate`} 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>{cert.name}</h4>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {cert.issueDate 
                          ? new Date(cert.issueDate).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                          : 'Issue date not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {cert.certificateID && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Certificate ID: {cert.certificateID}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No certifications available
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorProfileTabs;