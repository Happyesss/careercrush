import Link from "next/link";
import { useParams } from "next/navigation";
import { timeAgo } from "../../Services/Utilities";
import { useTheme } from "../../ThemeContext";
import {MapPin,UserRound} from 'lucide-react';

const PostedJobCard = (props: any) => {
  const params = useParams();
  const id = params?.id as string;
  const { isDarkMode } = useTheme();

  console.log(props);

  return (
  <Link href={`/posted-job/${props.id}`}
      className={`rounded-lg p-3 flex items-center gap-6
  ${props.id === Number(id) ? "border-2 border-primary" : ""} 
        ${isDarkMode ? 'bg-third text-cape-cod-100 ' : 'bg-white text-cape-cod-900 border border-cape-cod-200'}`}>

        <div>
          {props.iconImage ? (
            <img
              className="h-5 w-5 md:h-8 md:w-8 pl-2  object-contain"
              src={`data:image/png;base64,${props.iconImage}`}
              alt={`${props.company} logo`}
            />
          ) : null}
        </div>

      <div className=""> 
            <div className="text-[15px] font-semibold mb-1 ml-0.5">{props.jobTitle}</div>
            <div className={`text-xs mb-1 flex text-[#434343df] ${isDarkMode ? "text-[#a8a8a8c9]" :"text-[#434343df]"} `}> <span className="flex items-center"><MapPin  className="h-4 font-light w-4 mr-1"/> {props.location}</span>  <span className="ml-3 flex items-center"> <UserRound className="h-4 font-light w-4 mr-1"/> {props.applicants?.length == null ? "0" : props.applicants?.length}</span></div>
            <div className={`text-xs ${isDarkMode ? "text-[#a8a8a8c9]" :"text-[#434343df]"} ml-0.5`}>{props.jobStatus === "DRAFT" ? "Drafted" : props.jobStatus === "CLOSED" ? "Closed" : "Posted"} {timeAgo(props.postTime)}</div>

      </div>
         </Link>
  );
}

export default PostedJobCard;
