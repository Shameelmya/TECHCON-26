/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AttendeeRegistration, AdminStats, VolunteerRegistration } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where, getCountFromServer, updateDoc } from 'firebase/firestore';

const STORAGE_KEY = 'techcon26_registrations_v3'; // Bumped version to force a refresh on clients
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpg71jCgkSvWkvF2eY7ifWGJIvhUyVt7OiFdw0UfNJYn4LRSFA9imLg-kzI8DF4WuwBg/exec';

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

export const fetchAllRegistrations = async (password: string): Promise<AttendeeRegistration[]> => {
  if (typeof window === 'undefined') return [];
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getAllRegistrations', password })
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
  
  // Optimistically generate local data in case of network failure
  const optimisticReg: AttendeeRegistration = {
    ...reg,
    id: generateCustomID(list.length), // generateCustomID already accounts for 0-index internally
    ticketNumber: generateTicketNumber(),
    verificationToken: btoa(Math.random().toString()).substring(0, 16),
    createdAt: new Date().toISOString(),
    checkedIn: false,
    checkInTime: null
  };

  try {
    // Attempt to sync with Google Sheets (20 second timeout max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'register', ...reg }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await res.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    if (data.status === 'success' && data.registration) {
      optimisticReg.id = data.registration.id;
      optimisticReg.ticketNumber = data.registration.ticketNumber;
      optimisticReg.verificationToken = data.registration.verificationToken;
      optimisticReg.createdAt = data.registration.createdAt;
    }
  } catch (err: any) {
    if (err.message && (err.message.includes("Already registered") || err.message.includes("Server busy") || err.message.includes("Invalid password"))) {
      throw err; // Stop and report duplicate/server error to user
    }
    console.warn("Google Sheets Sync Failed. Falling back to robust local storage.", err.message);
  }

  // Persist locally instantly
  const updated = [...list, optimisticReg];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return optimisticReg;
};

export const checkInAttendee = async (ticketNumberOrId: string, password: string, sessionName?: string): Promise<AttendeeRegistration> => {
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

  if (sessionName) {
    if (!list[index].sessionCheckIns) {
      list[index].sessionCheckIns = {};
    }
    if (list[index].sessionCheckIns[sessionName]) {
      throw new Error(`Attendee ${list[index].fullName} is ALREADY checked in for ${sessionName}.`);
    }
    list[index].sessionCheckIns[sessionName] = new Date().toISOString();
  } else {
    if (list[index].checkedIn) {
      throw new Error(`Attendee ${list[index].fullName} is ALREADY checked in at ${new Date(list[index].checkInTime!).toLocaleTimeString()}`);
    }
    list[index].checkedIn = true;
    list[index].checkInTime = new Date().toISOString();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'checkin', id: list[index].id, sessionName, password })
    });
  } catch (err) {
    console.error("Failed to sync check-in to Google Sheets:", err);
  }

  return list[index];
};

export const revertCheckIn = async (id: string, password: string, sessionName?: string): Promise<AttendeeRegistration> => {
  const list = getRegistrations();
  const index = list.findIndex(item => item.id === id);
  if (index === -1) throw new Error("Attendee not found");
  
  if (sessionName && list[index].sessionCheckIns) {
    delete list[index].sessionCheckIns[sessionName];
  } else {
    list[index].checkedIn = false;
    list[index].checkInTime = null;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  
  // Sync revert to Google Sheets
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'revertCheckin', id: list[index].id, sessionName, password })
    });
  } catch (err) {
    console.error("Failed to sync revert check-in to Google Sheets:", err);
  }

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
  const sessionRegistrations: { [sessionName: string]: number } = {};
  const sessionCheckIns: { [sessionName: string]: number } = {};

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

    // Sessions / Programs Registration
    const allSessions = [...(item.sessions || []), ...(item.specialPrograms || [])];
    allSessions.forEach(s => {
      sessionRegistrations[s] = (sessionRegistrations[s] || 0) + 1;
    });

    // Session Check-ins
    if (item.sessionCheckIns) {
      Object.keys(item.sessionCheckIns).forEach(s => {
        sessionCheckIns[s] = (sessionCheckIns[s] || 0) + 1;
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
    interestsReport,
    sessionRegistrations,
    sessionCheckIns
  };
};

export const exportToCSV = (data: AttendeeRegistration[]) => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = [
    "Timestamp", "ID", "Ticket Number", "Full Name", "Email", 
    "Mobile Number", "WhatsApp Number", "Age", "Gender", "District", 
    "State", "Country", "Place", "Occupation", "Student Level", 
    "Institution", "Institution District", "Course", "Department", "Year", "Company", 
    "Profession", "Industry", "Tech Interests", "Sessions", "Special Programs", "Fee Receipt", "Emergency Contact", 
    "Food Preference", "Accessibility Req", "Consent", 
    "Checked In", "Check In Time", "Verification Token"
  ];

  const csvRows = [headers];
  
  for (const row of data) {
    const techInterests = Array.isArray(row.technologyInterests) ? row.technologyInterests.join(", ") : String(row.technologyInterests || '');
    
    csvRows.push([
      row.createdAt,
      row.id,
      row.ticketNumber,
      row.fullName,
      row.email,
      row.mobileNumber,
      row.whatsAppNumber || '',
      String(row.age),
      row.gender,
      row.district || '',
      row.state || '',
      row.country || '',
      row.place || '',
      row.occupation,
      row.level || '',
      row.institution || '',
      row.institutionDistrict || '',
      row.course || '',
      row.department || '',
      row.year || '',
      row.company || '',
      row.profession || '',
      row.industry || '',
      techInterests,
      Array.isArray(row.sessions) ? row.sessions.join(", ") : '',
      Array.isArray(row.specialPrograms) ? row.specialPrograms.join(", ") : '',
      row.feeReceiptUrl || '',
      row.emergencyContact || '',
      row.foodPreference || '',
      row.accessibilityRequirement || '',
      String(row.consent),
      String(row.checkedIn),
      row.checkInTime || '',
      row.sessionCheckIns ? Object.entries(row.sessionCheckIns).map(([s, time]) => `${s}: ${new Date(time as string).toLocaleTimeString()}`).join(" | ") : '',
      row.verificationToken || ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`));
  }

  const csvString = csvRows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `TECHCON26_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'login', password })
    });
    const data = await res.json();
    return data.status === 'success';
  } catch (e) {
    console.error("Login failed due to network error", e);
    return false;
  }
};

// FIREBASE: Get Settings (instant check for visitors, 1 free read)
export const getSettings = async (): Promise<boolean> => {
  try {
    const docRef = doc(db, "settings", "registration");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().isOpen === true;
    }
    return true; // Default true if document doesn't exist
  } catch (err) {
    console.error("Failed to get settings from Firebase:", err);
    return true; 
  }
};

// FIREBASE: Toggle Registration Status (instant write)
export const toggleRegistrationStatus = async (isOpen: boolean, password: string = 'admin'): Promise<boolean> => {
  try {
    const docRef = doc(db, "settings", "registration");
    await setDoc(docRef, { isOpen });
    return true;
  } catch (err) {
    console.error("Failed to toggle registration:", err);
    return false;
  }
};

export const getProgramSettings = async (): Promise<{ [key: string]: boolean }> => {
  try {
    const docRef = doc(db, "settings", "programs");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  } catch (err) {
    return {};
  }
};

export const toggleProgramSetting = async (programName: string, isOpen: boolean): Promise<boolean> => {
  try {
    const docRef = doc(db, "settings", "programs");
    await setDoc(docRef, { [programName]: isOpen }, { merge: true });
    return true;
  } catch (err) {
    return false;
  }
};

export const addEventToRegistration = async (id: string, mobileNumber: string, eventName: string, isSpecial: boolean = false, feeReceiptUrl?: string): Promise<AttendeeRegistration> => {
  const list = getRegistrations();
  const index = list.findIndex(item => item.id.toUpperCase() === id.toUpperCase() && item.mobileNumber === mobileNumber);
  
  if (index === -1) {
    throw new Error("Invalid Registration ID or Mobile Number.");
  }

  const attendee = list[index];
  
  if (isSpecial) {
    if (!attendee.specialPrograms) attendee.specialPrograms = [];
    if (attendee.specialPrograms.includes(eventName)) throw new Error("Already registered for this event.");
    attendee.specialPrograms.push(eventName);
    if (feeReceiptUrl) attendee.feeReceiptUrl = feeReceiptUrl;
  } else {
    if (!attendee.sessions) attendee.sessions = [];
    if (attendee.sessions.includes(eventName)) throw new Error("Already registered for this event.");
    attendee.sessions.push(eventName);
  }

  // Sync with Google Sheets
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ 
        action: 'addEvent', 
        id: attendee.id, 
        eventName, 
        isSpecial, 
        feeReceiptUrl 
      })
    });
    const data = await res.json();
    if (data.status === 'error') throw new Error(data.message);
  } catch (err: any) {
    throw new Error(err.message || "Failed to update registration on the server.");
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return attendee;
};

export const fetchPass = async (fullName: string, mobileNumber: string): Promise<any> => {
  const list = getRegistrations();
  const reg = list.find(r => r.fullName.toLowerCase().trim() === fullName.toLowerCase().trim() && r.mobileNumber === mobileNumber);
  
  if (reg) {
    return reg;
  }
  
  throw new Error("Invalid Name or Mobile Number. Pass not found.");
};

// ==========================================
// VOLUNTEER REGISTRATION (FIREBASE NATIVE)
// ==========================================

export const submitVolunteer = async (data: Omit<VolunteerRegistration, 'id' | 'createdAt'>): Promise<VolunteerRegistration> => {
  const volunteersRef = collection(db, 'volunteers');
  
  // Duplicate check using queries
  const mobileQuery = query(volunteersRef, where('mobileNumber', '==', data.mobileNumber));
  const mobileSnapshot = await getDocs(mobileQuery);
  if (!mobileSnapshot.empty) {
    throw new Error("A volunteer with this mobile number already exists.");
  }
  
  if (data.whatsAppNumber) {
    const waQuery = query(volunteersRef, where('whatsAppNumber', '==', data.whatsAppNumber));
    const waSnapshot = await getDocs(waQuery);
    if (!waSnapshot.empty) {
      throw new Error("A volunteer with this WhatsApp number already exists.");
    }
  }

  // Get count for ID generation
  const countSnapshot = await getCountFromServer(volunteersRef);
  const totalCount = countSnapshot.data().count;
  
  const id = `TCVOL${String(totalCount + 1).padStart(3, '0')}`;
  const createdAt = new Date().toISOString();
  
  const newVolunteer: VolunteerRegistration = { ...data, id, createdAt };
  await setDoc(doc(db, 'volunteers', id), newVolunteer);
  return newVolunteer;
};

export const fetchVolunteers = async (password: string): Promise<VolunteerRegistration[]> => {
  const isValid = await loginAdmin(password);
  if (!isValid) throw new Error("Unauthorized");

  const snapshot = await getDocs(collection(db, 'volunteers'));
  return snapshot.docs.map(d => d.data() as VolunteerRegistration)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getVolunteerSettings = async (): Promise<{isOpen: boolean, isIDCardDownloadEnabled: boolean}> => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'volunteer-registration'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return { 
        isOpen: data.isOpen || false, 
        isIDCardDownloadEnabled: data.isIDCardDownloadEnabled || false 
      };
    }
    return { isOpen: false, isIDCardDownloadEnabled: false };
  } catch (e) {
    return { isOpen: false, isIDCardDownloadEnabled: false };
  }
};

export const toggleVolunteerRegistrationStatus = async (isOpen: boolean, password: string): Promise<void> => {
  await setDoc(doc(db, 'settings', 'volunteer-registration'), { isOpen }, { merge: true });
};

export const toggleVolunteerIDDownloadStatus = async (isIDCardDownloadEnabled: boolean, password: string): Promise<void> => {
  await setDoc(doc(db, 'settings', 'volunteer-registration'), { isIDCardDownloadEnabled }, { merge: true });
};

export const verifyVolunteer = async (id: string, mobileNumber: string): Promise<VolunteerRegistration> => {
  const vDoc = await getDoc(doc(db, 'volunteers', id));
  if (!vDoc.exists()) {
    throw new Error('Volunteer not found');
  }
  const data = vDoc.data() as VolunteerRegistration;
  if (data.mobileNumber !== mobileNumber) {
    throw new Error('Mobile number mismatch');
  }
  return data;
};

export const deleteVolunteer = async (id: string, password: string): Promise<void> => {
  await deleteDoc(doc(db, 'volunteers', id));
};

export const updateVolunteer = async (id: string, updates: Partial<VolunteerRegistration>, password: string): Promise<boolean> => {
  const isValid = await loginAdmin(password);
  if (!isValid) throw new Error("Unauthorized");
  
  await updateDoc(doc(db, 'volunteers', id), updates);
  return true;
};

export const getAttendeeByMobile = (mobile: string): AttendeeRegistration | null => {
  const list = getRegistrations();
  return list.find(a => a.mobileNumber === mobile) || null;
};

// ==========================================
// CAMPUS AMBASSADOR REGISTRATION
// ==========================================

export const verifyMainRegistration = async (id: string, mobileNumber: string): Promise<AttendeeRegistration> => {
  const registrations = getRegistrations();
  const reg = registrations.find(r => r.id.trim() === id.trim() && r.mobileNumber.trim() === mobileNumber.trim());
  
  if (!reg) {
    throw new Error('No matching registration found. Please ensure you are fully registered with TECHCON 26 first.');
  }
  
  if (reg.occupation !== 'Student') {
    throw new Error('Only students are eligible for the Campus Ambassador program.');
  }
  
  return reg;
};

export const submitCampusAmbassador = async (data: any): Promise<void> => {
  const ambassadorsRef = collection(db, 'campus_ambassadors');
  
  const q = query(ambassadorsRef, where('id', '==', data.id));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    throw new Error('You have already submitted an application for Campus Ambassador.');
  }
  
  await setDoc(doc(ambassadorsRef, data.id), {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
};

export const getCampusAmbassadors = async (password: string): Promise<any[]> => {
  const isValid = await loginAdmin(password);
  if (!isValid) throw new Error("Unauthorized");
  
  const snapshot = await getDocs(collection(db, 'campus_ambassadors'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCampusAmbassadorStatus = async (id: string, status: 'pending' | 'approved', password: string): Promise<void> => {
  const isValid = await loginAdmin(password);
  if (!isValid) throw new Error("Unauthorized");
  await updateDoc(doc(db, 'campus_ambassadors', id), { status });
};

export const deleteCampusAmbassador = async (id: string, password: string): Promise<void> => {
  const isValid = await loginAdmin(password);
  if (!isValid) throw new Error("Unauthorized");
  await deleteDoc(doc(db, 'campus_ambassadors', id));
};
