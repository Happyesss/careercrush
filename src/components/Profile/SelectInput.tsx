import { useEffect, useState } from 'react';
import { Combobox, InputBase, ScrollArea, useCombobox } from '@mantine/core';

const SelectInput = (props: any) => {
  useEffect(() => {
    const inputProps = props.form.getInputProps(props.name);
    const initial = inputProps?.value ?? '';
    setData(props.options ?? []);
    setValue(initial);
    setSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search?.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [...current, search]);
          setValue(search);
          props.form.setValues({ [props.name]: search });
        } else {
          setValue(val);
          setSearch(val);
          props.form.setValues({ [props.name]: val });
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        {
          // Prevent spreading a null value from form props into the native input
        }
        {
          (() => {
            const inputProps = props.form.getInputProps(props.name) || {};
            // Remove value from spread and control it via local `search` state
            // eslint-disable-next-line no-unused-vars
            const { value: _val, onChange: _oc, ...rest } = inputProps;
            return (
              <InputBase
                {...rest}
                withAsterisk
                label={props.label}
                leftSection={<props.leftSection stroke={1.5} />}
                rightSection={<Combobox.Chevron />}
                value={search}
                onChange={(event) => {
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => {
                  combobox.closeDropdown();
                  setSearch(value || '');
                }}
                placeholder={props.placeholder}
                rightSectionPointerEvents="none"
              />
            );
          })()
        }
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options}
            {!exactOptionMatch && search?.trim()?.length > 0 && (
              <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
export default SelectInput;