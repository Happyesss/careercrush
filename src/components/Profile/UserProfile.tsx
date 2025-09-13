import { Avatar, Divider, FileInput, Indicator } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import Info from "./Info";
import { changeProfile } from "../../Slices/ProfileSlice";
import About from "./About";
import Skills from "./Skills";
import Experience from "./Experience";
import Certificate from "./Certificate";
import { successNotification } from "../../Services/NotificationService";
import { getBase64 } from "../../Services/Utilities";
import ProfilePostedJob from "../PostedJob/ProfilePostedJob";
import MentorInfo from "./MentorInfo";
import SessionManagement from "./SessionManagement";
import { useTheme } from "../../ThemeContext";

const UserProfile = (props: any) => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);
  const { isDarkMode } = useTheme();

  const handleProfilePicChange = async (image: any) => {
    if (image.size > 1 * 1024 * 1024) { 
      successNotification('Profile Picture must be less than 1MB', 'Error');
      return;
    }
    let picture: any = await getBase64(image);
    let updatedProfile = { ...profile, picture: picture.split(',')[1] };
    dispatch(changeProfile(updatedProfile));
    successNotification('Profile Picture Updated Successfully', 'Success');
  };

  const handleprofileBackgroundChange = async (image: any) => {
    if (image.size > 1 * 1024 * 1024) {
      successNotification('Profile Background must be less than 1MB', 'Error');
      return;
    }
    let profileBackground: any = await getBase64(image);
    let updatedProfile = { ...profile, profileBackground: profileBackground.split(',')[1] };
    dispatch(changeProfile(updatedProfile));
    successNotification('ProfileBackground Updated Successfully', 'Success');
  };

  return (

    <div className="w-full lg:w-2/3 mx-auto lg:mx-10 lg-mx:w-full bs-mx:mx-2 animate-fade-in">
      {/* Profile Header Card */}
      <div className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-third border border-gray-700/30 shadow-2xl' 
          : 'bg-white border border-gray-200/60 shadow-xl hover:shadow-2xl'
      }`}>
        
        {/* Background Image Section */}
        <div className="relative">
          <img
            className="rounded-t-2xl w-full h-44 xsm:h-48 xs:h-52 sm:h-56 md:h-60 bs:h-64 lg:h-68 xl:h-72 object-cover transition-transform duration-500 hover:scale-105"
            src={profile.profileBackground ? `data:image/jpeg;base64,${profile.profileBackground}` : ((): string => { const mod = require(`../../assets/images/bgimg.jpg`); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
            alt="Profile Background"
          />

          {/* Background Image Edit Button */}
          <div className="absolute top-12 right-4">
            <Indicator
              className="[&_.mantine-Indicator-indicator]:!border-0 [&_.img]:hover:opacity-80"
              autoContrast
              inline
              offset={30}
              label={<IconCamera className="h-4/5 w-4/5" stroke={1.5} />}
              size="48"
              position="bottom-end"
              color="gray.7"
            >
              <FileInput
                onChange={handleprofileBackgroundChange}
                className={`absolute bottom-2 right-2 z-[201] w-12 [&_div]:text-transparent rounded-full transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                }`}
                variant="unstyled"
                size="lg"
                radius="xl"
                accept="image/png,image/jpeg"
              />
            </Indicator>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6 lg-mx:left-4">
            <Indicator color="transparent">
              <Avatar
                className={`!w-32 !h-32 xs:!w-36 xs:!h-36 sm:!w-40 sm:!h-40 md:!w-44 md:!h-44 lg:!w-48 lg:!h-48 rounded-full cursor-pointer transition-all duration-300 border-4 ${
                  isDarkMode 
                    ? 'border-third hover:border-primary/50' 
                    : 'border-white hover:border-primary/30'
                } shadow-xl hover:shadow-2xl hover:scale-105`}
                src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : ((): string => { const mod = require(`../../assets/images/avatar.png`); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
                alt="Profile"
                onClick={() => document.getElementById('profile-pic-input')?.click()}
              />
              <FileInput
                id="profile-pic-input"
                onChange={handleProfilePicChange}
                className="absolute bottom-2 right-2 z-[201] w-12 [&_div]:text-transparent sm-mx:!w-8"
                variant="unstyled"
                size="lg"
                radius="xl"
                accept="image/png,image/jpeg"
                style={{ display: 'none' }}
              />
            </Indicator>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 pb-6">
          <Info />
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="mt-8 space-y-6">
        {/* About Section - Only show for non-mentors */}
        {user.accountType !== 'MENTOR' && (
          <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
            isDarkMode 
              ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
              : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
          }`}>
            <About />
          </div>
        )}

        {/* Company Posted Jobs Section */}
        {user.accountType === 'COMPANY' && (
          <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
            isDarkMode 
              ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
              : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
          }`}>
            <ProfilePostedJob />
          </div>
        )}
        
        {/* Skills, Experience, and Certificates for Applicants */}
        {user.accountType !== 'COMPANY' && user.accountType !== 'MENTOR' && (
          <>
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.1s' }}>
              <Skills />
            </div>
            
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.2s' }}>
              <Experience />
            </div>
            
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.3s' }}>
              <Certificate />
            </div>
          </>
        )}

        {/* Mentor Specific Sections */}
        {user.accountType === 'MENTOR' && (
          <>
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.1s' }}>
              <MentorInfo />
            </div>
            
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.2s' }}>
              <SessionManagement />
            </div>
            
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.3s' }}>
              <Experience />
            </div>
            
            <div className={`rounded-2xl p-6 transition-all duration-300 animate-slide-up ${
              isDarkMode 
                ? 'bg-third border border-gray-700/30 shadow-lg hover:shadow-xl' 
                : 'bg-white border border-gray-200/60 shadow-md hover:shadow-lg'
            }`} style={{ animationDelay: '0.4s' }}>
              <Certificate />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
