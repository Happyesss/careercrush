import { Divider } from "@mantine/core";
import ApplyForm from "./ApplyForm";
import { timeAgo } from "../../Services/Utilities";
import { useTheme } from "../../ThemeContext";

const ApplyJobComp = (props: any) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-2/3 mx-auto bs-mx:w-[92%] sm-mx:w-full sm-mx:px-2 ${isDarkMode ? 'text-black' : 'text-black'}`}>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-third p-5 sm-mx:p-4 shadow-sm mb-6 mt-3 sm-mx:mt-2">
      <div className="flex justify-between sm-mx:flex-wrap sm-mx:items-center">
        <div className="flex gap-2 items-center sm-mx:flex-wrap sm-mx:gap-1">
          <div className={`p-3 rounded-xl sm-mx:p-2 ${isDarkMode ? 'bg-third' : 'bg-secondary'}`}>
            {props.iconImage ? (
              <img
                className="h-14 sm-mx:h-12 xs-mx:h-10"
                src={`data:image/png;base64,${props.iconImage}`}
                alt={`${props.company} logo`}
              />
            ) : (
              <img
                className="h-14 sm-mx:h-12 xs-mx:h-10"
                src={((): string => { const mod = require("../../assets/images/logo.png"); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
                alt="Default logo"
              />
            )}
          </div>
          <div>
            <div className="font-semibold text-3xl md:text-2xl sm-mx:text-xl xs-mx:text-lg text-black dark:text-black">{props.title}</div>
            <div className={`text-base md:text-lg ${isDarkMode ? 'text-lightBlack' : 'text-lightBlack'} sm-mx:text-base xs-mx:text-sm`}>
              {props.company} &bull; {timeAgo(props.postTime)} &bull; {props.applicants ? props.applicants.length : 0} Applicants
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {props.location && (
                <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-black dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-black">
                  {props.location}
                </span>
              )}
              {props.jobType && (
                <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-black dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-black">
                  {props.jobType}
                </span>
              )}
              {props.experience && (
                <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-black dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-black">
                  {props.experience}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-third p-6 sm-mx:p-4 shadow-sm mt-3 sm-mx:mt-2">
        <ApplyForm />
      </div>
    </div>
  );
};

export default ApplyJobComp;
