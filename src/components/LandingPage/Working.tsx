import { IconBriefcaseFilled, IconBrowserCheck, IconBrowserShare, IconChecklist } from '@tabler/icons-react';
import { useTheme } from "../../ThemeContext";
import Dot from './Dot';
import Heading from './Heading';

const Working = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`mt-28 pb-20 flex flex-col items-center ${isDarkMode ? 'bg-cape-cod-950 text-white' : ' text-black'}`}>

      <Dot name='Process'/>

      <Heading heading={"Kickstart Your Journey"} subheading={"Take the first step toward building the career you’ve always wanted."}/>

      {/* Heading Section */}
      

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-8">
        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img className="w-[30rem]" src="https://mindfulbots.com/assets/about-rpa/Public-Sector.png" alt="Landing" />
        </div>

        {/* Steps Section */}
        <div className="md:w-1/2  flex flex-col gap-8">
          {/* Step 1 */}
        
        <div className='flex items-start justify-center border-b border-b-gray-300 pb-6'>

              <div className=' w-[10%] flex items-start mr-3  justify-center '>
                <h1 className='rounded-full border border-[#cccccc] text-black px-2 py-1 text-[12px] font-medium'>
                01

                </h1>
              </div>

              <div className='text-2xl tracking-tighter w-[50%] font-medium text-black'>
                      Create Resume
              </div>


              <div className='text-[14px] text-lightBlack'>
                     Make you resume add project and archivements to get started.

              </div>
        </div>

                <div className='flex items-start justify-center border-b border-b-gray-300 pb-6'>

              <div className=' w-[10%] flex items-start mr-3  justify-center '>
                <h1 className='rounded-full border border-[#cccccc] text-black px-2 py-1 text-[12px] font-medium'>
                02

                </h1>
              </div>

              <div className='text-2xl tracking-tighter w-[50%] font-medium text-black'>
                      Create Resume
              </div>


              <div className='text-[14px] text-lightBlack'>
                     Make you resume add project and archivements to get started.

              </div>
        </div>



        <div className='flex items-start justify-center border-b border-b-gray-300 pb-6'>

        <div className=' w-[10%] flex items-start mr-3  justify-center '>
          <h1 className='rounded-full border border-[#cccccc] text-black px-2 py-1 text-[12px] font-medium'>
          01

          </h1>
                  </div>

          <div className='text-2xl tracking-tighter w-[50%] font-medium text-black'>
                  Create Resume
          </div>


          <div className='text-[14px] text-lightBlack'>
          Make you resume add project and archivements to get started.

          </div>
        </div>



                    <div className='flex items-start justify-center border-b border-b-gray-300 pb-6'>

            <div className=' w-[10%] flex items-start mr-3  justify-center '>
              <h1 className='rounded-full border border-[#cccccc] text-black px-2 py-1 text-[12px] font-medium'>
              01

              </h1>
            </div>

            <div className='text-2xl tracking-tighter w-[50%] font-medium text-black'>
                    Create Resume
            </div>


            <div className='text-[14px] text-lightBlack'>
            Make you resume add project and archivements to get started.

            </div>
            </div>





        </div>
      </div>
    </div>
  );
};

export default Working;