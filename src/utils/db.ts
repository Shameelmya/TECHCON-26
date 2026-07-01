/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AttendeeRegistration, AdminStats } from '../types';

const STORAGE_KEY = 'techcon26_registrations_v2';

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
const MOCK_ATTENDEES: AttendeeRegistration[] = [];

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

export const fetchAllRegistrations = async (): Promise<AttendeeRegistration[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbxzAOiL7SXAk2Sg2Zzt0HWHODnCPNnzrM60I34xbaAVxnBBKM8Donpo1YSPXArr_sRHNQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getAllRegistrations' })
    });
    const data = await res.json();
    if (data.status === 'success' && data.registrations) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.registrations));
      return data.registrations;
    }
  } catch (e) {
    console.error("Failed to fetch all registrations from Google Sheet:", e);
  }
  return getRegistrations();
};

export const saveRegistration = async (reg: Omit<AttendeeRegistration, 'id' | 'ticketNumber' | 'verificationToken' | 'checkedIn' | 'checkInTime' | 'createdAt'>): Promise<AttendeeRegistration> => {
  const list = getRegistrations();
  
  // Check duplicates
  const duplicate = list.find(item => 
    (reg.email && item.email && item.email.toLowerCase() === reg.email.toLowerCase()) || 
    (item.mobileNumber === reg.mobileNumber)
  );
  if (duplicate) {
    throw new Error(`Already registered. Found existing user with email "${reg.email || 'N/A'}" or phone "${reg.mobileNumber}".`);
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
