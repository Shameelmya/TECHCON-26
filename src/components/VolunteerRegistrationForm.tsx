import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { storage } from '../utils/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { submitVolunteer, getAttendeeByMobile } from '../utils/db';
import { VolunteerRegistration } from '../types';

interface VolunteerRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onShowIDCard: (volunteer: VolunteerRegistration) => void;
}

const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", 
  "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export default function VolunteerRegistrationForm({ isOpen, onClose, onShowIDCard }: VolunteerRegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVolunteer, setSuccessVolunteer] = useState<VolunteerRegistration | null>(null);
  const isSubmittingRef = useRef(false);
  const [error, setError] = useState('');
  const [showErrorsStep1, setShowErrorsStep1] = useState(false);
  const [showErrorsStep2, setShowErrorsStep2] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    address: '',
    mobileNumber: '',
    whatsAppNumber: '',
    institution: '',
    district: '',
    institutionDistrict: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [volunteerAreas, setVolunteerAreas] = useState<string[]>([]);
  const [hearAbout, setHearAbout] = useState('');
  const [otherHearAbout, setOtherHearAbout] = useState('');
  const [reasonToJoin, setReasonToJoin] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const VOLUNTEER_AREAS_OPTIONS = [
    'Event Management', 'Marketing & Promotions', 'Social Media', 
    'Content Writing', 'Graphic Design', 'Photography & Videography', 
    'Registration Desk', 'Technical Support', 'Stage & Logistics', 
    'Public Relations', 'Hospitality'
  ];
  
  const HEAR_ABOUT_OPTIONS = ['Instagram', 'WhatsApp', 'LinkedIn', 'College/Faculty', 'Friend', 'Website', 'Other'];
  const REASON_OPTIONS = [
    'To gain event management experience', 'To improve my leadership skills', 
    'To network with industry professionals', 'To learn about technology and innovation', 
    'To enhance my resume/CV', 'To contribute to a major tech event', 'Other'
  ];

  const [isIDCardDownloadEnabled, setIsIDCardDownloadEnabled] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadId, setDownloadId] = useState('');
  const [downloadMobile, setDownloadMobile] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    import('../utils/db').then(({ getVolunteerSettings }) => {
      getVolunteerSettings().then(settings => {
        setIsIDCardDownloadEnabled(settings.isIDCardDownloadEnabled);
      });
    });
  }, []);

  useEffect(() => {
    const cleanNum = formData.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanNum.length === 10) {
      const attendee = getAttendeeByMobile(cleanNum);
      if (attendee) {
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || attendee.fullName,
          age: prev.age || (attendee.age ? attendee.age.toString() : ''),
          gender: attendee.gender || 'Male',
          address: prev.address || attendee.place || '',
          whatsAppNumber: prev.whatsAppNumber || attendee.whatsAppNumber || '',
          district: prev.district || attendee.district || '',
          institution: prev.institution || attendee.institution || '',
          institutionDistrict: prev.institutionDistrict || attendee.institutionDistrict || ''
        }));
      }
    }
  }, [formData.mobileNumber]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Must be an image file");
        return;
      }

      // Compress image for much faster processing
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setPhoto(dataUrl);
          setPhotoPreview(dataUrl);
          setError('');
        };
      };
    }
  };

  const validateStep1 = () => {
    setShowErrorsStep1(true);
    if (!formData.fullName || !formData.age || !formData.address || !formData.mobileNumber || !formData.whatsAppNumber) {
      setError("Please fill all required fields in step 1.");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, '').slice(-10))) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    
    setShowErrorsStep2(true);
    if (!formData.institution || !formData.district || !formData.institutionDistrict) {
      setError("Please select all institution and district details.");
      return;
    }
    if (volunteerAreas.length === 0 || !hearAbout || !reasonToJoin || (hearAbout === 'Other' && !otherHearAbout) || (reasonToJoin === 'Other' && !otherReason)) {
      setError("Please answer all questionnaire fields.");
      return;
    }
    if (!photo) {
      setError("Please upload a passport size photo for your ID Card.");
      return;
    }

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    setError('');

    try {
      // Direct base64 string as photoUrl to bypass Storage entirely
      const photoUrl = photo;

      // 2. Save Data to Firestore
      const volunteerData = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        address: formData.address,
        mobileNumber: formData.mobileNumber,
        whatsAppNumber: formData.whatsAppNumber || formData.mobileNumber,
        institution: formData.institution,
        district: formData.district,
        institutionDistrict: formData.institutionDistrict,
        volunteerAreas,
        hearAbout: hearAbout === 'Other' ? otherHearAbout : hearAbout,
        reasonToJoin: reasonToJoin === 'Other' ? otherReason : reasonToJoin,
        photoUrl
      };

      const volunteer = await Promise.race([
        submitVolunteer(volunteerData),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Processing timed out. Please check your internet connection and try again.")), 15000)
        )
      ]);
      
      // Clear form
      setFormData({
        fullName: '', age: '', gender: 'Male', address: '', 
        mobileNumber: '', whatsAppNumber: '', institution: '', 
        district: '', institutionDistrict: ''
      });
      setPhoto(null);
      setPhotoPreview(null);
      setVolunteerAreas([]);
      setHearAbout('');
      setOtherHearAbout('');
      setReasonToJoin('');
      setOtherReason('');
      setStep(3);
      setSuccessVolunteer(volunteer);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]"
      >
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold font-orbitron text-white">Volunteer Registration</h2>
            <p className="text-slate-400 text-xs mt-1 font-mono tracking-widest uppercase">TECHCON 2026</p>
          </div>
          <div className="flex items-center gap-4">
            {isIDCardDownloadEnabled && step !== 3 && (
              <button 
                onClick={() => setShowDownloadModal(true)}
                className="text-[10px] sm:text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors border border-white/20"
              >
                Download ID Card
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <span className="text-red-500 font-bold">Error:</span>
              <p className="text-red-700 text-sm leading-tight">{error}</p>
            </div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Full Name *</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep1 && !formData.fullName ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Age *</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep1 && !formData.age ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Gender *</label>
                  <select 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Place *</label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep1 && !formData.address ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Mobile No. *</label>
                  <input 
                    type="tel" 
                    value={formData.mobileNumber}
                    onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep1 && !formData.mobileNumber ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">WhatsApp No. *</label>
                    <label className="flex items-center gap-1.5 text-[10px] text-brand-purple cursor-pointer font-bold bg-purple-50 px-2 py-0.5 rounded-full hover:bg-purple-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="accent-brand-purple w-3 h-3 cursor-pointer"
                        onChange={(e) => {
                          if(e.target.checked && formData.mobileNumber) {
                            setFormData(prev => ({...prev, whatsAppNumber: prev.mobileNumber}));
                          }
                        }} 
                      />
                      Same as mobile
                    </label>
                  </div>
                  <input 
                    type="tel" 
                    value={formData.whatsAppNumber}
                    onChange={e => setFormData({...formData, whatsAppNumber: e.target.value})}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep1 && !formData.whatsAppNumber ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                  />
                </div>
              </div>

              <button 
                onClick={() => { if(validateStep1()) setStep(2); }}
                className="w-full bg-brand-purple hover:bg-brand-pink text-white font-bold py-4 rounded-xl mt-6 transition-colors shadow-lg shadow-purple-500/20"
              >
                Next Step
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Your District *</label>
                <select 
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep2 && !formData.district ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <option value="">Select District...</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Institution Name *</label>
                <input 
                  type="text" 
                  value={formData.institution}
                  onChange={e => setFormData({...formData, institution: e.target.value})}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep2 && !formData.institution ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Institution District *</label>
                <select 
                  value={formData.institutionDistrict}
                  onChange={e => setFormData({...formData, institutionDistrict: e.target.value})}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 ${showErrorsStep2 && !formData.institutionDistrict ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <option value="">Select District...</option>
                  {DISTRICTS.map(d => <option key={`inst-${d}`} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Questionnaire */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Which area would you like to volunteer in? (Select one or more) *</label>
                <div className="flex flex-wrap gap-2">
                  {VOLUNTEER_AREAS_OPTIONS.map(area => (
                    <label key={area} className={`px-3 py-2 border rounded-xl text-xs font-sans cursor-pointer transition-colors ${volunteerAreas.includes(area) ? 'bg-purple-100 border-purple-400 text-purple-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={volunteerAreas.includes(area)} 
                        onChange={(e) => {
                          if (e.target.checked) setVolunteerAreas(prev => [...prev, area]);
                          else setVolunteerAreas(prev => prev.filter(a => a !== area));
                        }} 
                      />
                      {area}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">How did you hear about TECHCON'26? *</label>
                <div className="flex flex-wrap gap-2">
                  {HEAR_ABOUT_OPTIONS.map(option => (
                    <label key={option} className={`px-3 py-2 border rounded-xl text-xs font-sans cursor-pointer transition-colors ${hearAbout === option ? 'bg-purple-100 border-purple-400 text-purple-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <input 
                        type="radio" 
                        name="hearAbout"
                        className="hidden" 
                        checked={hearAbout === option} 
                        onChange={() => setHearAbout(option)} 
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {hearAbout === 'Other' && (
                  <input type="text" placeholder="Please specify..." value={otherHearAbout} onChange={e => setOtherHearAbout(e.target.value)} className="mt-1 w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 border-slate-200 bg-slate-50" />
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Why do you want to join TECHCON'26? *</label>
                <div className="flex flex-col gap-2">
                  {REASON_OPTIONS.map(option => (
                    <label key={option} className={`px-3 py-2 border rounded-xl text-xs font-sans cursor-pointer transition-colors ${reasonToJoin === option ? 'bg-purple-100 border-purple-400 text-purple-700 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      <input 
                        type="radio" 
                        name="reasonToJoin"
                        className="hidden" 
                        checked={reasonToJoin === option} 
                        onChange={() => setReasonToJoin(option)} 
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {reasonToJoin === 'Other' && (
                  <input type="text" placeholder="Please specify..." value={otherReason} onChange={e => setOtherReason(e.target.value)} className="mt-1 w-full border-2 rounded-xl px-4 py-3 focus:bg-white focus:border-brand-purple outline-none transition-all text-slate-900 border-slate-200 bg-slate-50" />
                )}
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Passport Size Photo (For ID Card) *</label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="h-24 w-20 bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 border-dashed shrink-0 flex items-center justify-center relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="photo-upload" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                    <label 
                      htmlFor="photo-upload" 
                      className="inline-block px-4 py-2 bg-white border-2 border-brand-purple text-brand-purple font-bold rounded-lg text-sm cursor-pointer hover:bg-purple-50 transition-colors"
                    >
                      {photo ? 'Change Photo' : 'Choose Photo'}
                    </label>
                    <p className="text-xs text-slate-500 mt-2 leading-tight">
                      <strong>Max 5MB. 1:1 Aspect Ratio (Square) recommended.</strong><br/>
                      Must be a clear passport style photo with plain background.
                    </p>
                  </div>
                </div>
                {showErrorsStep2 && !photo && <p className="text-red-500 text-xs mt-1 font-bold">Please upload a photo.</p>}
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] bg-brand-purple hover:bg-brand-pink text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><CheckCircle size={18} /> Submit Registration</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && successVolunteer && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
              <p className="text-slate-600 mb-6">Thank you for registering as a volunteer for TECHCON'26.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 w-full max-w-sm mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Your Registration ID</p>
                <div className="text-3xl font-orbitron font-bold text-brand-purple">{successVolunteer.id}</div>
                <p className="text-xs text-slate-500 mt-4">Please save this ID. Your Volunteer ID Card will be sent to you later.</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full max-w-sm bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Download ID Card Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDownloadModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Download ID Card</h3>
                <button onClick={() => setShowDownloadModal(false)} className="text-slate-400 hover:text-slate-800"><X size={20}/></button>
              </div>
              
              {downloadError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                  {downloadError}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Volunteer ID</label>
                  <input type="text" value={downloadId} onChange={e => setDownloadId(e.target.value)} placeholder="e.g. TCVOL-A001" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 mt-1 focus:border-brand-purple outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Mobile Number</label>
                  <input type="tel" value={downloadMobile} onChange={e => setDownloadMobile(e.target.value)} placeholder="10-digit mobile" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 mt-1 focus:border-brand-purple outline-none" />
                </div>
              </div>

              <button 
                onClick={async () => {
                  if(!downloadId || !downloadMobile) { setDownloadError("Fill all fields"); return; }
                  setIsVerifying(true);
                  setDownloadError('');
                  try {
                    const { verifyVolunteer } = await import('../utils/db');
                    const vol = await verifyVolunteer(downloadId.trim(), downloadMobile.trim().replace(/\D/g, '').slice(-10));
                    setShowDownloadModal(false);
                    onShowIDCard(vol);
                  } catch(e: any) {
                    setDownloadError(e.message || "Verification failed");
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                disabled={isVerifying}
                className="w-full bg-brand-purple text-white font-bold py-3 rounded-xl hover:bg-brand-pink transition-colors disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'View ID Card'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
