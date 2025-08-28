"use client";

import { Card, Grid, Badge } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import SocialLink from "../common/SocialLink";

interface ProfileSummaryProps {
  mentor: any;
}

const ProfileSummary = ({ mentor }: ProfileSummaryProps) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* Mentor Profile Summary */}
      <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
        <p className="text-lg font-semibold mb-4">
          Profile Summary
        </p>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <p className="text-sm font-medium mb-1">Expertise</p>
            <p className={`text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'} mb-4`}>
              {mentor.expertise || "Not specified"}
            </p>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <p className="text-sm font-medium mb-1">Mentorship Areas</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 ? (
                mentor.mentorshipAreas.map((area: string, index: number) => (
                  <Badge key={index} variant="light" color="blue" size="sm">
                    {area}
                  </Badge>
                ))
              ) : (
                <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}`}>
                  No areas specified
                </p>
              )}
            </div>

            <p className="text-sm font-medium mb-1">Availability Status</p>
            <Badge color={mentor.isAvailable ? "green" : "red"} variant="light">
              {mentor.isAvailable ? "Available" : "Busy"}
            </Badge>

            {/* Social Links */}
            {(mentor.linkedinUrl || mentor.portfolioUrl) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Connect & Portfolio</p>
                <div className="flex flex-wrap gap-2">
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
          </Grid.Col>
        </Grid>
      </Card>

      {/* Experience Section */}
      <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
        <p className="text-lg font-semibold mb-4">
          Professional Experience
        </p>
        
        <div className="space-y-4">
          {mentor.experiences && mentor.experiences.length > 0 ? (
            mentor.experiences.map((exp: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    {exp.companyLogo ? (
                      <img 
                        className="w-10 h-10 object-cover rounded" 
                        src={`data:image/jpeg;base64,${exp.companyLogo}`} 
                        alt="Company logo" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {exp.company?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{exp.title || exp.position}</h4>
                      <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                      {exp.startDate && exp.endDate 
                        ? `${new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - ${exp.working ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`
                        : exp.duration || "Duration not specified"
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
              <p className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                No experience information available
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Certifications Section */}
      <Card className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} shadow-md mt-6`}>
        <p className="text-lg font-semibold mb-4">
          Certifications
        </p>
        
        <div className="space-y-4">
          {mentor.certifications && mentor.certifications.length > 0 ? (
            mentor.certifications.map((cert: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg border ${isDarkMode ? 'border-cape-cod-700 bg-cape-cod-800' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3 flex-1">
                    {cert.certificateImage ? (
                      <img 
                        className="w-10 h-10 object-cover rounded" 
                        src={`data:image/jpeg;base64,${cert.certificateImage}`} 
                        alt="Certificate" 
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">
                          {cert.issuer?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{cert.name}</h4>
                      <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                        {cert.issuer}
                      </p>
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
              <p className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
                No certifications available
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default ProfileSummary;