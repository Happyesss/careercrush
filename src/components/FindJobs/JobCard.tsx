"use client";

"use client";

import { Divider, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconBriefcase, IconClockHour3, IconMapPin, IconTie } from "@tabler/icons-react";
import Link from "next/link";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useRouter } from "next/navigation";
import { useTheme } from "../../ThemeContext";

const JobCard = (props: any) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleSaveJob = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!profile || !profile.id) {
      router.push("/login");
      return;
    }

    let savedJobs = Array.isArray(profile.savedJobs) ? [...profile.savedJobs] : [];

    if (savedJobs.includes(props.id)) {
      savedJobs = savedJobs.filter((id) => id !== props.id);
    } else {
      savedJobs = [...savedJobs, props.id];
    }

    const updatedProfile = { ...profile, savedJobs };
    dispatch(changeProfile(updatedProfile));
  };

  return (
  <Link href={`/jobs/${props.id}`} className={`flex flex-col gap-3 rounded-xl p-4 w-72 hover:shadow-[0_0_5px_1px_orange] ${isDarkMode ? 'bg-cape-cod-900 !shadow-orange-300' : 'bg-white !shadow-gray-300'}`}>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div className={`p-2 rounded-md ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'}`}>
            {props.iconImage ? (
              <img
                className="h-7 w-7 object-contain"
                src={`data:image/png;base64,${props.iconImage}`}
                alt={`${props.company} logo`}
              />
            ) : (
              <img
                className="h-7 w-7 object-contain"
                src={((): string => { const mod = require("../../assets/images/logo.png"); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
                alt="Default logo"
              />
            )}</div>
          <div>
            <div className="font-semibold">{props.jobTitle}</div>
            <div className={`text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`}>
              {props.company}
              {props.applyUrl ? "" : ` • ${props.applicants ? props.applicants.length : 0} Applicants`}
            </div>
          </div>
        </div>
        {profile.savedJobs?.includes(props.id) ? (
          <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-primary" stroke={1.5} />
        ) : (
          <IconBookmark onClick={handleSaveJob} className={`cursor-pointer hover:text-primary ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`} />
        )}
      </div>


      <div className={`flex gap-2 [&>div]:py-1 [&>div]:px-2 [&>div]:rounded-lg text-xs ${isDarkMode ? '[&>div]:bg-cape-cod-800 [&>div]:text-primary' : '[&>div]:bg-gray-200 [&>div]:text-primary'}`}>
        <div className="inline-flex items-center">
          <IconTie className="w-3 h-3 mr-1" />
          <span>{props.experience}</span>
        </div>
        <div className="inline-flex items-center">
          <IconBriefcase className="w-3 h-3 mr-1" />
          <span>{props.jobType}</span>
        </div>
        <div className="inline-flex items-center">
          <IconMapPin className="w-3 h-3 mr-1" />
          <span>{props.location}</span>
        </div>
      </div>

      <Text className={`!text-xs text-justify ${isDarkMode ? '!text-cape-cod-300' : '!text-gray-500'}`} lineClamp={3}>
        {props.about}
      </Text>
      <Divider size="xs" color={isDarkMode ? 'cape-cod.6' : 'gray.6'} />

      <div className="flex justify-between">
        <div className={`font-semibold ${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'}`}>
          {props.packageOffered > 0 ? `₹ ${props.packageOffered} K / month` : "Not mentioned"}
        </div>
        <div className={`flex gap-1 text-xs items-center ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}`}>
          <IconClockHour3 className="h-5 w-5" stroke={1.5} /> {timeAgo(props.postTime)}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;