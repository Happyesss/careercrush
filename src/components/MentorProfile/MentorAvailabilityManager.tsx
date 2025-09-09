"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeContext";
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconClock, 
  IconCalendar,
  IconCopy,
  IconDeviceFloppy,
  IconX,
  IconCheck,
  IconSettings,
  IconTemplate,
  IconPackage,
  IconRefresh
} from "@tabler/icons-react";
import { trialSessionService } from "../../Services/TrialSessionService";
import { 
  TrialSession, 
  AvailabilityTemplate, 
  BulkTrialSessionRequest,
  TimeSlotRequest,
  DailyAvailability 
} from "../../types/mentorshipPackages";

interface MentorAvailabilityManagerProps {
  mentorId: number;
}

interface BulkCreationForm {
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  timeSlots: TimeSlotRequest[];
  sessionType: string;
  timeZone: string;
  bufferTimeMinutes: number;
  preparationTimeMinutes: number;
  allowRescheduling: boolean;
  requireConfirmation: boolean;
  specialInstructions: string;
  createRecurring: boolean;
  recurringPattern: string;
  recurringWeeks: number;
}

const MentorAvailabilityManager = ({ mentorId }: MentorAvailabilityManagerProps) => {
  const { isDarkMode } = useTheme();
  
  // State management
  const [sessions, setSessions] = useState<TrialSession[]>([]);
  const [templates, setTemplates] = useState<AvailabilityTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'bulk' | 'templates'>('sessions');
  
  // Forms state
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AvailabilityTemplate | null>(null);
  const [selectedSessionForEdit, setSelectedSessionForEdit] = useState<TrialSession | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [quickCreateMode, setQuickCreateMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedQuickSlots, setSelectedQuickSlots] = useState<Set<string>>(new Set());
  const [showSingleDayMultiSlotModal, setShowSingleDayMultiSlotModal] = useState(false);
  const [singleDaySlots, setSingleDaySlots] = useState<Array<{time: string, duration: number}>>([
    {time: '09:00', duration: 30}
  ]);
  
  // Bulk creation form
  const [bulkForm, setBulkForm] = useState<BulkCreationForm>({
    startDate: '',
    endDate: '',
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri by default
    timeSlots: [
      { startTime: '09:00', durationMinutes: 30 },
      { startTime: '10:00', durationMinutes: 30 },
      { startTime: '14:00', durationMinutes: 30 },
      { startTime: '15:00', durationMinutes: 30 }
    ],
    sessionType: 'Video Call',
    timeZone: 'UTC',
    bufferTimeMinutes: 5,
    preparationTimeMinutes: 10,
    allowRescheduling: true,
    requireConfirmation: false,
    specialInstructions: '',
    createRecurring: false,
    recurringPattern: 'WEEKLY',
    recurringWeeks: 4
  });

  // Template form
  const [templateForm, setTemplateForm] = useState<AvailabilityTemplate>({
    templateName: '',
    description: '',
    dailyAvailabilities: Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i + 1,
      isAvailable: i < 5, // Mon-Fri available by default
      timeSlots: i < 5 ? [
        { startTime: '09:00', endTime: '17:00', sessionDurationMinutes: 30 }
      ] : []
    })),
    defaultDurationMinutes: 30,
    defaultSessionType: 'Video Call',
    bufferTimeMinutes: 5,
    preparationTimeMinutes: 10,
    allowRescheduling: true,
    maxReschedulingHours: 24,
    requireConfirmation: false,
    isDefault: false,
    isActive: true
  });

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    loadData();
  }, [mentorId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, templatesData] = await Promise.all([
        trialSessionService.getMyTrialSessions(),
        trialSessionService.getAvailabilityTemplates()
      ]);
      setSessions(sessionsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    try {
      const bulkRequest: BulkTrialSessionRequest = {
        startDate: bulkForm.startDate,
        endDate: bulkForm.endDate,
        timeSlots: bulkForm.timeSlots,
        daysOfWeek: bulkForm.daysOfWeek,
        sessionType: bulkForm.sessionType,
        timeZone: bulkForm.timeZone,
        bufferTimeMinutes: bulkForm.bufferTimeMinutes,
        preparationTimeMinutes: bulkForm.preparationTimeMinutes,
        allowRescheduling: bulkForm.allowRescheduling,
        requireConfirmation: bulkForm.requireConfirmation,
        specialInstructions: bulkForm.specialInstructions,
        createRecurring: bulkForm.createRecurring,
        recurringPattern: bulkForm.recurringPattern,
        recurringWeeks: bulkForm.recurringWeeks
      };

      const newSessions = await trialSessionService.createBulkTrialSessions(bulkRequest);
      setSessions(prev => [...prev, ...newSessions]);
      setShowBulkForm(false);
      alert(`Successfully created ${newSessions.length} trial sessions!`);
    } catch (error) {
      console.error('Error creating bulk sessions:', error);
      alert('Error creating sessions. Please try again.');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const savedTemplate = await trialSessionService.saveAvailabilityTemplate(templateForm);
      setTemplates(prev => editingTemplate 
        ? prev.map(t => t.id === editingTemplate.id ? savedTemplate : t)
        : [...prev, savedTemplate]
      );
      setShowTemplateForm(false);
      setEditingTemplate(null);
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  const handleApplyTemplate = async (templateId: number) => {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    
    if (startDate && endDate) {
      try {
        const newSessions = await trialSessionService.applyAvailabilityTemplate(
          templateId, 
          startDate + 'T00:00:00', 
          endDate + 'T23:59:59'
        );
        setSessions(prev => [...prev, ...newSessions]);
        alert(`Successfully created ${newSessions.length} sessions from template!`);
      } catch (error) {
        console.error('Error applying template:', error);
        alert('Error applying template. Please try again.');
      }
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await trialSessionService.deleteTrialSession(sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        alert('Session deleted successfully!');
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session. Please try again.');
      }
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await trialSessionService.deleteAvailabilityTemplate(templateId);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        alert('Template deleted successfully!');
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Error deleting template. Please try again.');
      }
    }
  };

  const handleEditSession = (session: TrialSession) => {
    setSelectedSessionForEdit(session);
    setShowEditForm(true);
  };

  const handleSaveEditedSession = async () => {
    if (!selectedSessionForEdit?.id) return;
    
    try {
      const updatedSession = await trialSessionService.updateTrialSession(selectedSessionForEdit.id, {
        scheduledDateTime: selectedSessionForEdit.scheduledDateTime,
        durationMinutes: selectedSessionForEdit.durationMinutes,
        sessionType: selectedSessionForEdit.sessionType,
        sessionTitle: selectedSessionForEdit.sessionTitle,
        sessionDescription: selectedSessionForEdit.sessionDescription,
        specialInstructions: selectedSessionForEdit.specialInstructions,
        timeZone: selectedSessionForEdit.timeZone,
        allowRescheduling: selectedSessionForEdit.allowRescheduling,
        requireConfirmation: selectedSessionForEdit.requireConfirmation,
        bufferTimeMinutes: selectedSessionForEdit.bufferTimeMinutes
      });
      
      setSessions(prev => prev.map(s => s.id === selectedSessionForEdit.id ? updatedSession : s));
      setShowEditForm(false);
      setSelectedSessionForEdit(null);
      alert('Session updated successfully!');
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Error updating session. Please try again.');
    }
  };

  const handleQuickCreate = async (date: string, timeSlots: { startTime: string, duration: number }[]) => {
    try {
      const bulkData = {
        mentorId,
        startDate: date,
        endDate: date,
        daysOfWeek: [new Date(date).getDay() === 0 ? 7 : new Date(date).getDay()], // Convert Sunday from 0 to 7
        timeSlots: timeSlots.map(slot => ({
          startTime: slot.startTime,
          durationMinutes: slot.duration
        })),
        sessionType: 'Video Call',
        timeZone: 'UTC',
        bufferTimeMinutes: 5,
        preparationTimeMinutes: 10,
        allowRescheduling: true,
        requireConfirmation: false,
        specialInstructions: '',
        createRecurring: false,
        recurringPattern: 'NONE' as const,
        recurringWeeks: 1
      };
      
      const newSessions = await trialSessionService.createBulkTrialSessions(bulkData);
      setSessions(prev => [...prev, ...newSessions]);
      setQuickCreateMode(false);
      setSelectedQuickSlots(new Set());
      alert(`${newSessions.length} sessions created successfully!`);
    } catch (error) {
      console.error('Error creating sessions:', error);
      alert('Error creating sessions. Please try again.');
    }
  };

  const closeQuickCreateModal = () => {
    setQuickCreateMode(false);
    setSelectedQuickSlots(new Set());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const addTimeSlot = () => {
    setBulkForm(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '12:00', durationMinutes: 30 }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setBulkForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlotRequest, value: string | number) => {
    setBulkForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const toggleDay = (day: number) => {
    setBulkForm(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) 
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort()
    }));
  };

  const updateTemplateAvailability = (dayIndex: number, field: keyof DailyAvailability, value: any) => {
    setTemplateForm(prev => ({
      ...prev,
      dailyAvailabilities: prev.dailyAvailabilities.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const addTemplateTimeSlot = (dayIndex: number) => {
    setTemplateForm(prev => ({
      ...prev,
      dailyAvailabilities: prev.dailyAvailabilities.map((day, i) =>
        i === dayIndex ? {
          ...day,
          timeSlots: [...(day.timeSlots || []), { 
            startTime: '09:00', 
            endTime: '10:00', 
            sessionDurationMinutes: 30 
          }]
        } : day
      )
    }));
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-cape-cod-900 text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-sm p-6`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-cape-cod-900 text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-sm`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Availability Manager</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setQuickCreateMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              <IconPlus size={16} />
              Quick Create
            </button>
            <button
              onClick={() => setShowSingleDayMultiSlotModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
            >
              <IconCalendar size={16} />
              Create Multiple Slots
            </button>
            <button
              onClick={() => setShowBulkForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <IconPackage size={16} />
              Batch Create
            </button>
            <button
              onClick={() => setShowTemplateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <IconTemplate size={16} />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'sessions', label: 'Sessions', icon: IconCalendar },
          { key: 'bulk', label: 'Bulk Actions', icon: IconPackage },
          { key: 'templates', label: 'Templates', icon: IconTemplate }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Trial Sessions ({sessions.length})</h3>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                <IconRefresh size={14} />
                Refresh
              </button>
            </div>
            
            <div className="grid gap-4">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg ${
                    session.status === 'AVAILABLE' 
                      ? 'border-green-200 bg-green-50' 
                      : session.status === 'BOOKED'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <IconCalendar size={16} />
                        <span className="font-medium">
                          {new Date(session.scheduledDateTime).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500">
                          {new Date(session.scheduledDateTime).toLocaleTimeString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          session.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          session.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {session.durationMinutes} mins • {session.sessionType}
                        {session.timeZone && ` • ${session.timeZone}`}
                        {session.isRecurring && ' • Recurring'}
                      </div>
                      {session.sessionTitle && (
                        <div className="text-sm font-medium text-gray-700 mt-1">
                          {session.sessionTitle}
                        </div>
                      )}
                      {session.menteeName && (
                        <div className="text-sm text-blue-600 mt-1">
                          Booked by: {session.menteeName}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSession(session)}
                        className="p-2 text-blue-400 hover:text-blue-600"
                        title="Edit session"
                      >
                        <IconEdit size={16} />
                      </button>
                      {session.status === 'AVAILABLE' && (
                        <button
                          onClick={() => session.id && handleDeleteSession(session.id)}
                          className="p-2 text-red-400 hover:text-red-600"
                          title="Delete session"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Availability Templates ({templates.length})</h3>
            
            <div className="grid gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{template.templateName}</div>
                      <div className="text-sm text-gray-600">{template.description}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {template.defaultDurationMinutes} min sessions • {template.defaultSessionType}
                        {template.isDefault && ' • Default'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => template.id && handleApplyTemplate(template.id)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          setEditingTemplate(template);
                          setTemplateForm(template);
                          setShowTemplateForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => template.id && handleDeleteTemplate(template.id)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Creation Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Bulk Create Sessions</h3>
              <button
                onClick={() => setShowBulkForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={bulkForm.startDate}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={bulkForm.endDate}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Days of Week */}
              <div>
                <label className="block text-sm font-medium mb-2">Days of Week</label>
                <div className="flex gap-2">
                  {dayNames.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(index + 1)}
                      className={`px-3 py-2 rounded text-sm font-medium ${
                        bulkForm.daysOfWeek.includes(index + 1)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Time Slots</label>
                  <button
                    onClick={addTimeSlot}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <IconPlus size={14} />
                    Add Slot
                  </button>
                </div>
                <div className="space-y-2">
                  {bulkForm.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="p-2 border rounded"
                      />
                      <input
                        type="number"
                        value={slot.durationMinutes}
                        onChange={(e) => updateTimeSlot(index, 'durationMinutes', parseInt(e.target.value))}
                        className="w-20 p-2 border rounded"
                        placeholder="30"
                      />
                      <span className="text-sm text-gray-500">minutes</span>
                      <button
                        onClick={() => removeTimeSlot(index)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Session Type</label>
                  <select
                    value={bulkForm.sessionType}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, sessionType: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time Zone</label>
                  <input
                    type="text"
                    value={bulkForm.timeZone}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, timeZone: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="UTC"
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Buffer Time (minutes)</label>
                  <input
                    type="number"
                    value={bulkForm.bufferTimeMinutes}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, bufferTimeMinutes: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preparation Time (minutes)</label>
                  <input
                    type="number"
                    value={bulkForm.preparationTimeMinutes}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, preparationTimeMinutes: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bulkForm.allowRescheduling}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, allowRescheduling: e.target.checked }))}
                  />
                  <span className="text-sm">Allow rescheduling</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bulkForm.requireConfirmation}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, requireConfirmation: e.target.checked }))}
                  />
                  <span className="text-sm">Require confirmation</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bulkForm.createRecurring}
                    onChange={(e) => setBulkForm(prev => ({ ...prev, createRecurring: e.target.checked }))}
                  />
                  <span className="text-sm">Create recurring pattern</span>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  value={bulkForm.specialInstructions}
                  onChange={(e) => setBulkForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Any special instructions for mentees..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowBulkForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Modal */}
      {quickCreateMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-cape-cod-800' : 'bg-white'} p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Quick Create Multiple Slots</h3>
              <button
                onClick={closeQuickCreateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              {/* Time Slots for Quick Create */}
              <div>
                <label className="block text-sm font-medium mb-2">Create Multiple Time Slots</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { time: '09:00', duration: 30 },
                      { time: '10:00', duration: 30 },
                      { time: '11:00', duration: 30 },
                      { time: '14:00', duration: 30 },
                      { time: '15:00', duration: 30 },
                      { time: '16:00', duration: 30 },
                      { time: '17:00', duration: 30 },
                      { time: '18:00', duration: 30 },
                      { time: '19:00', duration: 30 }
                    ].map((slot, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedQuickSlots.has(slot.time)}
                          onChange={(e) => {
                            const newSelection = new Set(selectedQuickSlots);
                            if (e.target.checked) {
                              newSelection.add(slot.time);
                            } else {
                              newSelection.delete(slot.time);
                            }
                            setSelectedQuickSlots(newSelection);
                          }}
                        />
                        <span className="text-sm font-medium">{slot.time}</span>
                        <span className="text-xs text-gray-500">({slot.duration}min)</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded border">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> Select multiple time slots to create them all at once for the selected date.
                      Selected: <strong>{selectedQuickSlots.size}</strong> slots
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeQuickCreateModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const timeSlotMap: Record<string, number> = {
                      '09:00': 30, '10:00': 30, '11:00': 30, '14:00': 30,
                      '15:00': 30, '16:00': 30, '17:00': 30, '18:00': 30, '19:00': 30
                    };
                    const selectedSlots = Array.from(selectedQuickSlots).map(time => ({
                      startTime: time,
                      duration: timeSlotMap[time] || 30
                    }));
                    if (selectedSlots.length > 0) {
                      handleQuickCreate(selectedDate, selectedSlots);
                    } else {
                      alert('Please select at least one time slot.');
                    }
                  }}
                  disabled={selectedQuickSlots.size === 0}
                  className={`px-6 py-2 rounded font-medium ${
                    selectedQuickSlots.size > 0 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Create {selectedQuickSlots.size} Selected Slot{selectedQuickSlots.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditForm && selectedSessionForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-cape-cod-800' : 'bg-white'} p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Edit Trial Session</h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setSelectedSessionForEdit(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={new Date(selectedSessionForEdit.scheduledDateTime).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const currentTime = new Date(selectedSessionForEdit.scheduledDateTime);
                      const newDateTime = new Date(e.target.value);
                      newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes());
                      setSelectedSessionForEdit({
                        ...selectedSessionForEdit,
                        scheduledDateTime: newDateTime.toISOString()
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={new Date(selectedSessionForEdit.scheduledDateTime).toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const currentDate = new Date(selectedSessionForEdit.scheduledDateTime);
                      const [hours, minutes] = e.target.value.split(':');
                      currentDate.setHours(parseInt(hours), parseInt(minutes));
                      setSelectedSessionForEdit({
                        ...selectedSessionForEdit,
                        scheduledDateTime: currentDate.toISOString()
                      });
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Duration & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={selectedSessionForEdit.durationMinutes || 30}
                    onChange={(e) => setSelectedSessionForEdit({
                      ...selectedSessionForEdit,
                      durationMinutes: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Session Type</label>
                  <select
                    value={selectedSessionForEdit.sessionType || 'Video Call'}
                    onChange={(e) => setSelectedSessionForEdit({
                      ...selectedSessionForEdit,
                      sessionType: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
              </div>

              {/* Session Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Session Title</label>
                <input
                  type="text"
                  value={selectedSessionForEdit.sessionTitle || ''}
                  onChange={(e) => setSelectedSessionForEdit({
                    ...selectedSessionForEdit,
                    sessionTitle: e.target.value
                  })}
                  placeholder="e.g., Career Guidance Session"
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Session Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={selectedSessionForEdit.sessionDescription || ''}
                  onChange={(e) => setSelectedSessionForEdit({
                    ...selectedSessionForEdit,
                    sessionDescription: e.target.value
                  })}
                  placeholder="Brief description of what this session will cover..."
                  className="w-full p-2 border rounded h-20"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  value={selectedSessionForEdit.specialInstructions || ''}
                  onChange={(e) => setSelectedSessionForEdit({
                    ...selectedSessionForEdit,
                    specialInstructions: e.target.value
                  })}
                  placeholder="Any special instructions for the mentee..."
                  className="w-full p-2 border rounded h-16"
                />
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSessionForEdit.allowRescheduling || false}
                    onChange={(e) => setSelectedSessionForEdit({
                      ...selectedSessionForEdit,
                      allowRescheduling: e.target.checked
                    })}
                  />
                  <span className="text-sm">Allow Rescheduling</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSessionForEdit.requireConfirmation || false}
                    onChange={(e) => setSelectedSessionForEdit({
                      ...selectedSessionForEdit,
                      requireConfirmation: e.target.checked
                    })}
                  />
                  <span className="text-sm">Require Confirmation</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedSessionForEdit(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedSession}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Day Multi Slot Modal */}
      {showSingleDayMultiSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Create Multiple Trial Slots for One Day
              </h3>
              <button
                onClick={() => setShowSingleDayMultiSlotModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <IconX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Time Slots (Add multiple slots for the selected date)
                </label>
                <div className="space-y-3">
                  {singleDaySlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          value={slot.time}
                          onChange={(e) => {
                            const newSlots = [...singleDaySlots];
                            newSlots[index].time = e.target.value;
                            setSingleDaySlots(newSlots);
                          }}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Duration (mins)
                        </label>
                        <select
                          value={slot.duration}
                          onChange={(e) => {
                            const newSlots = [...singleDaySlots];
                            newSlots[index].duration = parseInt(e.target.value);
                            setSingleDaySlots(newSlots);
                          }}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        >
                          <option value={15}>15 mins</option>
                          <option value={30}>30 mins</option>
                          <option value={45}>45 mins</option>
                          <option value={60}>60 mins</option>
                          <option value={90}>90 mins</option>
                          <option value={120}>120 mins</option>
                        </select>
                      </div>
                      {singleDaySlots.length > 1 && (
                        <button
                          onClick={() => {
                            const newSlots = singleDaySlots.filter((_, i) => i !== index);
                            setSingleDaySlots(newSlots);
                          }}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSingleDaySlots([...singleDaySlots, {time: '09:00', duration: 30}])}
                  className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg"
                >
                  <IconPlus size={16} />
                  Add Another Time Slot
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setShowSingleDayMultiSlotModal(false);
                    setSingleDaySlots([{time: '09:00', duration: 30}]);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const dateObj = new Date(selectedDate);
                      const promises = singleDaySlots.map(slot => {
                        const [hours, minutes] = slot.time.split(':');
                        const startTime = new Date(dateObj);
                        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        
                        const endTime = new Date(startTime);
                        endTime.setMinutes(endTime.getMinutes() + slot.duration);

                        const sessionData = {
                          scheduledDateTime: startTime.toISOString(),
                          durationMinutes: slot.duration,
                          sessionType: 'TRIAL',
                          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                          sessionTitle: `Trial Session - ${slot.duration} mins`,
                          sessionDescription: 'Trial session booking',
                          allowRescheduling: true,
                          requireConfirmation: false,
                          bufferTimeMinutes: 5,
                          preparationTimeMinutes: 5
                        };

                        return trialSessionService.createAvailableSlot(sessionData);
                      });

                      await Promise.all(promises);
                      await loadData();
                      setShowSingleDayMultiSlotModal(false);
                      setSingleDaySlots([{time: '09:00', duration: 30}]);
                      alert(`Created ${singleDaySlots.length} trial slots for ${selectedDate}`);
                    } catch (error) {
                      console.error('Error creating slots:', error);
                      alert('Failed to create slots. Please try again.');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                >
                  Create {singleDaySlots.length} Slot{singleDaySlots.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorAvailabilityManager;
