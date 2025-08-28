import { Button, TextInput, FileInput } from "@mantine/core";
import fields from "../../assets/Data/Profile";
import SelectInput from "./SelectInput";
import { MonthPickerInput } from "@mantine/dates";
import { useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";
import { successNotification } from "../../Services/NotificationService";
import { changeProfile } from "../../Slices/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import { getBase64 } from "../../Services/Utilities";
import { IconUpload } from "@tabler/icons-react";

const CertificateInput = (props: any) => {
  const select = fields;
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const { isDarkMode } = useTheme();

  const form = useForm({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues: { name: '', issuer: '', issueDate: new Date(), certificateID: '', certificateImage: '' },
    validate: {
      name: isNotEmpty('This field is required'),
      issuer: isNotEmpty('This field is required'),
      certificateID: isNotEmpty('This field is required'),
    }
  });

  const handleCertificateImageChange = async (image: File | null) => {
    if (!image) return;
    
    if (image.size > 2 * 1024 * 1024) { // 2MB limit
      successNotification('Certificate image must be less than 2MB', 'Error');
      return;
    }

    try {
      let certificateImage: any = await getBase64(image);
      form.setFieldValue('certificateImage', certificateImage.split(',')[1]);
      successNotification('Certificate image uploaded successfully', 'Success');
    } catch (error) {
      successNotification('Failed to upload certificate image', 'Error');
    }
  };

  const handleSave = () => {
    form.validate();
    if (!form.isValid()) return;

    let certi = [...profile.certifications];
    const certificationData = {
      ...form.getValues(),
      // Convert Date to ISO string for Redux serialization
      issueDate: form.getValues().issueDate?.toISOString()
    };
    certi.push(certificationData);
    let updatedProfile = { ...profile, certifications: certi };
    props.setEdit(false);
    dispatch(changeProfile(updatedProfile));
    successNotification('Certificate Added Successfully', 'Success');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-lg font-semibold">Add Certificate</div>
      <div className={`flex gap-10 [&>*]:w-1/2 ${isDarkMode ? ' text-cape-cod-100 [&_input]:bg-cape-cod-900 [&_input]:!text-cape-cod-100 [&_input]:border-cape-cod-900 ' : 'text-cape-cod-900 [&_input]:!text-cape-cod-900'}`}>
        <TextInput {...form.getInputProps("name")} label="Title" placeholder="Enter title" required />
        <SelectInput form={form} name="issuer" {...select[1]} />
      </div>
      <div className={`flex gap-10 [&>*]:w-1/2 ${isDarkMode ? ' text-cape-cod-100 [&_input]:bg-cape-cod-900 [&_input]:!text-cape-cod-100 [&_input]:border-cape-cod-900 ' : 'text-cape-cod-900 [&_input]:!text-cape-cod-900'}`}>
        <MonthPickerInput
          withAsterisk
          maxDate={new Date()}
          label="Issued date"
          placeholder="Pick date"
          {...form.getInputProps("issueDate")}
          styles={() => ({
            input: {
                backgroundColor:  isDarkMode ? "#2c3534" : "white",
                color: isDarkMode ? "white" : "black",
                borderColor: isDarkMode ? "#161d1d" : "#d1d5db"
            }
        })}
        />
        <TextInput {...form.getInputProps("certificateID")} label="Certificate ID" placeholder="Enter ID" required />
      </div>
      <div className={`${isDarkMode ? ' text-cape-cod-100 ' : 'text-cape-cod-900'}`}>
        <FileInput
          label="Certificate Image (Optional)"
          placeholder="Upload certificate image"
          accept="image/*"
          onChange={handleCertificateImageChange}
          leftSection={<IconUpload size={16} />}
          styles={() => ({
            input: {
              backgroundColor: isDarkMode ? "#2c3534" : "white",
              color: isDarkMode ? "white" : "black",
              borderColor: isDarkMode ? "#161d1d" : "#d1d5db"
            }
          })}
        />
        {form.getValues().certificateImage && (
          <div className="mt-2">
            <img
              src={`data:image/jpeg;base64,${form.getValues().certificateImage}`}
              alt="Certificate preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={handleSave} color="blue.4" variant="outline">Save</Button>
        <Button onClick={() => props.setEdit(false)} color="red.8" variant="light">Cancel</Button>
      </div>
    </div>
  );
};

export default CertificateInput;