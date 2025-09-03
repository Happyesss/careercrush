"use client";

"use client";

import { IconBookmark, IconBookmarkFilled, IconClockHour3 } from "@tabler/icons-react";
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

  const saved = !!profile.savedJobs?.includes(props.id);

  const salaryLabel = (() => {
    if (props.hourlyRate && props.currency) return `${props.currency}${props.hourlyRate}/hr`;
    if (props.hourlyRate) return `$${props.hourlyRate}/hr`;
    if (props.packageOffered > 0) return `₹ ${props.packageOffered}K / month`;
    return 'Not mentioned';
  })();

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.applyUrl) {
      window.open(props.applyUrl, '_blank');
      return;
    }
    router.push(`/jobs/${props.id}`);
  };

  return (
    <Link
      href={`/jobs/${props.id}`}
      className={`flex flex-col rounded-2xl border p-5 w-[360px] max-w-sm transition-shadow ${
        isDarkMode
          ? 'bg-third border-none shadow-sm hover:shadow-md'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top row: avatar + Save pill */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">

          {/* logo */}

          <div className={`h-10 w-10 rounded-full p-2 ring-1 overflow-hidden flex items-center justify-center ${isDarkMode ? 'ring-[#ee8f2a55] bg-secondary' : 'ring-gray-200 '}`}
               aria-hidden>
            {props.iconImage ? (
              <img
                className="h-full w-full object-cover"
                src={`data:image/png;base64,${props.iconImage}`}
                alt={`${props.company} logo`}
              />
            ) : (
              <span className="text-white font-semibold">{(props.company?.[0] ?? 'J').toUpperCase()}</span>
            )}
          </div>
          
        </div>
        <button
          onClick={handleSaveJob}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] ${
            isDarkMode ? 'bg-secondary text-gray-200 border-none' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <span>{saved ? 'Saved' : 'Save'}</span>
          {saved ? (
            <IconBookmarkFilled className="h-4 w-4 text-primary" />
          ) : (
            <IconBookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Company + time */}
      <div className=" flex items-center gap-2  mt-6">
        <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold text-[13px]`}>{props.company}</span>
        <span className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} text-[12px]`}>· {timeAgo(props.postTime)}</span>
      </div>

      {/* Title */}
      <h3 className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-medium tracking-tight my-3`}>
        {props.jobTitle}
      </h3>

      {/* Badges */}
      <div className=" flex flex-wrap gap-2">
        {props.jobType && (
          <span className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-normal ${isDarkMode ? 'bg-[#ee8f2a67] text-gray-200 ' : 'bg-[#eaeaea] text-gray-800 border border-gray-200'}`}>
            {props.jobType}
          </span>
        )}
        {props.experience && (
          <span className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-normal ${isDarkMode ? 'bg-[#ee8f2a67] text-gray-200 ' : 'bg-[#eaeaea] text-gray-800 border border-gray-200'}`}>
            {props.experience}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className={`mt-4 h-px ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`} />

      {/* Bottom: salary + location and Apply button */}
      <div className="flex mt-4 items-end justify-between gap-3">
        <div>
          <div className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm tracking-tight font-medium`}>{salaryLabel}</div>
          {props.location && (
            <div className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} mt-1 tracking-tight text-sm`}>{props.location}</div>
          )}
        </div>
        <button
          onClick={handleApply}
          className={`px-4 py-2 rounded-md text-[12px] font-medium ${isDarkMode ? 'bg-[#ee8f2a67] text-black' : 'bg-black text-white'} hover:opacity-95 active:scale-[0.99]`}
        >
          Apply now
        </button>
      </div>
    </Link>
  );
};

export default JobCard;