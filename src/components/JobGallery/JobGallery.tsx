import { Tabs } from "@mantine/core"
import JobCard from "../FindJobs/JobCard"
import { useEffect, useState } from "react";
import { getAllJobs } from "../../Services/JobService";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import NoJobsImage from "../../assets/images/404Error.png";
import { IconBookmark, IconFileText, IconTarget, IconCalendar } from '@tabler/icons-react'

const JobGallery = () => {
    const profile = useSelector((state: any) => state.profile)
    const user = useSelector((state: any) => state.user)
    const { isDarkMode } = useTheme()
    const [activeTab, setActiveTab] = useState<any>('SAVED')
    const [jobList, setJobList] = useState<any>([])
    const [showList, setShowList] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        setIsLoading(true)
        getAllJobs()
            .then((res) => {
                setJobList(res);
                // Initialize with saved jobs
                const savedJobsList = res.filter((job: any) => profile.savedJobs?.includes(job.id));
                setShowList(savedJobsList);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false)
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

    const getTabIcon = (tabValue: string) => {
        const color = isDarkMode ? '#d67757' : '#fc743e'
        const size = 18
        switch(tabValue) {
            case 'SAVED':
                return <IconBookmark size={size} color={color} />
            case 'APPLIED':
                return <IconFileText size={size} color={color} />
            case 'OFFERED':
                return <IconTarget size={size} color={color} />
            case 'INTERVIEWING':
                return <IconCalendar size={size} color={color} />
            default:
                return null
        }
    }

    const getTabCount = (tabValue: string) => {
        if (tabValue === "SAVED") {
            return jobList.filter((job: any) => profile.savedJobs?.includes(job.id)).length;
        } else {
            return jobList.filter((job: any) => 
                job.applicants?.some((applicant: any) => 
                    applicant.applicantId === user.id && applicant.applicationStatus === tabValue
                )
            ).length;
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Header Section */}
            <div className={`relative overflow-hidden rounded-3xl mb-8 p-6 md:p-8 ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-[#262624] via-[#201e1c] to-[#1a1918]' 
                    : 'bg-gradient-to-br from-[#faf9f5] via-white to-[#f8f6f0]'
            }`}>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                       
                        <div>
                            <h1 className={`text-2xl md:text-3xl xl:text-4xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                My Job Gallery
                            </h1>
                            <p className={`text-sm md:text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Track your career journey in one beautiful place
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 opacity-10">
                    <div className={`w-full h-full rounded-full ${
                        isDarkMode ? 'bg-primary' : 'bg-primary'
                    } animate-pulse-gentle`}></div>
                </div>
                <div className="absolute -bottom-4 md:-bottom-8 -left-4 md:-left-8 w-16 md:w-32 h-16 md:h-32 opacity-5">
                    <div className={`w-full h-full rounded-full ${
                        isDarkMode ? 'bg-white' : 'bg-gray-900'
                    } animate-float`}></div>
                </div>
            </div>

            {/* Enhanced Tabs Section */}
            <div className={`rounded-2xl p-4 md:p-6 mb-8 ${
                isDarkMode 
                    ? 'bg-gradient-to-r from-third/50 to-secondary/30 border border-gray-800' 
                    : 'bg-gradient-to-r from-white to-gray-50 border border-gray-200'
            } backdrop-blur-sm shadow-lg`}>
                <Tabs 
                    variant="pills" 
                    radius="xl" 
                    value={activeTab} 
                    onChange={handleTabChange}
                    className="job-gallery-tabs"
                >
                    <Tabs.List className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 bg-transparent">
                        {['SAVED', 'APPLIED', 'OFFERED', 'INTERVIEWING'].map((tab) => (
                            <Tabs.Tab 
                                key={tab}
                                value={tab}
                                className={`
                                    relative px-3 md:px-6 py-3 md:py-4 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300
                                    ${activeTab === tab 
                                        ? (isDarkMode 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                                            : 'bg-primary text-white shadow-lg shadow-primary/25'
                                        )
                                        : (isDarkMode 
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white' 
                                            : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200'
                                        )
                                    }
                                    transform hover:scale-105 active:scale-95
                                `}
                            >
                                <div className="flex items-center justify-center gap-1 md:gap-2">
                                    <span className="text-sm md:text-lg">{getTabIcon(tab)}</span>
                                    <span className="hidden sm:inline text-xs md:text-sm">
                                        {tab === 'INTERVIEWING' ? 'Scheduled' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                                    </span>
                                    <span className={`
                                        ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold
                                        ${activeTab === tab 
                                            ? 'bg-white/20 text-white' 
                                            : (isDarkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary')
                                        }
                                    `}>
                                        {getTabCount(tab)}
                                    </span>
                                </div>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>

                    <Tabs.Panel value={activeTab} className="mt-6 md:mt-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16 md:py-20">
                                <div className={`animate-spin rounded-full h-12 md:h-16 w-12 md:w-16 border-4 border-t-primary ${
                                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}></div>
                            </div>
                        ) : showList.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                    {showList.map((item: any, index: any) => (
                                        <div 
                                            key={item.id} 
                                            className="animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 0.1}s`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            <JobCard 
                                                {...item} 
                                                {...{[activeTab.toLowerCase()]: true}} 
                                            />
                                        </div>
                                    ))}
                                </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 md:py-20">
                                <div className={`p-6 md:p-8 rounded-3xl mb-6 ${
                                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                                }`}>
                                    <img 
                                        src={typeof NoJobsImage === 'string' ? NoJobsImage : (NoJobsImage as any)?.src ?? (NoJobsImage as any)?.default ?? ''} 
                                        alt="No jobs available" 
                                        className="w-24 md:w-32 h-24 md:h-32 opacity-60"
                                    />
                                </div>
                                <h3 className={`text-lg md:text-xl font-semibold mb-2 text-center ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    No jobs in {activeTab.toLowerCase()} category
                                </h3>
                                <p className={`text-center max-w-md text-sm md:text-base px-4 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {activeTab === 'SAVED' 
                                        ? "Start saving jobs that interest you to build your personal collection."
                                        : "Applications submitted through this portal will appear here."
                                    }
                                </p>
                                {activeTab !== 'SAVED' && (
                                    <p className={`text-xs mt-2 text-center px-4 ${
                                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                        Note: Only applications submitted through this portal will be displayed here.
                                    </p>
                                )}
                            </div>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    )
}

export default JobGallery