/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, CheckCircle, XCircle, Search, LogOut, Download, 
  Send, Users, QrCode, ClipboardList, Shield, RefreshCw, BarChart3, 
  FileSpreadsheet, FileText, Check, AlertCircle, Copy, HelpCircle
} from 'lucide-react';
import { AttendeeRegistration, AdminStats } from '../types';
import { getRegistrations, fetchAllRegistrations, getStats, checkInAttendee, revertCheckIn, exportToCSV, loginAdmin, getSettings, toggleRegistrationStatus } from '../utils/db';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface AdminDashboardProps {
  onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [isTogglingReg, setIsTogglingReg] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [attendees, setAttendees] = useState<AttendeeRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'checkin' | 'directory' | 'appscript'>('analytics');

  // Manual Check-in Console state
  const [scannerInput, setScannerInput] = useState('');
  const [scannerResult, setScannerResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [foundAttendee, setFoundAttendee] = useState<AttendeeRegistration | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Copy success indicator
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    const list = await fetchAllRegistrations();
    setAttendees(list);
    setStats(getStats());
    const regState = await getSettings();
    setIsRegOpen(regState);
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

  const handleConfirmCheckIn = async () => {
    if (!foundAttendee) return;
    try {
      const attendee = await checkInAttendee(foundAttendee.id);
      setScannerResult({
        success: true,
        msg: `SUCCESS: Checked in ${attendee.fullName} (${attendee.occupation}) at ${new Date(attendee.checkInTime!).toLocaleTimeString()}`
      });
      setFoundAttendee(null);
      setScannerInput('');
      loadData();
    } catch (e: any) {
      setScannerResult({ success: false, msg: `FAILED: ${e.message || 'Check-in Error'}` });
    }
  };

  const handleToggleCheckInTable = async (attendee: AttendeeRegistration) => {
    try {
      if (attendee.checkedIn) {
        revertCheckIn(attendee.id);
      } else {
        await checkInAttendee(attendee.id);
      }
      loadData();
    } catch (e: any) {
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
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter list by query
  const filteredAttendees = attendees.filter(a => {
    const query = searchQuery.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query) ||
      a.mobileNumber.toLowerCase().includes(query) ||
      a.district.toLowerCase().includes(query) ||
      a.occupation.toLowerCase().includes(query) ||
      (a.place && a.place.toLowerCase().includes(query))
    );
  });

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
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute w-28 h-28 rounded-full bg-purple-500/5 blur-2xl top-0 right-0" />
              
              <div className="text-center mb-8 select-none">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-4 border border-purple-200">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-orbitron font-bold text-slate-900 tracking-[0.06em] uppercase">Gatekeeper Portal</h2>
                <p className="text-xs text-slate-500 mt-1.5 font-sans leading-relaxed">
                  Provide administrator passcode to access live registrations, check-in controls, and sheet sync engines.
                </p>
              </div>

              {loginError && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium font-sans flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 tracking-wider uppercase font-semibold">GATE PASSCODE</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none font-sans text-sm text-slate-900 transition-all"
                      autoFocus
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans font-semibold text-xs rounded-xl transition-all"
                  >
                    RETURN HOME
                  </button>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className={`flex-1 py-3 font-sans font-semibold text-xs rounded-xl shadow-md transition-all ${
                      isLoggingIn 
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:shadow-lg'
                    }`}
                  >
                    {isLoggingIn ? 'VALIDATING...' : 'UNLOCK ACCESS'}
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

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Registration Status Toggle */}
              <button
                onClick={async () => {
                  setIsTogglingReg(true);
                  const newState = !isRegOpen;
                  const success = await toggleRegistrationStatus(newState, password);
                  if (success) setIsRegOpen(newState);
                  else alert("Failed to change registration status. Please try again.");
                  setIsTogglingReg(false);
                }}
                disabled={isTogglingReg}
                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                  isRegOpen
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {isTogglingReg ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${isRegOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                )}
                <span>{isRegOpen ? 'REGISTRATIONS OPEN' : 'REGISTRATIONS CLOSED'}</span>
              </button>

              {/* Refresh button */}
              <button
                onClick={loadData}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Refresh registrations"
              >
                <RefreshCw size={13} className="text-slate-600 animate-[spin_6s_linear_infinite]" />
                <span className="hidden sm:inline">REFRESH</span>
              </button>
              
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-sans font-semibold text-xs rounded-xl transition-all"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Lock Console</span>
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
              className={`flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-bold border transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ClipboardList className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">ATTENDEE RECORDS ({filteredAttendees.length})</span>
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
                    
                    {!foundAttendee.checkedIn && (
                      <button 
                        onClick={handleConfirmCheckIn}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold font-sans text-sm transition-colors shadow-sm"
                      >
                        MARK ATTENDANCE
                      </button>
                    )}
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
                
                {/* Search query box */}
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
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Registration ID</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Full Name</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Contact Credentials</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Role</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Place</th>
                        <th className="p-4 text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider text-center">Check-In Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((a) => (
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
                            </td>
                            <td className="p-4 font-medium text-slate-600">{a.place || 'N/A'}</td>
                            <td className="p-4 text-center select-none">
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
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 font-sans italic">
                            No registration records found matching the search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Google Apps Script secure engine code */}


        </div>
      )}

    </div>
  );
}


