import { useEffect, useState } from "react";
import PostedJobCard from "./PostedJobCard";
import { useTheme } from "../../ThemeContext";

const PostedJobs = (props: any) => {
  type TabKey = 'ACTIVE' | 'DRAFT' | 'CLOSED';
  const [activeTab, setActiveTab] = useState<TabKey>('ACTIVE');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const status = props.job?.jobStatus as string | undefined;
    if (status === 'ACTIVE' || status === 'DRAFT' || status === 'CLOSED') {
      setActiveTab(status);
    } else {
      setActiveTab('ACTIVE');
    }
  }, [props.job]);

  const jobList = props.jobList ?? [];
  const counts = {
    ACTIVE: jobList.filter((job: any) => job?.jobStatus === 'ACTIVE').length,
    DRAFT: jobList.filter((job: any) => job?.jobStatus === 'DRAFT').length,
    CLOSED: jobList.filter((job: any) => job?.jobStatus === 'CLOSED').length,
  } as const;

  console.log(jobList);

  const tabBtnClass = (selected: boolean) => {
    const base = 'px-4 py-2 rounded-lg text-xs font-medium ';
    const unselectedDark = 'bg-[#3d312e] text-[#d67757] ';
    const unselectedLight = 'bg-white text-black border border-cape-cod-200 ';
    const selectedDark = 'bg-primary text-cape-cod-900';
    const selectedLight = 'bg-primary text-white';
    return [
      base,
      selected ? (isDarkMode ? selectedDark : selectedLight) : (isDarkMode ? unselectedDark : unselectedLight),
    ].join(' ');
  };

  return (
    <div className="w-1/4.5 mt-5">
      {/* <div className="text-2xl font-semibold mb-5">Jobs</div> */}
      <div>
        <div role="tablist" aria-label="Posted jobs tabs" className={`flex gap-3 font-medium`}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ACTIVE'}
            className={tabBtnClass(activeTab === 'ACTIVE')}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Active [{counts.ACTIVE}]
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'DRAFT'}
            className={tabBtnClass(activeTab === 'DRAFT')}
            onClick={() => setActiveTab('DRAFT')}
          >
            Drafts [{counts.DRAFT}]
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'CLOSED'}
            className={tabBtnClass(activeTab === 'CLOSED')}
            onClick={() => setActiveTab('CLOSED')}
          >
            Close [{counts.CLOSED}]
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-wrap mt-5 gap-5">
        {jobList?.filter((job: any) => job?.jobStatus === activeTab)
          .map((item: any, index: any) => <PostedJobCard key={index} {...item} />)}
      </div>
    </div>
  );
};

export default PostedJobs;