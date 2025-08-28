"use client";

import { Button, Modal, Text, TextInput, Textarea, MultiSelect, Group, Switch, Badge } from "@mantine/core";
import { IconEdit, IconClock, IconUsers, IconStar, IconMapPin, IconLock, IconTarget, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail, createMentor, updateMentor, updateMentorAvailability } from "../../Services/MentorService";
import { successNotification, errorNotification } from "../../Services/NotificationService";

const MentorInfo = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Check if main profile is complete
  const isProfileComplete = profile?.name && profile?.jobTitle && profile?.company && profile?.location && profile?.about;

  const [mentorForm, setMentorForm] = useState({
    name: "",
    email: "",
    jobTitle: "",
    company: "",
    location: "",
    expertise: "",
    hourlyRate: 0,
    bio: "",
    // Add profile sync fields
    picture: "",
    skills: [] as string[],
    experiences: [] as any[],
    certifications: [] as any[],
    totalExp: 0,
    mentorshipAreas: [] as string[],
    linkedinUrl: "",
    portfolioUrl: "",
    languages: [] as string[],
    timezone: "",
    availableDays: [] as string[],
    sessionPreference: "",
  });

  useEffect(() => {
    fetchMentorData();
  }, [user, profile]);

  // Auto-sync mentor profile when profile data changes
  useEffect(() => {
    if (mentor && profile) {
      const syncMentorWithProfile = async () => {
        try {
          const updatedMentorData = {
            ...mentor,
            name: profile.name || user.name || mentor.name,
            jobTitle: profile.jobTitle || mentor.jobTitle,
            company: profile.company || mentor.company,
            location: profile.location || mentor.location,
            bio: profile.about || mentor.bio,
            picture: profile.picture || mentor.picture || "",
            skills: profile.skills || mentor.skills || [],
            totalExp: profile.totalExp || mentor.totalExp || 0,
            // Add experiences and certifications sync
            experiences: profile.experiences || mentor.experiences || [],
            certifications: profile.certifications || mentor.certifications || [],
          };
          
          // Only update if there are actual changes
          const hasChanges = 
            mentor.picture !== updatedMentorData.picture ||
            JSON.stringify(mentor.skills) !== JSON.stringify(updatedMentorData.skills) ||
            JSON.stringify(mentor.experiences) !== JSON.stringify(updatedMentorData.experiences) ||
            JSON.stringify(mentor.certifications) !== JSON.stringify(updatedMentorData.certifications) ||
            mentor.totalExp !== updatedMentorData.totalExp ||
            mentor.name !== updatedMentorData.name ||
            mentor.jobTitle !== updatedMentorData.jobTitle ||
            mentor.company !== updatedMentorData.company ||
            mentor.location !== updatedMentorData.location ||
            mentor.bio !== updatedMentorData.bio;
            
          if (hasChanges) {
            await updateMentor(updatedMentorData);
            setMentor(updatedMentorData);
            console.log("Mentor profile auto-synced with main profile (including experiences and certifications)");
          }
        } catch (error) {
          console.error("Error auto-syncing mentor profile:", error);
        }
      };
      
      syncMentorWithProfile();
    }
  }, [profile.picture, profile.skills, profile.experiences, profile.certifications, profile.totalExp, profile.name, profile.jobTitle, profile.company, profile.location, profile.about]);

  const fetchMentorData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const data = await getMentorByEmail(user.email);
      if (data) {
        setMentor(data);
        setMentorForm({
          name: profile.name || user.name || "",
          email: user.email || "",
          jobTitle: profile.jobTitle || "",
          company: profile.company || "",
          location: profile.location || "",
          expertise: data.expertise || "",
          hourlyRate: data.hourlyRate || 0,
          bio: profile.about || "",
          // Sync these fields from profile
          picture: profile.picture || data.picture || "",
          skills: profile.skills || data.skills || [],
          experiences: profile.experiences || data.experiences || [],
          certifications: profile.certifications || data.certifications || [],
          totalExp: profile.totalExp || data.totalExp || 0,
          mentorshipAreas: data.mentorshipAreas || [],
          linkedinUrl: data.linkedinUrl || "",
          portfolioUrl: data.portfolioUrl || "",
          languages: data.languages || [],
          timezone: data.timezone || "",
          availableDays: Array.isArray(data.availableDays) ? data.availableDays : [],
          sessionPreference: data.sessionPreference || "",
        });
      } else {
        // Pre-populate with user and profile data if no mentor profile exists
        setMentorForm(prev => ({
          ...prev,
          name: profile.name || user.name || "",
          email: user.email || "",
          jobTitle: profile.jobTitle || "",
          company: profile.company || "",
          location: profile.location || "",
          bio: profile.about || "",
          // Sync profile data
          picture: profile.picture || "",
          skills: profile.skills || [],
          experiences: profile.experiences || [],
          certifications: profile.certifications || [],
          totalExp: profile.totalExp || 0,
        }));
      }
    } catch (error: any) {
      // Handle 404 (mentor not found) as normal case
      if (error.response?.status === 404) {
        console.log("No mentor profile found - this is normal for new mentors");
        setMentor(null);
        // Pre-populate with user and profile data
        setMentorForm(prev => ({
          ...prev,
          name: profile.name || user.name || "",
          email: user.email || "",
          jobTitle: profile.jobTitle || "",
          company: profile.company || "",
          location: profile.location || "",
          bio: profile.about || "",
          // Sync profile data
          picture: profile.picture || "",
          skills: profile.skills || [],
          experiences: profile.experiences || [],
          certifications: profile.certifications || [],
          totalExp: profile.totalExp || 0,
        }));
      } else {
        console.error("Error fetching mentor profile:", error);
        errorNotification("Failed to load mentor profile", "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!isProfileComplete) {
      errorNotification("Please complete your main profile first", "Profile Incomplete");
      return;
    }
    setEditModalOpen(true);
  };

  const handleSaveMentorProfile = async () => {
    try {
      // Merge mentor form data with profile data to ensure sync
      const mentorDataToSave = {
        ...mentorForm,
        // Always sync these fields from the main profile
        name: profile.name || user.name || mentorForm.name,
        email: user.email || mentorForm.email,
        jobTitle: profile.jobTitle || mentorForm.jobTitle,
        company: profile.company || mentorForm.company,
        location: profile.location || mentorForm.location,
        bio: profile.about || mentorForm.bio,
        picture: profile.picture || "",
        skills: profile.skills || [],
        experiences: profile.experiences || [],
        certifications: profile.certifications || [],
        totalExp: profile.totalExp || 0,
      };

      if (mentor) {
        const updatedMentor = await updateMentor({ ...mentorDataToSave, id: mentor.id });
        setMentor(updatedMentor);
        successNotification("Mentor profile updated successfully", "Success");
      } else {
        const newMentor = await createMentor(mentorDataToSave);
        setMentor(newMentor);
        successNotification("Mentor profile created successfully", "Success");
      }
      setEditModalOpen(false);
      await fetchMentorData(); // Refresh data
    } catch (error) {
      console.error("Error saving mentor profile:", error);
      errorNotification("Failed to save mentor profile", "Error");
    }
  };

  const handleAvailabilityToggle = async (isAvailable: boolean) => {
    if (!mentor) return;
    try {
      await updateMentorAvailability(mentor.id, isAvailable);
      setMentor({ ...mentor, isAvailable });
      successNotification(`Availability ${isAvailable ? 'enabled' : 'disabled'}`, "Success");
    } catch (error) {
      console.error("Error updating availability:", error);
      errorNotification("Failed to update availability", "Error");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className={`h-4 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded mb-2`}></div>
        <div className={`h-4 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded w-3/4`}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Text size="xl" fw={700} className={isDarkMode ? 'text-white' : 'text-black'}>
          Mentor Information
        </Text>
        <Button 
          leftSection={<IconEdit size={16} />} 
          onClick={handleEditClick}
          variant="outline"
          disabled={!isProfileComplete}
        >
          {mentor ? 'Edit' : 'Setup'} Mentor Profile
        </Button>
      </div>

      {/* Profile Completion Check */}
      {!isProfileComplete ? (
        <div className={`text-center py-8 rounded-lg border-2 border-dashed ${isDarkMode ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-300'}`}>
          <div className="mb-4">
            <div className="flex justify-center mb-2">
              <IconLock size={48} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
            </div>
            <Text size="lg" fw={600} className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
              Complete Your Profile First
            </Text>
          </div>
          <Text size="sm" className={`mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
            Please fill out your main profile completely before setting up your mentor profile.
          </Text>
          <div className={`text-left max-w-md mx-auto p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <Text size="sm" fw={600} className={`mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
              Required fields:
            </Text>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile?.name ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <Text size="xs" className={isDarkMode ? 'text-red-200' : 'text-red-600'}>
                  Name {profile?.name ? <IconCheck size={12} className="inline text-green-500" /> : '(missing)'}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile?.jobTitle ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <Text size="xs" className={isDarkMode ? 'text-red-200' : 'text-red-600'}>
                  Job Title {profile?.jobTitle ? <IconCheck size={12} className="inline text-green-500" /> : '(missing)'}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile?.company ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <Text size="xs" className={isDarkMode ? 'text-red-200' : 'text-red-600'}>
                  Company {profile?.company ? <IconCheck size={12} className="inline text-green-500" /> : '(missing)'}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile?.location ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <Text size="xs" className={isDarkMode ? 'text-red-200' : 'text-red-600'}>
                  Location {profile?.location ? <IconCheck size={12} className="inline text-green-500" /> : '(missing)'}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile?.about ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <Text size="xs" className={isDarkMode ? 'text-red-200' : 'text-red-600'}>
                  About/Bio {profile?.about ? <IconCheck size={12} className="inline text-green-500" /> : '(missing)'}
                </Text>
              </div>
            </div>
          </div>
        </div>
      ) : !mentor ? (
        <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
          <Text size="lg" mb="md" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
            Set up your mentor profile to start helping others
          </Text>
          <Button onClick={handleEditClick}>
            Create Mentor Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mentor Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <IconUsers size={20} className="text-blue-500" />
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Active Mentees
                  </Text>
                  <Text size="lg" fw={700}>
                    {mentor.currentMentees || 0}
                  </Text>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <IconStar size={20} className="text-yellow-500" />
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Rating
                  </Text>
                  <Text size="lg" fw={700}>
                    4.8
                  </Text>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <IconClock size={20} className="text-green-500" />
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Rate
                  </Text>
                  <Text size="lg" fw={700}>
                    ₹{mentor.hourlyRate || 0}/hr
                  </Text>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${mentor.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-600'}>
                    Status
                  </Text>
                  <Text size="lg" fw={700}>
                    {mentor.isAvailable ? 'Available' : 'Busy'}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Details */}
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Text fw={600} mb={2}>Expertise</Text>
                <Text className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'}>
                  {mentor.expertise || "Not specified"}
                </Text>
              </div>

              <div>
                <Text fw={600} mb={2}>Session Preference</Text>
                <Text className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'}>
                  {mentor.sessionPreference || "Not specified"}
                </Text>
              </div>

              <div>
                <Text fw={600} mb={2}>Timezone</Text>
                <div className="flex items-center gap-2">
                  <IconMapPin size={16} />
                  <Text className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'}>
                    {mentor.timezone || "Not specified"}
                  </Text>
                </div>
              </div>

              <div>
                <Text fw={600} mb={2}>Availability</Text>
                <Switch
                  checked={mentor.isAvailable || false}
                  onChange={(e) => handleAvailabilityToggle(e.currentTarget.checked)}
                  label={mentor.isAvailable ? "Available for mentoring" : "Currently unavailable"}
                />
              </div>
            </div>

            {mentor.bio && (
              <div className="mt-6">
                <Text fw={600} mb={2}>Mentor Bio</Text>
                <Text className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-700'}>
                  {mentor.bio}
                </Text>
              </div>
            )}

            {mentor.mentorshipAreas && mentor.mentorshipAreas.length > 0 && (
              <div className="mt-6">
                <Text fw={600} mb={2}>Mentorship Areas</Text>
                <div className="flex flex-wrap gap-2">
                  {mentor.mentorshipAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="light" color="blue">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {mentor.availableDays && mentor.availableDays.length > 0 && (
              <div className="mt-6">
                <Text fw={600} mb={2}>Available Days</Text>
                <div className="flex flex-wrap gap-2">
                  {mentor.availableDays.map((day: string, index: number) => (
                    <Badge key={index} variant="outline" color="green">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal 
        opened={editModalOpen && isProfileComplete} 
        onClose={() => setEditModalOpen(false)} 
        title={mentor ? "Edit Mentor Profile" : "Create Mentor Profile"} 
        size="xl"
      >
        <div className="space-y-4">
          {/* Only show mentor-specific fields */}
          <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
            <Text size="sm" fw={600} className={`mb-4 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
              <IconTarget size={16} className="inline mr-1" /> Mentor-specific information
            </Text>
            
            <TextInput 
              label="Expertise Area" 
              value={mentorForm.expertise} 
              onChange={(e) => setMentorForm({ ...mentorForm, expertise: e.currentTarget.value })} 
              placeholder="e.g., Full Stack Development, Data Science"
              required
              className="mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <TextInput 
                label="LinkedIn URL" 
                value={mentorForm.linkedinUrl} 
                onChange={(e) => setMentorForm({ ...mentorForm, linkedinUrl: e.currentTarget.value })} 
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <TextInput 
                label="Portfolio URL" 
                value={mentorForm.portfolioUrl} 
                onChange={(e) => setMentorForm({ ...mentorForm, portfolioUrl: e.currentTarget.value })} 
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <TextInput 
                label="Timezone" 
                value={mentorForm.timezone} 
                onChange={(e) => setMentorForm({ ...mentorForm, timezone: e.currentTarget.value })} 
                placeholder="e.g., UTC+5:30" 
              />
              <TextInput 
                label="Session Preference" 
                value={mentorForm.sessionPreference} 
                onChange={(e) => setMentorForm({ ...mentorForm, sessionPreference: e.currentTarget.value })} 
                placeholder="e.g., Video calls, Chat" 
              />
            </div>
          </div>

          <MultiSelect
            label="Mentorship Areas"
            placeholder="Select areas you provide mentorship in"
            value={mentorForm.mentorshipAreas}
            onChange={(value) => setMentorForm({ ...mentorForm, mentorshipAreas: value })}
            data={[
              "Frontend Development", "Backend Development", "Full Stack Development",
              "Data Science", "Machine Learning", "DevOps", "UI/UX Design",
              "Product Management", "Mobile Development", "Cloud Computing",
              "Cybersecurity", "Database Management", "Project Management",
              "Leadership & Management", "Career Development", "Interview Preparation"
            ]}
            searchable
            clearable
          />

          <MultiSelect
            label="Languages Spoken"
            placeholder="Select languages you speak"
            value={mentorForm.languages}
            onChange={(value) => setMentorForm({ ...mentorForm, languages: value })}
            data={["English", "Hindi", "Spanish", "French", "German", "Chinese"]}
            searchable
            clearable
          />

          <MultiSelect
            label="Available Days"
            placeholder="Select days you're available for mentoring"
            value={mentorForm.availableDays}
            onChange={(value) => setMentorForm({ ...mentorForm, availableDays: value })}
            data={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMentorProfile}>
              Save Profile
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default MentorInfo;