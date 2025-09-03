"use client";

import { useState } from 'react';
import { Combobox, useCombobox } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateSort } from '../../Slices/SortSlice';
import { useTheme } from '../../ThemeContext';

const opt = ['Recent posted', 'Relevent', 'Salary(High - Low)', 'Salary(Low - High)'];
const talentSort = ['Relevent', 'Experience(High - Low)', 'Experience(Low - High)'];

const Sort=(props:any)=> {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const sortValue = useSelector((state: any) => state.sort);
  const [selectedItem, setSelectedItem] = useState<string | null>(sortValue || 'Recent posted');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = props.sort=="job"?opt.map((item) => (
    <Combobox.Option className='text-xs' value={item} key={item}>
      {item}
    </Combobox.Option>
  )):talentSort.map((item) => (
    <Combobox.Option className='text-xs' value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        store={combobox}
        width={250}
        position="bottom-start"
        onOptionSubmit={(val) => {
          setSelectedItem(val);
          dispatch(UpdateSort(val));
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
         
           <div onClick={()=> combobox. toggleDropdown()} className={` cursor-pointer ${isDarkMode ? "bg-third text-white" : "bg-white text-black shadow-sm border"} flex items-center font-medium px-4 py-2 rounded-lg gap-2 text-[13px] transition-colors`}>
            <IconAdjustments className='text-primary h-5 w-5 mr-1'/>{selectedItem}
           </div>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
export default Sort;