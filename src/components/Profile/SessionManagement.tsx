"use client";

import { Card, Text, Button, Badge, Modal, Group, Textarea, Select } from "@mantine/core";
import { IconCalendar, IconClock, IconUser, IconCheck, IconX, IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../ThemeContext";
import { getMentorByEmail, updateMentorshipRequestStatus } from "../../Services/MentorService";
import { successNotification, errorNotification } from "../../Services/NotificationService";

interface MentorshipRequest {
  id: string;
  applicantName: string;
  applicantEmail: string;
  requestDate: string;
  status: string;
  sessionStatus?: string;
  message: string;
  sessionType: string;
  preferredDate: string;
  preferredTime: string;
}

const SessionManagement = () => {
  const { isDarkMode } = useTheme();
  const user = useSelector((state: any) => state.user);
  const [mentor, setMentor] = useState<any>(null);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<string>("");

  useEffect(() => {
    fetchMentorData();
  }, [user]);

  const fetchMentorData = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const data = await getMentorByEmail(user.email);
      if (data) {
        setMentor(data);
        setRequests(data.mentorshipRequests || []);
      }
    } catch (error: any) {
      // Handle 404 (mentor not found) as normal case
      if (error.response?.status === 404) {
        console.log("No mentor profile found - this is normal for new mentors");
        setMentor(null);
        setRequests([]);
      } else {
        console.error("Error fetching mentor data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (request: MentorshipRequest, status: string) => {
    setSelectedRequest(request);
    setResponseStatus(status);
    setResponseModalOpen(true);
  };

  const submitResponse = async () => {
    if (!selectedRequest || !mentor) return;

    try {
      await updateMentorshipRequestStatus(
        mentor.id, 
        selectedRequest.id, 
        responseStatus, 
        responseMessage
      );
      
      // Update local state
      setRequests(prev => 
        prev.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: responseStatus }
            : req
        )
      );

      setResponseModalOpen(false);
      setSelectedRequest(null);
      setResponseMessage("");
      
      successNotification(
        `Request ${responseStatus.toLowerCase()} successfully`, 
        "Success"
      );
    } catch (error) {
      console.error("Error updating request status:", error);
      errorNotification("Failed to update request status", "Error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'yellow';
      case 'accepted': case 'approved': return 'green';
      case 'rejected': case 'declined': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <IconClock size={16} />;
      case 'accepted': case 'approved': return <IconCheck size={16} />;
      case 'rejected': case 'declined': return <IconX size={16} />;
      default: return <IconEye size={16} />;
    }
  };

  if (!mentor) {
    return (
      <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
        <Text size="lg" mb="md" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
          Set up your mentor profile to manage sessions
        </Text>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`p-4 rounded-lg animate-pulse ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
            <div className={`h-4 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded mb-2`}></div>
            <div className={`h-4 ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-200'} rounded w-3/4`}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Text size="xl" fw={700} className={isDarkMode ? 'text-white' : 'text-black'}>
          Session Management
        </Text>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
            <Text size="sm">
              Total Requests: {requests.length}
            </Text>
          </div>
          <div className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-50'}`}>
            <Text size="sm" c="yellow">
              Pending: {requests.filter(req => req.status === 'PENDING').length}
            </Text>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${isDarkMode ? 'bg-cape-cod-900' : 'bg-gray-50'}`}>
          <IconCalendar size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-cape-cod-400' : 'text-gray-400'}`} />
          <Text size="lg" mb="md" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
            No mentorship requests yet
          </Text>
            <Text size="sm" className={isDarkMode ? 'text-cape-cod-400' : 'text-gray-500'}>
            When students request mentorship, they&apos;ll appear here
          </Text>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className={`${isDarkMode ? 'bg-cape-cod-900' : 'bg-white'} border`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <IconUser size={16} />
                      <Text fw={600} size="lg">
                        {request.applicantName}
                      </Text>
                    </div>
                    <Badge 
                      color={getStatusColor(request.status)} 
                      variant="light"
                      leftSection={getStatusIcon(request.status)}
                    >
                      {request.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                        Email
                      </Text>
                      <Text size="sm">{request.applicantEmail}</Text>
                    </div>
                    
                    <div>
                      <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                        Session Type
                      </Text>
                      <Text size="sm">{request.sessionType}</Text>
                    </div>
                    
                    <div>
                      <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                        Preferred Date
                      </Text>
                      <Text size="sm">{request.preferredDate}</Text>
                    </div>
                    
                    <div>
                      <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
                        Preferred Time
                      </Text>
                      <Text size="sm">{request.preferredTime}</Text>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Text size="sm" fw={500} className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'} mb={1}>
                      Message
                    </Text>
                    <Text size="sm" className={`p-3 rounded ${isDarkMode ? 'bg-cape-cod-800' : 'bg-gray-50'}`}>
                      {request.message}
                    </Text>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <IconCalendar size={14} />
                    <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {request.status === 'PENDING' && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="xs"
                      color="green"
                      onClick={() => handleRequestResponse(request, 'ACCEPTED')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      onClick={() => handleRequestResponse(request, 'REJECTED')}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <Modal
        opened={responseModalOpen}
        onClose={() => setResponseModalOpen(false)}
        title={`${responseStatus === 'ACCEPTED' ? 'Accept' : 'Decline'} Mentorship Request`}
      >
        <div className="space-y-4">
          <Text size="sm" className={isDarkMode ? 'text-cape-cod-300' : 'text-gray-600'}>
            {selectedRequest && (
              <>
                Responding to request from <strong>{selectedRequest.applicantName}</strong>
              </>
            )}
          </Text>

          <Textarea
            label="Response Message (Optional)"
            placeholder={`Add a ${responseStatus === 'ACCEPTED' ? 'welcome' : 'explanation'} message...`}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.currentTarget.value)}
            rows={4}
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setResponseModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              color={responseStatus === 'ACCEPTED' ? 'green' : 'red'}
              onClick={submitResponse}
            >
              {responseStatus === 'ACCEPTED' ? 'Accept Request' : 'Decline Request'}
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default SessionManagement;