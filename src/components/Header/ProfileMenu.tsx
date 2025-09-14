"use client";

import { Avatar, Menu, rem, Switch } from '@mantine/core'
import { IconBrandAppgallery, IconLogout, IconMoonStars, IconSun, IconUserCircle } from '@tabler/icons-react'
import {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { removeUser } from '../../Slices/UserSlices';
import { useTheme } from "../../ThemeContext";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);
  const { isDarkMode, toggleTheme } = useTheme();

  const [opened, setOpened] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(removeUser());
    window.location.reload();
  };

  return (
    <Menu shadow="md" width={220} opened={opened} onChange={setOpened}>
      <Menu.Target>
        <div className="flex gap-2 items-center cursor-pointer">
          <div className='xs-mx:hidden text-black dark:text-white text-sm'>{profile.name}</div>
          <Avatar
            src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : ((): string => { const mod = require(`../../assets/images/avatar.png`); return typeof mod === 'string' ? mod : (mod?.default?.src ?? mod?.src ?? mod?.default ?? ''); })()}
            alt=""
          />
        </div>
      </Menu.Target>

      <Menu.Dropdown onChange={() => setOpened(true)} className="bg-white dark:bg-third text-primary dark:text-white border border-black/10 dark:border-white/10 rounded-md">
        <Link href="/profile">
          <Menu.Item leftSection={<IconUserCircle size={16} />} className="hover:bg-primary/10 dark:text-white dark:hover:bg-secondary">
            Profile
          </Menu.Item>
        </Link>
        <Link href="/job-gallery">
          <Menu.Item leftSection={<IconBrandAppgallery size={16} />} className="hover:bg-primary/10 dark:text-white dark:hover:bg-secondary">
            Gallery
          </Menu.Item>
        </Link>

        {/* Dark Mode Toggle */}
        <Menu.Item
          leftSection={<IconSun size={16} className="text-primary" />}
          rightSection={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              size="md"
              color="dark.4"
              onLabel={
                <IconSun style={{ width: rem(16), height: rem(16) }} stroke={2.5} className="text-primary" />
              }
              offLabel={
                <IconMoonStars size={16} stroke={2.5} className="text-primary" />
              }
            />
          }
          className="hover:bg-primary/1 dark:text-white dark:hover:bg-secondary"
        >
          Theme
        </Menu.Item>

        <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={16} />} className="text-red-500 dark:text-red-400 hover:bg-red-500/10">
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
