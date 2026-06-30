/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AttendeeRegistration, AdminStats } from '../types';

const STORAGE_KEY = 'techcon26_registrations';

// Helper to generate unique ID in TC26A001, TC26A002 ... TC26A999 format
export function generateCustomID(count: number): string {
  const letterIndex = Math.floor(count / 999);
  const letter = String.fromCharCode(65 + (letterIndex % 26));
  const num = (count % 999) + 1;
  const numStr = num.toString().padStart(3, '0');
  return `TC26${letter}${numStr}`;
}

export function generateTicketNumber(): string {
  const chars = '0123456789ABCDEF';
  let ticket = 'TC26-';
  for (let i = 0; i < 8; i++) {
    ticket += chars[Math.floor(Math.random() * chars.length)];
  }
  return ticket;
}

export function generateVerificationToken(regId: string, email: string): string {
  // Simple token generation
  return btoa(`${regId}:${email}`).substring(0, 16);
}

// Sample attendee data to pre-populate for rich dashboard charts
const MOCK_ATTENDEES: AttendeeRegistration[] = [
  {
    id: "TC26A001",
    ticketNumber: "TC26-9A1B4C3E",
    fullName: "Aravind K. Nair",
    mobileNumber: "+91 9447102030",
    whatsAppNumber: "+91 9447102030",
    email: "aravind.nair@gmail.com",
    age: 26,
    gender: "Male",
    district: "Ernakulam",
    state: "Kerala",
    country: "India",
    occupation: "Working Professional",
    company: "Tata Consultancy Services",
    profession: "Senior Software Engineer",
    industry: "Information Technology",
    technologyInterests: ["AI", "ML", "Cloud", "Cyber Security"],
    emergencyContact: "+91 9846123456",
    foodPreference: "Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "SR8F71Nair",
    checkedIn: true,
    checkInTime: "2026-06-30T09:12:00-07:00",
    createdAt: "2026-06-25T10:14:00-07:00"
  },
  {
    id: "TC26A002",
    ticketNumber: "TC26-F5E2A8D9",
    fullName: "Ananya R. Krishnan",
    mobileNumber: "+91 9845304050",
    whatsAppNumber: "+91 9845304050",
    email: "ananya.krishnan@outlook.com",
    age: 21,
    gender: "Female",
    district: "Thiruvananthapuram",
    state: "Kerala",
    country: "India",
    occupation: "Student",
    institution: "CUSAT",
    course: "B.Tech",
    department: "Computer Science and Engineering",
    year: "Final Year",
    technologyInterests: ["Web", "Robotics", "AR", "VR", "Data Science"],
    emergencyContact: "+91 9445678912",
    foodPreference: "Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "AN3D90Krish",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-26T14:22:15-07:00"
  },
  {
    id: "TC26A003",
    ticketNumber: "TC26-3C7B2F8E",
    fullName: "Dr. Matthew Joseph",
    mobileNumber: "+91 9048101020",
    whatsAppNumber: "+91 9048101020",
    email: "matthew.joseph@cusat.ac.in",
    age: 45,
    gender: "Male",
    district: "Ernakulam",
    state: "Kerala",
    country: "India",
    occupation: "Faculty",
    company: "Cochin University of Science and Technology",
    profession: "Professor",
    industry: "Education",
    technologyInterests: ["AI", "Robotics", "Data Science", "Electronics"],
    emergencyContact: "+91 9847239100",
    foodPreference: "Non-Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "MJ1A42Facu",
    checkedIn: true,
    checkInTime: "2026-06-30T08:45:00-07:00",
    createdAt: "2026-06-27T09:05:00-07:00"
  },
  {
    id: "TC26A004",
    ticketNumber: "TC26-0D4A6E1F",
    fullName: "Riya Elsa Cherian",
    mobileNumber: "+91 7560121234",
    whatsAppNumber: "+91 7560121234",
    email: "riya.cherian@yahoo.com",
    age: 28,
    gender: "Female",
    district: "Kottayam",
    state: "Kerala",
    country: "India",
    occupation: "Entrepreneur",
    company: "Vesta Robotics Lab",
    profession: "Founder & CEO",
    industry: "Robotics / Hardware",
    technologyInterests: ["Robotics", "IoT", "ML", "Electronics"],
    emergencyContact: "+91 9446212134",
    foodPreference: "Vegan",
    accessibilityRequirement: "Wheelchair ramp accessibility",
    consent: true,
    verificationToken: "RC9B88Entre",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-28T16:45:30-07:00"
  },
  {
    id: "TC26A005",
    ticketNumber: "TC26-B8D2C5F4",
    fullName: "Siddharth Sharma",
    mobileNumber: "+91 8129030405",
    whatsAppNumber: "+91 8129030405",
    email: "siddharth.s@iiit.ac.in",
    age: 24,
    gender: "Male",
    district: "Kozhikode",
    state: "Kerala",
    country: "India",
    occupation: "Research Scholar",
    institution: "NIT Calicut",
    course: "Ph.D.",
    department: "Computer Science",
    year: "2nd Year",
    technologyInterests: ["Blockchain", "Cyber Security", "Cryptography"],
    emergencyContact: "+91 9122334455",
    foodPreference: "Non-Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "SS7X31Rese",
    checkedIn: true,
    checkInTime: "2026-06-30T10:02:11-07:00",
    createdAt: "2026-06-28T11:30:10-07:00"
  },
  {
    id: "TC26A006",
    ticketNumber: "TC26-D3E9F8A1",
    fullName: "Meera Jasmine",
    mobileNumber: "+91 9495112233",
    whatsAppNumber: "+91 9495112233",
    email: "meera.jasmine@gmail.com",
    age: 22,
    gender: "Female",
    district: "Thrissur",
    state: "Kerala",
    country: "India",
    occupation: "Student",
    institution: "KTU",
    course: "B.Tech",
    department: "Electronics and Communication",
    year: "Third Year",
    technologyInterests: ["IoT", "Web", "Mobile", "Electronics"],
    emergencyContact: "+91 9845112233",
    foodPreference: "Non-Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "MJ5K22Stud",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-29T10:15:00-07:00"
  },
  {
    id: "TC26A007",
    ticketNumber: "TC26-E4F2B7C8",
    fullName: "Faisal Rahman",
    mobileNumber: "+91 9895010203",
    whatsAppNumber: "+91 9895010203",
    email: "faisal.rahman@carestack.com",
    age: 31,
    gender: "Male",
    district: "Ernakulam",
    state: "Kerala",
    country: "India",
    occupation: "Working Professional",
    company: "CareStack",
    profession: "Lead Architect",
    industry: "Healthcare Tech",
    technologyInterests: ["Cloud", "Web", "Data Science", "AI"],
    emergencyContact: "+91 9895998877",
    foodPreference: "Non-Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "FR2P44Tech",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-29T15:40:00-07:00"
  },
  {
    id: "TC26A008",
    ticketNumber: "TC26-C2F9E1A3",
    fullName: "Devika S. Kumar",
    mobileNumber: "+91 9446305070",
    whatsAppNumber: "+91 9446305070",
    email: "devika.kumar@gmail.com",
    age: 20,
    gender: "Female",
    district: "Alappuzha",
    state: "Kerala",
    country: "India",
    occupation: "Student",
    institution: "CUSAT",
    course: "B.Tech",
    department: "Information Technology",
    year: "Second Year",
    technologyInterests: ["Web", "Cloud", "Cyber Security"],
    emergencyContact: "+91 9446405070",
    foodPreference: "Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "DK8L55Cusat",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-30T02:10:00-07:00"
  },
  {
    id: "TC26A009",
    ticketNumber: "TC26-B1A5D8E4",
    fullName: "Adarsh Sen",
    mobileNumber: "+91 7012345678",
    whatsAppNumber: "+91 7012345678",
    email: "adarsh.sen@github.com",
    age: 29,
    gender: "Male",
    district: "Kollam",
    state: "Kerala",
    country: "India",
    occupation: "Working Professional",
    company: "GitHub",
    profession: "Developer Advocate",
    industry: "Open Source Tech",
    technologyInterests: ["Web", "AI", "Cloud", "Blockchain"],
    emergencyContact: "+91 9012345678",
    foodPreference: "Non-Veg",
    accessibilityRequirement: "None",
    consent: true,
    verificationToken: "AS3M11Advoc",
    checkedIn: false,
    checkInTime: null,
    createdAt: "2026-06-30T04:22:00-07:00"
  }
];

export const getRegistrations = (): AttendeeRegistration[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Populate mock data if database is empty to make experience amazing immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ATTENDEES));
    return MOCK_ATTENDEES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return MOCK_ATTENDEES;
  }
};

export const saveRegistration = async (reg: Omit<AttendeeRegistration, 'id' | 'ticketNumber' | 'verificationToken' | 'checkedIn' | 'checkInTime' | 'createdAt'>): Promise<AttendeeRegistration> => {
  const list = getRegistrations();
  
  // Check duplicates
  const duplicate = list.find(item => item.email.toLowerCase() === reg.email.toLowerCase() || item.mobileNumber === reg.mobileNumber);
  if (duplicate) {
    throw new Error(`Already registered. Found existing user with email "${reg.email}" or phone "${reg.mobileNumber}".`);
  }

  const id = generateCustomID(list.length);
  const ticketNumber = generateTicketNumber();
  const verificationToken = generateVerificationToken(id, reg.email);
  
  const newReg: AttendeeRegistration = {
    ...reg,
    id,
    ticketNumber,
    verificationToken,
    checkedIn: false,
    checkInTime: null,
    createdAt: new Date().toISOString()
  };

  const updated = [...list, newReg];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  try {
    await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'register', ...newReg })
    });
  } catch (err) {
    console.error("Failed to sync registration to Google Sheets:", err);
  }

  return newReg;
};

export const checkInAttendee = async (ticketNumberOrId: string): Promise<AttendeeRegistration> => {
  const list = getRegistrations();
  const cleanedInput = ticketNumberOrId.trim().toUpperCase();
  
  const index = list.findIndex(
    item => item.ticketNumber.toUpperCase() === cleanedInput || 
            item.id.toUpperCase() === cleanedInput ||
            item.verificationToken === ticketNumberOrId
  );

  if (index === -1) {
    throw new Error(`No attendee found with ID, Ticket, or Token "${ticketNumberOrId}".`);
  }

  if (list[index].checkedIn) {
    throw new Error(`Attendee ${list[index].fullName} is ALREADY checked in at ${new Date(list[index].checkInTime!).toLocaleTimeString()}`);
  }

  list[index].checkedIn = true;
  list[index].checkInTime = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  try {
    await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'checkin', ticketNumber: list[index].ticketNumber })
    });
  } catch (err) {
    console.error("Failed to sync check-in to Google Sheets:", err);
  }

  return list[index];
};

export const revertCheckIn = (id: string): AttendeeRegistration => {
  const list = getRegistrations();
  const index = list.findIndex(item => item.id === id);
  if (index === -1) throw new Error("Attendee not found");
  
  list[index].checkedIn = false;
  list[index].checkInTime = null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list[index];
};

export const getStats = (): AdminStats => {
  const list = getRegistrations();
  const today = new Date().toISOString().substring(0, 10);
  
  const todays = list.filter(item => {
    try {
      return item.createdAt.substring(0, 10) === today;
    } catch {
      return false;
    }
  });

  const checkedIn = list.filter(item => item.checkedIn);

  // Compile reports
  const districtReport: { [district: string]: number } = {};
  const occupationReport: { [occupation: string]: number } = {};
  const genderReport: { [gender: string]: number } = {};
  const interestsReport: { [interest: string]: number } = {};

  list.forEach(item => {
    // District
    const dist = item.district || 'Other';
    districtReport[dist] = (districtReport[dist] || 0) + 1;

    // Occupation
    const occ = item.occupation || 'Other';
    occupationReport[occ] = (occupationReport[occ] || 0) + 1;

    // Gender
    const gen = item.gender || 'Other';
    genderReport[gen] = (genderReport[gen] || 0) + 1;

    // Technology Interests
    if (item.technologyInterests && Array.isArray(item.technologyInterests)) {
      item.technologyInterests.forEach(interest => {
        interestsReport[interest] = (interestsReport[interest] || 0) + 1;
      });
    }
  });

  return {
    totalRegistrations: list.length,
    todaysRegistrations: todays.length,
    checkedInCount: checkedIn.length,
    districtReport,
    occupationReport,
    genderReport,
    interestsReport
  };
};

export const exportToCSV = (list: AttendeeRegistration[]) => {
  const headers = [
    'ID', 'Ticket Number', 'Full Name', 'Email', 'Mobile', 'WhatsApp', 
    'Age', 'Gender', 'District', 'State', 'Country', 'Occupation', 
    'Institution/Company', 'Course/Profession', 'Department/Industry', 'Year',
    'Tech Interests', 'Checked In', 'Check-In Time', 'Registration Date'
  ];

  const rows = list.map(item => [
    item.id,
    item.ticketNumber,
    `"${item.fullName.replace(/"/g, '""')}"`,
    item.email,
    item.mobileNumber,
    item.whatsAppNumber,
    item.age,
    item.gender,
    item.district,
    item.state,
    item.country,
    item.occupation,
    `"${(item.institution || item.company || '').replace(/"/g, '""')}"`,
    `"${(item.course || item.profession || '').replace(/"/g, '""')}"`,
    `"${(item.department || item.industry || '').replace(/"/g, '""')}"`,
    item.year || '',
    `"${(item.technologyInterests || []).join(', ')}"`,
    item.checkedIn ? 'Yes' : 'No',
    item.checkInTime || '',
    item.createdAt
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "techcon26_registrations_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'login', password })
    });
    const data = await res.json();
    return data.status === 'success';
  } catch (err) {
    console.error("Admin login failed:", err);
    return false;
  }
};

export const getSettings = async (): Promise<boolean> => {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getSettings' })
    });
    const data = await res.json();
    return data.isOpen !== false;
  } catch (err) {
    console.error("Failed to get settings:", err);
    return true; 
  }
};

export const toggleRegistrationStatus = async (isOpen: boolean, password: string = 'admin'): Promise<boolean> => {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'toggleRegistration', isOpen, password })
    });
    const data = await res.json();
    return data.status === 'success';
  } catch (err) {
    console.error("Failed to toggle registration:", err);
    return false;
  }
};

export const fetchPass = async (fullName: string, mobileNumber: string): Promise<any> => {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getPass', fullName, mobileNumber })
    });
    const data = await res.json();
    if (data.status === 'success') {
      return data.ticket;
    }
    throw new Error(data.message || 'Ticket not found.');
  } catch (err) {
    throw err;
  }
};
