import { Button, Divider, Drawer } from '@mantine/core'
import PostedJobs from '../PostedJob/PostedJobs'
import PostedJobDesc from '../PostedJob/PostedJobDesc'
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getJobPostedBy } from '../../Services/JobService';
import { useTheme } from '../../ThemeContext';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';


const PostedJob = () => {
  const { isDarkMode } = useTheme();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const user =useSelector((state:any)=>state.user)
  const [opened,{open,close}]= useDisclosure(false);
  const [jobList, setJobList] = useState<any[]>([])
  const [job, setJob] = useState<any>({});
  const matches = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    window.scrollTo(0, 0);
    getJobPostedBy(user.id).then((res) => {
      setJobList(res);
  if(res && res.length>0&& Number(id)===0)router.push(`/posted-job/${res[0].id}`);
      setJob(res.find((item:any)=>item.id==id));
    }).catch((error) => {
      console.log(error);
    })
  }, [id])
  return (
    <div className={`min-h-[100vh] ${isDarkMode ? 'bg-secondary text-white' : 'bg-secondary text-black'}  p-4`}>
    {matches&&<Button onClick={open} className={`!text-xs !p-3 ${isDarkMode ? '!bg-[#3b2f23] !text-primary' : '!bg-[#ffeae6] !text-primary'}`}>All Jobs</Button>}
      <Drawer  size="xs" opened={opened} onClose={close} title="All Jobs"  >
      <PostedJobs job={job} jobList={jobList}/>
        </Drawer>

      <div className="flex gap-5">
      {!matches&&<PostedJobs job={job} jobList={jobList}/>}
       <PostedJobDesc {...job}/>
      </div>
    </div>
  )
}

export default PostedJob