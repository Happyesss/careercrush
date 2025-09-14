"use client";

import { log } from "console";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const NavLinks = () => {
  const user = useSelector((state: any) => state.user);
  const pathname = usePathname();

  const links = [
    { name: "Jobs", url: "find-jobs" },
    { name: "Mentors", url: "find-mentors" },
    { name: "About us", url: "about-us" },
  ];

  if (user?.accountType === "COMPANY") {
    links.splice(2, 0, { name: "Post jobs", url: "post-job/0" });
  }

  return (
    <div className="flex gap-5 bs-mx:hidden text-[14px] text-[#000] dark:text-white font-normal">
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/${link.url}`}
          className={`transition-colors duration-300 ${
            pathname === `/${link.url}` ? "text-black dark:text-white" : "hover:text-primary"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
