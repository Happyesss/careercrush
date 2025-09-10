"use client";

import { Badge, Text, Tabs } from "@mantine/core";
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

  return (
  <div className="w-full">
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "overview")}>
        <Tabs.List className="overflow-x-auto">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="experience">Experience</Tabs.Tab>
          <Tabs.Tab value="skills">Skills</Tabs.Tab>
          <Tabs.Tab value="certifications">Certifications</Tabs.Tab>
        </Tabs.List>
      
        <Tabs.Panel value="overview" pt="md" className="min-h-[320px] md:min-h-[420px]">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <Text className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
                {mentor.bio || mentor.about}
              </Text>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Mentorship Areas</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.mentorshipAreas?.map((area, index) => (
                  <Badge key={index} size="lg" variant="light" color="blue">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Session Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="font-medium mb-1">Preferred Method</Text>
                  <Text className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
                    {mentor.sessionPreference}
                  </Text>
                </div>
                <div>
                  <Text className="font-medium mb-1">Available Days</Text>
                  <Text className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>
                    {Array.isArray(mentor.availableDays) ? mentor.availableDays.join(", ") : mentor.availableDays}
                  </Text>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.languages?.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Social Links in Overview */}
            {(mentor.linkedinUrl || mentor.portfolioUrl) && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Connect & Portfolio</h3>
                <div className="flex flex-wrap gap-3">
                  {mentor.linkedinUrl && (
                    <SocialLink 
                      url={mentor.linkedinUrl} 
                      type="linkedin"
                    />
                  )}
                  {mentor.portfolioUrl && (
                    <SocialLink 
                      url={mentor.portfolioUrl} 
                      type="portfolio"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs.Panel>
        
        <Tabs.Panel value="experience" pt="md" className="min-h-[320px] md:min-h-[420px]">
          <div className="space-y-4">
            {mentor.experiences && mentor.experiences.length > 0 ? (
              mentor.experiences.map((exp, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {exp.companyLogo && (
                          <div className={`p-2 rounded-md ${isDarkMode ? 'bg-cape-cod-700' : 'bg-white'}`}>
                            <img 
                              className="h-8 w-8 object-cover rounded" 
                              src={`data:image/jpeg;base64,${exp.companyLogo}`} 
                              alt={`${exp.company} logo`} 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{exp.title}</h4>
                          <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                        {exp.startDate && exp.endDate 
                          ? `${new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - ${exp.working ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`
                          : 'Duration not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className={`mt-2 ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                  No experience information available
                </Text>
              </div>
            )}
          </div>
        </Tabs.Panel>
        
        <Tabs.Panel value="skills" pt="md" className="min-h-[320px] md:min-h-[420px]">
          <div className="flex flex-wrap gap-3">
            {mentor.skills && mentor.skills.length > 0 ? (
              mentor.skills.map((skill, index) => (
                <Badge key={index} size="lg" variant="filled" color="blue">
                  {skill}
                </Badge>
              ))
            ) : (
              <Text className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                No skills listed
              </Text>
            )}
          </div>
        </Tabs.Panel>
        
        <Tabs.Panel value="certifications" pt="md" className="min-h-[320px] md:min-h-[420px]">
          <div className="space-y-4">
            {mentor.certifications && mentor.certifications.length > 0 ? (
              mentor.certifications.map((cert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {cert.certificateImage && (
                          <div className={`p-2 rounded-md ${isDarkMode ? 'bg-cape-cod-700' : 'bg-white'}`}>
                            <img 
                              className="h-8 w-8 object-cover rounded" 
                              src={`data:image/jpeg;base64,${cert.certificateImage}`} 
                              alt={`${cert.name} certificate`} 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-lg">{cert.name}</h4>
                          <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                        {cert.issueDate 
                          ? new Date(cert.issueDate).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                          : 'Issue date not specified'
                        }
                      </p>
                    </div>
                  </div>
                  {cert.certificateID && (
                    <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                      Certificate ID: {cert.certificateID}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                  No certifications available
                </Text>
              </div>
            )}
          </div>
        </Tabs.Panel>
        
  {/* Reviews tab removed as per requirement */}
      </Tabs>
    </div>
  );
};

export default MentorProfileTabs;