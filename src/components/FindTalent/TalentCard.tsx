"use client";
import { Avatar, Button, Divider, Modal, Text } from "@mantine/core";
import { IconCalendarMonth, IconLock, IconMapPin, IconUsersPlus } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProfile } from "../../Services/ProfileServices";
import { DateInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { ChangeAppStatus } from "../../Services/JobService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { foramtInterviewTime, openBase64 } from "../../Services/Utilities";
import { useTheme } from "../../ThemeContext";
import {Trash} from 'lucide-react';

const TalentCard = (props: any) => {
  const params = useParams();
  const id = (params as any)?.id as string | undefined;
  const ref = useRef<HTMLInputElement>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [app, { open: openApp, close: closeApp }] = useDisclosure(false);
  const [profile, setProfile] = useState<any>({});
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<any>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (props.applicantId) getProfile(props.applicantId).then((res) => {
      setProfile(res);
    }).catch((err) => {
      console.error(err);
    });
    else setProfile(props);
  }, [props]);

  const handleOffer = (status: string) => {
    let interview: any = { id, applicantId: profile?.id, applicationStatus: status };
    if (status === "INTERVIEWING") {
      const [hours, minutes] = time.split(":").map(Number);
      date?.setHours(hours, minutes);
      interview = { ...interview, interviewTime: date };
    }
    ChangeAppStatus(interview).then((res) => {
      if (status === "INTERVIEWING") successNotification("Success", "Interview Scheduled");
      else if (status === "OFFERED") successNotification("Success", "Offer Sent");
      else successNotification("Success", "Application Rejected");
      window.location.reload();
    }).catch((err) => {
      console.error(err);
      errorNotification(err.response.data.errorMessage, "Error scheduling interview");
    });
  };



  return (
    <div className="w-full ">
      <div className={`flex p-4 border-b pb-4  rounded-xl items-center justify-between w-full  ${isDarkMode ? 'hover:bg-secondary border-[#d5dade53]' : 'bg-white hover:bg-[#98989817]'}`}>

      <div className="flex flex-col sm:flex-row w-full">
        





          <Link href={`/talent-profile/${profile?.id}`} className="flex flex-col sm:flex-row gap-2 sm:items-center justify-start sm:justify-between w-full">


        <div className="flex mb-1 sm:mb-0 sm:justify-between">
            <div >
<img
  src={
    profile?.picture
      ? `data:image/jpeg;base64,${profile.picture}`
      : require("../../assets/images/avatar.png")?.src ??
        require("../../assets/images/avatar.png")?.default ??
        require("../../assets/images/avatar.png")
  }
  alt="User Avatar"
  className="w-11 h-10 mr-4 rounded-sm"
/>
            </div>

            <div className="flex flex-row gap-6">

              <div>
                 <div className="font-semibold tracking-tight mb-1 text-[16px]">
                        {profile?.name
                       ?.toLowerCase()
                     .replace(/\b\w/g, (char: any) => char.toUpperCase())}
                  </div>

                  <div className="font-normal text-[12px]  text-gray-500">
                      {profile?.email}
                  </div>
              </div>

            
            </div>


          
        </div>



       


        {/* <div>
          <Text className={`!text-xs text-justify ${isDarkMode ? '!text-cape-cod-300' : '!text-gray-500'}`} lineClamp={3}>
            {profile?.about}
          </Text>
        </div> */}


          <div className="sm:mr-[22%] mb-2 sm:mb-0">

        {props.invited ? (
          <div className={`text-xs flex sm:text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-black'}`}>
           Interview: {foramtInterviewTime(props.interviewTime)}
          </div>
        ) : (
          <div className="flex justify-between tracking-tight">
            <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-black'}`}>
              Experience : {props.totalExp ? props.totalExp : 1} Years
            </div>
           
          </div>
        )}

        </div>

                  </Link>




        
        <div className="flex gap-2 sm:flex-row mt-2 sm:mt-0 flex-col">
          {!props.invited && (
            <>
            <div className="flex gap-2 ">


              <div>
                {props.posted ? (
                  <Button leftSection={<IconCalendarMonth className="w-5 h-5 rounded-md" />} className={`!rounded-md !text-xs !bg-[#1fc55c11] !text-green-500 !border !border-[#1fc55c] `} onClick={open} >
                    Schedule
                  </Button>
                ) : (
                  <Button className={`!rounded-md !text-xs !bg-[#ef914412] !text-primary !border !border-primary`}>
                    <IconLock className="h-4 w-4" /> Message
                  </Button>
                )}
              </div>



              <div>
                 {(props.invited || props.posted) && (
          <Button  onClick={openApp}  className={`!rounded-md !text-xs ${isDarkMode ? "!bg-[#3b2f23] !border !border-primary !text-primary" : "!bg-[#feebe6a2] !border !border-primary !text-primary"}`}>
            View Application
          </Button>
        )}
              </div>

              </div>


              {props.posted && (
               <div>
                <Button onClick={() => handleOffer("REJECTED")} className={`!rounded-md !text-xs !bg-[#ef444412] !text-red-600 !border !border-red-500`}>
                  Reject
                </Button>
              </div>)}


            </>
          )}
          {props.invited && (
            <>
              <div>
                <Button onClick={() => handleOffer("OFFERED")} className={`!rounded-md !text-xs !bg-[#44ef8012] !text-green-600 !border !border-green-500`}>
                  Accept
                </Button>
              </div>
              <div>
                <Button onClick={() => handleOffer("REJECTED")} className={`!rounded-md !text-xs !bg-[#ef444412] !text-red-600 !border !border-red-500`}>
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>





      </div>
        
       
        {/* Schedule Interview Overlay */}
        {opened && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-96 rounded-lg p-6 ${isDarkMode ? 'bg-third text-white' : 'bg-white text-black'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Schedule Interview</h3>
                <button onClick={close} className={`text-2xl ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}>
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Date Selection */}
                <div className="px-3">
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date ? date.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-2 rounded-md text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isDarkMode 
                        ? 'bg-third border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Choose interview date"
                  />
                </div>
                
                {/* Time Selection */}
                <div className="px-3">
                  <label className={`block text-xs font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={time || ''}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full p-2 rounded-md text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isDarkMode 
                        ? 'bg-third border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-black'
                    }`}
                    placeholder="Choose interview time"
                  />
                </div>
                
                {/* Schedule Button */}
                <div className="p-3">
                  <Button 
                    onClick={() => handleOffer("INTERVIEWING")} 
                    className={`!rounded-md !text-xs ${
                      isDarkMode 
                        ? '!bg-primary !text-white !border !border-primary hover:!bg-primary/90' 
                        : '!bg-primary !text-white !border !border-primary hover:!bg-primary/90'
                    }`}
                    fullWidth
                    disabled={!date || !time}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Application Details Overlay */}
        {app && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`w-96 rounded-lg p-6 ${isDarkMode ? 'bg-third text-white' : 'bg-white text-black'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Application Details</h3>
                <button onClick={closeApp} className={`text-2xl ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}>
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Contact Info - Compact */}
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>Email:</span>
                      <a 
                        className="text-primary hover:text-primary/80 transition-colors text-xs font-medium" 
                        href={`mailto:${profile?.email}`}
                      >
                        {props.email}
                      </a>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>Phone:</span>
                      <a 
                        className="text-primary hover:text-primary/80 transition-colors text-xs font-medium" 
                        href={`tel:${props.phone}`}
                      >
                        {props.phone}
                      </a>
                    </div>
                    
                    {props.website && (
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}`}>Website:</span>
                        <a 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors text-xs font-medium" 
                          href={props.website}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume - Compact */}
                {props.resume && (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
                    <button 
                      className={`w-full p-2 rounded-md border transition-all hover:scale-[1.01] ${
                        isDarkMode 
                          ? 'border-primary bg-primary/10 hover:bg-primary/20 text-primary' 
                          : 'border-primary bg-primary/10 hover:bg-primary/20 text-primary'
                      }`}
                      onClick={() => openBase64(props.resume)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-medium">View Resume</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Cover Letter - Compact */}
                {props.coverLetter && (
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
                      Cover Letter:
                    </div>
                    <div className={`text-xs leading-relaxed p-2 rounded-md max-h-24 overflow-y-auto ${isDarkMode ? 'bg-cape-cod-900 text-cape-cod-300' : 'bg-white text-gray-600'}`}>
                      {props.coverLetter}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentCard;