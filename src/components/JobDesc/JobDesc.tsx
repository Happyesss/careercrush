import { ActionIcon, Button, ButtonGroup, Divider, Modal } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconShare, IconMapPin, IconChartBarPopular, IconCopy, IconBrandWhatsapp, IconBrandTwitter, IconMail, IconBrandLinkedin, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Wallet, Timer } from "lucide-react";

import { card } from "../../assets/Data/JobDescData";
//@ts-ignore
import DOMPurify from 'dompurify';
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useEffect, useState } from "react";
import { postJob } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useTheme } from "../../ThemeContext";

const JobDesc = (props: any) => {
  const data = DOMPurify.sanitize(props.description);
  const [applied, setApplied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const { isDarkMode } = useTheme();
  const router = useRouter();

  console.log("JobDesc props:", props);

  const handleSaveJob = () => {
    let savedJobs = Array.isArray(profile.savedJobs) ? [...profile.savedJobs] : [];

    if (savedJobs.includes(props.id)) {
      savedJobs = savedJobs.filter((id) => id !== props.id);
    } else {
      savedJobs = [...savedJobs, props.id];
    }

    const updatedProfile = { ...profile, savedJobs };
    dispatch(changeProfile(updatedProfile));
  };

  useEffect(() => {
    if (props.applicants?.filter((applicant: any) => applicant.applicantId == user.id).length > 0) {
      setApplied(true);
    } else {
      setApplied(false);
    }
  }, [props]);

  const handleClose = () => {
    postJob({ ...props, jobStatus: "CLOSED" }).then((res) => {
      successNotification("Job Closed Successfully", "Success");
    }).catch((err) => {
      errorNotification(err.response.data.errorMessage, "Error");
    });
  };

  const handleApplyLink = (event: React.MouseEvent) => {
    event.preventDefault();
    
    if (!user || !user.id) {
      router.push("/login");
      return;
    }
    
    // If logged in, open application link
    window.open(props.applyUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    successNotification("Link copied to clipboard!", "Success");
    setShareModalOpen(false);
  };

  const shareToWhatsApp = () => {
    const message = `Check out this job opportunity: ${props.jobTitle} at ${props.company} - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    setShareModalOpen(false);
  };

  const shareToTwitter = () => {
    const message = `Check out this job opportunity: ${props.jobTitle} at ${props.company}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    setShareModalOpen(false);
  };

  const shareToEmail = () => {
    const subject = `Job Opportunity: ${props.jobTitle} at ${props.company}`;
    const body = `Hi,\n\nI found this interesting job opportunity that might interest you:\n\n${props.jobTitle} at ${props.company}\n\n${window.location.href}\n\nBest regards`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShareModalOpen(false);
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    setShareModalOpen(false);
  };

  return (
    <div className={`w-2/3 bs-mx:w-full p-4 !pt-2 md:p-8 rounded-lg flex ${isDarkMode ? 'text-white' : 'text-black'} flex-col items-start`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between w-full mb-6 gap-4">

        <div className="flex tems-start w-full gap-3 md:gap-4 ">
          {/* Company Logo */}
          <div className={`p-2 md:p-3 rounded-lg flex-shrink-0`}>
            {props.iconImage ? (
              <img
                className="h-12 w-12 md:h-12 md:w-12 object-contain"
                src={`data:image/png;base64,${props.iconImage}`}
                alt={`${props.company} logo`}
              />
            ) : (
              <img
                className="h-8 w-8 md:h-12 md:w-12 object-contain"
                src={((): string => { const mod = require("../../assets/images/logo.png"); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
                alt="Default logo"
              />
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-semibold tracking-tight mb-1 leading-tight">{props.jobTitle}</h1>


            <div className="flex  sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium text-primary text-[16px]">{props.company}</span>
              <span className=" sm:inline">•</span>
              <span className="text-sm">{props.location || "Remote"}</span>
              <span className=" sm:inline">•</span>
              <span className="text-sm">{timeAgo(props.postTime)}</span>
            </div>
            
            {/* Job Details Tags */}
            <div className="flex flex-wrap  gap-2 text-xs mb-4">
              <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-[#201e1c] text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.jobType || "Full time"}
              </span>

              <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-[#201e1c] text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.experience || "2-4 Years"}
              </span>

               <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-[#201e1c] text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.applicants?.length || "0"} - Applicant
              </span>

               <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-[#201e1c] text-white' : 'bg-gray-100 text-gray-700'}`}>
₹{props.packageOffered}K - ₹{props.packageOffered + 50}K       
       </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2 md:gap-3 justify-start md:justify-end">
          {/* Apply Button */}
          {(!props.applyUrl && (props.edit || !applied)) && (
            <Link href={props.edit ? `/post-job/${props.id}` : `/apply-job/${props.id}`}>
              <button 
                className="bg-primary  text-white px-4 md:px-6 py-2 rounded-md font-semibold text-[12px]  whitespace-nowrap"
              >
                {props.closed ? "Reopen" : props.edit ? "Edit" : "Apply Now"}
              </button>
            </Link>
          )}
          
          {props.applyUrl && (
            <button 
                className="bg-primary  text-white px-4 md:px-6 py-2 rounded-md font-semibold text-[12px]  whitespace-nowrap"
              onClick={handleApplyLink}
            >
              Apply Now
            </button>
          )}

          {!props.edit && applied && (
            <button 
                className="bg-primary  text-white px-4 md:px-6 py-2 rounded-md font-semibold text-[12px]  whitespace-nowrap"
              disabled
            >
              Applied
            </button>
          )}

          {/* Bookmark Button */}



 {props.edit && !props.closed ? <Button color="red.4" size="sm" variant='light' onClick={handleClose}>Close</Button> :

            profile.savedJobs?.includes(props.id) ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-primary" stroke={1.5} />
              : <IconBookmark onClick={handleSaveJob} className={`cursor-pointer hover:text-primary ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`} />
          }


          {/* Close Button for Editors */}
          {/* {props.edit && !props.closed && (
            <Button 
              size="sm"
              variant="outline"
              className="px-3 md:px-4 py-2 rounded-lg font-medium border-red-500 text-red-500 hover:bg-red-50 text-sm whitespace-nowrap"
              onClick={handleClose}
            >
              Close
            </Button>
          )} */}


          <button onClick={handleShare} className={`p-2 rounded-lg transition-colors `}>
               <IconShare className={`cursor-pointer h-5 w-5  ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`} />
          </button>

        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
    {/* Modal box */}
    <div
      className={`w-[90%] sm:w-full max-w-sm rounded-lg shadow-lg 
        ${isDarkMode ? 'bg-third' : 'bg-white'}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b 
          ${isDarkMode ? 'border-[#373a40]' : 'border-[#e9ecef]'}
        `}
      >
        <div className="flex items-center gap-2">
          <IconShare size={20} className="text-primary" />
          <span
            className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            Share this job
          </span>
        </div>
        <button
          onClick={() => setShareModalOpen(false)}
          className={`text-lg font-bold ${
            isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-3">
        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
            hover:bg-gray-50 dark:hover:bg-secondary 
            ${isDarkMode ? 'text-white' : 'text-gray-700'}
          `}
        >
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <IconCopy size={20} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="text-left">
            <div className="font-medium">Copy link</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Copy job link to clipboard</div>
          </div>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
            hover:bg-gray-50 dark:hover:bg-secondary  
            ${isDarkMode ? 'text-white' : 'text-gray-700'}
          `}
        >
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <IconBrandWhatsapp size={20} className="text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">WhatsApp</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Share via WhatsApp</div>
          </div>
        </button>

        {/* Twitter/X */}
        <button
          onClick={shareToTwitter}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
            hover:bg-gray-50 dark:hover:bg-secondary 
            ${isDarkMode ? 'text-white' : 'text-gray-700'}
          `}
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <IconBrandTwitter size={20} className="text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Twitter/X</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Share on Twitter</div>
          </div>
        </button>

        {/* Email */}
        <button
          onClick={shareToEmail}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
            hover:bg-gray-50 dark:hover:bg-secondary  
            ${isDarkMode ? 'text-white' : 'text-gray-700'}
          `}
        >
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <IconMail size={20} className="text-red-600" />
          </div>
          <div className="text-left">
            <div className="font-medium">Email</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Share via email</div>
          </div>
        </button>

        {/* LinkedIn */}
        <button
          onClick={shareToLinkedIn}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
            hover:bg-gray-50 dark:hover:bg-secondary 
            ${isDarkMode ? 'text-white' : 'text-gray-700'}
          `}
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <IconBrandLinkedin size={20} className="text-blue-700" />
          </div>
          <div className="text-left">
            <div className="font-medium">LinkedIn</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Share on LinkedIn</div>
          </div>
        </button>
      </div>
    </div>
  </div>
)}


     


       {/* Required Skills */}
      {props?.skillsRequired && props.skillsRequired.length > 0 && (
        <>
        <Divider className="mt-2"/>
          <div className="mb-6 md:mb-8  w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {props.skillsRequired.map((skill: any, index: number) => (
                <span
                  key={index}
                  className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : 'bg-orange-50 text-orange-600 border border-orange-200'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </>
      )}


      {/* About this role */}
      <div className="mb-6 md:mb-8 ">
        <div className={`text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed ${isDarkMode ? '[&_*]:text-cape-cod-300' : '[&_*]:text-gray-600'} [&_h4]:text-lg [&_h4]:md:text-xl [&_h4]:my-3 [&_h4]:md:my-5 [&_h4]:font-semibold [&_h4]:${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'} [&_p]:text-justify [&_li]:marker:text-primary [&_li]:mb-1 [&_ul]:pl-4 [&_ol]:pl-4`}>
<div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: data }}
    />        </div>
      </div>

     
    </div>
  )
}

export default JobDesc;