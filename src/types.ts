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

  // Administrative / System fields
  verificationToken: string;
  checkedIn: boolean;
  checkInTime: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalRegistrations: number;
  todaysRegistrations: number;
  checkedInCount: number;
  districtReport: { [district: string]: number };
  occupationReport: { [occupation: string]: number };
  genderReport: { [gender: string]: number };
  interestsReport: { [interest: string]: number };
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
