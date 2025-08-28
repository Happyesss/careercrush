import { formatDate } from "../../Services/Utilities"

const ExperienceCard = (props:any) => {
  return (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-cape-cod-800 rounded-md">
              {props.companyLogo ? (
                <img 
                  className="h-7 w-7 object-cover rounded" 
                  src={`data:image/jpeg;base64,${props.companyLogo}`} 
                  alt="Company logo" 
                />
              ) : (
                <img 
                  className="h-7" 
                  src={((): string => { 
                    try {
                      const mod = require(`../../assets/Icons/${props.company}.png`); 
                      return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); 
                    } catch {
                      // Fallback to a generic company icon
                      const defaultMod = require(`../../assets/Icons/Google.png`);
                      return typeof defaultMod === 'string' ? defaultMod : (defaultMod?.default?.src ?? defaultMod?.src ?? defaultMod?.default ?? '');
                    }
                  })()} 
                  alt="Company" 
                />
              )}
            </div>
            <div>
              <div className="font-semibold">{props.title}</div>
              <div className="text-sm text-cape-cod-300">
                {props.company} &#x2022;  {props.location}
              </div>
            </div>
          </div>
          <div>{formatDate(props.startDate)} - {formatDate(props.endDate)} </div>
          </div>
          <div className="text-sm text-cape-cod-300 text-justify">
            {props.description}
            </div>
    </div>
  )
}

export default ExperienceCard