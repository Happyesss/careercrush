"use client";

import { IconMapPin, IconBriefcase } from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";
import { Mentor } from "../../types/mentor";

type Props = {
  mentor: Mentor;
};

export default function PublicMentorProfileHeader({ mentor }: Props) {
  const { isDarkMode } = useTheme();

  const nameInitial = mentor.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <section className={`w-full ${isDarkMode ? "bg-cape-cod-950 text-gray-100" : "bg-white text-gray-900"} rounded-xl overflow-hidden shadow-sm`}>
      {/* Cover banner */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full">
        {mentor.profileBackground ? (
          <img
            src={`data:image/jpeg;base64,${mentor.profileBackground}`}
            alt="Profile cover"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-rose-300 to-amber-400" />
        )}

        {/* Avatar */}
        <div className="absolute -bottom-14 left-6 sm:left-8">
          {mentor.picture ? (
            <img
              src={`data:image/jpeg;base64,${mentor.picture}`}
              alt={mentor.name}
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-white shadow-md"
            />
          ) : (
            <div className={`h-28 w-28 sm:h-32 sm:w-32 rounded-full grid place-items-center text-3xl sm:text-4xl font-semibold ring-4 ring-white shadow-md ${isDarkMode ? "bg-cape-cod-800 text-blue-300" : "bg-gray-200 text-blue-700"}`}>
              {nameInitial}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="pt-16 pb-6 sm:pb-8 px-6 sm:px-8 relative">
        {/* Top-right availability / CTA */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${mentor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {mentor.isAvailable ? 'Open to mentor' : 'Not accepting mentees'}
          </div>
          <button
            onClick={() => {
              const ev = new CustomEvent('request-mentorship', { detail: { mentorId: mentor.id } });
              window.dispatchEvent(ev);
            }}
            disabled={!mentor.isAvailable}
            className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm ${mentor.isAvailable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Request
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{mentor.name}</h1>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mt-1 text-lg`}> 
          {mentor.jobTitle || "Professional"}
          {mentor.company ? <span> • {mentor.company}</span> : null}
        </p>

        <div className={`mt-4 flex flex-wrap items-center gap-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {mentor.location && (
            <div className="flex items-center gap-2">
              <IconMapPin size={18} />
              <span className="text-sm sm:text-base">{mentor.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <IconBriefcase size={18} />
            <span className="text-sm sm:text-base">{mentor.totalExp ?? 0} years of experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
