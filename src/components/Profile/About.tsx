import { ActionIcon, Textarea } from "@mantine/core";
import { IconCancel, IconDeviceFloppy, IconPencil, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useTheme } from "../../ThemeContext";

const About = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const [about, setAbout] = useState("");
  const [edit, setEdit] = useState(false);
  const { isDarkMode } = useTheme();

  const handleEdit = () => {
    if (!edit) {
      setEdit(true);
      setAbout(profile.about || "");
    } else {
      setEdit(false);
    }
  };

  const handleSave = () => {
    setEdit(false);
    let updatedProfile = { ...profile, about: about };
    dispatch(changeProfile(updatedProfile));
    successNotification("About section updated successfully", "Success");
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
            <IconUser className="h-5 w-5 text-primary" stroke={1.5} />
          </div>
          <h2 className={`text-xl md:text-2xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About Me
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
          <Textarea
            value={about}
            placeholder="Tell us about yourself, your background, interests, and what makes you unique..."
            autosize
            minRows={4}
            maxRows={8}
            size="md"
            radius="md"
            onChange={(event) => setAbout(event.currentTarget.value)}
            styles={() => ({
              input: {
                backgroundColor: isDarkMode ? "var(--color-third)" : "white",
                color: isDarkMode ? "white" : "black",
                borderColor: isDarkMode ? "#374151" : "#d1d5db",
                border: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                lineHeight: "1.6",
                transition: "all 0.2s ease",
                "&:focus": {
                  borderColor: "var(--color-primary)",
                  boxShadow: `0 0 0 3px ${isDarkMode ? "rgba(252, 116, 62, 0.1)" : "rgba(252, 116, 62, 0.1)"}`,
                },
              },
            })}
          />
        ) : (
          <div className={`text-sm md:text-base leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {profile.about ? (
              <p className="whitespace-pre-wrap">{profile.about}</p>
            ) : (
              <div className={`italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Add a brief description about yourself to help others get to know you better.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;