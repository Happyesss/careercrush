'use client'
import JobDescription from '@/components/Pages/JobDescription'
import { useTheme } from '@/ThemeContext'

export default function JobDescriptionPage() {
  const { isDarkMode } = useTheme(); 
  return (
    <div className={`${isDarkMode ? 'bg-secondary' : 'bg-secondary'}`}>
      <JobDescription />
    </div>
  );
}
