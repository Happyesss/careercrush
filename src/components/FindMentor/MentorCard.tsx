"use client";

import React, { useState } from "react";
import { IconMapPin, IconStar, IconBookmark, IconBookmarkFilled, IconCalendar, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";
import { useTheme } from "../../ThemeContext";

const MentorCard = (props: any) => {
  const { isDarkMode } = useTheme();
  const [saved, setSaved] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("6");

  // Use package-based prices if provided from parent, otherwise use default pricing
  const mappedPlanPrices = props.planPriceMap as Record<string, number> | undefined;
  const mappedDiscounts = props.discountMap as Record<string, number> | undefined;
  const hasRealPackages = props.mentorshipPackages && props.mentorshipPackages.length > 0;
  
  // If we have real packages, use those prices, otherwise fall back to defaults
  const basePriceFromPackage = mappedPlanPrices?.["1"];
  const basePrice = basePriceFromPackage ?? 7000; // Default base price
  
  const planPrices = {
    "1": mappedPlanPrices?.["1"] ?? basePrice,
    "3": mappedPlanPrices?.["3"] ?? Math.round(basePrice * 0.85), // 15% off default
    "6": mappedPlanPrices?.["6"] ?? Math.round(basePrice * 0.7), // 30% off default
  } as const;
  
  const planDiscounts = {
    "1": mappedDiscounts?.["1"] ?? 0,
    "3": mappedDiscounts?.["3"] ?? 15,
    "6": mappedDiscounts?.["6"] ?? 30,
  };

  const currentPrice = planPrices[selectedPlan as keyof typeof planPrices];
  const currentDiscount = planDiscounts[selectedPlan as keyof typeof planDiscounts];
  
  // Check if trial is available
  const hasTrialSlots = props.hasTrialSlots ?? props.hasTrialSlots !== false;

  const handleSaveMentor = (event: React.MouseEvent) => {
    event.preventDefault();
    setSaved(!saved);
  };

  const handleBookTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle trial booking logic here
  };

  return (
    <Link
      href={`/mentor/${props.id}`}
      className={`flex flex-col  rounded-2xl border p-5   transform transition-all duration-200 ${
        isDarkMode
          ? 'bg-third border-none shadow-sm hover:shadow-lg hover:-translate-y-1'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Top row: avatar + Save pill */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`h-10 w-10 rounded-full ring-1 overflow-hidden flex items-center justify-center ${isDarkMode ? 'ring-[#ee8f2a55] bg-secondary' : 'ring-gray-200'}`}>
            {props.picture ? (
              <img
                className="h-full w-full object-cover"
                src={`data:image/png;base64,${props.picture}`}
                alt={`${props.name} avatar`}
              />
            ) : (
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                {props.name?.charAt(0) || "M"}
              </span>
            )}
          </div>
          
          {/* Star Mentor Badge */}
          {props.isStarMentor && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
              <IconStar size={12} />
              STAR
            </span>
          )}
        </div>
        
        <button
          onClick={handleSaveMentor}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] ${
            isDarkMode ? 'bg-secondary text-gray-200 border-none' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <span>{saved ? 'Saved' : 'Save'}</span>
          {saved ? (
            <IconBookmarkFilled className="h-4 w-4 text-primary" />
          ) : (
            <IconBookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Company + rating */}
      <div className="flex items-center gap-2 mt-6">
        <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} font-semibold text-[13px]`}>
          {props.company}
        </span>
        <span className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} text-[12px]`}>
          · {props.rating || 4.5} ⭐ ({props.reviewCount || "80+"}+ reviews)
        </span>
      </div>

      {/* Name and Title */}
      <h3 className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-medium tracking-tight my-3`}>
        {props.name}
      </h3>

      {/* Job Title */}
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
        {props.jobTitle} • {props.totalExp}+ Years Experience
      </p>

      {/* Skills/Badges */}
      <div className="flex flex-wrap gap-2">
        {props.location && (
          <span className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-normal flex items-center gap-1 ${isDarkMode ? 'bg-[#ee8f2a67] text-gray-200' : 'bg-[#eaeaea] text-gray-800 border border-gray-200'}`}>
            <IconMapPin size={12} />
            {props.location}
          </span>
        )}
        {props.skills && props.skills.slice(0, 3).map((skill: string, index: number) => (
          <span key={index} className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-normal ${isDarkMode ? 'bg-[#ee8f2a67] text-gray-200' : 'bg-[#eaeaea] text-gray-800 border border-gray-200'}`}>
            {skill}
          </span>
        ))}
        {props.skills && props.skills.length > 3 && (
          <span className={`px-3 py-1 rounded-md text-[11px] font-medium tracking-normal ${isDarkMode ? 'bg-[#ee8f2a67] text-gray-200' : 'bg-[#eaeaea] text-gray-800 border border-gray-200'}`}>
            +{props.skills.length - 3} more
          </span>
        )}
      </div>

      {/* Divider */}
      <div className={`mt-4 h-px ${isDarkMode ? 'bg-cape-cod-700' : 'bg-gray-200'}`} />

      {/* Bottom: pricing + plan selector and CTA button */}
      <div className="flex mt-4 items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="grid grid-cols-3 rounded overflow-hidden text-xs border">
              {["6", "3", "1"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPlan(plan);
                  }}
                  className={`px-2 py-1 transition-colors ${
                    selectedPlan === plan
                      ? "bg-primary text-white"
                      : isDarkMode
                      ? "bg-secondary hover:bg-gray-600 text-gray-300"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {plan}M
                </button>
              ))}
            </div>
            {currentDiscount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {currentDiscount}% OFF
              </span>
            )}
          </div>
          <div className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm tracking-tight font-medium`}>
            ₹{currentPrice.toLocaleString()}/month
          </div>
          <div className={`${isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'} mt-1 tracking-tight text-[12px] flex items-center gap-1`}>
            <IconCalendar size={12} />
            {selectedPlan === "6" ? "2x" : "1x"} sessions/week
          </div>
        </div>

        {hasTrialSlots ? (
          <button
            onClick={handleBookTrial}
            className={`px-4 py-2 rounded-md text-[12px] font-medium ${
              isDarkMode ? "bg-[#ee8f2a67] text-black" : "bg-black text-white"
            } hover:opacity-95 active:scale-[0.99]`}
          >
            Book Trial
          </button>
        ) : (
          <button
            onClick={handleBookTrial}
            className="px-4 py-2 rounded-md text-[12px] font-medium bg-primary text-white hover:bg-primary/90 active:scale-[0.99]"
          >
            View Profile
          </button>
        )}
      </div>
    </Link>
  );
};

export default MentorCard;