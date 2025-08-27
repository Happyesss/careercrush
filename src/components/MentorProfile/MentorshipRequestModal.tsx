"use client";

import { Modal, TextInput, Textarea, Select, Group, Button } from "@mantine/core";

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
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Request Mentorship Session"
      size="lg"
    >
      <div className="space-y-4">
        <TextInput
          label="Your Name"
          placeholder="Enter your name"
          value={requestForm.menteeName}
          onChange={(e) => setRequestForm({...requestForm, menteeName: e.target.value})}
          required
        />
        
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={requestForm.menteeEmail}
          onChange={(e) => setRequestForm({...requestForm, menteeEmail: e.target.value})}
          required
        />
        
        <TextInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={requestForm.menteePhone}
          onChange={(e) => setRequestForm({...requestForm, menteePhone: e.target.value})}
        />
        
        <Textarea
          label="Your Background"
          placeholder="Tell us about your current role and experience"
          value={requestForm.menteeBackground}
          onChange={(e) => setRequestForm({...requestForm, menteeBackground: e.target.value})}
          rows={3}
        />
        
        <Textarea
          label="Message to Mentor"
          placeholder="Why do you want to work with this mentor?"
          value={requestForm.requestMessage}
          onChange={(e) => setRequestForm({...requestForm, requestMessage: e.target.value})}
          rows={3}
          required
        />
        
        <Textarea
          label="Your Goals"
          placeholder="What do you hope to achieve through mentorship?"
          value={requestForm.goals}
          onChange={(e) => setRequestForm({...requestForm, goals: e.target.value})}
          rows={3}
        />
        
        <TextInput
          label="Preferred Time"
          placeholder="When would you like to have sessions?"
          value={requestForm.preferredTime}
          onChange={(e) => setRequestForm({...requestForm, preferredTime: e.target.value})}
        />
        
        <Select
          label="Session Type"
          value={requestForm.sessionType}
          onChange={(value) => setRequestForm({...requestForm, sessionType: value || "one-time"})}
          data={[
            { value: "one-time", label: "One-time Session" },
            { value: "ongoing", label: "Ongoing Mentorship" },
            { value: "project-based", label: "Project-based" }
          ]}
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Send Request
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default MentorshipRequestModal;