import { formatDate } from "../../Services/Utilities"

const CertiCard = (props:any) => {
    return (
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <div className="p-2 bg-cape-cod-800 rounded-md">
                  {props.certificateImage ? (
                    <img 
                      className="h-7 w-7 object-cover rounded" 
                      src={`data:image/jpeg;base64,${props.certificateImage}`} 
                      alt="Certificate" 
                    />
                  ) : (
                    <img 
                      className="h-7" 
                      src={((): string => { 
                        try {
                          const mod = require(`../../assets/Icons/${props.issuer}.png`); 
                          return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); 
                        } catch {
                          // Fallback to a generic certificate icon
                          const defaultMod = require(`../../assets/Icons/Google.png`);
                          return typeof defaultMod === 'string' ? defaultMod : (defaultMod?.default?.src ?? defaultMod?.src ?? defaultMod?.default ?? '');
                        }
                      })()} 
                      alt="Certificate issuer" 
                    />
                  )}
                </div>
                <div>
                    <div className="font-semibold">{props.name}</div>
                    <div className="text-sm text-cape-cod-300">
                        {props.issuer}
                    </div>
                </div>
            </div>
            <div className="text-sm text-cape-cod-300 flex flex-col items-end">
                        <div>Issued on {formatDate(props.issueDate)}</div>
                        <div>ID: {props.certificateID}</div>
                    </div>
        </div>

    )
}

export default CertiCard