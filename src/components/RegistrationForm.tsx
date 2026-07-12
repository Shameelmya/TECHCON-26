/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Mail, Award, BookOpen, AlertCircle, Check, MapPin, X, Upload } from 'lucide-react';
import { AttendeeRegistration } from '../types';
import { saveRegistration, getRegistrations, getProgramSettings } from '../utils/db';

interface RegistrationFormProps {
  onSuccess: (reg: AttendeeRegistration) => void;
  onCancel: () => void;
  onGetPass?: () => void;
}

const DISTRICTS_KERALA = [
  'Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kottayam', 
  'Alappuzha', 'Kollam', 'Malappuram', 'Palakkad', 'Kannur', 
  'Kasaragod', 'Idukki', 'Wayanad', 'Pathanamthitta', 'Other State'
];

export default function RegistrationForm({ onSuccess, onCancel, onGetPass }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDuplicateMobileFound, setIsDuplicateMobileFound] = useState(false);

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [district, setDistrict] = useState('');
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('India');
  
  const [occupation, setOccupation] = useState<'Student' | 'Working Professional' | 'Entrepreneur' | 'Faculty' | 'Research Scholar' | 'Other'>('Student');
  
  // Conditional Student fields
  const [institution, setInstitution] = useState('');
  const [institutionDistrict, setInstitutionDistrict] = useState('');
  const [studentLevel, setStudentLevel] = useState('UG'); // Primary, Highschool, Higher secondary, UG, PG, Diploma, Proffesional courses, others
  const [customCourse, setCustomCourse] = useState(''); // course name if UG, PG, or Proffesional

  const [sameAsMobile, setSameAsMobile] = useState(false);

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
  
  const [techInterests, setTechInterests] = useState<string[]>([]);

  const TECH_OPTIONS = ['AI & ML', 'Cyber Security', 'Web/Mobile Dev', 'Cloud Computing', 'Data Science', 'IoT & Hardware', 'UI/UX Design', 'Blockchain'];

  // Stage 3 Fields
  const [sessions, setSessions] = useState<string[]>(['Mega Conference']);
  const [specialPrograms, setSpecialPrograms] = useState<string[]>([]);
  const [feeReceiptUrl, setFeeReceiptUrl] = useState<string | null>(null);
  const [feeReceiptPreview, setFeeReceiptPreview] = useState<string | null>(null);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ feeReceiptUrl: 'File must be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ feeReceiptUrl: 'Must be an image file' });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let scaleSize = MAX_WIDTH / img.width;
          if (scaleSize > 1) scaleSize = 1;
          
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // heavily compress
          setFeeReceiptUrl(dataUrl);
          setFeeReceiptPreview(dataUrl);
          setErrors(prev => ({...prev, feeReceiptUrl: ''}));
        };
      };
    }
  };

  const [programSettings, setProgramSettings] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    getProgramSettings().then(setProgramSettings);
  }, []);

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
        setInstitutionDistrict(existing.institutionDistrict || '');
        setStudentLevel(existing.level || 'UG');
        setCustomCourse(existing.course || '');
      } else if (existing.occupation === 'Working Professional') {
        setJobTitle(existing.profession || '');
        setProfInstitution(existing.company || '');
      } else if (existing.occupation === 'Entrepreneur') {
        setCompanyName(existing.company || '');
        setSector(existing.industry || '');
      } else if (existing.occupation === 'Research Scholar' || existing.occupation === 'Faculty') {
        setUniversity(existing.company || '');
        setDepartment(existing.department || '');
      }
    } else {
      setIsDuplicateMobileFound(false);
      setErrorMsg(null);
    }
  }, [mobileNumber]);

  const handlePrevStep = () => {
    setStep(1);
    setTimeout(() => {
      document.getElementById('register-flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg(null);
    setErrors({});

    // Step 1 Validation
    if (step === 1) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileNumber.trim() || !mobileRegex.test(mobileNumber)) {
        setErrors({ mobileNumber: 'Please enter a valid 10-digit mobile number' });
        document.getElementById('mobileNumber-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!fullName.trim()) {
        setErrors({ fullName: 'Please enter your full name' });
        document.getElementById('fullName-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!whatsAppNumber.trim() || !mobileRegex.test(whatsAppNumber)) {
        setErrors({ whatsAppNumber: 'Please enter a valid 10-digit WhatsApp number' });
        document.getElementById('whatsAppNumber-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (email.trim() && !email.includes('@')) {
        setErrors({ email: 'Please enter a valid email address' });
        document.getElementById('email-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!place.trim()) {
        setErrors({ place: 'Please enter your place of residence' });
        document.getElementById('place-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!district) {
        setErrors({ district: 'Please select a district' });
        return;
      }
      if (!age || age <= 0) {
        setErrors({ age: 'Please enter a valid age greater than 0' });
        document.getElementById('age-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (isDuplicateMobileFound) {
        setErrors({ mobileNumber: 'This mobile number is already registered. Please use another mobile number.' });
        document.getElementById('mobileNumber-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      
      setStep(2);
      setTimeout(() => {
        document.getElementById('register-flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      return;
    }

    // Step 2 Validation (Role Details)
    if (step === 2) {
      if (isDuplicateMobileFound) {
        setErrors({ mobileNumber: 'Cannot register. This mobile number is already registered.' });
        return;
      }

      // Role-specific validations
      if (occupation === 'Student') {
        if (!institution.trim()) {
          setErrors({ institution: 'Institution name is required for students.' });
          setTimeout(() => document.getElementById('institution-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
        if (!institutionDistrict) {
          setErrors({ institutionDistrict: 'Institution district is required for students.' });
          setTimeout(() => document.getElementById('institutionDistrict-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
        const needsCourse = ['UG', 'PG', 'Professional courses'].includes(studentLevel);
        if (needsCourse && !customCourse.trim()) {
          setErrors({ customCourse: 'Please specify your course.' });
          setTimeout(() => document.getElementById('course-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
      } else if (occupation === 'Working Professional') {
        if (!jobTitle.trim()) {
          setErrors({ jobTitle: 'Job title is required.' });
          setTimeout(() => document.getElementById('jobTitle-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
      } else if (occupation === 'Entrepreneur') {
        if (!sector.trim()) {
          setErrors({ sector: 'Field / Sector is required.' });
          setTimeout(() => document.getElementById('sector-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
      } else if (occupation === 'Research Scholar' || occupation === 'Faculty') {
        if (!university.trim()) {
          setErrors({ university: 'University / Institution is required.' });
          setTimeout(() => document.getElementById('university-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
        }
      }

      setStep(3);
      setTimeout(() => {
        document.getElementById('register-flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      return;
    }

    // Step 3 Validation
    if (isDuplicateMobileFound) {
      setErrors({ mobileNumber: 'Cannot register. This mobile number is already registered.' });
      return;
    }

    if (!consent) {
      setErrors({ consent: 'You must consent to the registration terms and conditions.' });
      return;
    }

    if (specialPrograms.includes('Hackathon') && !feeReceiptUrl) {
      setErrors({ feeReceiptUrl: 'Please upload the Rs 500 fee receipt for the Hackathon.' });
      setTimeout(() => document.getElementById('hackathon-receipt-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName, email, mobileNumber, whatsAppNumber, age, gender,
        district, place, state: 'Kerala', country, occupation, consent,
        technologyInterests: techInterests,
        emergencyContact: whatsAppNumber, foodPreference: 'Veg', accessibilityRequirement: 'None',
        sessions, specialPrograms, feeReceiptBase64: specialPrograms.includes('Hackathon') ? feeReceiptUrl : null
      };

      if (occupation === 'Student') {
        payload.institution = institution;
        payload.institutionDistrict = institutionDistrict;
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
      } else if (occupation === 'Research Scholar' || occupation === 'Faculty') {
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
          <div className="flex items-center gap-4">
            <span>STAGE {step} OF 3</span>
            <button 
              type="button" 
              onClick={onCancel}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 -mr-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3-Step Wizards Tracker */}
        <div className="flex gap-2.5">
          {[1, 2, 3].map((num) => (
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
        
        {onGetPass && (
          <div className="mt-4 p-3.5 bg-brand-purple/5 rounded-xl border border-brand-purple/10 flex items-center justify-between animate-fade-in">
            <span className="text-[11px] sm:text-xs text-brand-purple font-sans font-semibold uppercase tracking-wider">Already registered?</span>
            <button
              type="button"
              onClick={onGetPass}
              className="px-4 py-2 bg-white hover:bg-brand-purple text-brand-purple hover:text-white border border-brand-purple/20 rounded-lg text-xs font-bold transition-colors uppercase tracking-widest shadow-sm"
            >
              Get Pass
            </button>
          </div>
        )}
      </div>

      {/* Alert Messaging */}
      <AnimatePresence>
        {errorMsg && !errorMsg.includes('mobile number is already connected') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 flex items-start gap-2.5 p-4 border rounded-2xl text-xs bg-red-50 border-red-100 text-red-600`}
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-sans font-medium leading-relaxed">
              {errorMsg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
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
              
              {/* Mobile Phone Number */}
              <div className="flex flex-col gap-1.5" id="mobileNumber-field">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMobileNumber(val);
                    setIsDuplicateMobileFound(false);
                    setErrorMsg(null);
                    setErrors(prev => ({...prev, mobileNumber: ''}));
                    if (sameAsMobile) {
                      setWhatsAppNumber(val);
                    }
                  }}
                  className={`w-full px-4 py-3 border ${errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors`}
                  maxLength={10}
                  pattern="[0-9]*"
                  required
                />
                {errors.mobileNumber && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.mobileNumber}</span>}
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5" id="fullName-field">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors(prev => ({...prev, fullName: ''}));
                  }}
                  className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors`}
                  disabled={isDuplicateMobileFound}
                  required
                />
                {errors.fullName && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.fullName}</span>}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5" id="email-field">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors`}
                  disabled={isDuplicateMobileFound}
                />
                {errors.email && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.email}</span>}
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col gap-1.5" id="whatsAppNumber-field">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">WhatsApp Number</label>
                  {!isDuplicateMobileFound && (
                    <div className="flex items-center gap-1.5">
                      <input 
                        id="same-mobile" 
                        type="checkbox" 
                        checked={sameAsMobile}
                        className="w-3 h-3 accent-purple-600 rounded cursor-pointer"
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSameAsMobile(checked);
                          if (checked) {
                            setWhatsAppNumber(mobileNumber);
                            setErrors(prev => ({...prev, whatsAppNumber: ''}));
                          }
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
                  onChange={(e) => {
                    setWhatsAppNumber(e.target.value);
                    setErrors(prev => ({...prev, whatsAppNumber: ''}));
                  }}
                  className={`w-full px-4 py-3 border ${errors.whatsAppNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors`}
                  disabled={isDuplicateMobileFound}
                  maxLength={10}
                  pattern="[0-9]*"
                  required
                />
                {errors.whatsAppNumber && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.whatsAppNumber}</span>}
              </div>

              {/* Place */}
              <div className="flex flex-col gap-1.5" id="place-field">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Place of Residence</label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => {
                    setPlace(e.target.value);
                    setErrors(prev => ({...prev, place: ''}));
                  }}
                  className={`w-full px-4 py-3 border ${errors.place ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors`}
                  disabled={isDuplicateMobileFound}
                  required
                />
                {errors.place && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.place}</span>}
              </div>

              {/* District */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">District</label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setErrors(prev => ({...prev, district: ''}));
                  }}
                  className={`w-full px-4 py-3 border ${errors.district ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none bg-white font-sans text-sm text-slate-800 transition-colors`}
                  disabled={isDuplicateMobileFound}
                  required
                >
                  <option value="" disabled>Select District</option>
                  {DISTRICTS_KERALA.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.district}</span>}
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1.5" id="age-field">
                <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Age (Years) *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                  className={`w-full px-4 py-3 border rounded-xl outline-none font-sans text-sm text-slate-800 transition-colors ${
                    errors.age ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'
                  }`}
                  disabled={isDuplicateMobileFound}
                  min="1"
                  required
                />
                {errors.age && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.age}</span>}
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
                {['Student', 'Working Professional', 'Entrepreneur', 'Faculty', 'Research Scholar', 'Other'].map((role) => (
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
                  <div className="flex flex-col gap-1.5" id="institution-field">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Institution Name</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => {
                        setInstitution(e.target.value);
                        setErrors(prev => ({...prev, institution: ''}));
                      }}
                      className={`w-full px-4 py-2.5 border ${errors.institution ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white`}
                      disabled={isDuplicateMobileFound}
                      required
                    />
                    {errors.institution && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.institution}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1.5" id="institutionDistrict-field">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Institution District *</label>
                    <select
                      value={institutionDistrict}
                      onChange={(e) => {
                        setInstitutionDistrict(e.target.value);
                        setErrors(prev => ({...prev, institutionDistrict: ''}));
                      }}
                      className={`w-full px-4 py-2.5 border ${errors.institutionDistrict ? 'border-red-500 bg-red-50/50' : 'border-slate-200'} focus:border-purple-500 rounded-xl outline-none bg-white font-sans text-xs text-slate-800`}
                      disabled={isDuplicateMobileFound}
                      required
                    >
                      <option value="" disabled>Select District</option>
                      {DISTRICTS_KERALA.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.institutionDistrict && <span className="text-red-500 text-[10px] font-sans font-medium px-1">{errors.institutionDistrict}</span>}
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
                      <div className="flex flex-col gap-1.5" id="course-field">
                        <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Which Course?</label>
                        <input
                          type="text"
                          value={customCourse}
                          onChange={(e) => setCustomCourse(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-sans text-xs text-slate-800 bg-white"
                          disabled={isDuplicateMobileFound}
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WORKING PROFESSIONAL FIELDS */}
              {occupation === 'Working Professional' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5" id="jobTitle-field">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Job Title *</label>
                    <input
                      type="text"
                          value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none font-sans text-xs text-slate-800 bg-white ${
                        errors.jobTitle ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'
                      }`}
                      disabled={isDuplicateMobileFound}
                      required
                    />
                    {errors.jobTitle && <span className="text-red-500 text-[10px] font-sans font-medium">{errors.jobTitle}</span>}
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
                  <div className="flex flex-col gap-1.5" id="sector-field">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Sector / Industry *</label>
                    <input
                      type="text"
                          value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none font-sans text-xs text-slate-800 bg-white ${
                        errors.sector ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'
                      }`}
                      disabled={isDuplicateMobileFound}
                      required
                    />
                    {errors.sector && <span className="text-red-500 text-[10px] font-sans font-medium">{errors.sector}</span>}
                  </div>
                </div>
              )}

              {/* RESEARCHER FIELDS */}
              {(occupation === 'Research Scholar' || occupation === 'Faculty') && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5" id="university-field">
                    <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">University / Institution *</label>
                    <input
                      type="text"
                          value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none font-sans text-xs text-slate-800 bg-white ${
                        errors.university ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-purple-500'
                      }`}
                      disabled={isDuplicateMobileFound}
                      required
                    />
                    {errors.university && <span className="text-red-500 text-[10px] font-sans font-medium">{errors.university}</span>}
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
                  No additional parameters required. Proceed to next step.
                </div>
              )}

            </div>

            {/* Technology Interests Fields */}
            <div className="flex flex-col gap-2 mt-6">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Technology Interests (Select multiple)</label>
              <div className="flex flex-wrap gap-2">
                {TECH_OPTIONS.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      if (!isDuplicateMobileFound) {
                        setTechInterests(prev => 
                          prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
                        );
                      }
                    }}
                    disabled={isDuplicateMobileFound}
                    className={`py-2 px-3 border rounded-xl text-[10px] font-sans font-semibold tracking-wide transition-all duration-300 ${
                      techInterests.includes(tech)
                        ? 'bg-purple-100 border-purple-400 text-purple-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 disabled:opacity-50'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* STEP 3: Sessions, Programs & Consent */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-orbitron font-bold tracking-[0.05em] text-slate-950 uppercase flex items-center gap-2">
                <Award size={18} className="text-purple-600" />
                <span>Sessions & Programs</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Customize your TECHCON '26 experience</p>
            </div>

            {/* Sessions Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Select Sessions</label>
              <div className="space-y-2">
                {[
                  "Mega Conference",
                  "Workshop on Cybersecurity Shield a secure digital future",
                  "Workshop on The imapct of technology on global industrials",
                  "Workshop on Building tomorrow’s careers thriving the age of AI",
                  "Presentation and discussion on AI smart village"
                ].filter(sessionName => programSettings[sessionName] !== false).map((sessionName) => {
                  const isMega = sessionName === "Mega Conference";
                  return (
                    <label key={sessionName} className={`flex items-start gap-3 p-3 rounded-xl border ${sessions.includes(sessionName) ? 'border-purple-300 bg-purple-50/50' : 'border-slate-100 bg-white hover:bg-slate-50'} cursor-pointer transition-colors`}>
                      <input 
                        type="checkbox"
                        checked={sessions.includes(sessionName)}
                        onChange={(e) => {
                          if (isMega) return; // Cannot uncheck mega conference
                          if (e.target.checked) {
                            setSessions([...sessions, sessionName]);
                          } else {
                            setSessions(sessions.filter(s => s !== sessionName));
                          }
                        }}
                        disabled={isMega || isDuplicateMobileFound}
                        className="w-4 h-4 mt-0.5 accent-purple-600 rounded cursor-pointer disabled:opacity-50"
                      />
                      <span className={`text-xs font-sans font-medium ${isMega ? 'text-slate-900' : 'text-slate-700'}`}>
                        {sessionName}
                        {isMega && <span className="ml-2 inline-block px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[9px] rounded uppercase font-bold tracking-wider">Default</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Special Programs Selection */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Special Programs (Optional)</label>
              <div className="space-y-2">
                {[
                  "Hackathon",
                  "Project Competition",
                  "Pro Night"
                ].filter(programName => {
                  if (programSettings[programName] === false) return false;
                  if (programName === "Pro Night" && (typeof age !== 'number' || age < 16)) return false;
                  return true;
                }).map((programName) => (
                  <label key={programName} className={`flex items-start gap-3 p-3 rounded-xl border ${specialPrograms.includes(programName) ? 'border-brand-pink/50 bg-pink-50/30' : 'border-slate-100 bg-white hover:bg-slate-50'} cursor-pointer transition-colors`}>
                    <input 
                      type="checkbox"
                      checked={specialPrograms.includes(programName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSpecialPrograms([...specialPrograms, programName]);
                        } else {
                          setSpecialPrograms(specialPrograms.filter(p => p !== programName));
                        }
                      }}
                      disabled={isDuplicateMobileFound}
                      className="w-4 h-4 mt-0.5 accent-brand-pink rounded cursor-pointer disabled:opacity-50"
                    />
                    <span className="text-xs font-sans font-medium text-slate-700">
                      {programName}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hackathon Fee Upload */}
            <AnimatePresence>
              {specialPrograms.includes('Hackathon') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl mt-4" id="hackathon-receipt-field">
                    <label className="text-[11px] font-mono tracking-wider text-orange-600 uppercase font-bold block mb-2">
                      Hackathon Fee Receipt (Rs. 500) *
                    </label>
                    <p className="text-[10px] text-slate-500 mb-3">Please upload a screenshot or image of your payment receipt to complete Hackathon registration.</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 bg-white rounded-lg border-2 border-orange-200 border-dashed shrink-0 flex items-center justify-center relative overflow-hidden">
                        {feeReceiptPreview ? (
                          <img src={feeReceiptPreview} alt="Receipt Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={20} className="text-orange-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="fee-receipt-upload" 
                          className="hidden" 
                          onChange={handleReceiptChange} 
                          disabled={isDuplicateMobileFound}
                        />
                        <label 
                          htmlFor="fee-receipt-upload" 
                          className="inline-block px-4 py-2 bg-white border border-orange-200 text-orange-600 font-bold rounded-lg text-xs cursor-pointer hover:bg-orange-50 transition-colors"
                        >
                          {feeReceiptUrl ? 'Change Receipt' : 'Upload Receipt'}
                        </label>
                      </div>
                    </div>
                    {errors.feeReceiptUrl && <span className="text-red-500 text-[10px] font-sans font-medium mt-2 block">{errors.feeReceiptUrl}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border ${errors.consent ? 'border-red-300' : 'border-slate-100/80'}`}>
              <input
                id="consent-box"
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  if (!isDuplicateMobileFound) {
                    setConsent(e.target.checked);
                    setErrors(prev => ({...prev, consent: ''}));
                  }
                }}
                disabled={isDuplicateMobileFound}
                className="w-4.5 h-4.5 accent-purple-600 border-slate-300 rounded cursor-pointer mt-0.5 shrink-0 disabled:opacity-50"
              />
              <div className="flex flex-col">
                <label htmlFor="consent-box" className="text-xs text-slate-500 font-sans leading-relaxed cursor-pointer">
                  I hereby declare that the details provided are genuine. I consent to receiving official tickets, security alerts, and event updates over Email and WhatsApp. I agree to the privacy policy of Techfed Kerala and TECHCON '26.
                </label>
                {errors.consent && <span className="text-red-500 text-[10px] font-sans font-medium mt-1">{errors.consent}</span>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-8 select-none">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
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

          {step < 3 ? (
            <button
              type="submit"
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
