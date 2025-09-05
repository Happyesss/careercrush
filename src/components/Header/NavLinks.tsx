"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const links = [
    { name: "Jobs", url: "find-jobs" },
    { name: "Mentors", url: "find-mentors" },
    { name: "Post jobs", url: "post-job/0" },
    { name: "About us", url: "about-us" },
  ];

  const pathname = usePathname();

  return (
    <div className="flex gap-5 bs-mx:hidden text-[14px] text-[#000] dark:text-primary font-normal">
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/${link.url}`}
          className={`transition-colors duration-300 ${
            pathname === `/${link.url}` ? "text-black" : "hover:text-primary"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
