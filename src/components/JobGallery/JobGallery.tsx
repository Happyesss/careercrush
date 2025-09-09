import { Tabs } from "@mantine/core"
import JobCard from "../FindJobs/JobCard"
import { useEffect, useState, useMemo } from "react";
import { getAllJobs } from "../../Services/JobService";
import { useSelector } from "react-redux";
import NoJobsImage from "../../assets/images/404Error.png"; 

const JobGallery = () => {
    const profile = useSelector((state: any) => state.profile)
    const user = useSelector((state: any) => state.user)
    const [activeTab, setActiveTab] = useState<any>('SAVED')
    const [jobList, setJobList] = useState<any>([])
    const [showList, setShowList] = useState<any>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    
    useEffect(() => {
        getAllJobs()
            .then((res) => {
                setJobList(res);
                // Initialize with saved jobs
                const savedJobsList = res.filter((job: any) => profile.savedJobs?.includes(job.id));
                setShowList(savedJobsList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [user.id, profile.savedJobs]);
    
    const handleTabChange = (value: string | null) => {
        setActiveTab(value);
        
        if (value === "SAVED") {
            setShowList(jobList.filter((job: any) => profile.savedJobs?.includes(job.id)));
        } else {
            setShowList(jobList.filter((job: any) => 
                job.applicants?.some((applicant: any) => 
                    applicant.applicantId === user.id && applicant.applicationStatus === value
                )
            ));
        }
    };
    
    const filteredList = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const base = Array.isArray(showList) ? showList : [];
        if (!term) return base;
        return base.filter((job: any) => {
            return (job.jobTitle || '').toLowerCase().includes(term) || (job.company || '').toLowerCase().includes(term) || (job.location || '').toLowerCase().includes(term)
        })
    }, [showList, searchTerm])

    return (
        <div className="w-4/5 md-mx:w-[92%] mx-auto">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-2xl font-semibold mb-1 sm-mx:text-xl xs-mx:text-lg">My Gallery</div>
                    <div className="text-sm text-gray-500">Showing <span className="font-semibold">{filteredList.length}</span> jobs</div>
                </div>
                <div className="flex gap-3 items-center">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search jobs, companies or locations"
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-third text-sm w-72 placeholder-gray-400"
                    />
                </div>
            </div>

            <div>
                <Tabs variant="outline" radius="lg" value={activeTab} onChange={handleTabChange}>
                    <Tabs.List className="[&_button]:!text-lg font-semibold [&_button[data-active='true']]:text-primary xs-mx:[&_button]:!px-2">
                        <Tabs.Tab value="SAVED">Saved</Tabs.Tab>
                        <Tabs.Tab value="APPLIED">Applied</Tabs.Tab>
                        <Tabs.Tab value="OFFERED">Offered</Tabs.Tab>
                        <Tabs.Tab value="INTERVIEWING">Scheduled</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={activeTab}>
                        {filteredList.length > 0 ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm-mx:gap-4 xs-mx:gap-3'>
                                {filteredList.map((item: any, index: any) => <JobCard key={index} {...item} {...{[activeTab.toLowerCase()]:true}} />)}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center mt-10 bs-mx:mt-20'>
                                <img src={typeof NoJobsImage === 'string' ? NoJobsImage : (NoJobsImage as any)?.src ?? (NoJobsImage as any)?.default ?? ''} alt="No jobs available" className='w-[20%] h-[20%] bs-mx:w-[40%] bs-mx:h-[40%]' />
                                <p className='mt-4 text-lg font-semibold text-gray-500 text-center'>
                                    No jobs found in this category <br /> 
                                    Note: Only applications submitted through this portal will be displayed here , NO Redirected apply.
                                </p>
                            </div>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    )
}

export default JobGallery
