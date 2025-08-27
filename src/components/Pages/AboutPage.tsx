"use client";

import { Divider } from "@mantine/core";
import { useTheme } from "../../ThemeContext";
import { AboutUs } from "../AboutUs/AboutUs";

const AboutPage = () => {
   const { isDarkMode } = useTheme();
  
    return (
      <div className={`min-h-[100vh] ${isDarkMode ? 'bg-secondary text-primary' : 'bg-secondary text-primary'}  mt-[-65px]`}>
        <AboutUs />
        <Divider mx="md" size="xs" color={isDarkMode ? 'dark' : 'gray'} />
      </div>
    );
}

export default AboutPage