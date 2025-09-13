import { ActionIcon } from "@mantine/core"
import { IconCancel, IconPencil, IconPlus, IconCertificate } from "@tabler/icons-react"
import CertificateCard from "./CertificateCard"
import CertificateInput from "./CertificateInput"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useTheme } from "../../ThemeContext"

const Certificate = () => {
    const [addCerti, setAddCerti] = useState(false);
    const [edit, setEdit] = useState(false);
    const profile = useSelector((state: any) => state.profile);
    const { isDarkMode } = useTheme();
    
    const handleEdit = () => {
        setEdit(!edit);
    }
    
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
            <IconCertificate className="h-5 w-5 text-orange-600" stroke={1.5} />
          </div>
          <h2 className={`text-xl md:text-2xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Certifications & Achievements
          </h2>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <ActionIcon 
            variant="subtle" 
            radius="lg" 
            color="green.4" 
            size="lg" 
            onClick={() => setAddCerti(true)}
            className={`transition-all duration-200 hover:scale-110 ${
              isDarkMode ? 'hover:bg-green-500/10' : 'hover:bg-green-50'
            }`}
          >
            <IconPlus className="h-4 w-4" stroke={1.5} />
          </ActionIcon>

          <ActionIcon 
            variant="subtle" 
            radius="lg" 
            color={edit ? "red.8" : "blue.4"} 
            size="lg" 
            onClick={handleEdit}
            className={`transition-all duration-200 hover:scale-110 ${
              edit 
                ? (isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50')
                : (isDarkMode ? 'hover:bg-blue-500/10' : 'hover:bg-blue-50')
            }`}
          >
            {edit ? (
              <IconCancel className="h-4 w-4" />
            ) : (
              <IconPencil className="h-4 w-4" stroke={1.5} />
            )}
          </ActionIcon>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {profile?.certifications && profile.certifications.length > 0 ? (
          <div className="space-y-6">
            {profile.certifications.map((certi: any, index: number) => (
              <CertificateCard key={index} index={index} {...certi} edit={edit} />
            ))}
          </div>
        ) : !addCerti ? (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="italic">
              Add your certifications and achievements to highlight your expertise and credentials.
            </div>
          </div>
        ) : null}
        
        {addCerti && (
          <div className="mt-6">
            <CertificateInput setEdit={setAddCerti} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Certificate