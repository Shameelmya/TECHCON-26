import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Loader2 } from 'lucide-react';
import { VolunteerRegistration } from '../types';

interface VolunteerEditModalProps {
  volunteer: VolunteerRegistration;
  onClose: () => void;
  onSave: (id: string, updates: Partial<VolunteerRegistration>) => Promise<void>;
}

export default function VolunteerEditModal({ volunteer, onClose, onSave }: VolunteerEditModalProps) {
  const [formData, setFormData] = useState({
    fullName: volunteer.fullName,
    age: volunteer.age.toString(),
    gender: volunteer.gender,
    mobileNumber: volunteer.mobileNumber,
    whatsAppNumber: volunteer.whatsAppNumber || '',
    address: volunteer.address,
    district: volunteer.district,
    institution: volunteer.institution,
    institutionDistrict: volunteer.institutionDistrict
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.age || !formData.mobileNumber) {
      setError('Name, age, and mobile number are required.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(volunteer.id, {
        fullName: formData.fullName,
        age: parseInt(formData.age, 10),
        gender: formData.gender as any,
        mobileNumber: formData.mobileNumber,
        whatsAppNumber: formData.whatsAppNumber,
        address: formData.address,
        district: formData.district,
        institution: formData.institution,
        institutionDistrict: formData.institutionDistrict
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update volunteer.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0 z-10">
          <h2 className="text-white font-bold font-orbitron text-lg tracking-wide">Edit Volunteer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
          <div className="p-6 space-y-4 overflow-y-auto">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input 
                name="fullName" value={formData.fullName} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
              <input 
                name="age" type="number" value={formData.age} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
              <input 
                name="mobileNumber" value={formData.mobileNumber} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp Number</label>
              <input 
                name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address / Place</label>
              <input 
                name="address" value={formData.address} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">District</label>
              <input 
                name="district" value={formData.district} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Institution</label>
              <input 
                name="institution" value={formData.institution} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Institution District</label>
              <input 
                name="institutionDistrict" value={formData.institutionDistrict} onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium"
              />
            </div>
            </div>
          </div>

          <div className="p-4 px-6 flex justify-end gap-3 border-t border-slate-100 bg-white shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <button 
              type="button" onClick={onClose} disabled={isSaving}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={isSaving}
              className="px-6 py-2 bg-brand-purple hover:bg-brand-pink text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm shadow-md"
            >
              {isSaving ? <><Loader2 size={16} className="animate-spin"/> Saving...</> : <><Save size={16}/> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
