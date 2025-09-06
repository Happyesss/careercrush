import { Divider } from "@mantine/core";
import ApplyForm from "./ApplyForm";
import { timeAgo } from "../../Services/Utilities";
import { useTheme } from "../../ThemeContext";

const ApplyJobComp = (props: any) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-2/3 mx-auto bs-mx:w-[92%] sm-mx:w-full sm-mx:px-2 ${isDarkMode ? 'text-black' : 'text-black'}`}>
      <div className="rounded-xl border border-gray-200 dark:border-none bg-white dark:bg-third p-5 sm-mx:p-4 shadow-sm mb-6 mt-3 sm-mx:mt-2">
      <div className="flex justify-between sm-mx:flex-wrap sm-mx:items-center">
        <div className="flex gap-2 items-center sm-mx:flex-wrap sm-mx:gap-1">
          <div className={`p-3 rounded-xl sm-mx:p-2 mr-4`}>
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


            <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight mb-1">{props.jobTitle}</h1>


            <div className="flex  sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium text-primary text-[16px]">{props.company}</span>
              <span className=" sm:inline">•</span>
              <span className="text-sm">{props.location || "Remote"}</span>
              <span className=" sm:inline">•</span>
              <span className="text-sm">{timeAgo(props.postTime)}</span>
            </div>
            
            {/* Job Details Tags */}
            <div className="flex flex-wrap  gap-2 text-xs ">
              <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.jobType || "Full time"}
              </span>

              <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.experience || "2-4 Years"}
              </span>

               <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}>
                {props.applicants?.length || "0"} - Applicant
              </span>

               <span className={`px-2 md:px-3 py-1 rounded-md !text-xs md:text-sm ${isDarkMode ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'}`}>
₹{props.packageOffered}K - ₹{props.packageOffered + 50}K       
       </span>
            </div>
          </div>


         
          </div>
        </div>
      </div>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-none bg-white dark:bg-third p-6 sm-mx:p-4 shadow-sm mt-3 sm-mx:mt-2">
        <ApplyForm />
      </div>
    </div>
  );
};

export default ApplyJobComp;
