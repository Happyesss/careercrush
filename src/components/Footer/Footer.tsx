'use client'

import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/ThemeContext";


const Footer = () => {
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  if (pathname === "/signup" || pathname === "/login") {
    return null;
  }

  return (
    <footer className={`w-full p-8 px-12 pb-0 tracking-tight ${isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white'}  mt-auto`}>
      <div className=" ">
        <div className="relative rounded-[28px]   overflow-hidden p-4 ">
          {/* Watermark word */}
          <div className="pointer-events-none select-none absolute -bottom-10 left-0 right-0 text-white/10 font-extrabold tracking-tight text-[140px] leading-none hidden md:block">
            CareerCrush
          </div>

    <div className="flex items-center  justify-between mb-10">

      <div className="flex items-center gap-3">
 <img src="/cc.jpg" alt="CareerCrush logo" className="h-18 w-16 rounded-2xl object-contain " />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link href="https://twitter.com" target="_blank" aria-label="Twitter" className="h-10 w-10 rounded-full border border-white/30 bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
          <IconBrandTwitter size={18} />
        </Link>
        <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="h-10 w-10 rounded-full border border-white/30 bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
          <IconBrandInstagram size={18} />
        </Link>
        <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="h-10 w-10 rounded-full border border-white/30 bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
          <IconBrandLinkedin size={18} />
        </Link>
      </div>
     
    </div>

          <div className="grid grid-cols-1 pb-20 md:grid-cols-3 gap-10 relative z-10">
            {/* Quick Links */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4 text-white/90">
                <li><Link href="/about-us" className="hover:underline">About us</Link></li>
                <li><Link href="/find-jobs" className="hover:underline">Work</Link></li>
                <li><Link href="/find-talent" className="hover:underline">Services</Link></li>
                <li><Link href="/about-us" className="hover:underline">How it work</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact us</Link></li>
                <li><Link href="/404" className="hover:underline">Error 404</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact</h3>
              <div className="space-y-4 text-white/90">
                <p>testing@gmail.com</p>
                <p>+123 456 789</p>
                <p>Amsterdam, USA</p>
              </div>
            </div>

            {/* Follow us */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Follow us</h3>
              <div className="space-y-4 text-white/90">
                <Link href="https://twitter.com" target="_blank" className="flex items-center gap-3 hover:underline">
                  <IconBrandTwitter size={20} /> <span>Twitter</span>
                </Link>
                <Link href="https://linkedin.com" target="_blank" className="flex items-center gap-3 hover:underline">
                  <IconBrandLinkedin size={20} /> <span>Linkedin</span>
                </Link>
                <Link href="https://facebook.com" target="_blank" className="flex items-center gap-3 hover:underline">
                  <IconBrandFacebook size={20} /> <span>Facebook</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom legal row */}
        {/* <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-2 text-sm text-lightBlack">
          <p>© {new Date().getFullYear()} CareerCrush. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;