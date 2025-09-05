"use client";

import { Burger, Button, Drawer, Switch } from "@mantine/core";
import NavLinks from "./NavLinks";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getProfile } from "../../Services/ProfileServices";
import { setProfile } from "../../Slices/ProfileSlice";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { setUser } from "../../Slices/UserSlices";
import { setupResponseInterceptors } from "../../Interceptor/AxiosInterceptor";
import { useDisclosure } from "@mantine/hooks";
import { IconMoonStars, IconSun, IconX } from "@tabler/icons-react";
import Image from "next/image";
import CcLogo from "../../assets/Icons/cc-logo.jpg";
import { useTheme } from "../../ThemeContext";
import { usePathname, useRouter } from "next/navigation";

interface CustomJwtPayload extends JwtPayload {
  sub?: string;
  profileId?: string;
}

const Header = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.jwt);
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const links = useMemo(() => [
    { name: "Find jobs", url: "find-jobs" },
    { name: "Find mentors", url: "find-mentors" },
    { name: "Post jobs", url: "post-job/0" },
    { name: "About us", url: "about-us" },
  ], []);

  useEffect(() => {
    setupResponseInterceptors((path: string) => router.push(path));
  }, [router]);

  useEffect(() => {
    if (!token || token.trim() === "") {
      dispatch(setUser(null));
      return;
    }

    try {
      const decoded: CustomJwtPayload = jwtDecode<CustomJwtPayload>(token);
      dispatch(setUser({ ...decoded, email: decoded.sub }));

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired. Logging out.");
        dispatch(setUser(null));
        return;
      }

      if (decoded.profileId) {
        getProfile(decoded.profileId)
          .then((res) => dispatch(setProfile(res)))
          .catch((error: any) => console.error("Error fetching profile:", error));
      }
    } catch (error) {
      console.error("Invalid token:", error);
      dispatch(setUser(null));
    }
  }, [token, dispatch]);

  if (pathname === "/signup" || pathname === "/login") {
    return null;
  }

  return (
    <div
      className={`w-full px-8 tracking-normal ${isDarkMode ? "bg-third text-white" : "bg-white text-black"}  py-4 flex justify-between items-center transition-colors duration-300`}
    >
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <Link href="/" className="flex items-center gap-2  transition-transform duration-300">
          <Image
            src={CcLogo}
            alt="cc"
            width={40}
            height={34}
            className="h-10 w-11 rounded-lg"
            priority
          />
         <div>
            <h1 className="font-semibold text-lg text-black dark:text-primary hidden md:block">CareerCrush</h1>
         </div>
        </Link>
      </div>

      {/* Nav Links */}
      <NavLinks />

      {/* Right Section */}
      <div className="flex gap-3 items-center">
        {/* Theme Switcher */}
        {!user && (
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            size="md"
            color="dark.4"
            onLabel={
              <IconSun
                size={16}
                stroke={2.5}
                className="text-primary"
              />
            }
            offLabel={
              <IconMoonStars
                size={16}
                stroke={2.5}
                className="text-primary"
              />
            }
          />
        )}

        {/* Profile / Login buttons */}
        {user ? (
          <ProfileMenu />
        ) : (
          <>
            <Link href="/login">
              <button
                className="font-medium text-black dark:text-primary text-sm mx-3 hover:text-primary  transition-colors duration-300"
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                className="bg-black dark:bg-secondary text-white dark:text-black px-4 py-1.5 rounded-md text-[13px] font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                SignUp
              </button>
            </Link>
          </>
        )}

        {/* Burger Menu */}
        <Burger
          className="bs:hidden text-primary dark:text-primary"
          opened={opened}
          onClick={open}
          aria-label="Toggle navigation"
        />

        {/* Drawer for mobile */}
        <Drawer
          size="xs"
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          opened={opened}
          onClose={close}
          position="right"
          closeButtonProps={{ icon: <IconX size={30} /> }}
          className="dark:bg-secondary"
        >
          <div className="flex flex-col gap-5 p-5 bg-white dark:bg-secondary">
            {links.map((link, index) => (
              <Link
                key={index}
                href={`/${link.url}`}
                onClick={close}
                className={`transition-colors duration-300 flex text-lg text-primary hover:opacity-80 ${
                  pathname === `/${link.url}`
                    ? "font-semibold"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
