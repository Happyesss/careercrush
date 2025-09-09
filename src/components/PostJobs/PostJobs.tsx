import { Button, NumberInput, TagsInput, Textarea, TextInput, FileInput } from "@mantine/core";
import SelectInput from "./SelectInput";
import TextEditor from "./TextEditor";
import { content, fields } from "../../assets/Data/PostJob";
import { isNotEmpty, useForm, hasLength, matches } from "@mantine/form";
import { getJob, postJob } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";
import { IconBriefcase, IconBuilding, IconCoin, IconFileDescription, IconMapPin, IconPaperclip, IconSend, IconUsers, IconWorld } from "@tabler/icons-react";

const PostJobs = () => {
  const params = useParams();
  const id = params?.id as string;
  const [editorData, setEditorData] = useState(content);
  const user = useSelector((state: any) => state.user);
  const select = fields;
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id !== "0") {
      getJob(id)
        .then((res) => {
          form.setValues(res);
          setEditorData(res.description);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      form.reset(); // function of mantine form to reset the form
      setEditorData(content);
    }
  }, []);

  const form = useForm({
    mode: "controlled",
    validateInputOnChange: true,
    initialValues: {
      jobTitle: "",
      company: "",
      experience: "",
      jobType: "",
      location: "",
      packageOffered: "",
      skillsRequired: [],
      about: "",
      description: content,
      applyUrl: "",
      iconImage: null, // Added iconImage field
    },
    validate: {
      jobTitle: isNotEmpty("Job Title is required"),
      company: isNotEmpty("Company is required"),
      experience: isNotEmpty("Experience is required"),
      jobType: isNotEmpty("Job Type is required"),
      location: isNotEmpty("Location is required"),
      packageOffered: isNotEmpty("Package Offered is required"),
      skillsRequired: isNotEmpty("Skills are required"),
      about: isNotEmpty("About is required"),
      description: isNotEmpty("Description is required"),
      applyUrl: (value: string | null) => {
        if (!value || value.trim() === "") return null; 
        return matches(/^https?:\/\/[^\s$.?#].[^\s]*$/i, "Invalid URL")(value);
      },
      iconImage: (value: File | null) => {
        if (value && value.size > 500 * 1024) { // 500KB limit
          return "Icon Image must be less than 500KB";
        }
        return null;
      },
    },
  });

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]); // Extract Base64 string
        } else {
          reject(new Error("Failed to convert file to Base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handlePost = async () => {
    form.validate();
    if (!form.isValid()) return;

    try {
      const iconBase64 = form.values.iconImage
        ? await toBase64(form.values.iconImage)
        : null;

      const jobData = {
        ...form.getValues(),
        id,
        postedBy: user.id,
        jobStatus: "ACTIVE",
        iconImage: iconBase64, // Include iconImage in the payload
      };

      await postJob(jobData);
      successNotification("Job Posted Successfully", "success");
  router.push(`/posted-job/${id}`);
    } catch (error:any) {
      console.log(error);
      errorNotification(error.response?.data?.errorMessage || "Error occurred", "error");
    }
  };

  const handleDraft = async () => {
    try {
      const iconBase64 = form.values.iconImage
        ? await toBase64(form.values.iconImage)
        : null;

      const jobData = {
        ...form.getValues(),
        id,
        postedBy: user.id,
        jobStatus: "DRAFT",
        iconImage: iconBase64, // Include iconImage in the payload
      };

      await postJob(jobData);
      successNotification("Job Drafted Successfully", "success");
  router.push(`/posted-job/${id}`);
    } catch (error:any) {
      console.log(error);
      errorNotification(error.response?.data?.errorMessage || "Error occurred", "error");
    }
  };

  return (
  <div className={`post-job-root w-2/3 mx-auto bs-mx:w-[92%] sm-mx:w-full sm-mx:px-2 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
      <div className="rounded-xl border border-gray-200 dark:border-none bg-white dark:bg-third p-5 sm-mx:p-4 shadow-sm mb-6 mt-3 sm-mx:mt-2">
        <div className="flex items-start gap-3 mb-5">
          <div className="mt-1 text-primary"><IconSend size={18} /></div>
          <div>
            <div className="text-2xl md:text-xl font-medium tracking-tight text-black dark:text-black">Post Your Job</div>
            <div className="text-sm text-lightBlack tracking-tight">Fill out the form below to post a new position</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-5">
          {/* Job Information Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4 text-black">
              <span className="text-primary"><IconBriefcase size={16} /></span>
              <span className="font-medium tracking-tight">Job Information</span>
            </div>
            
            <div className={`flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:w-full sm-mx:flex-wrap sm-mx:gap-5`}>
              <div className="post-job-input-wrapper mb-3">
                <SelectInput form={form} name="jobTitle" {...select[0]} />
              </div>
              <div className="post-job-input-wrapper mb-3">
                <SelectInput form={form} name="company" {...select[1]} />
              </div>
            </div>
            
            <div className={`flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:w-full sm-mx:flex-wrap sm-mx:gap-5`}>
              <div className="post-job-input-wrapper mb-3">
                <SelectInput form={form} name="experience" {...select[2]} />
              </div>
              <div className="post-job-input-wrapper mb-3">
                <SelectInput form={form} name="jobType" {...select[3]} />
              </div>
            </div>
            
            <div className={`flex gap-10 md-mx:gap-5 [&>*]:w-1/2 sm-mx:[&>*]:w-full sm-mx:flex-wrap sm-mx:gap-5`}>
              <div className="post-job-input-wrapper mb-3">
                <SelectInput form={form} name="location" {...select[4]} />
              </div>
              <NumberInput 
                {...form.getInputProps("packageOffered")} 
                withAsterisk 
                label="Package Offered" 
                min={0} 
                max={500} 
                clampBehavior="strict" 
                placeholder="Enter Salary" 
                hideControls 
                leftSection={<IconCoin stroke={1.5} size={18} />}
                leftSectionPointerEvents="none"
                className={`post-job-input-wrapper mb-3`}
                
              />
            </div>
          </div>

          {/* Company Assets Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4 text-black">
              <span className="text-primary"><IconBuilding size={16} /></span>
              <span className="font-medium tracking-tight">Company Assets</span>
            </div>
            
              <FileInput 
              {...form.getInputProps("iconImage")} 
              withAsterisk 
              label="Company Logo" 
              placeholder="Upload Company Logo" 
              accept="image/png,image/jpeg" 
              leftSection={<IconPaperclip stroke={1.5} size={18} />}
              leftSectionPointerEvents="none"
              className={`post-job-input-wrapper mb-3`}
              
            />
            
            <TagsInput 
              {...form.getInputProps("skillsRequired")} 
              withAsterisk 
              label="Required Skills" 
              placeholder="Enter the required skills" 
              splitChars={[",", " ", "|"]} 
              clearable 
              acceptValueOnBlur 
              leftSection={<IconUsers stroke={1.5} size={18} />}
              leftSectionPointerEvents="none"
              className={`${isDarkMode ? 'text-black [&_input]:bg-third [&_input]:border-third [&_input]:text-black' : 'text-black [&_input]:bg-secondary [&_input]:text-black'} mb-3`}
              styles={() => ({
                input: {
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                  color: "var(--color-blackk)",
                  borderColor: isDarkMode ? "#3a3a3a" : "#e5e7eb",
                },
              })} 
            />
          </div>

          {/* Job Details Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4 text-black">
              <span className="text-primary"><IconFileDescription size={16} /></span>
              <span className="font-medium tracking-tight">Job Details</span>
            </div>
            
              <Textarea 
              {...form.getInputProps("about")} 
              withAsterisk 
              label="About the Role" 
              placeholder="Describe the role and responsibilities" 
              minRows={3} 
              maxRows={6} 
              className={`post-job-input-wrapper mb-3`}
              
            />
            
            <TextInput 
              {...form.getInputProps("applyUrl")} 
              label="Apply URL (Optional)" 
              placeholder="Enter the external application URL" 
              leftSection={<IconWorld stroke={1.5} size={18} />}
              leftSectionPointerEvents="none"
              className={`post-job-input-wrapper mb-3`}
              
            />
            
            <div className="[&_button[data-active='true']]:!text-blue-500 [&_button[data-active='true']]:!bg-blue-500/20">
              <div className="text-sm font-medium">Job Description <span className="text-red-500">*</span></div>
              <TextEditor form={form} data={editorData} />
            </div>
          </div>
          
          <div className="flex gap-4 justify-center mt-6">
            <Button 
              onClick={handlePost}
              variant="filled" 
              styles={() => ({
                root: {
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  borderColor: 'var(--color-primary)',
                }
              })}
            >
              Publish Job
            </Button>
            <Button
              onClick={handleDraft}
              variant="filled"
              styles={() => ({
                root: {
                  backgroundColor: isDarkMode ? '#ee8f2a67' : '#fff2e6',
                  color: isDarkMode ? '#fff' : 'var(--color-primary)',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '8px 16px',
                  borderRadius: '0.375rem',
                  // keep the same look on hover/active
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#ee8f2a67' : '#fff2e6',
                    opacity: 0.95,
                  },
                  '&:active': {
                    transform: 'scale(0.99)'
                  }
                }
              })}
            >
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobs;