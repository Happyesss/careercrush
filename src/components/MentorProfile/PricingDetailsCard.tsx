"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { packageService, packageUtils } from "../../Services/MentorshipPackageService";
import { useTheme } from "../../ThemeContext";

interface PricingDetailsCardProps {
  mentorId: number;
  packagesList?: any[];
  selectedPlan: '1' | '3' | '6';
}

export default function PricingDetailsCard({ mentorId, packagesList = [], selectedPlan }: PricingDetailsCardProps) {
  const { isDarkMode } = useTheme();
  const [internalPackages, setInternalPackages] = useState<any[]>(packagesList);
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

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
    <div className={`border rounded-xl p-8 shadow-sm ${isDarkMode ? 'bg-third border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading package details...</span>
      </div>
    </div>
  );
  if (!selectedPkg) return null;

  return (

    <div className="tracking-tight">


       {selectedPkg.description && (
        <div className="mt-12 pl-2 mb-4">
            <h4 className={`font-semibold text-2xl tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>About this package</h4>
            <p className={`text-sm tracking-normal leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedPkg.description}</p>
        </div>
      )}

      {/* Package Details Box */}

      <div className="flex w-full flex-col sm:flex-row gap-2">
 <div className={`rounded-lg border w-full sm:w-1/2 p-6 mb-4 ${isDarkMode ? 'border-none bg-third' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Package Details</span>
        </div>
        <ul className="space-y-3">
          {typeof selectedPkg.durationMonths === 'number' && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration: <span className="font-medium text-primary">{packageUtils.formatDuration(selectedPkg.durationMonths)}</span></span>
            </li>
          )}
          {typeof selectedPkg.sessionsPerMonth === 'number' && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sessions per month: <span className="font-medium text-primary">{selectedPkg.sessionsPerMonth}</span></span>
            </li>
          )}
          {typeof selectedPkg.totalSessions === 'number' && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total sessions: <span className="font-medium text-primary">{selectedPkg.totalSessions}</span></span>
            </li>
          )}
          {selectedPkg.sessionDurationMinutes && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session duration: <span className="font-medium text-primary">{selectedPkg.sessionDurationMinutes} minutes</span></span>
            </li>
          )}
          {selectedPkg.sessionType && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Session type: <span className="font-medium text-primary">{selectedPkg.sessionType}</span></span>
            </li>
          )}
          {selectedPkg.isFreeTrialIncluded && (
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium text-sm">Free trial included</span>
            </li>
          )}
        </ul>
      </div>

      {/* Topics Covered Box */}
      {Array.isArray(selectedPkg.topicsCovered) && selectedPkg.topicsCovered.length > 0 && (
        <div className={`rounded-lg border w-full sm:w-1/2 p-6 mb-4 ${isDarkMode ? 'border-none bg-third' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>Topics Covered</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPkg.topicsCovered.map((t: string, i: number) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-primary/20 text-primary border-primary/30' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      </div>
     



    <div className={`border rounded-xl p-6 shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-third border-none' : 'bg-white border-gray-200'}`}>
     
      
      {/* Package Details Button */}
    
      {/* Package Details Content */}
      

      {/* Topics Covered Button */}
     
      
      {/* Learning Modules */}
      {Array.isArray(selectedPkg.modules) && selectedPkg.modules.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Monthly Learning Plan</h3>
          <div className="space-y-3">
            {selectedPkg.modules.slice(0, selectedPkg.durationMonths || 6).map((module: any, idx: number) => (
              <div key={idx}>
                <button
                  onClick={() => setExpandedModule(expandedModule === idx ? null : idx)}
                  className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                    expandedModule === idx 
                      ? `${isDarkMode ? 'bg-primary/20 border-primary' : 'bg-primary/10 border-primary'}` 
                      : `${isDarkMode ? 'bg-secondary border-gray-600 hover:border-primary/50' : 'bg-gray-50 border-gray-200 hover:border-primary/30'}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${expandedModule === idx ? 'bg-primary' : 'bg-gray-400'}`}>
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {module.moduleTitle || `Month ${module.monthNumber || idx+1}`}
                      </div>
                      {module.sessionsInMonth && (
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {module.sessionsInMonth} sessions
                        </div>
                      )}
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${expandedModule === idx ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedModule === idx && (
                  <div className={`mt-2 p-4 rounded-lg border ${isDarkMode ? 'border-gray-600 bg-secondary' : 'border-gray-200 bg-gray-50'}`}>
                    {module.moduleDescription && (
                      <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{module.moduleDescription}</p>
                    )}
                    
                    {Array.isArray(module.learningObjectives) && module.learningObjectives.length > 0 && (
                      <div className="mb-4">
                        <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Learning Objectives
                        </div>
                        <ul className="space-y-2">
                          {module.learningObjectives.map((obj: string, oIdx: number) => (
                            <li key={oIdx} className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {Array.isArray(module.deliverables) && module.deliverables.length > 0 && (
                      <div className="mb-4">
                        <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Deliverables
                        </div>
                        <ul className="space-y-2">
                          {module.deliverables.map((d: string, dIdx: number) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {Array.isArray(module.topicsInMonth) && module.topicsInMonth.length > 0 && (
                      <div>
                        <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                          </svg>
                          Topics This Month
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {module.topicsInMonth.map((topic: string, tIdx: number) => (
                            <span key={tIdx} className={`px-2 py-1 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
        </div>

  );
}
