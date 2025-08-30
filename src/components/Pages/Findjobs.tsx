"use client";

"use client";

import SearchBar from "../FindJobs/SearchBar"
import Jobs from "../FindJobs/Jobs"
import FilterSidebar from "../FindJobs/FilterSidebar"
import { useTheme } from "../../ThemeContext"
import { Helmet } from "react-helmet-async" 

const Findjobs = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Helmet>
        <title>Find Jobs - CareerCrush</title>
        <meta name="description" content="Search and apply for jobs on our portal. Find the best job opportunities that match your skills and preferences. CareerCrush serves you the best" />
      </Helmet>
      <div className={`min-h-[100vh] mt-10 ${isDarkMode ? 'bg-secondary text-primary' : 'bg-secondary text-black'} ]`}>
        <SearchBar />
        <div className="flex flex-col  lg:flex-row">
          {/* <div className="w-full lg:w-1/4 ">
            <div className='text-2xl my-6 mx-4 ml-7 font-semibold sm-mx:hidden'>Filter Jobs</div>
            <FilterSidebar />
          </div> */}
            <Jobs />
        </div>
      </div>
    </>
  )
}

export default Findjobs