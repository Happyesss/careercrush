"use client";

import React from "react";
import { Badge, Text, Button, Rating, Divider } from "@mantine/core";
import {
  IconMapPin,
  IconClock,
  IconTrophy,
  IconCalendar,
  IconBell,
  IconStar,
  IconBriefcase,
  IconChartBar,
  IconLanguage,
  IconSchool,
  IconTarget
} from "@tabler/icons-react";
import Link from "next/link";
import { useTheme } from "../../ThemeContext";
import { useState } from "react";

const MentorCard = (props: any) => {
  const { isDarkMode } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>("6");

  // Use package-based prices if provided from parent, otherwise use default pricing
  const mappedPlanPrices = props.planPriceMap as Record<string, number> | undefined;
  const basePriceFromPackage = mappedPlanPrices?.["1"];
  const basePrice = basePriceFromPackage ?? 7000; // Default base price
  const planPrices = {
    "1": mappedPlanPrices?.["1"] ?? basePrice,
    "3": mappedPlanPrices?.["3"] ?? Math.round(basePrice * 0.85), // 15% off default
    "6": mappedPlanPrices?.["6"] ?? Math.round(basePrice * 0.7), // 30% off default
  } as const;
  
  const planDiscounts = {
    "6": 30,
    "3": 15,
    "1": 0
  };

  const currentPrice = planPrices[selectedPlan as keyof typeof planPrices];
  const currentDiscount = planDiscounts[selectedPlan as keyof typeof planDiscounts];
  
  // Check if trial is available
  const hasTrialSlots = props.hasTrialSlots !== false; // Default to true if not specified
  const nextAvailableDate = props.nextAvailableDate || "Sun Aug 31 2025";

  return (
    <div
      className={`w-full rounded-xl p-6 hover:shadow-[0_0_5px_1px_#3b82f6] transition-all border ${
        isDarkMode
          ? "bg-cape-cod-900 border-cape-cod-800 !shadow-blue-300"
          : "bg-white border-gray-200 !shadow-gray-300"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT: Profile summary */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="relative">
              {props.picture ? (
                <img
                  className="h-28 w-28 rounded-full object-cover"
                  src={`data:image/png;base64,${props.picture}`}
                  alt={`${props.name} avatar`}
                />
              ) : (
                <div
                  className={`h-28 w-28 rounded-full flex items-center justify-center text-4xl font-bold ${
                    isDarkMode ? "bg-cape-cod-800 text-blue-400" : "bg-gray-200 text-blue-600"
                  }`}
                >
                  {props.name?.charAt(0) || "M"}
                </div>
              )}
              {props.isAvailable && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              )}
              {/* Star Mentor Badge */}
              {props.isStarMentor && (
                <div className="absolute -top-2 -left-2">
                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <IconStar className="w-3 h-3" />
                    STAR MENTOR
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-xl">{props.name}</div>
                  <div className={`text-sm ${isDarkMode ? "text-cape-cod-300" : "text-gray-600"}`}>
                    {props.jobTitle} at {props.company}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <IconMapPin className="w-4 h-4" />
                  <span className="text-sm">{props.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconStar className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{props.reviewCount || "80+"}+ reviews</span>
                </div>
                {props.languages && (
                  <div className="text-sm flex items-center gap-1">
                    <IconLanguage className="w-4 h-4" />
                    <span>{Array.isArray(props.languages) ? props.languages.join(", ") : props.languages}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Rating value={props.rating || 4.5} readOnly size="sm" />
                <span className={`text-xs ${isDarkMode ? "text-cape-cod-400" : "text-gray-500"}`}>
                  ({props.reviewCount || "80+"}+ reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Experience/Role Info */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                <IconBriefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{props.currentRole || props.jobTitle}</div>
                <div className="text-xs text-gray-500">{props.company}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white">
                <IconChartBar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{props.totalExp}+ Years of Experience</div>
                {props.previousCompanies && (
                  <div className="text-xs text-gray-500">
                    {props.previousCompanies}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Text className={`!text-sm mt-4 ${isDarkMode ? "!text-cape-cod-300" : "!text-gray-600"}`} lineClamp={3}>
            {props.bio || props.about || "Embark on a transformative mentorship journey with me, where I am not just a guide but a colleague you can confide in at any moment. Together, we will navigate the path to your pro..."}
            {(props.bio || props.about) && (props.bio || props.about).length > 150 && (
              <span className="text-blue-500 cursor-pointer ml-1">Read More</span>
            )}
          </Text>

          {/* Skills */}
          {props.skills && props.skills.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {props.skills.slice(0, 6).map((skill: string, index: number) => (
                <Badge key={index} size="sm" variant="light" color="blue">
                  {skill}
                </Badge>
              ))}
              {props.skills.length > 6 && (
                <Badge size="sm" variant="outline" color="gray">
                  +{props.skills.length - 6} More
                </Badge>
              )}
            </div>
          )}

          {/* Target Audience */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <IconTarget className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Targeting Domains:</span>
              {props.mentorshipAreas && props.mentorshipAreas.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-600">
                    {props.mentorshipAreas.slice(0, 2).join(", ")}
                  </span>
                  {props.mentorshipAreas.length > 2 && (
                    <span className="text-blue-500">+{props.mentorshipAreas.length - 2} More</span>
                  )}
                </div>
              ) : (
                <span className="font-medium text-blue-600">{props.targetDomains || "Data Analyst"}</span>
              )}
            </div>
          </div>

          <div className={`mt-4 flex flex-wrap gap-4 text-xs ${isDarkMode ? "text-cape-cod-400" : "text-gray-500"}`}>
            <div className="flex items-center gap-1">
              <IconTrophy className="w-4 h-4" />
              <span>{props.totalExp}+ years</span>
            </div>
            <div className="flex items-center gap-1">
              <IconClock className="w-4 h-4" />
              <span>{props.timezone}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Pricing panel (like screenshot) */}
        <div
          className={`w-full lg:w-80 shrink-0 rounded-xl p-4 border ${
            isDarkMode ? "border-cape-cod-700 bg-cape-cod-800" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="grid grid-cols-3 rounded-lg overflow-hidden text-sm font-medium mb-4 border">
            {["6", "3", "1"].map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`py-2 text-center transition-colors ${
                  selectedPlan === plan
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "bg-cape-cod-700 hover:bg-cape-cod-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {plan} Month{plan !== "1" ? "s" : ""}
              </button>
            ))}
          </div>

          <div className={`flex items-start gap-3 text-sm ${isDarkMode ? "text-cape-cod-200" : "text-gray-700"}`}>
            <IconCalendar className="w-4 h-4 mt-0.5" />
            <span>{selectedPlan === "6" ? "2x" : "1x"} Sessions Per Week</span>
          </div>
          <div className={`mt-2 flex items-start gap-3 text-sm ${isDarkMode ? "text-cape-cod-200" : "text-gray-700"}`}>
            <IconTrophy className="w-4 h-4 mt-0.5" />
            <span>
              Referrals in Top Companies <span className="text-blue-500">+12 More</span>
            </span>
          </div>

          <Divider className="my-4" />

          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold">₹{currentPrice.toLocaleString()}</div>
            <div className="text-sm mb-1">/Month</div>
            {currentDiscount > 0 && (
              <Badge color="yellow" variant="light" className="ml-auto">
                Extra {currentDiscount}% OFF
              </Badge>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <Link href={`/mentor/${props.id}`} className="w-full">
              <Button fullWidth variant="outline">View Profile</Button>
            </Link>
            
            {hasTrialSlots ? (
              <Button fullWidth color="blue">
                Book a Free Trial
              </Button>
            ) : (
              <Button fullWidth leftSection={<IconBell size={16} />} color="dark">
                Notify Me
              </Button>
            )}
          </div>

          <div className={`mt-3 text-center text-xs ${isDarkMode ? "text-cape-cod-300" : "text-gray-500"}`}>
            {hasTrialSlots ? (
              "Trial slots available"
            ) : (
              <>Next Available: <span className="text-blue-500">{nextAvailableDate}</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;