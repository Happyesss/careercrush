import { Button, Divider } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import { useParams, useRouter } from "next/navigation"
import ApplyJobComp from "../ApplyJob/ApplyJobComp"
import { useEffect, useState } from "react"
import { getJob } from "../../Services/JobService"
import { useTheme } from "../../ThemeContext"

const ApplyJob = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<any>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    getJob(id).then((res) => {
      setJob(res);
    }).catch((error) => {
      console.log(error);
    })
  }, [id])
  return (
    <div className={`min-h-[100vh] ${isDarkMode ? 'bg-secondary text-gray-200' : 'bg-secondary text-black'} p-4 sm-mx:p-2`}>
  {/* <Button my="md" leftSection={<IconArrowLeft size={20}/>} onClick={()=>router.back()} color="orange.4" variant='light' >Back</Button>  */}
    <ApplyJobComp {...job}/>
    </div>
  )
}

export default ApplyJob