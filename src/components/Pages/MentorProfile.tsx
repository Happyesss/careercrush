"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Button, Text, Rating, Tabs, Modal, TextInput, Textarea, Select, Group } from "@mantine/core";
import { IconMapPin, IconCalendar, IconTrophy, IconUser, IconStar, IconClock, IconMail, IconPhone, IconWorld } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";
import { getMentor, requestMentorshipSession } from "../../Services/MentorService";
import { useSelector } from "react-redux";
import { Mentor } from "../../types/mentor";
import SocialLink from "../common/SocialLink";

const MentorProfile = () => {
  const { isDarkMode } = useTheme();
  const params = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state: any) => state.user);
  
  const [requestForm, setRequestForm] = useState({
    menteeName: "",
    menteeEmail: "",
    menteePhone: "",
    menteeBackground: "",
    requestMessage: "",
    goals: "",
    preferredTime: "",
    sessionType: "one-time"
  });

  useEffect(() => {
    if (params.id) {
      fetchMentor();
    }
  }, [params.id]);

  const fetchMentor = async () => {
    try {
      setLoading(true);
      const data = await getMentor(params.id);
      console.log("Fetched mentor data:", data); // Debug log
      console.log("Mentor experiences:", data.experiences); // Debug experiences
      console.log("Mentor certifications:", data.certifications); // Debug certifications
      setMentor(data);
    } catch (error) {
      console.error("Error fetching mentor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async () => {
    try {
      await requestMentorshipSession(params.id, requestForm);
      setRequestModalOpen(false);
      setRequestForm({
        menteeName: "",
        menteeEmail: "",
        menteePhone: "",
        menteeBackground: "",
        requestMessage: "",
        goals: "",
        preferredTime: "",
        sessionType: "one-time"
      });
      alert("Mentorship request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950' : 'bg-cape-cod-10'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-white' : 'bg-cape-cod-10 text-black'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mentor not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'} font-['poppins']`}>
  <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
            {mentor.profileBackground && (
              <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <img
                  src={`data:image/png;base64,${mentor.profileBackground}`}
                  alt="Profile background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:items-start">
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
                    
                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <Button
                        size="lg"
                        disabled={!mentor.isAvailable || mentor.currentMentees >= mentor.maxMentees}
                        onClick={() => setRequestModalOpen(true)}
                        className="w-full"
                      >
                        {mentor.isAvailable ? "Request Mentorship" : "Currently Unavailable"}
                      </Button>
                      
                      <div className="text-center">
                        <Text className={`font-bold text-lg ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
                          {mentor.hourlyRate ? `₹${mentor.hourlyRate}/hour` : "Rate not specified"}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="xl:w-2/3 w-full">
                  <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "overview")}>
                    <Tabs.List className="overflow-x-auto">
                      <Tabs.Tab value="overview">Overview</Tabs.Tab>
                      <Tabs.Tab value="experience">Experience</Tabs.Tab>
                      <Tabs.Tab value="skills">Skills</Tabs.Tab>
                      <Tabs.Tab value="certifications">Certifications</Tabs.Tab>
                      <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
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
                                  <h4 className="font-semibold text-lg">{exp.title}</h4>
                                  <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                                    {exp.company} {exp.location && `• ${exp.location}`}
                                  </p>
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
                                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                                  <p className={`${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} font-medium`}>
                                    {cert.issuer}
                                  </p>
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
                    
                    <Tabs.Panel value="reviews" pt="md" className="min-h-[320px] md:min-h-[420px]">
                      <div className="text-center py-8">
                        <Text className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
                          Reviews feature coming soon...
                        </Text>
                      </div>
                    </Tabs.Panel>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal
        opened={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Mentorship Session"
        size="lg"
      >
        <div className="space-y-4">
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            value={requestForm.menteeName}
            onChange={(e) => setRequestForm({...requestForm, menteeName: e.target.value})}
            required
          />
          
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={requestForm.menteeEmail}
            onChange={(e) => setRequestForm({...requestForm, menteeEmail: e.target.value})}
            required
          />
          
          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={requestForm.menteePhone}
            onChange={(e) => setRequestForm({...requestForm, menteePhone: e.target.value})}
          />
          
          <Textarea
            label="Your Background"
            placeholder="Tell us about your current role and experience"
            value={requestForm.menteeBackground}
            onChange={(e) => setRequestForm({...requestForm, menteeBackground: e.target.value})}
            rows={3}
          />
          
          <Textarea
            label="Message to Mentor"
            placeholder="Why do you want to work with this mentor?"
            value={requestForm.requestMessage}
            onChange={(e) => setRequestForm({...requestForm, requestMessage: e.target.value})}
            rows={3}
            required
          />
          
          <Textarea
            label="Your Goals"
            placeholder="What do you hope to achieve through mentorship?"
            value={requestForm.goals}
            onChange={(e) => setRequestForm({...requestForm, goals: e.target.value})}
            rows={3}
          />
          
          <TextInput
            label="Preferred Time"
            placeholder="When would you like to have sessions?"
            value={requestForm.preferredTime}
            onChange={(e) => setRequestForm({...requestForm, preferredTime: e.target.value})}
          />
          
          <Select
            label="Session Type"
            value={requestForm.sessionType}
            onChange={(value) => setRequestForm({...requestForm, sessionType: value || "one-time"})}
            data={[
              { value: "one-time", label: "One-time Session" },
              { value: "ongoing", label: "Ongoing Mentorship" },
              { value: "project-based", label: "Project-based" }
            ]}
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestMentorship}>
              Send Request
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default MentorProfile;