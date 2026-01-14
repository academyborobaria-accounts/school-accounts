
import React, { useState } from 'react';
import { UserPlus, Save, CheckCircle, GraduationCap } from 'lucide-react';
import { Student, StudentClass } from '../types';

interface StudentEntryProps {
  onAdd: (student: Student) => void;
}

const StudentEntry: React.FC<StudentEntryProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    roll: '',
    name: '',
    className: StudentClass.PLAY,
    fatherName: '',
    phone: '',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.roll) return;

    const newStudent: Student = {
      ...formData,
      id: `S${Date.now().toString().slice(-6)}`, // ইউনিক আইডি জেনারেশন
      totalPaid: 0
    };

    onAdd(newStudent);
    setShowSuccess(true);
    setFormData({
      roll: '',
      name: '',
      className: StudentClass.PLAY,
      fatherName: '',
      phone: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-emerald-800 p-10 text-white flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">নতুন ছাত্র ভর্তি</h2>
            <p className="text-emerald-200">আন-নূর একাডেমিতে নতুন ছাত্রের তথ্য যোগ করুন।</p>
          </div>
          <UserPlus className="w-16 h-16 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">রোল নম্বর</label>
              <input 
                type="text"
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 outline-none font-bold"
                value={formData.roll}
                onChange={(e) => setFormData({...formData, roll: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">ছাত্রের নাম</label>
              <input 
                type="text"
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">শ্রেণী</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value as StudentClass})}
              >
                {Object.values(StudentClass).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">পিতার নাম</label>
              <input 
                type="text"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={formData.fatherName}
                onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">মোবাইল নম্বর</label>
              <input 
                type="tel"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">ভর্তির তারিখ</label>
              <input 
                type="date"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={formData.admissionDate}
                onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Save className="w-6 h-6" /> তথ্য সংরক্ষণ করুন
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed bottom-10 right-10 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right">
          <CheckCircle className="w-8 h-8" />
          <p className="font-bold">সফলভাবে ভর্তি করা হয়েছে!</p>
        </div>
      )}
    </div>
  );
};

export default StudentEntry;
