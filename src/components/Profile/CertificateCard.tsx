import { ActionIcon } from "@mantine/core"
import { IconTrash } from "@tabler/icons-react"
import { formatDate } from "../../Services/Utilities"
import { useDispatch, useSelector } from "react-redux";
import { successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useTheme } from "../../ThemeContext";

const CertificateCard = (props:any) => {
    const dispatch = useDispatch();
    const profile = useSelector((state: any) => state.profile);
    const { isDarkMode } = useTheme();
    const handleDelete = () => {
        let certi = [...profile.certifications];
        certi.splice(props.index, 1);
        let updatedProfile = { ...profile, certifications: certi };
        dispatch(changeProfile(updatedProfile));
        successNotification('Certificate Deleted Successfully', 'Success');
    }
    return (
        <div>
        <div className="flex justify-between">
            <div className="flex gap-2 items-center mb-4">
                <div className={`p-2 rounded-md ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-100'}`}>
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
                                    // Fallback to a generic certificate icon - using an existing icon as placeholder
                                    const defaultMod = require(`../../assets/Icons/Google.png`);
                                    return typeof defaultMod === 'string' ? defaultMod : (defaultMod?.default?.src ?? defaultMod?.src ?? defaultMod?.default ?? '');
                                }
                            })()} 
                            alt="Certificate issuer" 
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">{props.name}</div>
                    <div className="text-sm text-cape-cod-300">
                        {props.issuer}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 ">
            <div className="text-sm text-cape-cod-300 flex flex-col items-end">
                        <div>Issued {formatDate(props.issueDate)}</div>
                        <div>ID: {props.certificateID}</div>
                    </div>
                    {props.edit&&<ActionIcon onClick={handleDelete} variant="subtle" radius="lg" color="red.8" size="lg"  >
                        <IconTrash className="h-4/5 w-4/5" stroke={1.5} />
                    </ActionIcon>}
                    </div>
        </div>
        </div>

    )
}

export default CertificateCard