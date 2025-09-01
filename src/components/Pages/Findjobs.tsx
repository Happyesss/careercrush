"use client";

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
      <div className={`min-h-screen py-6 ${isDarkMode ? 'bg-secondary text-primary' : 'bg-secondary text-black'}`}>
        <div className="flex flex-col lg:flex-row max-w-9xl mx-auto px-6">
          <div >
           
            <FilterSidebar />
          </div>
          <div className="flex-1 lg:ml-6">
            <Jobs />
          </div>
        </div>
      </div>
    </>
  )
}

export default Findjobs;