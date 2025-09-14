"use client";

import { useTheme } from "../../ThemeContext";

interface MentorshipRequestModalProps {
  opened: boolean;
  onClose: () => void;
  requestForm: {
    menteeName: string;
    menteeEmail: string;
    menteePhone: string;
    menteeBackground: string;
    requestMessage: string;
    goals: string;
    preferredTime: string;
    sessionType: string;
  };
  setRequestForm: (form: any) => void;
  onSubmit: () => void;
}

const MentorshipRequestModal = ({
  opened,
  onClose,
  requestForm,
  setRequestForm,
  onSubmit,
}: MentorshipRequestModalProps) => {
  const { isDarkMode } = useTheme();

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border ${isDarkMode ? 'bg-third border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-base font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>Request Mentorship Session</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-black'}`}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <form className="p-4 space-y-4" onSubmit={e => {e.preventDefault(); onSubmit();}}>
          {/* Name Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Your Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="Enter your name"
              value={requestForm.menteeName}
              onChange={e => setRequestForm({...requestForm, menteeName: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
              required
            />
          </div>
          {/* Email Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              placeholder="Enter your email"
              value={requestForm.menteeEmail}
              onChange={e => setRequestForm({...requestForm, menteeEmail: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
              required
            />
          </div>
          {/* Phone Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={requestForm.menteePhone}
              onChange={e => setRequestForm({...requestForm, menteePhone: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
            />
          </div>
          {/* Background Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Your Background</label>
            <textarea
              placeholder="Tell us about your current role and experience"
              value={requestForm.menteeBackground}
              onChange={e => setRequestForm({...requestForm, menteeBackground: e.target.value})}
              rows={2}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
            />
          </div>
          {/* Message Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Message to Mentor <span className="text-red-500">*</span></label>
            <textarea
              placeholder="Why do you want to work with this mentor?"
              value={requestForm.requestMessage}
              onChange={e => setRequestForm({...requestForm, requestMessage: e.target.value})}
              rows={2}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
              required
            />
          </div>
          {/* Goals Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Your Goals</label>
            <textarea
              placeholder="What do you hope to achieve through mentorship?"
              value={requestForm.goals}
              onChange={e => setRequestForm({...requestForm, goals: e.target.value})}
              rows={2}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
            />
          </div>
          {/* Preferred Time Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Preferred Time</label>
            <input
              type="text"
              placeholder="When would you like to have sessions?"
              value={requestForm.preferredTime}
              onChange={e => setRequestForm({...requestForm, preferredTime: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
            />
          </div>
          {/* Session Type Field */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-black/80'}`}>Session Type</label>
            <select
              value={requestForm.sessionType}
              onChange={e => setRequestForm({...requestForm, sessionType: e.target.value})}
              className={`w-full px-3 py-2 rounded-md border text-sm font-normal outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${isDarkMode ? 'bg-secondary border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            >
              <option value="one-time">One-time Session</option>
              <option value="ongoing">Ongoing Mentorship</option>
              <option value="project-based">Project-based</option>
            </select>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md border text-xs font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-xs rounded-md font-semibold text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorshipRequestModal;