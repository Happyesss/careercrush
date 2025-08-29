"use client";

import { Button, Modal, Text, TextInput, MultiSelect, Group } from "@mantine/core";
import { IconEdit, IconLock, IconTarget, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail, createMentor, updateMentor } from "../../Services/MentorService";
import { successNotification, errorNotification } from "../../Services/NotificationService";
import { Divider } from "@mantine/core";

const MentorSetup = () => {
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
    bio: "",
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
          bio: profile.about || "",
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
          profileBackground: profile.profileBackground || "",
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
          profileBackground: profile.profileBackground || "",
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
      if (mentor) {
        const updatedMentor = await updateMentor({ ...mentorForm, id: mentor.id });
        setMentor(updatedMentor);
        successNotification("Mentor profile updated successfully", "Success");
      } else {
        const newMentor = await createMentor(mentorForm);
        setMentor(newMentor);
        successNotification("Mentor profile created successfully", "Success");
      }
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error saving mentor profile:", error);
      errorNotification("Failed to save mentor profile", "Error");
    }
  };

  return (
    <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <Text size="xl" fw={700} className={isDarkMode ? 'text-white' : 'text-black'}>
          Mentor Profile Setup
        </Text>
        <Button 
          leftSection={<IconEdit size={16} />} 
          onClick={handleEditClick}
          variant="outline"
          disabled={!isProfileComplete}
        >
          {mentor ? 'Edit' : 'Setup'} Profile
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
        <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
          <Text size="lg" mb="md" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
            Set up your mentor profile to start helping others
          </Text>
          <Button onClick={handleEditClick} size="lg">
            Create Mentor Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
            <Text size="lg" fw={600} mb={2}>✅ Mentor Profile Active</Text>
            <Text size="sm" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
              Your mentor profile is set up and ready. Use the edit button to make changes.
            </Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
              <Text size="sm" fw={600}>Expertise</Text>
              <Text size="sm" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                {mentor.expertise || "Not specified"}
              </Text>
            </div>
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

export default MentorSetup;