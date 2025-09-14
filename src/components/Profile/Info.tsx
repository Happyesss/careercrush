import { ActionIcon, NumberInput, TextInput } from "@mantine/core";
import { IconBriefcase, IconCancel, IconDeviceFloppy, IconMapPin, IconPencil, IconTie } from "@tabler/icons-react";
import SelectInput from "./SelectInput";
import fields from "../../assets/Data/Profile";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { successNotification } from "../../Services/NotificationService";
import { useTheme } from "../../ThemeContext";

const Info = () => {
  const select = fields;
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [edit, setEdit] = useState(false);
  const profile = useSelector((state: any) => state.profile);
  const { isDarkMode } = useTheme();

  const form = useForm({
    mode: "controlled",
    initialValues: { name: "", jobTitle: "", company: "", location: "", totalExp: 0 },
    validate: {
      name: (value: string) => (value.trim().length === 0 ? "Name cannot be empty" : null),
    },
  });
  

  const handleEdit = () => {
    if (!edit) {
      setEdit(true);
      form.setValues({
        name: profile.name,
        jobTitle: profile.jobTitle,
        company: profile.company,
        location: profile.location,
        totalExp: profile.totalExp,
      });
    } else {
      setEdit(false);
    }
  };

  const handleSave = () => {
    if (form.validate().hasErrors) return; // Stop saving if validation fails

    setEdit(false);
    const updatedProfile = { ...profile, ...form.getValues() };
    dispatch(changeProfile(updatedProfile));
    successNotification("Profile Updated Successfully", "Success");
  };

  return (
    <div className="px-4 pt-2 pb-1">
      {/* Name and Edit Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex-1">
          {edit ? (
            <TextInput
              withAsterisk
              placeholder="Enter Your Name"
              {...form.getInputProps("name")}
              error={form.errors.name}
              size="lg"
              className="text-2xl md:text-3xl font-semibold"
              styles={() => ({
                input: {
                  backgroundColor: isDarkMode ? "var(--color-third)" : "white",
                  color: isDarkMode ? "white" : "black",
                  borderColor: isDarkMode ? "#374151" : "#d1d5db",
                  fontSize: "1.875rem",
                  fontWeight: "600",
                  border: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  transition: "all 0.2s ease",
                  "&:focus": {
                    borderColor: "var(--color-primary)",
                    boxShadow: `0 0 0 3px ${isDarkMode ? "rgba(252, 116, 62, 0.1)" : "rgba(252, 116, 62, 0.1)"}`,
                  },
                },
              })}
            />
          ) : (
            <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {profile.name || 'Your Name'}
            </h1>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {edit && (
            <ActionIcon 
              variant="subtle" 
              radius="lg" 
              color="blue.4" 
              size="xl" 
              onClick={handleSave}
              className={`transition-all duration-200 hover:scale-110 ${
                isDarkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50'
              }`}
            >
              <IconDeviceFloppy className="h-5 w-5" />
            </ActionIcon>
          )}
          <ActionIcon 
            variant="subtle" 
            radius="lg" 
            color={edit ? "red.8" : "orange.4"} 
            size="xl" 
            onClick={handleEdit}
            className={`transition-all duration-200 hover:scale-110 ${
              edit 
                ? (isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50')
                : (isDarkMode ? 'hover:bg-orange-500/10' : 'hover:bg-orange-50')
            }`}
          >
            {edit ? (
              <IconCancel className="h-5 w-5" />
            ) : (
              <IconPencil className="h-5 w-5" stroke={1.5} />
            )}
          </ActionIcon>
        </div>
      </div>

      {/* Profile Information */}
      {edit ? (
        <div className="space-y-4">
          {user.accountType !== 'COMPANY' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${
                  isDarkMode
                    ? "text-gray-100 [&_input]:bg-third [&_input]:text-gray-100 [&_input]:border-gray-600"
                    : "text-gray-900 [&_input]:text-gray-900 [&_input]:border-gray-300"
                }`}>
                  <SelectInput form={form} name="jobTitle" {...select[0]} />
                </div>
                <div className={`${
                  isDarkMode
                    ? "text-gray-100 [&_input]:bg-third [&_input]:text-gray-100 [&_input]:border-gray-600"
                    : "text-gray-900 [&_input]:text-gray-900 [&_input]:border-gray-300"
                }`}>
                  <SelectInput form={form} name="company" {...select[1]} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${
                  isDarkMode
                    ? "text-gray-100 [&_input]:bg-third [&_input]:text-gray-100 [&_input]:border-gray-600"
                    : "text-gray-900 [&_input]:text-gray-900 [&_input]:border-gray-300"
                }`}>
                  <SelectInput form={form} name="location" {...select[2]} />
                </div>
                <NumberInput
                  withAsterisk
                  label="Experience (Years)"
                  placeholder="Years of experience"
                  hideControls
                  clampBehavior="strict"
                  min={0}
                  max={50}
                  size="md"
                  radius="md"
                  {...form.getInputProps("totalExp")}
                  styles={() => ({
                    input: {
                      backgroundColor: isDarkMode ? "var(--color-third)" : "white",
                      color: isDarkMode ? "white" : "black",
                      borderColor: isDarkMode ? "#374151" : "#d1d5db",
                      border: `1px solid ${isDarkMode ? "#374151" : "#d1d5db"}`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                      transition: "all 0.2s ease",
                      "&:focus": {
                        borderColor: "var(--color-primary)",
                        boxShadow: `0 0 0 2px ${isDarkMode ? "rgba(252, 116, 62, 0.1)" : "rgba(252, 116, 62, 0.1)"}`,
                      },
                    },
                    label: {
                      color: isDarkMode ? "#f3f4f6" : "#374151",
                      fontWeight: "500",
                      marginBottom: "6px",
                    },
                  })}
                />
              </div>
            </>
          )}
          
          {user.accountType === 'COMPANY' && (
            <div className={`${
              isDarkMode
                ? "text-gray-100 [&_input]:bg-third [&_input]:text-gray-100 [&_input]:border-gray-600"
                : "text-gray-900 [&_input]:text-gray-900 [&_input]:border-gray-300"
            }`}>
              <SelectInput form={form} name="location" {...select[2]} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {user.accountType !== 'COMPANY' && (
            <>
              {(profile.jobTitle || profile.company) && (
                <div className={`flex gap-2 items-center text-lg md:text-xl ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <IconTie className="h-5 w-5 text-primary" stroke={1.5} />
                  <span className="font-medium">
                    {profile.jobTitle && profile.company 
                      ? `${profile.jobTitle} • ${profile.company}`
                      : profile.jobTitle || profile.company || 'Add your job title and company'
                    }
                  </span>
                </div>
              )}
              
              {profile.location && (
                <div className={`flex gap-2 items-center text-base md:text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <IconMapPin className="h-5 w-5 text-primary" stroke={1.5} />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.totalExp !== undefined && profile.totalExp > 0 && (
                <div className={`flex gap-2 items-center text-base md:text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <IconBriefcase className="h-5 w-5 text-primary" stroke={1.5} />
                  <span>{profile.totalExp} {profile.totalExp === 1 ? 'year' : 'years'} of experience</span>
                </div>
              )}
            </>
          )}
          
          {user.accountType === 'COMPANY' && profile.location && (
            <div className={`flex gap-2 items-center text-base md:text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <IconMapPin className="h-5 w-5 text-primary" stroke={1.5} />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Info;
