import React from 'react'
import { useTheme } from "../../ThemeContext";


const Heading = ({ heading, subheading }) => {

    const { isDarkMode } = useTheme();


  return (
    <div className={`flex items-center   w-[80%] md:w-[100%] text-center justify-center flex-col gap-3 ${isDarkMode ? ' text-white' : ' text-black'}`}>
    <h1 className="md:text-3xl text-xl font-medium tracking-tight">{heading}</h1>
    <p className="text-center text-lightBlack w-full md:w-[500px]">{subheading}</p>
</div>  )
}

export default Heading