
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Save, 
  UserCheck, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Search, 
  X, 
  User, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { Student, PaymentType, StudentClass, ExamFeeConfig, ClassConfig } from '../types';

interface PaymentEntryProps {
  students: Student[];
  examFeeConfigs: ExamFeeConfig[];
  classConfigs: ClassConfig[];
  onAdd: (payment: any) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const PaymentEntry: React.FC<PaymentEntryProps> = ({ students, examFeeConfigs, classConfigs, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    studentId: '',
    type: PaymentType.TUITION,
    amount: '',
    month: MONTHS[new Date().getMonth()],
    examName: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-set initial exam name if configs exist
  useEffect(() => {
    if (examFeeConfigs.length > 0 && !formData.examName) {
      setFormData(prev => ({ ...prev, examName: examFeeConfigs[0].examName }));
    }
  }, [examFeeConfigs]);

  // AUTO-SET AMOUNT Logic
  useEffect(() => {
    if (!selectedStudent) return;

    if (formData.type === PaymentType.TUITION) {
      const config = classConfigs.find(c => c.className === selectedStudent.className);
      if (config) {
        const total = Number(config.monthlyFee) + Number(selectedStudent.transportFee || 0);
        setFormData(prev => ({ ...prev, amount: String(total) }));
      }
    } else if (formData.type === PaymentType.EXAM && formData.examName) {
      const examConfig = examFeeConfigs.find(e => e.examName === formData.examName);
      if (examConfig && examConfig.fees) {
        const fee = examConfig.fees[selectedStudent.className] || 0;
        setFormData(prev => ({ ...prev, amount: String(fee) }));
      }
    }
  }, [formData.type, formData.examName, selectedStudent, classConfigs, examFeeConfigs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    
    return students.filter(s => 
      (s.name || '').toLowerCase().includes(term) || 
      (s.id || '').toLowerCase().includes(term) || 
      String(s.roll || '').includes(term)
    ).slice(0, 6);
  }, [students, searchTerm]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData(prev => ({ ...prev, studentId: student.id }));
    setSearchTerm('');
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.amount) return;

    const submissionData = {
      ...formData,
      amount: Number(formData.amount),
      receivedBy: 'Accountant',
      month: formData.type === PaymentType.TUITION ? formData.month : undefined,
      examName: formData.type === PaymentType.EXAM ? formData.examName : undefined
    };

    onAdd(submissionData);
    setShowSuccess(true);
    
    // Reset but keep date and receiver
    setFormData(prev => ({
      ...prev,
      studentId: '',
      amount: '',
      month: MONTHS[new Date().getMonth()]
    }));
    setSelectedStudent(null);
    setSearchTerm('');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <mark key={i} className="bg-emerald-100 text-emerald-900 font-bold px-0.5">{part}</mark> : part
        )}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-50">
        
        <div className="bg-[#064e3b] p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12">
            <CreditCard size={160} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-black mb-3">নতুন ফি এন্ট্রি</h2>
               <p className="text-emerald-200/80 font-bold text-sm uppercase tracking-widest">স্কুল পেমেন্ট ম্যানেজমেন্ট সিস্টেম</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
               <UserCheck size={32} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          <div className="space-y-6 relative" ref={searchRef}>
            <div className="flex items-center justify-between mb-2">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-[10px]">১</div>
                 ছাত্র নির্বাচন করুন
               </label>
               {selectedStudent && (
                 <button 
                  onClick={() => {setSelectedStudent(null); setFormData(f => ({...f, studentId: ''}));}}
                  className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                 >
                   <X size={12}/> পরিবর্তন করুন
                 </button>
               )}
            </div>

            {!selectedStudent ? (
              <div className="relative group">
                <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-emerald-500' : 'text-slate-300'}`} size={20} />
                <input 
                  type="text"
                  placeholder="আইডি, রোল বা নাম লিখুন..."
                  className="w-full pl-16 pr-14 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-emerald-500/30 focus:bg-white text-base text-slate-900 font-bold transition-all shadow-inner"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                />
                
                {showResults && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-emerald-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredResults.length > 0 ? (
                      <div className="divide-y divide-slate-50">
                        {filteredResults.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => handleSelectStudent(s)}
                            className="w-full p-5 text-left hover:bg-emerald-50 transition-all flex items-center gap-4 group"
                          >
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                              {s.roll}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-slate-800 text-sm">
                                 <HighlightText text={s.name} highlight={searchTerm} />
                               </p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                 {s.className} • <HighlightText text={s.id} highlight={searchTerm} />
                               </p>
                            </div>
                            <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-slate-400 italic text-sm font-bold">কোন ছাত্র পাওয়া যায়নি!</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 bg-emerald-50 border-2 border-emerald-200/50 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 animate-in zoom-in duration-500 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                   <User size={120} />
                </div>
                <div className="w-20 h-20 bg-white rounded-[1.8rem] shadow-lg flex items-center justify-center text-emerald-600 font-black text-2xl border-2 border-emerald-100">
                  {selectedStudent.roll}
                </div>
                <div className="text-center md:text-left relative z-10">
                  <h4 className="text-2xl font-black text-emerald-900">{selectedStudent.name}</h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                     <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">শ্রেণী: {selectedStudent.className}</span>
                     <span className="px-4 py-1.5 bg-white border border-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">আইডি: {selectedStudent.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-50" />

          <form onSubmit={handleSubmit} className={`space-y-10 transition-all duration-500 ${!selectedStudent ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-[10px]">২</div>
              ফি এর বিস্তারিত তথ্য
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">আদায়ের ধরন</label>
                <div className="relative">
                   <select 
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500/20 focus:bg-white outline-none transition-all text-base font-bold text-slate-900 appearance-none shadow-inner cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as PaymentType})}
                  >
                    {Object.values(PaymentType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">টাকার পরিমাণ (৳)</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-lg">৳</span>
                   <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500/20 focus:bg-white outline-none transition-all text-2xl font-black text-emerald-700 shadow-inner"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              {formData.type === PaymentType.TUITION && (
                <div className="space-y-3 animate-in slide-in-from-left duration-300">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">মাসের নাম</label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500/20 focus:bg-white outline-none transition-all text-base font-bold text-slate-900 appearance-none shadow-inner cursor-pointer"
                      value={formData.month}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                    >
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>
              )}

              {formData.type === PaymentType.EXAM && (
                <div className="space-y-3 animate-in slide-in-from-left duration-300">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">পরিক্ষার নাম</label>
                  <div className="relative">
                    <select 
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500/20 focus:bg-white outline-none transition-all text-base font-bold text-slate-900 appearance-none shadow-inner cursor-pointer"
                      value={formData.examName}
                      onChange={(e) => setFormData({...formData, examName: e.target.value})}
                    >
                      {examFeeConfigs.map(ex => (
                        <option key={ex.examName} value={ex.examName}>{ex.examName}</option>
                      ))}
                      {examFeeConfigs.length === 0 && <option value="">কোন তথ্য নেই</option>}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">তারিখ নির্বাচন</label>
                <div className="relative">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
                  <input 
                    type="date"
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500/20 focus:bg-white outline-none transition-all text-base font-bold text-slate-900 shadow-inner"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-[#064e3b] text-white rounded-[1.8rem] font-black text-xl hover:bg-emerald-900 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-900/20 active:scale-[0.98]"
            >
              <Save className="w-6 h-6" />
              টাকা জমা দিন (Save Payment)
            </button>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed bottom-12 right-6 md:right-12 bg-emerald-600 text-white px-8 py-6 rounded-[2rem] shadow-2xl flex items-center gap-5 animate-in slide-in-from-right-8 duration-500 z-[100] border-2 border-white/20">
          <div className="bg-white/20 p-2 rounded-xl">
             <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="font-black text-xl">সফল হয়েছে!</p>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-0.5">লেনদেন ডাটাবেসে যুক্ত হয়েছে</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentEntry;
