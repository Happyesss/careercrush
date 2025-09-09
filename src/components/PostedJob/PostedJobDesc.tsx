import { Badge, Tabs } from "@mantine/core";
import JobDesc from "../JobDesc/JobDesc";
import TalentCard from "../FindTalent/TalentCard";
import { useEffect, useState } from "react";
import { useTheme } from "../../ThemeContext";

const PostedJobDesc = (props: any) => {
    const [tab, setTab] = useState("overview");
    const [arr, setArr] = useState<any>([]);
    const { isDarkMode } = useTheme();
    const handleTabChange = (value: any) => {
        setTab(value);
        if (value === "applicants") {
            setArr(props.applicants?.filter((x: any) => x.applicationStatus === "APPLIED"));
        }
        else if (value === "invited") {
            setArr(props.applicants?.filter((x: any) => x.applicationStatus === "INTERVIEWING"));
        }
        else if (value === "offered") {
            setArr(props.applicants?.filter((x: any) => x.applicationStatus === "OFFERED"));
        }
        else if (value === "rejected") {
            setArr(props.applicants?.filter((x: any) => x.applicationStatus === "REJECTED"));
        }
    }
    useEffect(() => {
        handleTabChange("overview");
    }, [props])

    return (
        <div className="mt-5 w-3/4 px-5 md-mx:w-full sm-mx:px-0">
            {props.jobTitle?<><div className="text-3xl font-semibold flex tracking-tight items-center">
                {props.jobTitle}
            </div>
            <div className={`font-medium mb-5 tracking-tight mt-1 ${isDarkMode ? "text-white" : "text-black"}`}>
                {props.location}
            </div>
            <Tabs variant="pills" className="!text-sm !rounded-lg" radius={"xl"} value={tab} onChange={handleTabChange}>
                <Tabs.List className=" [&_button]:!text-xs  font-semibold !mb-10 [&_button[data-active='true']]:!text-white [&_button[data-active='true']]:!bg-primary ">
                    <Tabs.Tab value="overview" className={` ${isDarkMode ? "!bg-[#3b2f23]" : "!bg-[#ffebe7]" } !text-primary`}>Overview</Tabs.Tab>
                    <Tabs.Tab value="applicants" className={` ${isDarkMode ? "!bg-[#3b2f23]" : "!bg-[#ffebe7]" } !text-primary`}>Applicants</Tabs.Tab>
                    <Tabs.Tab value="invited" className={` ${isDarkMode ? "!bg-[#3b2f23]" : "!bg-[#ffebe7]" } !text-primary`}>Invited</Tabs.Tab>
                    <Tabs.Tab value="offered" className={` ${isDarkMode ? "!bg-[#3b2f23]" : "!bg-[#ffebe7]" } !text-primary`}>Offered</Tabs.Tab>
                    <Tabs.Tab value="rejected" className={` ${isDarkMode ? "!bg-[#3b2f23]" : "!bg-[#ffebe7]" } !text-primary`}>Rejected</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" className="[&>div]:w-full">
                    <JobDesc {...props} edit={true}  />
                </Tabs.Panel>

                <Tabs.Panel value="applicants">
                    <div className={`flex mt-10 h-[90vh] sm:h-[70vh] rounded-md overflow-y-scroll p-3 ${isDarkMode ? "bg-third" : "bg-white"} flex-col`}>
                        {
                           arr?.length?arr.map((talent: any, index: any) => index < 6 && <TalentCard key={index} {...talent} posted={true} />):<div className="text-2xl font-semibold">No Applicants</div>
                        }
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="invited">
                    <div className={`flex mt-10 h-[90vh] sm:h-[70vh] rounded-md overflow-y-scroll p-3 ${isDarkMode ? "bg-third" : "bg-white"} flex-col`}>
                        {
                            arr?.length?arr.map((talent: any, index: any) => index < 6 && <TalentCard key={index} {...talent} invited={true} />):<div className="text-2xl font-semibold">No Invited Applicants</div>
                        }
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="offered">
                    <div className={`flex mt-10 h-[90vh] sm:h-[70vh] rounded-md overflow-y-scroll p-3 ${isDarkMode ? "bg-third" : "bg-white"} flex-col`}>
                        {
                            arr?.length?arr.map((talent: any, index: any) => index < 6 && <TalentCard key={index} {...talent} offered={true} />):<div className="text-2xl font-semibold">No Offered Applicants</div>
                        }
                    </div>
                </Tabs.Panel>
                <Tabs.Panel value="rejected">
                    <div className={`flex mt-10 h-[90vh] sm:h-[70vh] rounded-md overflow-y-scroll p-3 ${isDarkMode ? "bg-third" : "bg-white"} flex-col`}>
                        {
                           arr?.length?arr.map((talent: any, index: any) => index < 6 && <TalentCard key={index} {...talent} rejected={true} />):<div className="text-2xl font-semibold ">No Rejected Applicants</div>
                        }
                    </div>
                </Tabs.Panel>
            </Tabs>
            </>:<div className="text-2xl font-semibold flex items-center justify-center min-h-[70vh]">No Job Selected</div>}
        </div>
    );
};

export default PostedJobDesc;
