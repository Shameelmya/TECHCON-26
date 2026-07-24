/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, CheckCircle, XCircle, Search, LogOut, Download, 
  Send, Users, QrCode, ClipboardList, Shield, RefreshCw, BarChart3, 
  FileSpreadsheet, FileText, Check, AlertCircle, Copy, HelpCircle, User, Trash2, FileSearch, Settings, Network, X, Eye, EyeOff
} from 'lucide-react';
import { AttendeeRegistration, AdminStats, VolunteerRegistration, CampusAmbassador } from '../types';
import { getRegistrations, fetchRegistrations, getStats, checkInAttendee, revertCheckIn, exportToCSV, loginAdmin, getSettings, toggleRegistrationStatus, fetchVolunteers, getVolunteerSettings, toggleVolunteerRegistrationStatus, toggleVolunteerIDDownloadStatus, deleteVolunteer, updateVolunteer, getProgramSettings, toggleProgramSetting, getCampusAmbassadors, updateCampusAmbassadorStatus, deleteCampusAmbassador, deleteRegistration } from '../utils/db';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import VolunteerIDCard from './VolunteerIDCard';
import VolunteerEditModal from './VolunteerEditModal';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [isTogglingReg, setIsTogglingReg] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [programSettings, setProgramSettings] = useState<{ [key: string]: boolean }>({});

  // Dashboard Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [attendees, setAttendees] = useState<AttendeeRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');
  const [filterRole, setFilterRole] = useState<'all' | string>('all');
  const [filterSession, setFilterSession] = useState<'all' | string>('all');
  const [filterProgram, setFilterProgram] = useState<'all' | string>('all');
  const [activeTab, setActiveTab] = useState<'analytics' | 'checkin' | 'directory' | 'appscript' | 'volunteers' | 'ambassadors' | 'settings'>('analytics');
  const [displayCount, setDisplayCount] = useState(50);

  // Volunteer State
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [isVolRegOpen, setIsVolRegOpen] = useState(false);
  const [isTogglingVolReg, setIsTogglingVolReg] = useState(false);
  const [isIDCardDownloadEnabled, setIsIDCardDownloadEnabled] = useState(false);
  const [isTogglingIDCard, setIsTogglingIDCard] = useState(false);
  const [viewingVolunteer, setViewingVolunteer] = useState<VolunteerRegistration | null>(null);
  const [viewingVolunteerDetails, setViewingVolunteerDetails] = useState<VolunteerRegistration | null>(null);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerRegistration | null>(null);

  // Manual Check-in Console state
  const [scannerInput, setScannerInput] = useState('');
  const [scannerResult, setScannerResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [foundAttendee, setFoundAttendee] = useState<AttendeeRegistration | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);

  // --- Campus Ambassador States ---
  const [ambassadorSort, setAmbassadorSort] = useState<'all' | 'pending' | 'approved'>('all');
  const [ambassadorToDelete, setAmbassadorToDelete] = useState<CampusAmbassador | null>(null);
  const [isProcessingAmbassador, setIsProcessingAmbassador] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async (isLoadMore = false) => {
    if (!isLoadMore) setLastVisibleDoc(null);
    const currentLastVisible = isLoadMore ? lastVisibleDoc : null;
    
    const result = await fetchRegistrations(password, 50, currentLastVisible, searchQuery, filterCheckIn);
    
    if (isLoadMore) {
      setAttendees(prev => [...prev, ...result.data]);
    } else {
      setAttendees(result.data);
    }
    setLastVisibleDoc(result.lastVisible);
    
    setStats(await getStats());
    const regState = await getSettings();
    setIsRegOpen(regState);
    
    // Fetch volunteers
    try {
      const volList = await fetchVolunteers(password);
      setVolunteers(volList);
      const volRegState = await getVolunteerSettings();
      setIsVolRegOpen(volRegState.isOpen);
      setIsIDCardDownloadEnabled(volRegState.isIDCardDownloadEnabled);
      const progSettings = await getProgramSettings();
      setProgramSettings(progSettings);
      const ambList = await getCampusAmbassadors(password);
      setAmbassadors(ambList);
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleClose = () => {
    if (isAuthenticated) {
      if (window.confirm("You are logging out of the Admin Console. Are you sure?")) {
        setPassword('');
        setIsAuthenticated(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setLoginError('');
    setIsLoggingIn(true);
    
    // Access with official passcode or guest access
    const isValid = await loginAdmin(password);
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid administrator credentials.');
    }
    setIsLoggingIn(false);
  };

  const handleSearchForCheckIn = (ticketOrId: string) => {
    try {
      let finalId = ticketOrId.trim();
      try {
        const parsed = JSON.parse(finalId);
        if (parsed.id) finalId = String(parsed.id).trim();
      } catch (e) {
        // Not JSON, use as is
      }
      
      const cleanedInput = finalId.toUpperCase();
      const index = attendees.findIndex(
        item => item.ticketNumber.toUpperCase() === cleanedInput || 
                item.id.toUpperCase() === cleanedInput ||
                item.verificationToken === finalId
      );

      if (index === -1) {
        setScannerResult({ success: false, msg: `FAILED: No attendee found with ID "${finalId}".` });
        setFoundAttendee(null);
      } else {
        setFoundAttendee(attendees[index]);
        setScannerResult(null);
      }
    } catch (e: any) {
      setScannerResult({ success: false, msg: `FAILED: ${e.message || 'Verification Error'}` });
      setFoundAttendee(null);
    }
  };

  const handleConfirmCheckIn = async (sessionName?: string) => {
    if (!foundAttendee || isProcessingAttendance) return;
    setIsProcessingAttendance(true);
    try {
      const attendee = await checkInAttendee(foundAttendee.id, password, sessionName);
      setScannerResult({
        success: true,
        msg: `SUCCESS: Checked in ${attendee.fullName} for ${sessionName || 'Main Event'}!`
      });
      setFoundAttendee(attendee);
      loadData();
    } catch (e: any) {
      setScannerResult({ success: false, msg: `FAILED: ${e.message || 'Check-in Error'}` });
    } finally {
      setIsProcessingAttendance(false);
    }
  };

  const handleRevertScannerCheckIn = async (sessionName?: string) => {
    if (!foundAttendee || isProcessingAttendance) return;
    setIsProcessingAttendance(true);
    try {
      const attendee = await revertCheckIn(foundAttendee.id, password, sessionName);
      setScannerResult({
        success: true,
        msg: `REVERTED: Check-in removed for ${sessionName || 'Main Event'}.`
      });
      setFoundAttendee(attendee);
      loadData();
    } catch (e: any) {
      setScannerResult({ success: false, msg: `FAILED: ${e.message || 'Revert Error'}` });
    } finally {
      setIsProcessingAttendance(false);
    }
  };

  const handleDeleteAttendee = async (attendee: AttendeeRegistration) => {
    if (!window.confirm(`Are you absolutely sure you want to completely delete the registration for ${attendee.fullName} (${attendee.id})? This cannot be undone.`)) {
      return;
    }
    
    // Prompt for password if needed, or we just pass the stored password
    const pwd = prompt("Enter admin passcode to confirm deletion:");
    if (pwd !== password) {
      alert("Incorrect passcode. Deletion aborted.");
      return;
    }

    try {
      const success = await deleteRegistration(attendee.id, attendee.mobileNumber);
      if (success) {
        setAttendees(prev => prev.filter(a => a.id !== attendee.id));
      } else {
        alert("Failed to delete attendee from database.");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleToggleCheckInTable = async (attendee: AttendeeRegistration) => {
    const isCurrentlyCheckedIn = attendee.checkedIn;
    if (isCurrentlyCheckedIn) {
      if (!window.confirm("Are you sure you want to remove attendance for this participant?")) return;
    }
    
    // OPTIMISTIC UPDATE: Instantly change the UI without waiting for Google Sheets
    setAttendees(prev => prev.map(a => a.id === attendee.id ? { ...a, checkedIn: !isCurrentlyCheckedIn } : a));
    
    try {
      if (isCurrentlyCheckedIn) {
        await revertCheckIn(attendee.id, password);
      } else {
        await checkInAttendee(attendee.id, password);
      }
      // Re-fetch quietly in the background to ensure data consistency
      loadData();
    } catch (e: any) {
      // Revert if the API call failed
      setAttendees(prev => prev.map(a => a.id === attendee.id ? { ...a, checkedIn: isCurrentlyCheckedIn } : a));
      alert(e.message);
    }
  };

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isComponentMounted = true;

    if (activeTab === 'checkin' && isCameraActive) {
      const timer = setTimeout(() => {
        if (!isComponentMounted) return;
        const readerElement = document.getElementById('reader');
        if (readerElement && readerElement.innerHTML === '') {
          html5QrCode = new Html5Qrcode("reader");
          html5QrCode.start(
            { facingMode: "environment" }, // Prefer back camera
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText: string) => {
              handleSearchForCheckIn(decodedText);
            },
            (errorMessage: any) => {}
          ).catch((err) => {
            console.error("Camera failed to start:", err);
          });
        }
      }, 300);

      return () => {
        isComponentMounted = false;
        clearTimeout(timer);
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(e => console.error("Failed to stop scanner", e));
        }
      };
    }
    
    // Auto turn off camera if tab changes
    if (activeTab !== 'checkin') {
      setIsCameraActive(false);
    }
  }, [activeTab, isCameraActive]);

  // Export filtered attendees to Excel CSV
  const handleExportCSV = () => {
    exportToCSV(filteredAttendees);
  };

  // Export filtered attendees table to a high quality PDF printable page
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = filteredAttendees.map((a, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-family: monospace; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 10px; font-family: monospace; font-size: 11px; font-weight: bold; color: #4f46e5;">${a.id}</td>
        <td style="padding: 10px; font-weight: 500;">${a.fullName}</td>
        <td style="padding: 10px;">${a.email}</td>
        <td style="padding: 10px; font-family: monospace; font-size: 11px;">${a.mobileNumber}</td>
        <td style="padding: 10px; text-transform: uppercase; font-size: 11px; font-weight: bold;">${a.occupation}</td>
        <td style="padding: 10px; font-size: 11px;">${a.place || 'N/A'}</td>
        <td style="padding: 10px; text-align: center;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; background-color: ${a.checkedIn ? '#d1fae5; color: #065f46' : '#fee2e2; color: #991b1b'}">
            ${a.checkedIn ? 'ATTENDED' : 'ABSENT'}
          </span>
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>TECHCON '26 - Attendance Report</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; }
            h1 { font-family: 'Jura', sans-serif; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
            p { font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { text-align: left; background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px 10px; font-size: 11px; font-weight: bold; color: #475569; text-transform: uppercase; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>TECHCON '26 - Official Registration Report</h1>
          <p>Generated on: ${new Date().toLocaleString()} | Filtered Attendees Count: ${filteredAttendees.length}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Registration ID</th>
                <th>Attendee Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>Occupation</th>
                <th>Place</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(attendees));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter list by query
  const handleToggleVolunteerRegistration = async () => {
    if (isTogglingVolReg) return;
    setIsTogglingVolReg(true);
    const newState = !isVolRegOpen;
    try {
      const res = await toggleVolunteerRegistrationStatus(newState);
      if (res.success) {
        setIsVolRegOpen(newState);
      } else {
        alert(res.message || "Failed to toggle volunteer registration.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to toggle volunteer registration.");
    } finally {
      setIsTogglingVolReg(false);
    }
  };

  const handleToggleIDCardDownload = async () => {
    if (isTogglingIDCard) return;
    setIsTogglingIDCard(true);
    try {
      const newState = !isIDCardDownloadEnabled;
      const res = await toggleVolunteerIDDownloadStatus(newState);
      if (res.success) {
        setIsIDCardDownloadEnabled(newState);
      } else {
        alert(res.message || "Failed to toggle ID card download status.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to toggle ID card download status.");
    } finally {
      setIsTogglingIDCard(false);
    }
  };

  const handleExportVolunteers = () => {
    const headers = [
      "Timestamp", "ID", "Full Name", "Gender", "Age", 
      "Mobile Number", "WhatsApp Number", "Address", "District", 
      "Institution", "Institution District"
    ];

    const csvRows = [headers];
    
    for (const row of volunteers) {
      csvRows.push([
        row.createdAt,
        row.id,
        row.fullName,
        row.gender,
        String(row.age),
        row.mobileNumber,
        row.whatsAppNumber || '',
        row.address || '',
        row.district || '',
        row.institution || '',
        row.institutionDistrict || ''
      ].map(v => `"${String(v).replace(/"/g, '""')}"`));
    }

    const csvString = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TECHCON26_Volunteers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAmbassadors = useMemo(() => {
    let list = [...ambassadors];
    if (ambassadorSort !== 'all') {
      list = list.filter(a => a.status === ambassadorSort);
    }
    // Sort logic (Pending first, then by date)
    list.sort((a, b) => {
      if (a.status === 'pending' && b.status === 'approved') return -1;
      if (a.status === 'approved' && b.status === 'pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [ambassadors, ambassadorSort]);

  const handleExportAmbassadorsCSV = () => {
    const headers = ['Reg ID', 'Name', 'DOB', 'Place', 'District', 'Phone', 'WhatsApp', 'Email', 'Institution', 'Inst. District', 'Status', 'Date'];
    const csvRows = [headers];
    filteredAmbassadors.forEach(a => {
      csvRows.push([
        a.id, `"${a.fullName}"`, a.dob || '', `"${a.place || ''}"`, `"${a.district || ''}"`, a.mobileNumber, a.whatsAppNumber || '', `"${a.email || ''}"`, `"${a.institution}"`, `"${a.institutionDistrict || ''}"`, a.status, new Date(a.createdAt).toLocaleDateString()
      ]);
    });
    const csvString = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Campus_Ambassadors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAmbassadorsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = filteredAmbassadors.map((a, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-family: monospace; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 10px; font-family: monospace; font-size: 11px; font-weight: bold; color: #4f46e5;">${a.id}</td>
        <td style="padding: 10px; font-weight: 500;">${a.fullName}</td>
        <td style="padding: 10px;">${a.district || ''}</td>
        <td style="padding: 10px; font-family: monospace; font-size: 11px;">${a.mobileNumber} / ${a.whatsAppNumber || ''}</td>
        <td style="padding: 10px; font-size: 11px;">${a.institution || 'N/A'}</td>
        <td style="padding: 10px; text-align: center;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; background-color: ${a.status === 'approved' ? '#d1fae5; color: #065f46' : '#fef3c7; color: #92400e'}">
            ${a.status}
          </span>
        </td>
        <td style="padding: 10px; font-family: monospace; font-size: 11px;">${new Date(a.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>TECHCON '26 - Campus Ambassador Report</title>
          <style>
            @page { size: landscape; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; }
            h1 { font-family: 'Jura', sans-serif; font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
            p { font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { text-align: left; background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px 10px; font-size: 11px; font-weight: bold; color: #475569; text-transform: uppercase; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>TECHCON '26 - Campus Ambassador Report</h1>
          <p>Generated on: ${new Date().toLocaleString()} | Total: ${filteredAmbassadors.length}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Reg ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Mobile Number</th>
                <th>Institution</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleToggleAmbassadorStatus = async (id: string, currentStatus: string) => {
    setIsProcessingAmbassador(true);
    try {
      const newStatus = currentStatus === 'pending' ? 'approved' : 'pending';
      await updateCampusAmbassadorStatus(id, newStatus as any, password);
      setAmbassadors(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (e: any) {
      alert(e.message || 'Failed to update ambassador status.');
    }
    setIsProcessingAmbassador(false);
  };

  const handleDeleteAmbassador = async () => {
    if (!ambassadorToDelete) return;
    setIsProcessingAmbassador(true);
    try {
      await deleteCampusAmbassador(ambassadorToDelete.id, password);
      setAmbassadors(prev => prev.filter(a => a.id !== ambassadorToDelete.id));
      setAmbassadorToDelete(null);
    } catch (e: any) {
      alert(e.message || 'Failed to delete ambassador.');
    }
    setIsProcessingAmbassador(false);
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (window.confirm("Are you sure you want to completely delete this volunteer registration? This action cannot be undone.")) {
      try {
        await deleteVolunteer(id, password);
        setVolunteers(prev => prev.filter(v => v.id !== id));
      } catch (e: any) {
        alert(e.message || "Failed to delete volunteer.");
      }
    }
  };

  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      if (filterCheckIn === 'checked-in' && !a.checkedIn) return false;
      if (filterCheckIn === 'not-checked-in' && a.checkedIn) return false;
      if (filterRole !== 'all' && filterRole) {
        if (filterRole === 'student' && a.occupation !== 'Student') return false;
        if (filterRole === 'professional' && a.occupation !== 'Professional') return false;
      }
      if (filterSession !== 'all' && filterSession) {
        if (!a.sessions || !a.sessions.includes(filterSession)) return false;
      }
      if (filterProgram !== 'all' && filterProgram) {
        if (!a.specialPrograms || !a.specialPrograms.includes(filterProgram)) return false;
      }

      const query = searchQuery.toLowerCase();
      if (!query) return true;
      return (
        a.fullName.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query) ||
        a.ticketNumber.toLowerCase().includes(query) ||
        a.mobileNumber.toLowerCase().includes(query) ||
        a.district.toLowerCase().includes(query) ||
        a.occupation.toLowerCase().includes(query) ||
        (a.place && a.place.toLowerCase().includes(query)) ||
        (a.sessions && a.sessions.some(s => s.toLowerCase().includes(query))) ||
        (a.specialPrograms && a.specialPrograms.some(p => p.toLowerCase().includes(query)))
      );
    });
  }, [attendees, searchQuery, filterCheckIn, filterRole, filterSession, filterProgram]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(50);
  }, [searchQuery, activeTab, filterCheckIn, filterRole, filterSession, filterProgram]);

  const displayedAttendees = filteredAttendees;

  return (
    <div id="admin-dashboard-root" className="w-full min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-8 md:p-12 relative overflow-hidden">
      
      {/* Decorative radial gradients (very soft for light theme) */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[130px] bottom-10 right-10 pointer-events-none" />

      {/* LOGIN BLOCK */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle tech background glows */}
              <div className="absolute w-32 h-32 rounded-full bg-brand-purple/20 blur-[50px] top-0 right-0 pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full bg-brand-blue/10 blur-[50px] bottom-0 left-0 pointer-events-none" />
              
              <div className="text-center mb-8 select-none relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-brand-purple mx-auto mb-5 border border-slate-700 shadow-inner">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-orbitron font-bold text-white tracking-wider uppercase drop-shadow-md">Gatekeeper Access</h2>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
                  Provide secure passcode to authenticate and initialize live telemetry systems.
                </p>
              </div>

              {loginError && (
                <div className="mb-5 p-3 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-mono flex items-center gap-2 relative z-10">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 tracking-widest uppercase font-bold">Admin Passcode</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3.5 bg-slate-800/50 border border-slate-700/50 focus:border-brand-purple focus:bg-slate-800 focus:ring-1 focus:ring-brand-purple/50 rounded-xl outline-none font-mono text-sm text-white transition-all placeholder:text-slate-600"
                      autoFocus
                    />
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs tracking-wider rounded-xl transition-all"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className={`flex-1 py-3.5 font-mono font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all ${
                      isLoggingIn 
                        ? 'bg-brand-purple/50 text-white/50 cursor-not-allowed border border-brand-purple/20'
                        : 'bg-brand-purple text-white hover:bg-brand-purple/90 border border-brand-purple/50 hover:shadow-brand-purple/20'
                    }`}
                  >
                    {isLoggingIn ? 'AUTHENTICATING...' : 'INITIALIZE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD CONTAINER - GORGEOUS WHITE THEME */}
      {isAuthenticated && stats && (
        <div className="max-w-7xl mx-auto space-y-8 relative z-10 text-left">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6 select-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-orbitron font-bold tracking-tight text-slate-900 uppercase">TECHCON '26 Gate Console</h1>
                  <span className="text-[9px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-bold">
                    LIVE TELEMETRY
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Real-time attendances, unique ID sequences, and secure Google AppScript integration guide.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 font-sans font-semibold text-xs text-slate-700 rounded-xl transition-all"
                title="Refresh Data"
              >
                <RefreshCw size={13} className={isProcessingAttendance ? "animate-spin" : ""} />
                <span className="hidden sm:inline">REFRESH</span>
              </button>
              
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-sans font-semibold text-xs rounded-xl transition-all"
              >
                <X size={13} />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Core Dashboard Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden select-none shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block font-bold">TOTAL REGISTRATIONS</span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 mt-1 block tabular-nums">
                {stats.totalRegistrations}
              </span>
              <div className="absolute right-3.5 bottom-3 text-purple-500/10">
                <Users size={42} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden select-none shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block font-bold">CHECKED IN / ATTENDED</span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-emerald-600 mt-1 block tabular-nums">
                {stats.checkedInCount}
              </span>
              <div className="absolute right-3.5 bottom-3 text-emerald-500/10">
                <CheckCircle size={42} />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden select-none shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block font-bold">ABSENT / NOT ATTENDED</span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-amber-600 mt-1 block tabular-nums">
                {stats.totalRegistrations - stats.checkedInCount}
              </span>
              <div className="absolute right-3.5 bottom-3 text-amber-500/10">
                <XCircle size={42} />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl relative overflow-hidden select-none shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block font-bold">ATTENDANCE RATIO</span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-brand-purple mt-1 block tabular-nums">
                {stats.totalRegistrations > 0 
                  ? `${Math.round((stats.checkedInCount / stats.totalRegistrations) * 100)}%` 
                  : '0%'
                }
              </span>
              <div className="absolute right-3.5 bottom-3 text-purple-600/10">
                <QrCode size={42} />
              </div>
            </div>

          </div>

          {/* Sub navigation bar */}
          <div className="flex gap-1.5 border-b border-slate-200 pb-1.5 select-none overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold border transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">LIVE ANALYTICS REPORTS</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold border transition-all whitespace-nowrap ${
                activeTab === 'checkin'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">GATE CHECK-IN RADAR</span>
            </button>

            <button 
              onClick={() => setActiveTab('directory')}
              className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 rounded-t-xl font-bold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'directory' 
                  ? 'bg-slate-800 text-brand-pink border-brand-pink' 
                  : 'bg-slate-900 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardList size={18} />
              <span className="hidden sm:inline">Attendee Directory</span>
            </button>
            <button 
              onClick={() => setActiveTab('volunteers')}
              className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 rounded-t-xl font-bold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'volunteers' 
                  ? 'bg-slate-800 text-brand-pink border-brand-pink' 
                  : 'bg-slate-900 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <User size={18} />
              <span className="hidden sm:inline">Volunteers</span>
            </button>
            <button 
              onClick={() => setActiveTab('ambassadors')}
              className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 rounded-t-xl font-bold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'ambassadors' 
                  ? 'bg-slate-800 text-brand-pink border-brand-pink' 
                  : 'bg-slate-900 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <Network size={18} />
              <span className="hidden sm:inline">Ambassadors</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 rounded-t-xl font-bold text-sm transition-all border-b-2 flex justify-center items-center gap-2 ${
                activeTab === 'settings' 
                  ? 'bg-slate-800 text-brand-pink border-brand-pink' 
                  : 'bg-slate-900 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

          {/* TAB VISUALIZATIONS */}

          {/* TAB 1: Live Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              
              {/* Category-Wise registrations breakdown */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-purple uppercase font-bold">// ROLE ANALYSIS</span>
                  <h3 className="text-base font-orbitron font-bold text-slate-900 uppercase mt-1">Role / Category Breakdown</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Distribution of attendee role classifications</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(stats.occupationReport).map(([category, count]) => {
                    const pct = Math.round(((count as number) / stats.totalRegistrations) * 100) || 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="font-semibold text-slate-700">{category}</span>
                          <span className="font-mono text-slate-500 font-bold">{count as number} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gender-Wise breakdown */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-pink uppercase font-bold">// GENDER RATIO</span>
                  <h3 className="text-base font-orbitron font-bold text-slate-900 uppercase mt-1">Gender Demographics</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Demographics computed from profile submissions</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(stats.genderReport).map(([gender, count]) => {
                    const pct = Math.round(((count as number) / stats.totalRegistrations) * 100) || 0;
                    return (
                      <div key={gender} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="font-semibold text-slate-700">{gender}</span>
                          <span className="font-mono text-slate-500 font-bold">{count as number} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event / Session breakdown */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm md:col-span-2">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-blue uppercase font-bold">// EVENT ATTENDANCE</span>
                  <h3 className="text-base font-orbitron font-bold text-slate-900 uppercase mt-1">Sessions & Programs Metrics</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Registration vs Actual Check-in for individual events</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {Object.entries(stats.sessionRegistrations || {}).map(([session, regCount]) => {
                    const checkCount = Number(stats.sessionCheckIns?.[session]) || 0;
                    const pct = Math.round((checkCount / Number(regCount)) * 100) || 0;
                    return (
                      <div key={session} className="space-y-1 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-start text-xs font-sans">
                          <span className="font-semibold text-slate-700 max-w-[70%]">{session}</span>
                          <div className="text-right">
                            <span className="block font-mono text-slate-900 font-bold">{checkCount} / {regCount}</span>
                            <span className="text-[10px] text-slate-500">Checked In</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Gate Check-In station (simulates scanner) */}
          {activeTab === 'checkin' && (
            <div className="max-w-xl mx-auto pt-2">
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                <div className="text-center space-y-1.5 select-none">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-2">
                    <QrCode size={22} />
                  </div>
                  <h3 className="text-base font-orbitron font-bold text-slate-900 uppercase">Interactive Gate Scanner</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                    Scan the QR code on the ticket, or type the Entry Pass ID (e.g. <span className="font-mono font-bold text-purple-600">TC26A001</span>) to record physical attendance instantly.
                  </p>
                </div>

                {!isCameraActive ? (
                  <div className="w-full mt-4 rounded-2xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center bg-slate-50 gap-4">
                    <button
                      onClick={() => setIsCameraActive(true)}
                      className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-orbitron font-bold text-sm sm:text-base rounded-2xl shadow-lg transition-all animate-pulse shadow-red-500/30 tracking-widest"
                    >
                      SCAN QR CODE
                    </button>
                    <p className="text-[10px] text-slate-400 font-mono text-center max-w-[200px]">
                      Click to activate rear camera & request scanning permissions
                    </p>
                  </div>
                ) : (
                  <div id="reader" className="w-full mt-4 rounded-2xl overflow-hidden border border-slate-200"></div>
                )}

                <div className="flex gap-2.5 mt-4">
                  <input
                    type="text"
                    placeholder="Enter TC26A001 / Ticket Pass Code..."
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchForCheckIn(scannerInput)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-mono text-sm text-slate-900 uppercase placeholder:normal-case"
                  />
                  <button
                    onClick={() => handleSearchForCheckIn(scannerInput)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold font-sans text-sm transition-colors shadow-sm"
                  >
                    SEARCH
                  </button>
                </div>

                {foundAttendee && (
                  <div className="mt-4 p-5 rounded-2xl border-2 border-purple-200 bg-purple-50 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{foundAttendee.fullName}</h4>
                        <p className="text-sm text-slate-500 font-mono">{foundAttendee.id} • {foundAttendee.mobileNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">{foundAttendee.occupation} - {foundAttendee.district}</p>
                      </div>
                      <div className="text-right">
                        {foundAttendee.checkedIn ? (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded-full uppercase tracking-wide">
                            Already In
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded-full uppercase tracking-wide">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-3 border-t border-purple-200/50">
                      
                      {/* Main Entry */}
                      <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-purple-100">
                        <span className="font-sans font-bold text-slate-800">Main Convention Entry</span>
                        {foundAttendee.checkedIn ? (
                          <button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              const target = e.currentTarget;
                              const timer = setTimeout(() => {
                                if (window.confirm("Are you sure you want to REVERT this main check-in?")) {
                                  handleRevertScannerCheckIn();
                                }
                                target.removeAttribute('data-timer');
                              }, 3000);
                              target.setAttribute('data-timer', timer.toString());
                            }}
                            onPointerUp={(e) => {
                              const timer = e.currentTarget.getAttribute('data-timer');
                              if (timer) { clearTimeout(parseInt(timer)); e.currentTarget.removeAttribute('data-timer'); }
                            }}
                            onPointerLeave={(e) => {
                              const timer = e.currentTarget.getAttribute('data-timer');
                              if (timer) { clearTimeout(parseInt(timer)); e.currentTarget.removeAttribute('data-timer'); }
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            className="text-[10px] font-mono bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold cursor-pointer transition-colors active:bg-amber-100 active:text-amber-700 select-none touch-none"
                            title="Hold for 3 seconds to revert check-in"
                          >
                            IN at {new Date(foundAttendee.checkInTime!).toLocaleTimeString()}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleConfirmCheckIn()}
                            disabled={isProcessingAttendance}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-50"
                          >
                            CHECK IN
                          </button>
                        )}
                      </div>

                      {/* Sessions & Special Programs */}
                      {[...(foundAttendee.sessions || []), ...(foundAttendee.specialPrograms || [])].map(sessionName => {
                        const isCheckedIn = foundAttendee.sessionCheckIns?.[sessionName];
                        return (
                          <div key={sessionName} className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-purple-100">
                            <span className="font-sans font-bold text-slate-800">{sessionName}</span>
                            {isCheckedIn ? (
                              <button
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  const target = e.currentTarget;
                                  const timer = setTimeout(() => {
                                    if (window.confirm(`Are you sure you want to REVERT check-in for ${sessionName}?`)) {
                                      handleRevertScannerCheckIn(sessionName);
                                    }
                                    target.removeAttribute('data-timer');
                                  }, 3000);
                                  target.setAttribute('data-timer', timer.toString());
                                }}
                                onPointerUp={(e) => {
                                  const timer = e.currentTarget.getAttribute('data-timer');
                                  if (timer) { clearTimeout(parseInt(timer)); e.currentTarget.removeAttribute('data-timer'); }
                                }}
                                onPointerLeave={(e) => {
                                  const timer = e.currentTarget.getAttribute('data-timer');
                                  if (timer) { clearTimeout(parseInt(timer)); e.currentTarget.removeAttribute('data-timer'); }
                                }}
                                onContextMenu={(e) => e.preventDefault()}
                                className="text-[10px] font-mono bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold cursor-pointer transition-colors active:bg-amber-100 active:text-amber-700 select-none touch-none"
                                title="Hold for 3 seconds to revert check-in"
                              >
                                IN at {new Date(isCheckedIn).toLocaleTimeString()}
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleConfirmCheckIn(sessionName)}
                                disabled={isProcessingAttendance}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-50"
                              >
                                CHECK IN
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scannerResult && (
                  <div className={`p-4 rounded-xl text-xs font-sans border ${
                    scannerResult.success 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                      : 'bg-red-50 border-red-100 text-red-700'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {scannerResult.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>{scannerResult.success ? 'VERIFICATION SUCCESSFUL' : 'VERIFICATION FAILED'}</span>
                    </div>
                    <p className="mt-1 font-mono">{scannerResult.msg}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Attendee Database Table */}
          {activeTab === 'directory' && (
            <div className="space-y-4 pt-2">
              {/* Controls bar: Search & Exports */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                
                {/* Search query & Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Search name, phone, district, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-900"
                    />
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  
                  <select
                    value={filterCheckIn}
                    onChange={(e) => setFilterCheckIn(e.target.value as any)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-900"
                  >
                    <option value="all">All Check-In Status</option>
                    <option value="checked-in">Checked In</option>
                    <option value="not-checked-in">Not Checked In</option>
                  </select>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                  </select>

                  <select
                    value={filterSession}
                    onChange={(e) => setFilterSession(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-900 max-w-[150px] truncate"
                  >
                    <option value="all">All Sessions</option>
                    <option value="Mega Conference">Mega Conference</option>
                    <option value="Workshop on Cybersecurity Shield a secure digital future">WS: Cybersecurity</option>
                    <option value="Workshop on The imapct of technology on global industrials">WS: Global Industrials</option>
                    <option value="Workshop on Building tomorrow’s careers thriving the age of AI">WS: AI Careers</option>
                    <option value="Presentation and discussion on AI smart village">Presentation: AI Smart Village</option>
                  </select>

                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-900 max-w-[150px] truncate"
                  >
                    <option value="all">All Programs</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Project Competition">Project Competition</option>
                    <option value="Campus Ambassadors">Campus Ambassadors</option>
                  </select>
                </div>

                {/* Exports Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-sans font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    <FileSpreadsheet size={14} />
                    <span>Export to Excel (CSV)</span>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-sans font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    <FileText size={14} />
                    <span>Export to PDF</span>
                  </button>
                </div>

              </div>

              {/* Attendance Table */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 z-[100] bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Registration ID</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Full Name</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Contact Credentials</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Role & Location</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Sessions / Programs</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider text-center">Check-In Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {displayedAttendees.slice(0, displayCount).map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-purple-700">{a.id}</td>
                            <td className="p-4">
                              <span className="font-bold text-slate-900 block">{a.fullName}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">{a.district}, Kerala</span>
                            </td>
                            <td className="p-4">
                              <span className="block font-mono text-[11px] text-slate-800">{a.mobileNumber}</span>
                              <span className="block text-slate-400 text-[10px]">{a.email}</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold uppercase block w-fit">
                                {a.occupation}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-1">{a.place || 'N/A'}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {a.sessions && a.sessions.map((s, idx) => (
                                  <span key={idx} className="bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                                    {s.replace("Workshop on ", "WS: ").replace("Presentation and discussion on ", "PR: ").substring(0, 15)}..
                                  </span>
                                ))}
                                {a.specialPrograms && a.specialPrograms.map((p, idx) => (
                                  <span key={`p-${idx}`} className="bg-pink-50 text-pink-600 border border-pink-100 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                                    {p}
                                  </span>
                                ))}
                                {a.feeReceiptUrl && (
                                  <a href={a.feeReceiptUrl} target="_blank" rel="noreferrer" className="bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold hover:underline">
                                    [Receipt]
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center select-none flex items-center justify-center gap-2 h-full min-h-[70px]">
                              <button
                                onClick={() => handleToggleCheckInTable(a)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-all border ${
                                  a.checkedIn
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                                }`}
                              >
                                {a.checkedIn ? 'ATTENDED' : 'NOT ATTENDED'}
                              </button>
                              <button
                                onClick={() => handleDeleteAttendee(a)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Registration"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                {displayCount < filteredAttendees.length && (
                  <div className="w-full flex justify-center py-6 border-t border-slate-100">
                    <button
                      onClick={() => setDisplayCount(prev => prev + 50)}
                      className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                    >
                      Load More ({filteredAttendees.length - displayCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VOLUNTEERS TAB */}
          {activeTab === 'volunteers' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-700">
                <div>
                  <h3 className="font-orbitron font-bold text-white text-xl">Volunteer Management</h3>
                  <p className="text-slate-400 text-sm mt-1">Manage volunteers and export ID cards.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportVolunteers}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-colors shadow-md"
                  >
                    <Download size={16} /> Export to Excel
                  </button>
                  <div className="bg-brand-purple/20 text-brand-pink px-4 py-2 rounded-xl border border-brand-purple/30 font-bold font-mono">
                    Total: {volunteers.length}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-2xl">ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Institution / District</th>
                        <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {volunteers.map(vol => (
                        <tr key={vol.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-brand-pink">{vol.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-white">{vol.fullName}</p>
                            <p className="text-xs text-slate-400">{vol.gender} • {vol.age} yrs</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                            <p>Mob: {vol.mobileNumber}</p>
                            <p className="text-slate-500">WA: {vol.whatsAppNumber}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium">{vol.institution}</p>
                            <p className="text-xs text-slate-500">{vol.district} ({vol.institutionDistrict})</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setViewingVolunteerDetails(vol)}
                                className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                <FileSearch size={14} /> Details
                              </button>
                              <button 
                                onClick={() => setViewingVolunteer(vol)}
                                className="inline-flex items-center gap-1.5 bg-brand-purple hover:bg-brand-pink text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                <Shield size={14} /> View ID
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to edit this volunteer?')) {
                                    setEditingVolunteer(vol);
                                  }
                                }}
                                className="inline-flex items-center p-1.5 bg-blue-900/30 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg transition-colors ml-1"
                                title="Edit Registration"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteVolunteer(vol.id)}
                                className="inline-flex items-center p-1.5 bg-red-900/30 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors ml-1"
                                title="Delete Registration"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {volunteers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono text-sm">
                            No volunteers registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* AMBASSADORS TAB */}
          {activeTab === 'ambassadors' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Network size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Campus Ambassadors</h3>
                    <p className="text-sm text-slate-500">Manage {filteredAmbassadors.length} applications</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={ambassadorSort}
                    onChange={(e) => setAmbassadorSort(e.target.value as any)}
                    className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple/40 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                  <button 
                    onClick={handleExportAmbassadorsCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition-colors border border-slate-200"
                  >
                    <FileSpreadsheet size={16} className="text-green-600" />
                    <span>CSV</span>
                  </button>
                  <button 
                    onClick={handleExportAmbassadorsPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition-colors border border-slate-200"
                  >
                    <FileText size={16} className="text-red-500" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">
                        <th className="p-4">Reg ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Institution</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredAmbassadors.map((amb) => (
                        <tr key={amb.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-brand-purple">
                            {amb.id}
                          </td>
                          <td className="p-4 font-semibold text-slate-800">
                            <div>{amb.fullName}</div>
                            <div className="text-xs text-slate-500 font-normal">{amb.email}</div>
                          </td>
                          <td className="p-4 text-slate-600">{amb.mobileNumber}</td>
                          <td className="p-4 text-slate-600 truncate max-w-[200px]" title={amb.institution}>{amb.institution}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${amb.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {amb.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleToggleAmbassadorStatus(amb.id, amb.status)}
                                disabled={isProcessingAmbassador}
                                className={`p-1.5 rounded-lg transition-colors border ${
                                  amb.status === 'approved' 
                                    ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                                }`}
                                title={amb.status === 'approved' ? 'Mark as Pending' : 'Approve Application'}
                              >
                                {amb.status === 'approved' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={() => setAmbassadorToDelete(amb)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                                title="Delete Ambassador"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAmbassadors.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500">
                            No campus ambassador applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="font-orbitron font-bold text-white text-xl mb-1">Registration Controls</h3>
                <p className="text-slate-400 text-sm mb-6">Manage global registration settings. Open or close form access.</p>
                
                <div className="space-y-4">
                  {/* Total Registration */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-white">Attendee Registration</h4>
                      <p className="text-xs text-slate-400">Controls the main attendee registration form.</p>
                    </div>
                    <button
                      onClick={async () => {
                        setIsTogglingReg(true);
                        const newState = !isRegOpen;
                        const res = await toggleRegistrationStatus(newState, password);
                        if (res.success) {
                          setIsRegOpen(newState);
                        } else {
                          alert(res.message || "Failed to change registration status. Please try again.");
                        }
                        setIsTogglingReg(false);
                      }}
                      disabled={isTogglingReg}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${isRegOpen ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isRegOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Volunteer Registration */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-white">Volunteer Registration</h4>
                      <p className="text-xs text-slate-400">Controls the volunteer registration form (#volunteer).</p>
                    </div>
                    <button 
                      onClick={handleToggleVolunteerRegistration}
                      disabled={isTogglingVolReg}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${isVolRegOpen ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isVolRegOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Volunteer ID Card Download */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-white">Volunteer ID Card Download</h4>
                      <p className="text-xs text-slate-400">Controls if volunteers can download their ID cards.</p>
                    </div>
                    <button 
                      onClick={handleToggleIDCardDownload}
                      disabled={isTogglingIDCard}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 ${isIDCardDownloadEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isIDCardDownloadEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="font-orbitron font-bold text-white text-xl mb-1">Session & Program Controls</h3>
                <p className="text-slate-400 text-sm mb-6">Enable or disable specific sessions in the registration form.</p>
                
                <div className="space-y-4">
                  {[
                    "Workshop on Cybersecurity Shield a secure digital future",
                    "Workshop on The imapct of technology on global industrials",
                    "Workshop on Building tomorrow’s careers thriving the age of AI",
                    "Presentation and discussion on AI smart village.",
                    "Hackathon",
                    "Project Competition",
                    "Campus Ambassadors.",
                    "Pro Night"
                  ].map(prog => {
                    // Default to true if not explicitly set to false
                    const isOpen = programSettings[prog] !== false;
                    return (
                      <div key={prog} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                        <div className="pr-4">
                          <h4 className="font-bold text-white text-sm">{prog}</h4>
                        </div>
                        <button 
                          onClick={async () => {
                            const newState = !isOpen;
                            const res = await toggleProgramSetting(prog, newState);
                            if (res.success) {
                              setProgramSettings(prev => ({...prev, [prog]: newState}));
                            } else {
                              alert(res.message || "Failed to change program status.");
                            }
                          }}
                          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${isOpen ? 'bg-emerald-500' : 'bg-slate-600'}`}
                        >
                          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      )}

      {viewingVolunteer && (
        <VolunteerIDCard 
          volunteer={viewingVolunteer} 
          onClose={() => setViewingVolunteer(null)} 
        />
      )}

      {/* Editing Volunteer Modal */}
      <AnimatePresence>
        {editingVolunteer && (
          <VolunteerEditModal 
            volunteer={editingVolunteer} 
            onClose={() => setEditingVolunteer(null)} 
            onSave={async (id, updates) => {
              await updateVolunteer(id, updates, password);
              // Refresh volunteers
              const updatedList = await fetchVolunteers(password);
              setVolunteers(updatedList);
            }} 
          />
        )}
      </AnimatePresence>

      {viewingVolunteerDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
          >
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-white text-xl">Volunteer Details</h3>
                <p className="text-slate-400 text-xs font-mono">{viewingVolunteerDetails.id}</p>
              </div>
              <button onClick={() => setViewingVolunteerDetails(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex gap-6 items-start">
                <img src={viewingVolunteerDetails.photoUrl} alt="Passport" className="w-24 h-32 object-cover rounded-xl border border-slate-200 shadow-md shrink-0" />
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{viewingVolunteerDetails.fullName}</h4>
                    <p className="text-sm text-slate-500">{viewingVolunteerDetails.gender} • {viewingVolunteerDetails.age} years old</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Mobile</p>
                      <p className="text-sm font-bold text-slate-700">{viewingVolunteerDetails.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">WhatsApp</p>
                      <p className="text-sm font-bold text-slate-700">{viewingVolunteerDetails.whatsAppNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Address</p>
                    <p className="text-sm font-bold text-slate-700 whitespace-pre-wrap">{viewingVolunteerDetails.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Institution / District</p>
                    <p className="text-sm font-bold text-slate-700">{viewingVolunteerDetails.institution}</p>
                    <p className="text-xs text-slate-500">{viewingVolunteerDetails.district} (Inst. District: {viewingVolunteerDetails.institutionDistrict})</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Registered At</p>
                    <p className="text-sm text-slate-500">{new Date(viewingVolunteerDetails.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Ambassador Modal */}
      <AnimatePresence>
        {ambassadorToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-md w-full"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Ambassador</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to permanently delete the application for <span className="font-bold text-slate-800">{ambassadorToDelete.fullName}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setAmbassadorToDelete(null)}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    disabled={isProcessingAmbassador}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAmbassador}
                    disabled={isProcessingAmbassador}
                    className="px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm shadow-red-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessingAmbassador ? 'Deleting...' : 'Delete Application'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
