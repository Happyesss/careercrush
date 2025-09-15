"use client";

import { Divider } from "@mantine/core"

import UserProfile from "../Profile/UserProfile"
import { profile } from "../../assets/Data/TalentData"
import { useEffect, useState } from "react"
import { getAllProfiles } from "../../Services/ProfileServices"
import RightSidebar from "../Profile/RightSidebar"
import { useTheme } from "../../ThemeContext"

const ProfilePage = () => {
  const [talents, setTalents] = useState<any>([])
  const { isDarkMode } = useTheme();
 useEffect(() => {
  getAllProfiles().then((res) => {
    setTalents(res);
  }).catch((err) => {
    console.error(err);
  });
}, [])
  return (
  <div className={`min-h-[90vh] mb-8 ${isDarkMode ? 'bg-cape-cod-950 text-gray-200' : 'bg-cape-cod-10 text-black'}`}>
        <Divider mx="md" mb="xl" color={isDarkMode ? 'dark' : 'transparent'}/>
  <div className='flex gap-5 pr-3 sm:pr-4 md:pr-6 xl:pr-8'>

        <UserProfile {...profile}/>
        <RightSidebar />
        </div>
    </div>
  )
}

export default ProfilePage