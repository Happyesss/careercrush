"use client";

import Marquee from "react-fast-marquee";
import { companies } from "../../assets/Data/Data";
import { useTheme } from "../../ThemeContext";
import Dot from "./Dot";

const Companies = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`mt-[450px] flex items-center flex-col pb-5 ${isDarkMode ? ' text-white' : ' text-black'}`}>


     <Dot name="Archivements" />

      <div className={`text-3xl tracking-tight text-center font-medium mb-10 ${isDarkMode ? 'text-cape-cod-100' : 'text-cape-cod-900'}`}>

        Featuring <span className="text-primary">100+</span> jobs by
      </div>
      <Marquee pauseOnHover={true}>
        {companies.map((company, index) => {
          const mod = require(`../../assets/Companies/${company}.png`)
          const src = typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? '')
          return (
            <div key={index} className={`mx-8 px-2 py-1 hover:bg-cape-cod-900 rounded-xl cursor-pointer `}>
              <img className="h-14" src={src} alt={company} />
            </div>
          )
        })}
      </Marquee>
    </div>
  );
}

export default Companies;