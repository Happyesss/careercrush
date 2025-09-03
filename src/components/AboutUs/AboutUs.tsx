"use client";

import {
  IconUsers,
  IconCode,
  IconTrendingUp,
  IconPlant,
} from "@tabler/icons-react";
import { useTheme } from "../../ThemeContext";
import FAQs from "./FAQs";

export function AboutUs() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen pt-28 relative overflow-hidden ${
        isDarkMode ? "bg-secondary text-white" : "bg-secondary text-black"
      }`}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 bg-primary/40 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 w-[380px] h-[380px] rounded-full blur-3xl opacity-30 bg-primary/30 animate-pulse" />

      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 md:px-10 relative">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">Rooted in growth</span>
          <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Growing together in the digital soil
          </h1>
          <p className={`mt-4 text-base sm:text-lg md:text-xl ${isDarkMode ? 'text-white/70' : 'text-lightBlack'}`}>
            At CareerCrush, we cultivate a thriving ecosystem where talent, opportunity, and collaboration meet.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition">Join community</button>
            <button className={`px-5 py-2.5 rounded-md text-sm font-semibold border ${isDarkMode ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'} transition`}>Learn more</button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 sm:px-6 md:px-10">
        <div className={`max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white'} p-6 border ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
          {[
            { label: 'Active members', value: '25k+' },
            { label: 'Hiring partners', value: '120+' },
            { label: 'Projects shipped', value: '4k+' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{s.value}</div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-white/60' : 'text-lightBlack'}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values - refreshed cards */}
      <div className="py-16 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Our core values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Connect', Icon: IconUsers, color: 'text-indigo-500', desc: 'Bridge brilliant minds across disciplines to spark meaningful collaboration.' },
              { title: 'Collaborate', Icon: IconCode, color: 'text-green-500', desc: 'Build ambitious projects through events, challenges, and open source.' },
              { title: 'Grow', Icon: IconTrendingUp, color: 'text-purple-500', desc: 'Accelerate your career with curated opportunities and mentorship.' },
            ].map(({ title, Icon, color, desc }, i) => (
              <div key={i} className={`rounded-xl p-6 border h-full hover:-translate-y-1 hover:shadow-lg transition ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 ${color}`}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-white/70' : 'text-lightBlack'}`}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission timeline */}
      <div className={`py-16 px-4 sm:px-6 md:px-10 ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Our mission</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Discover', desc: 'Surface the best jobs and people for you.' },
              { title: 'Build', desc: 'Give you tools and a network to build remarkable things.' },
              { title: 'Launch', desc: 'Help you showcase work and get hired faster.' },
            ].map((m, i) => (
              <div key={i} className={`rounded-xl p-6 border relative overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
                <span className="absolute -top-6 -right-2 text-7xl font-extrabold text-primary/10 select-none">0{i+1}</span>
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-white/70' : 'text-lightBlack'}`}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQs />

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 md:px-10 text-center">
        <div className={`max-w-4xl mx-auto rounded-2xl p-10 border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to grow with us?</h2>
          <p className={`text-base sm:text-lg md:text-xl mb-8 ${isDarkMode ? 'text-white/70' : 'text-lightBlack'}`}>
            Join our community of innovators, creators, and problem‑solvers.
          </p>
          <button className="bg-primary hover:opacity-90 text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-md transition inline-flex items-center gap-2">
            <span>Start Growing Today</span>
            <IconPlant size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
