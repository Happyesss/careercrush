export interface Mentor {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  bio: string;
  about?: string;
  picture?: string;
  profileBackground?: string;
  location: string;
  totalExp: number;
  timezone: string;
  currentMentees: number;
  isAvailable: boolean;
  mentorshipAreas: string[];
  sessionPreference: string;
  availableDays: string[] | string;
  languages: string[];
  experiences: Experience[];
  skills: string[];
  certifications?: Certification[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  mentorshipRequests?: MentorshipRequest[];
  // New fields for mentorship packages
  mentorshipPackages?: any[]; // Will contain MentorshipPackage[]
  planPriceMap?: Record<string, number>;
  hasTrialSlots?: boolean;
  discountMap?: Record<string, number>; // Discount percentages for each duration
  originalPriceMap?: Record<string, number>; // Original prices before discount
}

export interface Experience {
  company: string;
  position?: string; // Make optional for backward compatibility
  title?: string;    // Make optional for backward compatibility  
  duration?: string; // Make optional
  startDate?: string | Date;
  endDate?: string | Date;
  working?: boolean; // Current job indicator
  description?: string; // Make optional
  location?: string; // Add location field for consistency
  companyLogo?: string; // Base64 encoded company logo image
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate?: string | Date;
  certificateID?: string;
  certificateImage?: string; // Base64 encoded certificate image
}

export interface MentorshipRequest {
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

export interface MentorFilters {
  search: string;
  skills: string[];
  experience: string;
  availability: string;
  priceRange: number[];
}