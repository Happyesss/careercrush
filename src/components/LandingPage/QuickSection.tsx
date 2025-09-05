import { IconPalette, IconCode, IconArticle, IconSchool, IconSpeakerphone } from "@tabler/icons-react";
import digitalMarketingImage from '../../assets/images/digital-marketing.png';
import uiuxImage from '../../assets/images/ui-ux.jpg'
import webdevImage from '../../assets/images/webdevimg.png'
import { useTheme } from "../../ThemeContext";
import { Loder } from "./Loder";
import Dot from "./Dot";
import Heading from './Heading'

const quickItems = [
    {
        title: "Digital Marketing",
        description: "Master the art of online promotion, from social media to search engine marketing.",
        bg: "#ffecc7",
        icon: <IconPalette />,
        image: digitalMarketingImage
    },
    {
        title: "UI/UX Design",
        description: "Craft beautiful, user-centered designs that enhance user experiences.",
        bg: "#ffdfdf",
        icon: <IconCode />,
        image: uiuxImage
    },
    {
        title: "Web Development",
        description: "Build dynamic, responsive websites using the latest technologies and frameworks.",
        bg: "#d1ecf1",
        icon: <IconArticle />,
        image: webdevImage
    },
    {
        title: "Jobs",
        description: "Find your dream job and take the next step in your career.",
        bg: "#ddc2ff",
        icon: <IconSpeakerphone />,
        image: digitalMarketingImage
    },
    {
        title: "Internship",
        description: "Gain hands-on experience,and kickstart your career in a professional setting.",
        bg: "#cdd3ff",
        icon: <IconSchool />,
        image: "https://static.wixstatic.com/media/ad04f7_1450ab6bf1ac44c98cf9f259b44f4d84~mv2.png/v1/fill/w_420,h_420,al_c,lg_1,q_85,enc_avif,quality_auto/ad04f7_1450ab6bf1ac44c98cf9f259b44f4d84~mv2.png"
    }
];

const QuickSection = () => {
    const { isDarkMode } = useTheme();
    return (
      <div className={`py-20 w-full flex flex-col items-center transition-colors ${isDarkMode ? 'bg-[var(--color-secondary)]' : 'bg-white'}`}>

            <Heading heading={"Empowering Ambitions. Transforming Careers"} subheading={"We believe that everyone deserves the chance to land their dream job, role, and company"}/>

            <div className="grid w-[75%] mt-10 grid-cols-1 md:grid-cols-3  gap-8 sm:gap-6">
           {quickItems.map((item, index) => (
            <div
              key={index}
              className="relative h-[200px] bg-white dark:bg-third  p-5 rounded-xl  hover:shadow-lg transition-transform duration-300 hover:-translate-y-1  flex flex-col justify-between"
            
            >
              <div className="flex flex-col justify-between h-full ">

                <span className="text-primary ">
                  {item.icon}
                </span>
                <div>
                       <h5 className="text-black text-xl font-medium tracking-tighter mb-2">{item.title}</h5>
                       <p className="text-lightBlack text-xs sm:text-sm">{item.description}</p>  
                </div>
             
              </div>
              
            </div>
          ))}
        </div>

      </div>
    );
};

export default QuickSection;
