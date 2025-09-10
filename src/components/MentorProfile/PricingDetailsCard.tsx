"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { packageService, packageUtils } from "../../Services/MentorshipPackageService";

interface PricingDetailsCardProps {
  mentorId: number;
  packagesList?: any[];
  selectedPlan: '1' | '3' | '6';
}

export default function PricingDetailsCard({ mentorId, packagesList = [], selectedPlan }: PricingDetailsCardProps) {
  const [internalPackages, setInternalPackages] = useState<any[]>(packagesList);
  const [loading, setLoading] = useState(false);

  const ensurePackages = useCallback(async () => {
    if (internalPackages.length === 0) {
      try {
        setLoading(true);
        let pkgs = await packageService.getActivePackagesByMentor(mentorId);
        if (!pkgs || pkgs.length === 0) pkgs = await packageService.getPackagesByMentor(mentorId as any);
        setInternalPackages(pkgs || []);
      } finally { setLoading(false); }
    }
  }, [internalPackages.length, mentorId]);

  useEffect(() => { ensurePackages(); }, [ensurePackages]);

  const selectedPkg = useMemo(() => {
    if (!internalPackages || internalPackages.length === 0) return null;
    const months = Number(selectedPlan);
    return internalPackages.find(p => p.durationMonths === months) || internalPackages[0];
  }, [internalPackages, selectedPlan]);

  if (loading && !selectedPkg) return (
    <div className="border border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50 shadow-lg">
      <div className="flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading package details...</span>
      </div>
    </div>
  );
  if (!selectedPkg) return null;

  return (
    <div className="border border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50 w-full shadow-lg hover:shadow-xl transition-all duration-300">
      {selectedPkg.description && (
        <div className="rounded-xl border border-blue-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-lg font-semibold text-blue-900">About this package</div>
          </div>
          <p className="text-blue-800 leading-relaxed">{selectedPkg.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
            <div className="text-lg font-semibold text-gray-800">Package Details</div>
          </div>
          <ul className="space-y-3">
            {typeof selectedPkg.durationMonths === 'number' && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Duration: <span className="font-medium">{packageUtils.formatDuration(selectedPkg.durationMonths)}</span></span>
              </li>
            )}
            {typeof selectedPkg.sessionsPerMonth === 'number' && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Sessions per month: <span className="font-medium">{selectedPkg.sessionsPerMonth}</span></span>
              </li>
            )}
            {typeof selectedPkg.totalSessions === 'number' && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Total sessions: <span className="font-medium">{selectedPkg.totalSessions}</span></span>
              </li>
            )}
            {selectedPkg.sessionDurationMinutes && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Session duration: <span className="font-medium">{selectedPkg.sessionDurationMinutes} minutes</span></span>
              </li>
            )}
            {selectedPkg.sessionType && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Session type: <span className="font-medium">{selectedPkg.sessionType}</span></span>
              </li>
            )}
            {selectedPkg.isFreeTrialIncluded && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Free trial included</span>
              </li>
            )}
          </ul>
        </div>

        {Array.isArray(selectedPkg.topicsCovered) && selectedPkg.topicsCovered.length > 0 && (
          <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
              </svg>
              <div className="text-lg font-semibold text-gray-800">Topics Covered</div>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedPkg.topicsCovered.map((t: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:shadow-md transition-shadow duration-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {Array.isArray(selectedPkg.modules) && selectedPkg.modules.length>0 && (
        <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-lg font-semibold text-gray-800">Monthly Learning Breakdown</div>
          </div>
          <div className="space-y-6">
            {selectedPkg.modules.slice(0, selectedPkg.durationMonths || 6).map((module: any, idx: number) => (
              <div key={idx} className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    {module.moduleTitle || `Month ${module.monthNumber || idx+1}`}
                  </h4>
                  {module.sessionsInMonth && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {module.sessionsInMonth} sessions
                    </span>
                  )}
                </div>
                
                {module.moduleDescription && (
                  <p className="text-gray-600 mb-4 leading-relaxed">{module.moduleDescription}</p>
                )}
                
                {Array.isArray(module.learningObjectives) && module.learningObjectives.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Learning Objectives
                    </div>
                    <ul className="space-y-2">
                      {module.learningObjectives.map((obj: string, oIdx: number) => (
                        <li key={oIdx} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {Array.isArray(module.deliverables) && module.deliverables.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Deliverables
                    </div>
                    <ul className="space-y-2">
                      {module.deliverables.map((d: string, dIdx: number) => (
                        <li key={dIdx} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {Array.isArray(module.topicsInMonth) && module.topicsInMonth.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                      </svg>
                      Topics This Month
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {module.topicsInMonth.map((topic: string, tIdx: number) => (
                        <span key={tIdx} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
