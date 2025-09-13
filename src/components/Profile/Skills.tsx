import { useState } from "react";
import { successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { ActionIcon, TagsInput } from "@mantine/core";
import { IconCancel, IconDeviceFloppy, IconPencil, IconTool } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";

const Skills = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const [skills, setSkills] = useState<string[]>([]);
  const [edit, setEdit] = useState(false);
  const { isDarkMode } = useTheme();

  const handleEdit = () => {
    if (!edit) {
      setEdit(true);
      setSkills(Array.isArray(profile.skills) ? [...profile.skills] : []);
    } else {
      setEdit(false);
    }
  };

  const handleSave = () => {
    setEdit(false);
    const updatedProfile = { ...profile, skills: [...skills] };
    dispatch(changeProfile(updatedProfile));
    successNotification("Skills updated successfully", "Success");
  };

  const handleSkillsChange = (updatedSkills: string[]) => {
    setSkills([...updatedSkills]); 
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
            <IconTool className="h-5 w-5 text-green-600" stroke={1.5} />
          </div>
          <h2 className={`text-xl md:text-2xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Skills & Technologies
          </h2>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {edit && (
            <ActionIcon 
              variant="subtle" 
              radius="lg" 
              color="blue.4" 
              size="lg" 
              onClick={handleSave}
              className={`transition-all duration-200 hover:scale-110 ${
                isDarkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50'
              }`}
            >
              <IconDeviceFloppy className="h-4 w-4" />
            </ActionIcon>
          )}
          <ActionIcon 
            variant="subtle" 
            radius="lg" 
            color={edit ? "red.8" : "blue.4"} 
            size="lg" 
            onClick={handleEdit}
            className={`transition-all duration-200 hover:scale-110 ${
              edit 
                ? (isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50')
                : (isDarkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50')
            }`}
          >
            {edit ? (
              <IconCancel className="h-4 w-4" />
            ) : (
              <IconPencil className="h-4 w-4" stroke={1.5} />
            )}
          </ActionIcon>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {edit ? (
          <TagsInput
            value={skills}
            onChange={handleSkillsChange}
            placeholder="Add your skills (e.g., JavaScript, React, Python...)"
            splitChars={[",", " ", "|"]}
            size="md"
            radius="md"
            styles={() => ({
              input: {
                backgroundColor: isDarkMode ? "var(--color-third)" : "white",
                color: isDarkMode ? "white" : "black",
                borderColor: isDarkMode ? "#374151" : "#d1d5db",
                border: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "12px",
                padding: "12px 16px",
                minHeight: "48px",
                transition: "all 0.2s ease",
                "&:focus": {
                  borderColor: "var(--color-primary)",
                  boxShadow: `0 0 0 3px ${isDarkMode ? "rgba(252, 116, 62, 0.1)" : "rgba(252, 116, 62, 0.1)"}`,
                },
              },
              pill: {
                backgroundColor: isDarkMode ? "var(--color-primary)" : "var(--color-primary)",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "500",
              },
            })}
          />
        ) : (
          <div>
            {profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill: string, index: number) => (
                  <div
                    key={index}
                    className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-primary/20 text-primary-light border border-primary/30' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`italic text-center py-8 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Add your skills to showcase your expertise to potential employers and mentors.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;