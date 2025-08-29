"use client";
import { Button } from "@mantine/core"
import { useState } from "react";
import ExpInput from "./ExpInput";
import { formatDate } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useTheme } from "../../ThemeContext";

const ExperienceCard = (props:any) => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const profile = useSelector((state: any) => state.profile);
  const { isDarkMode } = useTheme();
  const handleDelete = () => {
    let exp = [...profile.experiences];
    exp.splice(props.index, 1);
    let updatedProfile = { ...profile, experiences: exp };
    dispatch(changeProfile(updatedProfile));
    successNotification('Experience Deleted Successfully', 'Success');

  }
  return (
    !edit?<div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className={`p-2 rounded-md ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-100'}`}>
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
                      // Fallback to a generic company icon - using an existing icon as placeholder
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
          <div className="text-sm text-cape-cod-300">{formatDate(props.startDate)} - {props.working?"Present":formatDate(props.endDate)}</div>
          </div>
          <div className="text-sm text-cape-cod-300 text-justify">
            {props.description}
          </div>
          {props.edit&&
          <div className="flex gap-3">
            <Button onClick={()=>setEdit(true)} color="blue.4" variant="outline">Edit</Button>
            <Button color="red.8" variant="light" onClick={handleDelete}>Delete</Button>
          </div>
          }
    </div>:<ExpInput {...props} setEdit={setEdit}/>
  )
}

export default ExperienceCard