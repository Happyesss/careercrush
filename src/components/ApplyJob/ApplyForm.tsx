'use client'

import { Button, FileInput, LoadingOverlay, NumberInput, Textarea, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconPaperclip, IconMail, IconPhone, IconUser, IconWorld, IconFileDescription, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { getBase64 } from "../../Services/Utilities";
import { applyJob } from "../../Services/JobService";
import { useRouter, useParams } from "next/navigation";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useSelector } from "react-redux";
import { useTheme } from "@/ThemeContext";

interface ApplyFormValues {
    name: string;
    email: string;
    phone: string;
    website: string;
    resume: File | null;
    coverLetter: string;
}

const ApplyForm = () => {
    const router = useRouter();
    const { id } = useParams();
    const user = useSelector((state: any) => state.user);
    const [preview, setPreview] = useState(false);
    const [submit, setSubmit] = useState(false);
    const { isDarkMode } = useTheme();

    const handlePreview = () => {
        form.validate();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!form.isValid()) return;
        setPreview(!preview);
    };

    const handleSubmit = async () => {
        setSubmit(true);
        try {
            const { resume } = form.getValues();

            // Validate resume
            if (!resume) {
                throw new Error("Resume is required");
            }
            if (resume instanceof File && resume.size > 2 * 1024 * 1024) { 
                throw new Error("Resume file size should be under 2MB.");
            }

            // Convert resume to Base64
            let resumeBase64: any = await getBase64(resume);
            if (!resumeBase64) {
                throw new Error("Failed to process resume file.");
            }

            // Prepare applicant data
            let applicant = {
                ...form.getValues(),
                applicantId: user.id,
                resume: resumeBase64.split(',')[1], 
            };

            // Submit application
            const res = await applyJob(id, applicant);
            if (res.error) {
                throw new Error(res.error);
            }

            // Success handling
            setSubmit(false);
            successNotification("Application Submitted Successfully", "Success");
            router.back(); 
        } catch (err: any) {
            setSubmit(false);
            const errorMessage = err.response?.data?.errorMessage || err.message || "Failed to submit application";
            errorNotification(errorMessage, "Error");
        }
    };

    const form = useForm<ApplyFormValues>({
        mode: 'controlled',
        validateInputOnChange: true,
        initialValues: { name: '', email: '', phone: '', website: '', resume: null, coverLetter: '' },
        validate: {
            name: isNotEmpty('This field is required'),
            email: (value) => /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address',
            phone: (value) => /^\d{10}$/.test(value) ? null : 'Phone number must be 10 digits',
            website: (value) => value && !/^https?:\/\/\S+$/.test(value) ? 'Invalid URL' : null,
            resume: isNotEmpty('Resume is required'),
        },
    });

    return (
        <div>
            <LoadingOverlay visible={submit} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div className="flex items-start gap-3 mb-3">
                <div className="mt-1 text-primary"><IconSend size={18} /></div>
                <div>
                    <div className="text-2xl md:text-xl font-medium tracking-tight text-black dark:text-black">Submit Your Application</div>
                    <div className="text-sm text-lightBlack tracking-tight">Fill out the form below to apply for this position</div>
                </div>
            </div>
            <div className="flex flex-col gap-5 mt-5">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-4 text-black">
                        <span className="text-primary"><IconFileDescription size={16} /></span>
                        <span className="font-medium tracking-tight">Personal Information</span>
                    </div>
                <div className="flex gap-10 !font-medium !tracking-tight mt-4 [&>*]:w-1/2 sm-mx:[&>*]:w-full sm-mx:flex-wrap sm-mx:gap-5">
                    <TextInput
                        {...form.getInputProps("name")}
                        readOnly={preview}
                        variant={preview ? "unstyled" : "default"}
                        className={`${isDarkMode ? ' text-black [&_input]:bg-third [&_input]:border-third [&_input]:text-black' : 'text-black [&_input]:bg-secondary [&_input]:text-black'} mb-3
                                ${preview ? "text-lightBlack font-semibold [&_input]:bg-transparent [&_input]:border-transparent" : ""} sm-mx:w-full`}
                        label="Full Name"
                        placeholder="Your Name"
                        withAsterisk
                        description="Enter Name"
                        leftSection={<IconUser stroke={1.5} size={18} />}
                        leftSectionPointerEvents="none"
                        styles={() => ({
                            input: {
                                backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                                color: "var(--color-blackk)",
                                borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                            },
                        })}
                    />
                    <TextInput
                        {...form.getInputProps("email")}
                        readOnly={preview}
                        variant={preview ? "unstyled" : "default"}
                        className={`${isDarkMode ? 'text-black [&_input]:bg-third [&_input]:border-third [&_input]:text-black' : 'text-black [&_input]:bg-secondary [&_input]:text-black'} mb-3
                                ${preview ? "text-lightBlack font-semibold [&_input]:bg-transparent [&_input]:border-transparent" : ""} sm-mx:w-full`}
                        label="Email"
                        withAsterisk
                        description="Enter Email"
                        leftSection={<IconMail stroke={1.5} size={18} />}
                        leftSectionPointerEvents="none"
                        placeholder="Your Email"
                        styles={() => ({
                            input: {
                                backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                                color: "var(--color-blackk)",
                                borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                            },
                        })}
                    />
                </div>
                <div className="flex gap-10 [&>*]:w-1/2 sm-mx:[&>*]:w-full sm-mx:flex-wrap sm-mx:gap-5">
                    <NumberInput
                        {...form.getInputProps("phone")}
                        readOnly={preview}
                        variant={preview ? "unstyled" : "default"}
                        className={`${isDarkMode ? 'text-black [&_input]:bg-third [&_input]:border-third [&_input]:text-black' : 'text-black [&_input]:bg-secondary [&_input]:text-black'} mb-3
                                ${preview ? "text-lightBlack font-semibold [&_input]:bg-transparent [&_input]:border-transparent" : ""}`}
                        label="Phone Number"
                        withAsterisk
                        description="Enter Phone Number"
                        placeholder="Your Phone Number"
                        hideControls
                        min={0}
                        max={9999999999}
                        clampBehavior="strict"
                        leftSection={<IconPhone stroke={1.5} size={18} />}
                        leftSectionPointerEvents="none"
                        styles={() => ({
                            input: {
                                backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                                color: "var(--color-blackk)",
                                borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                            },
                        })}
                    />
                    <TextInput
                        {...form.getInputProps("website")}
                        readOnly={preview}
                        variant={preview ? "unstyled" : "default"}
                        className={`${isDarkMode ? 'text-black [&_input]:bg-third [&_input]:border-third [&_input]:text-black' : 'text-black [&_input]:bg-secondary [&_input]:text-black'} mb-3
                                ${preview ? "text-lightBlack font-semibold [&_input]:bg-transparent [&_input]:border-transparent" : ""}`}
                        label="Personal Website"
                        withAsterisk
                        placeholder="Your Website"
                        description="Enter URL"
                        leftSection={<IconWorld stroke={1.5} size={18} />} 
                        leftSectionPointerEvents="none"
                        styles={() => ({
                            input: {
                                backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                                color: "var(--color-blackk)",
                                borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                            },
                        })}
                    />
                </div>
                </div>
                <div className="rounded-lg border border-gray-200 !tracking-tight !font-medium dark:border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-4 text-black">
                        <span className="text-primary"><IconFileDescription size={16} /></span>
                        <span className="font-medium tracking-tight">Documents & Cover Letter</span>
                    </div>
                <FileInput
                    {...form.getInputProps("resume")}
                    accept="application/pdf"
                    readOnly={preview}
                    variant={preview ? "unstyled" : "default"}
                    className={`${preview ? "text-lightBlack font-semibold" : "text-black"} mb-3`}
                    label="Attach your CV"
                    placeholder="Your CV"
                    withAsterisk
                    leftSection={<IconPaperclip stroke={1.5} />}
                    leftSectionPointerEvents="none"
                    styles={() => ({
                        input: {
                            backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                            color: "var(--color-blackk)",
                            borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                        },
                    })}
                />
                <Textarea
                    {...form.getInputProps("coverLetter")}
                    readOnly={preview}
                    variant={preview ? "unstyled" : "default"}
                    className={`${preview ? "text-lightBlack font-semibold" : "text-black"} sm-mx:w-full mb-3`}
                    placeholder="Write your cover letter..."
                    label="Cover Letter"
                    withAsterisk
                    autosize
                    minRows={4}
                    styles={() => ({
                        input: {
                            backgroundColor: preview ? "transparent" : isDarkMode ? "rgba(255,255,255,0.04)" : "var(--color-secondary)",
                            color: "var(--color-blackk)",
                            borderColor: preview ? "transparent" : isDarkMode ? "#3a3a3a" : "#e5e7eb",
                        },
                    })}
                />
                </div>
                {!preview && (
                    <div className="flex justify-center">
                        <Button onClick={handlePreview} variant="filled" styles={() => ({
                            root: {
                                backgroundColor: 'var(--color-primary)',
                                color: '#fff',
                                borderColor: 'var(--color-primary)',
                            }
                        })}>Preview Application</Button>
                    </div>
                )}
                {preview && (
                    <div className="flex gap-6 [&>*]:w-1/2">
                        <Button onClick={handlePreview} variant="filled" styles={() => ({
                            root: {
                                backgroundColor: 'var(--color-primary)',
                                color: '#fff',
                                borderColor: 'var(--color-primary)',
                            }
                        })}>Edit</Button>
                        <Button onClick={handleSubmit} variant="filled" styles={() => ({
                            root: {
                                backgroundColor: 'var(--color-primary)',
                                color: '#fff',
                                borderColor: 'var(--color-primary)',
                            }
                        })}>Submit</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyForm;