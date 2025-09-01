// components/filters/TagMultiSelect.tsx
"use client";

import React from "react";
import {
  Combobox,
  Pill,
  PillsInput,
  useCombobox,
  ScrollArea,
  rem,
  Input, // ✅ import Input
} from "@mantine/core";

import { IconChevronDown, IconX } from "@tabler/icons-react";

type Group = { label: string; options: string[] };

interface TagMultiSelectProps {
  label: string;
  placeholder?: string;
  groups?: Group[];          // dropdown with grouped options
  quickOptions?: string[];   // pills shown under the input
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

export default function TagMultiSelect({
  label,
  placeholder = "Type to search…",
  groups = [],
  quickOptions = [],
  value,
  onChange,
  className,
}: TagMultiSelectProps) {
  const [search, setSearch] = React.useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const toggle = (item: string) => {
    const exists = value.includes(item);
    onChange(exists ? value.filter((v) => v !== item) : [...value, item]);
  };

  const clearAll = () => onChange([]);

  // Filter dropdown items by search
  const lower = search.toLowerCase();
  const filteredGroups = groups
    .map((g) => ({
      ...g,
      options: g.options.filter((o) => o.toLowerCase().includes(lower)),
    }))
    .filter((g) => g.options.length > 0);

  // Add custom token on Enter if not empty
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const t = search.trim();
      if (t && !value.includes(t)) onChange([...value, t]);
      setSearch("");
      combobox.closeDropdown();
    }
  };

  return (
    <div className={className}>
      <label className="block text-[15px] font-semibold mb-2 text-[#0f172a]">
        {label}
      </label>

      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          toggle(val);
          setSearch("");
          // keep dropdown open for multi select
          combobox.openDropdown();
        }}
        withinPortal={false}
      >
        <Combobox.Target>
          <PillsInput
            onClick={() => combobox.toggleDropdown()}
            className="rounded-xl border !border-gray-200 hover:!border-gray-300 focus-within:!border-gray-400"
          >
            
<Input.Label className="sr-only">{label}</Input.Label>

            <div className="flex items-center w-full">
              <PillsInput.Field
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                onKeyDown={onKeyDown}
                placeholder={value.length ? "" : placeholder}
                className="min-h-[46px]"
              />

              {value.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="mr-1 rounded p-1 hover:bg-gray-100"
                  aria-label="Clear selected"
                >
                  <IconX size={16} />
                </button>
              )}
              <IconChevronDown size={18} className="mr-2 opacity-70" />
            </div>

            {/* Selected chips appear inside input */}
            {/* <PillsInput.Field>
              {value.map((v) => (
                <Pill
                  key={v}
                  withRemoveButton
                  onRemove={() => toggle(v)}
                  className="!bg-gray-100 !text-gray-800 !rounded-xl"
                >
                  {v}
                </Pill>
              ))}
            </PillsInput.Field> */}
          </PillsInput>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search…"
          />
          <ScrollArea.Autosize mah={rem(280)}>
            <Combobox.Options>
              {filteredGroups.length === 0 && (
                <Combobox.Empty className="py-4 text-gray-500">
                  No matches
                </Combobox.Empty>
              )}

              {filteredGroups.map((group) => (
                <Combobox.Group
                  key={group.label}
                  label={group.label.toUpperCase()}
                >
                  {group.options.map((opt) => {
                    const active = value.includes(opt);
                    return (
                      <Combobox.Option
                        value={opt}
                        key={opt}
                        active={active}
                        className={`flex items-center justify-between ${
                          active ? "!bg-gray-100 !text-black" : ""
                        }`}
                      >
                        {opt}
                        {active && (
                          <span className="text-xs rounded-full px-2 py-[2px] bg-black text-white">
                            ✓
                          </span>
                        )}
                      </Combobox.Option>
                    );
                  })}
                </Combobox.Group>
              ))}
            </Combobox.Options>
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>

      {/* Quick-pick pills */}
      {quickOptions.length > 0 && (
        <>
          <div className="mt-3 flex flex-wrap gap-3">
            {quickOptions.map((q) => {
              const on = value.includes(q);
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => toggle(q)}
                  className={`px-4 py-2 rounded-2xl text-[14px] transition ${
                    on
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {q}
                </button>
              );
            })}
          </div>
          <hr className="mt-5 border-dashed border-gray-200" />
        </>
      )}
    </div>
  );
}
