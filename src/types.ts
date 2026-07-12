/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AttendeeRegistration {
  id: string; // Registration ID
  ticketNumber: string; // e.g. TC26-7F3A9B2C
  fullName: string;
  mobileNumber: string;
  whatsAppNumber: string;
  email: string;
  age: number;
  gender: string;
  district: string;
  state: string;
  country: string;
  occupation: 'Student' | 'Working Professional' | 'Entrepreneur' | 'Faculty' | 'Research Scholar' | 'Other';
  place?: string; // Place of resident
  level?: string; // Student level (Primary, Highschool, etc.)
  
  // Student fields
  institution?: string;
  institutionDistrict?: string;
  course?: string;
  department?: string;
  year?: string;

  // Working professional fields
  company?: string;
  profession?: string;
  industry?: string;

  // Preferences & Interests
  technologyInterests: string[]; // ['AI', 'ML', 'Cyber Security', etc]
  emergencyContact: string;
  foodPreference: 'Veg' | 'Non-Veg' | 'Vegan' | 'Jain' | 'None';
  accessibilityRequirement: string;
  consent: boolean;

  // Selected Sessions & Programs
  sessions: string[];
  specialPrograms: string[];
  feeReceiptUrl?: string; // Optional URL for Hackathon fee receipt

  // Administrative / System fields
  verificationToken: string;
  checkedIn: boolean; // Global check-in
  checkInTime: string | null;
  sessionCheckIns?: { [sessionName: string]: string }; // Map of session/program name to ISO timestamp
  createdAt: string;
}

export interface AdminStats {
  totalRegistrations: number;
  todaysRegistrations: number;
  checkedInCount: number; // Global check-in count
  districtReport: { [district: string]: number };
  occupationReport: { [occupation: string]: number };
  genderReport: { [gender: string]: number };
  interestsReport: { [interest: string]: number };
  sessionRegistrations: { [sessionName: string]: number };
  sessionCheckIns: { [sessionName: string]: number };
}

export interface TimelineEvent {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  speaker?: {
    name: string;
    role: string;
    avatar?: string;
  };
  type: 'keynote' | 'panel' | 'workshop' | 'break' | 'expo';
}

export interface VolunteerRegistration {
  id: string; // e.g., TCVOL-A001
  fullName: string;
  age: number;
  gender: string;
  address: string;
  mobileNumber: string;
  whatsAppNumber: string;
  institution: string;
  district: string;
  institutionDistrict: string;
  photoUrl: string; // Firebase Storage URL
  volunteerAreas: string[];
  hearAbout: string;
  reasonToJoin: string;
  createdAt: string;
}

export interface CampusAmbassador {
  id: string; // References AttendeeRegistration ID
  fullName: string;
  mobileNumber: string;
  email: string;
  institution: string;
  status: 'pending' | 'approved';
  createdAt: string;
}
