import { ActionIcon, Button, Divider } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled,
  IconMapPin,
  IconShare,
  } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const { isDarkMode } = useTheme();
  const router = useRouter();

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

  return (
  //   <div className={`w-2/3 bs-mx:w-full ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'}`}>
  //     <div className="flex justify-between">
  //       <div className="flex gap-2 items-center">
  //         <div className={`p-3 rounded-xl sm-mx:p-1 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'}`}>
  //         {props.iconImage ? (
  //   <img
  //     className="h-7 w-7 object-contain"
  //     src={`data:image/png;base64,${props.iconImage}`}
  //     alt={`${props.company} logo`}
  //   />
  // ) : (
  //   <img
  //     className="h-7 w-7 object-contain"
  // src={((): string => { const mod = require("../../assets/images/logo.png"); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
  //     alt="Default logo"
  //   />
  // )}
  //         </div>
  //         <div>
  //           <div className="font-semibold text-2xl sm-mx:text-xl">{props.jobTitle}</div>
  //           <div className={`text-lg sm-mx:text-base ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`}>
  //             {props.company} &bull; {timeAgo(props.postTime)}
  //             {!props.applyUrl &&  ` • ${props.applicants ? props.applicants.length : 0} Applicants`}
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-2 items-center">
  //         {(!props.applyUrl && (props.edit || !applied)) && (
  //           <Link href={props.edit ? `/post-job/${props.id}` : `/apply-job/${props.id}`}>
  //             <Button color="orange.4" size="sm" variant="light">
  //               {props.closed ? "Reopen" : props.edit ? "Edit" : "Apply"}
  //             </Button>
  //           </Link>
  //         )}
  //         {props.applyUrl && (
  //         <Button 
  //           color="orange.4" 
  //           size="sm" 
  //           variant="light"
  //           onClick={handleApplyLink}
  //         >
  //           Apply Link
  //         </Button>
  //       )}
  //         {
  //           !props.edit && applied && <Button color="orange.4" size="sm" variant='transparent'>Applied</Button>
  //         }
  //         {props.edit && !props.closed ? <Button color="red.4" size="sm" variant='light' onClick={handleClose}>Close</Button> :

  //           profile.savedJobs?.includes(props.id) ? <IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-primary" stroke={1.5} />
  //             : <IconBookmark onClick={handleSaveJob} className={`cursor-pointer hover:text-primary ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'}`} />
  //         }
  //       </div>
  //     </div>
  //     <Divider my="xl" color='dark' />
  //     <div className="flex justify-around sm-mx:flex-wrap sm-mx:gap-4">
  //       {
  //         card.map((item: any, index: number) => <div key={index} className="flex flex-col items-center gap-1">
  //           <ActionIcon className="!h-12 !w-12 sm-mx:!h-10 sm-mx:!w-10 xs-mx:!h-8 xs-mx:!w-8" color="orange.4" variant="transparent" radius="xl" aria-label="Settings">
  //             <item.icon className="h-4/5 w-4/5" stroke={1.5} />
  //           </ActionIcon>
  //           <div className={`text-sm ${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'} sm-mx:text-xs xs-mx:text-[10px]`}>{item.name}</div>
  //           <div className="font-semibold sm-mx:text-sm xs-mx:text-xs">
  //             {props ? props[item.id] : "NA"}
  //             {item.id === "packageOffered" && (props[item.id] > 0 ? <>K</> : <>Not mentioned</>)}
  //           </div>
  //         </div>
  //         )}
  //     </div>
  //     <Divider my="xl" color='dark' />
  //     <div>
  //       <div className="text-xl font-semibold mb-5 sm-mx:text-lg xs-mx:text-base">Required Skills</div>
  //       <div className="flex flex-wrap gap-2">{
  //         props?.skillsRequired?.map((skill: any, index: number) =>
  //           <ActionIcon key={index} className="!h-fit font-medium !text-sm !w-fit " color="orange.4" p="xs" variant="light" radius="xl" aria-label="Settings">
  //             {skill}
  //           </ActionIcon>
  //         )}
  //       </div>
  //     </div>
  //     <Divider my="xl" color='dark' />
  //     <div className={`[&_*]:${isDarkMode ? 'text-cape-cod-300' : 'text-gray-500'} [&_h4]:text-xl [&_h4]:my-5 [&_h4]:font-semibold [&_h4]:${isDarkMode ? 'text-cape-cod-200' : 'text-gray-700'} [&_p]:text-justify [&_li]:marker:text-primary [&_li]:mb-1`}
  //       dangerouslySetInnerHTML={{ __html: data }}>

  //     </div>
  //   </div>









 <div className="w-2/3 bs-mx:w-full ml-auto ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'}">
      
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-3xl font-medium text-gray-900">UI/UX Designer</h1>
        <div className="flex items-center space-x-3">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
            Apply Now
          </Button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <IconBookmarkFilled className="w-5 h-5 text-orange-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <IconShare className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>



<div className="flex items-center space-x-4 mb-8 ml-5">
        <div className="w-15 h-15 bg-transparent rounded-lg flex">
           {props.iconImage ? (
    <img
      className="h-12 w-12 object-contain"
      src={`data:image/png;base64,${props.iconImage}`}
      alt={`${props.company} logo`}
    />
  ) : (
    <img
      className="h-7 w-7 object-contain"
  src={((): string => { const mod = require("../../assets/images/logo.png"); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
      alt="Default logo"
    />
  )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-500 text-lg font-medium">Pixelz Studio</span>
            <IconMapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Yogyakarta, Indonesia</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Fulltime</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Remote</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">2-4 Years</span>
          </div>
        </div>
      </div>


<section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">About this role</h2>
        <p className="text-gray-600 leading-relaxed">
          As an UI/UX Designer on Pixelz Studio, you'll focus on design user-friendly on several platform (web, mobile, 
          dashboard, etc) to our users needs. Your innovative solution will enhance the user experience on several 
          platforms. Join us and let's making impact on user engagement at Pixelz Studio.
        </p>
      </section>



            <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Qualification</h2>
        <ul className="space-y-3 text-gray-600 ml-3">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            At least 2-4 years of relevant experience in product design or related roles.
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Knowledge of design validation, either through quantitative or qualitative research.
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Have good knowledge using Figma and Figjam
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Experience with analytics tools to gather data from users.
          </li>
        </ul>
      </section>


<section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Responsibility</h2>
        <ul className="space-y-3 text-gray-600 ml-3">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Create design and user journey on every features and product/business units across multiples devices (Web+App)
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Identifying design problems through user journey and devising elegant solutions
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Develop low and hi fidelity designs, user experience flow, & prototype, translate it into highly-polished visual composites following style and brand guidelines.
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Brainstorm and works together with Design Lead, UX Engineers, and PMs to execute a design sprint on specific story or task
          </li>
        </ul>
      </section>



      </div>
  ) 
}

export default JobDesc;