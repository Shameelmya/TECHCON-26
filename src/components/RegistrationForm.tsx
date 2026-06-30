/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Mail, Award, BookOpen, AlertCircle, Check, MapPin } from 'lucide-react';
import { AttendeeRegistration } from '../types';
import { saveRegistration, getRegistrations } from '../utils/db';

interface RegistrationFormProps {
  onSuccess: (reg: AttendeeRegistration) => void;
  onCancel: () => void;
}

const DISTRICTS_KERALA = [
  'Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kottayam', 
  'Alappuzha', 'Kollam', 'Malappuram', 'Palakkad', 'Kannur', 
  'Kasaragod', 'Idukki', 'Wayanad', 'Pathanamthitta', 'Other State'
];

export default function RegistrationForm({ onSuccess, onCancel }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDuplicateMobileFound, setIsDuplicateMobileFound] = useState(false);

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [district, setDistrict] = useState('Ernakulam');
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('India');
  
  const [occupation, setOccupation] = useState<'Student' | 'Working Professional' | 'Entrepreneur' | 'Researcher' | 'Other'>('Student');
  
  // Conditional Student fields
  const [institution, setInstitution] = useState('');
  const [studentLevel, setStudentLevel] = useState('UG'); // Primary, Highschool, Higher secondary, UG, PG, Diploma, Proffesional courses, others
  const [customCourse, setCustomCourse] = useState(''); // course name if UG, PG, or Proffesional

  // Conditional Professional fields
  const [jobTitle, setJobTitle] = useState('');
  const [profInstitution, setProfInstitution] = useState('');

  // Conditional Entrepreneur fields
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');

  // Conditional Researcher fields
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');

  // Consent
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill duplicate detector on mobile number entry
  useEffect(() => {
    if (!mobileNumber.trim()) {
      setIsDuplicateMobileFound(false);
      setErrorMsg(null);
      return;
    }

    const allAttendees = getRegistrations();
    const existing = allAttendees.find(
      a => a.mobileNumber.trim() === mobileNumber.trim()
    );

    if (existing) {
      setIsDuplicateMobileFound(true);
      setErrorMsg(`This mobile number is already connected with a registered participant. Try another phone number.`);
      
      // Auto-fill all existing data
      setFullName(existing.fullName || '');
      setEmail(existing.email || '');
      setWhatsAppNumber(existing.whatsAppNumber || '');
      setAge(existing.age || '');
      setGender(existing.gender || 'Male');
      setDistrict(existing.district || 'Ernakulam');
      setPlace(existing.place || '');
      setCountry(existing.country || 'India');
      setOccupation(existing.occupation || 'Student');
      setConsent(existing.consent || false);
      
      if (existing.occupation === 'Student') {
        setInstitution(existing.institution || '');
        setStudentLevel(existing.level || 'UG');
        setCustomCourse(existing.course || '');
      } else if (existing.occupation === 'Working Professional') {
        setJobTitle(existing.profession || '');
        setProfInstitution(existing.company || '');
      } else if (existing.occupation === 'Entrepreneur') {
        setCompanyName(existing.company || '');
        setSector(existing.industry || '');
      } else if (existing.occupation === 'Researcher') {
        setUniversity(existing.company || '');
        setDepartment(existing.department || '');
      }
    } else {
      setIsDuplicateMobileFound(false);
      setErrorMsg(null);
    }
  }, [mobileNumber]);

  const handleNextStep = () => {
    setErrorMsg(null);

    // Validation for Step 1
    if (step === 1) {
      if (!fullName.trim()) return setErrorMsg('Please enter your full name');
      if (email.trim() && !email.includes('@')) return setErrorMsg('Please enter a valid email address');
      if (!mobileNumber.trim()) return setErrorMsg('Please enter your mobile number');
      if (isDuplicateMobileFound) {
        return setErrorMsg('This mobile number is already registered. Please use another mobile number.');
      }
      if (!whatsAppNumber.trim()) return setErrorMsg('Please enter your WhatsApp number');
      if (!place.trim()) return setErrorMsg('Please enter your Place of residence');
      
      setStep(2);
      setTimeout(() => {
        document.getElementById('register-flow')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg(null);

    if (isDuplicateMobileFound) {
      setErrorMsg('Cannot register. This mobile number is already registered.');
      return;
    }

    if (!consent) {
      setErrorMsg('You must consent to the registration terms and conditions.');
      return;
    }

    // Role-specific validations
    if (occupation === 'Student') {
      if (!institution.trim()) {
        setErrorMsg('Institution name is required for students.');
        return;
      }
      const needsCourse = ['UG', 'PG', 'Professional courses'].includes(studentLevel);
      if (needsCourse && !customCourse.trim()) {
        setErrorMsg('Please specify your course.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName,
        email,
        mobileNumber,
        whatsAppNumber,
        age,
        gender,
        district,
        place,
        state: 'Kerala',
        country,
        occupation,
        consent,
        technologyInterests: ['AI', 'Development'], // default interests
        emergencyContact: whatsAppNumber,
        foodPreference: 'Veg',
        accessibilityRequirement: 'None',
      };

      // Set role-specific conditional variables
      if (occupation === 'Student') {
        payload.institution = institution;
        payload.level = studentLevel;
        if (['UG', 'PG', 'Professional courses'].includes(studentLevel)) {
          payload.course = customCourse;
        }
      } else if (occupation === 'Working Professional') {
        payload.profession = jobTitle;
        payload.company = profInstitution;
      } else if (occupation === 'Entrepreneur') {
        payload.company = companyName;
        payload.industry = sector;
      } else if (occupation === 'Researcher') {
        payload.company = university;
        payload.department = department;
        payload.profession = occupation;
      }

      const registrationResult = await saveRegistration(payload);
      onSuccess(registrationResult);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showCourseColumn = occupation === 'Student' && ['UG', 'PG', 'Professional courses'].includes(studentLevel);

  return (
    <div id="register-flow" className="w-full max-w-2xl mx-auto bg-white border border-slate-100 p-8 sm:p-10 rounded-[32px] shadow-xl relative overflow-hidden">
      
      {/* Glow Backdrop Accent */}
      <div className="absolute w-44 h-44 rounded-full bg-purple-500/5 blur-2xl -top-10 -right-10 pointer-events-none" />

      {/* Header Info */}
      <div className="mb-8 select-none">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
          <span className="text-purple-600 font-semibold uppercase">SECURE REGISTRATION</span>
          <span>STAGE {step} OF 2</span>
        </div>

        {/* 2-Step Wizards Tracker */}
        <div className="flex gap-2.5">
          {[1, 2].map((num) => (
            <div 
              key={num} 
              className={`h-[3px] flex-1 rounded-full transition-all duration-500 ${
                num <= step 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm' 
                  : 'bg-slate-100'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Alert Messaging */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 flex items-start gap-2.5 p-4 border rounded-2xl text-xs ${
              isDuplicateMobileFound 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-red-50 border-red-100 text-red-600'
            }`}
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="font-sans font-medium">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: Personal Coordinates */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-orbitron font-bold tracking-[0.05em] text-slate-950 uppercase flex items-center gap-2">
                <User size={18} className="text-purple-600" />
                <span>Personal Profile</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Let's start with your identity details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Mobile Phone Number - Entered first to allow auto-fill triggers */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  required
                />
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                />
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">WhatsApp Number</label>
                  {!isDuplicateMobileFound && (
                    <div className="flex items-center gap-1.5">
                      <input 
                        id="same-mobile" 
                        type="checkbox" 
                        className="w-3 h-3 accent-purple-600 rounded cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) setWhatsAppNumber(mobileNumber);
                        }}
                      />
                      <label htmlFor="same-mobile" className="text-[9px] font-sans text-purple-600 font-semibold cursor-pointer select-none">
                        Same as Mobile
                      </label>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                  required
                />
              </div>

              {/* Place */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Place of Residence</label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                  required
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none bg-white font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                >
                  {DISTRICTS_KERALA.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Age (Years) (Optional)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-purple-500 rounded-xl outline-none bg-white font-sans text-sm text-slate-800 transition-colors"
                  disabled={isDuplicateMobileFound}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 2: Role Details, Consent & Direct Submit */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-orbitron font-bold tracking-[0.05em] text-slate-950 uppercase flex items-center gap-2">
                <BookOpen size={18} className="text-purple-600" />
                <span>Profession & Profile Details</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Selecting your role profile category is mandatory</p>
            </div>

            {/* Role Select Options */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Select Current Role *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Student', 'Working Professional', 'Entrepreneur', 'Researcher', 'Other'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      if (!isDuplicateMobileFound) {
                        setOccupation(role as any);
                      }
                    }}
                    disabled={isDuplicateMobileFound}
                    className={`py-3 px-3 border rounded-xl text-[11px] font-sans font-semibold uppercase tracking-wide transition-all duration-300 ${
                      occupation === role
                        ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 disabled:opacity-50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Conditional Fields Display */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80">
              
              {/* STUDENT FIELDS */}
              {occupation === 'Student' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Institution Name (Optional)</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Education Level *</label>
                      <select
                        value={studentLevel}
                        onChange={(e) => setStudentLevel(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                        disabled={isDuplicateMobileFound}
                      >
                        <option value="Primary">Primary School</option>
                        <option value="Highschool">High School</option>
                        <option value="Higher secondary">Higher Secondary</option>
                        <option value="UG">Undergraduate (UG)</option>
                        <option value="PG">Postgraduate (PG)</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Professional courses">Professional Courses</option>
                        <option value="others">Others</option>
                      </select>
                    </div>

                    {showCourseColumn && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Which Course? (Optional)</label>
                        <input
                          type="text"
                                  value={customCourse}
                          onChange={(e) => setCustomCourse(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                          disabled={isDuplicateMobileFound}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WORKING PROFESSIONAL FIELDS */}
              {occupation === 'Working Professional' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Job Title (Optional)</label>
                    <input
                      type="text"
                          value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Institution Name / Employer (Optional)</label>
                    <input
                      type="text"
                          value={profInstitution}
                      onChange={(e) => setProfInstitution(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                </div>
              )}

              {/* ENTREPRENEUR FIELDS */}
              {occupation === 'Entrepreneur' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Company Name (Optional)</label>
                    <input
                      type="text"
                          value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Sector / Industry (Optional)</label>
                    <input
                      type="text"
                          value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                </div>
              )}

              {/* RESEARCHER FIELDS */}
              {occupation === 'Researcher' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">University / Institution (Optional)</label>
                    <input
                      type="text"
                          value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Department / Branch (Optional)</label>
                    <input
                      type="text"
                          value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                      disabled={isDuplicateMobileFound}
                    />
                  </div>
                </div>
              )}

              {/* OTHER ROLE FIELDS */}
              {occupation === 'Other' && (
                <div className="py-2 text-center text-xs text-slate-400 font-sans italic">
                  No additional parameters required. Proceed to validation below.
                </div>
              )}

            </div>

            {/* Direct Consent Box */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/80">
              <input
                id="consent-box"
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  if (!isDuplicateMobileFound) {
                    setConsent(e.target.checked);
                  }
                }}
                disabled={isDuplicateMobileFound}
                className="w-4.5 h-4.5 accent-purple-600 border-slate-300 rounded cursor-pointer mt-0.5 shrink-0 disabled:opacity-50"
              />
              <label htmlFor="consent-box" className="text-xs text-slate-500 font-sans leading-relaxed cursor-pointer">
                I hereby declare that the details provided are genuine. I consent to receiving official tickets, security alerts, and event updates over Email and WhatsApp. I agree to the privacy policy of msf TechFed and TECHCON '26.
              </label>
            </div>
          </motion.div>
        )}

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-8 select-none">
          {step === 2 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-6 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-sans font-medium text-xs rounded-full transition-colors"
            >
              PREVIOUS
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-800 font-sans font-medium text-xs hover:bg-slate-50 rounded-full transition-colors"
            >
              CANCEL
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-8 py-2.5 bg-slate-950 hover:bg-purple-600 text-white font-sans font-medium text-xs rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
              disabled={isDuplicateMobileFound}
            >
              NEXT STEP
            </button>
          ) : (
            <button
              type="submit"
              className="px-10 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-sans font-semibold text-xs rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-75 disabled:cursor-wait"
              disabled={isDuplicateMobileFound || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  PROCESSING...
                </span>
              ) : (
                "SUBMIT & GENERATE TICKET"
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
