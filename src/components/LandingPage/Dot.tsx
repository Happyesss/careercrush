import React from 'react'
import { useTheme } from "../../ThemeContext";


const Dot = ({ name }: { name: string }) => {

  const { isDarkMode } = useTheme();

  return (
    <div className={`flex items-center justify-center text-sm tracking-normal font-normal mb-8 px-4 py-1 rounded-full border border-gray-200 ${isDarkMode ? ' text-white' : ' text-black'}`}>
    <div className="h-2 w-2 mr-2 bg-primary dark:text-primary rounded-full"></div> {name}
  </div>
  )
}

export default Dot