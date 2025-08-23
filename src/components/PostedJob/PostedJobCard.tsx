import Link from "next/link";
import { useParams } from "next/navigation";
import { timeAgo } from "../../Services/Utilities";
import { useTheme } from "../../ThemeContext";

const PostedJobCard = (props: any) => {
  const params = useParams();
  const id = params?.id as string;
  const { isDarkMode } = useTheme();

  return (
  <Link href={`/posted-job/${props.id}`}
      className={`rounded-xl p-2 border-b-2 border-l-2 border-blue-400 
  ${props.id === Number(id) ? "border-2 border-blue-400" : ""} 
        ${isDarkMode ? 'bg-cape-cod-900 text-cape-cod-100' : 'bg-white text-cape-cod-900'}`}>

      <div className="text-sm font-semibold">{props.jobTitle}</div>
      <div className="text-xs">{props.location}</div>
      <div className="text-xs">{props.jobStatus === "DRAFT" ? "Drafted" : props.jobStatus === "CLOSED" ? "Closed" : "Posted"} {timeAgo(props.postTime)}</div>
    </Link>
  );
}

export default PostedJobCard;
