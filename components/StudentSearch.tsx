
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  X, 
  Filter, 
  Info,
  CreditCard,
  History as HistoryIcon,
  Wallet,
  User,
  Hash,
  Fingerprint
} from 'lucide-react';
import { Student, Payment, StudentClass, PaymentType, ClassConfig, ExamFeeConfig } from '../types';

interface StudentSearchProps {
  students: Student[];
  payments: Payment[];
  classConfigs: ClassConfig[];
  examFeeConfigs: ExamFeeConfig[];
}

const StudentSearch: React.FC<StudentSearchProps> = ({ students, payments, classConfigs, examFeeConfigs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('সব');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on component mount
  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // Optimized Real-time Filtering Logic
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    return students.filter(s => {
      const studentName = (s.name || '').toLowerCase();
      const studentId = (s.id || '').toLowerCase();
      const studentRoll = String(s.roll || '').toLowerCase();

      const matchesSearch = studentName.includes(term) || 
                          studentId.includes(term) || 
                          studentRoll.includes(term);
      
      const matchesClass = selectedClass === 'সব' || s.className === selectedClass;
      
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  // Combined Debt Logic (Tuition + Exams)
  const getStudentBriefStats = (student: Student) => {
    // 1. Tuition Debt
    const config = classConfigs.find(c => c.className === student.className);
    const monthlyFee = config?.monthlyFee || 0;
    const transportFee = Number(student.transportFee) || 0;
    const totalMonthly = monthlyFee + transportFee;
    const monthsPassed = new Date().getMonth() + 1;
    const totalExpectedTuition = monthsPassed * totalMonthly;
    const actualPaidTuition = payments
      .filter(p => p.studentId === student.id && p.type === PaymentType.TUITION)
      .reduce((acc, p) => acc + Number(p.amount), 0);
    const tuitionDue = Math.max(0, totalExpectedTuition - actualPaidTuition);

    // 2. Exam Debt
    const totalExpectedExam = examFeeConfigs.reduce((acc, ex) => acc + (ex.fees[student.className] || 0), 0);
    const actualPaidExam = payments
      .filter(p => p.studentId === student.id && p.type === PaymentType.EXAM)
      .reduce((acc, p) => acc + Number(p.amount), 0);
    const examDue = Math.max(0, totalExpectedExam - actualPaidExam);

    const totalDue = tuitionDue + examDue;
    return { due: totalDue, isPaid: totalDue <= 0 };
  };

  const studentDetailedData = useMemo(() => {
    if (!selectedStudent) return null;
    
    // Tuition Calculation
    const config = classConfigs.find(c => c.className === selectedStudent.className);
    const monthlyFee = config?.monthlyFee || 0;
    const transportFee = Number(selectedStudent.transportFee) || 0;
    const totalMonthly = monthlyFee + transportFee;
    const monthsPassed = new Date().getMonth() + 1;
    const totalExpectedTuition = monthsPassed * totalMonthly;
    const actualPaidTuition = payments
      .filter(p => p.studentId === selectedStudent.id && p.type === PaymentType.TUITION)
      .reduce((acc, p) => acc + Number(p.amount), 0);
    const tuitionDue = Math.max(0, totalExpectedTuition - actualPaidTuition);

    // Exam Calculation
    const totalExpectedExam = examFeeConfigs.reduce((acc, ex) => acc + (ex.fees[selectedStudent.className] || 0), 0);
    const actualPaidExam = payments
      .filter(p => p.studentId === selectedStudent.id && p.type === PaymentType.EXAM)
      .reduce((acc, p) => acc + Number(p.amount), 0);
    const examDue = Math.max(0, totalExpectedExam - actualPaidExam);

    const totalDue = tuitionDue + examDue;
    const history = payments
      .filter(p => p.studentId === selectedStudent.id)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return { 
      due: totalDue, 
      tuitionDue,
      examDue,
      actualPaidTuition, 
      actualPaidExam,
      totalExpectedTuition, 
      totalExpectedExam,
      monthlyFee, 
      transportFee, 
      totalMonthly, 
      history 
    };
  }, [selectedStudent, payments, classConfigs, examFeeConfigs]);

  const handlePrintReceipt = (payment: Payment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>মানি রিসিট - ${selectedStudent?.name}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .receipt { border: 3px solid #064e3b; padding: 40px; border-radius: 30px; max-width: 500px; margin: auto; position: relative; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .school-name { font-size: 26px; font-weight: 900; color: #064e3b; margin: 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
            .total { font-size: 24px; font-weight: 900; color: #064e3b; padding-top: 20px; border-top: 3px double #064e3b; margin-top: 20px; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
            .stamp { position: absolute; bottom: 80px; right: 40px; opacity: 0.1; transform: rotate(-15deg); font-weight: bold; border: 4px solid #064e3b; padding: 10px; border-radius: 10px; font-size: 20px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="receipt">
            <div class="header">
              <p class="school-name">আন-নূর একাডেমি</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: bold; color: #666; letter-spacing: 2px;">অফিস কপি / ছাত্র কপি</p>
            </div>
            <div class="row"><span>তারিখ:</span> <b>${payment.date}</b></div>
            <div class="row"><span>আইডি নম্বর:</span> <b>${selectedStudent?.id}</b></div>
            <div class="row"><span>ছাত্রের নাম:</span> <b>${selectedStudent?.name}</b></div>
            <div class="row"><span>শ্রেণী ও রোল:</span> <b>${selectedStudent?.className} (রোল: ${selectedStudent?.roll})</b></div>
            <div class="row"><span>পেমেন্টের ধরন:</span> <b>${payment.type} ${payment.month ? `(${payment.month})` : ''}${payment.examName ? `(${payment.examName})` : ''}</b></div>
            <div class="row total"><span>মোট জমা:</span> <b>৳${payment.amount}</b></div>
            <div class="stamp">PAID</div>
            <div style="display: flex; justify-content: space-between; margin-top: 60px;">
               <div style="text-align: center;"><div style="border-top: 1px solid #333; width: 100px; margin-bottom: 5px;"></div>স্বাক্ষর (অফিস)</div>
               <div style="text-align: center;"><div style="border-top: 1px solid #333; width: 100px; margin-bottom: 5px;"></div>স্বাক্ষর (অভিভাবক)</div>
            </div>
            <div class="footer">বড়বাড়িয়া আন-নূর একাডেমি - আপনার শিশুর উজ্জ্বল ভবিষ্যৎ</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <mark key={i} className="bg-emerald-400/30 text-emerald-950 font-bold px-0.5 rounded-sm">{part}</mark> : part
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[85vh]">
      
      {/* Google-Style Search Sidebar */}
      <div className="w-full lg:w-[440px] flex flex-col gap-6 shrink-0">
        <div className="bg-white p-7 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 space-y-6">
          <div className="relative group">
            <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchTerm ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
              <Search size={22} />
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="আইডি, রোল বা নাম দিয়ে খুঁজুন..."
              className="w-full pl-16 pr-14 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-emerald-500/40 focus:bg-white text-base text-slate-900 font-bold transition-all shadow-inner placeholder:text-slate-300 placeholder:font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-500 rounded-full transition-all active:scale-90"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
             <div className="flex items-center justify-center p-2 bg-slate-100 rounded-full text-slate-400"><Filter size={14} /></div>
             {['সব', ...Object.values(StudentClass)].map(cls => (
               <button 
                 key={cls}
                 onClick={() => setSelectedClass(cls)}
                 className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                   selectedClass === cls ? 'bg-[#064e3b] text-white border-transparent shadow-xl translate-y-[-2px]' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
                 }`}
               >
                 {cls}
               </button>
             ))}
          </div>
        </div>
        
        {/* Results List */}
        <div className="flex-1 bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden flex flex-col max-h-[70vh]">
          <div className="px-7 py-5 bg-slate-50/80 border-b border-emerald-50 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">রেজাল্ট: {filteredStudents.length} জন</span>
             </div>
          </div>
          
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {filteredStudents.length > 0 ? filteredStudents.map(s => {
              const brief = getStudentBriefStats(s);
              const isActive = selectedStudent?.id === s.id;
              return (
                <button 
                  key={s.id} 
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full px-7 py-5 text-left border-b border-slate-50/80 last:border-0 transition-all flex items-center gap-5 group relative ${
                    isActive ? 'bg-[#064e3b] text-white' : 'hover:bg-emerald-50/40'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-base transition-all duration-300 ${
                    isActive ? 'bg-white/20 rotate-6 scale-110 shadow-lg' : s.status === 'x' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                  }`}>
                    {s.roll}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm md:text-base truncate leading-tight">
                      <HighlightText text={s.name} highlight={searchTerm} />
                    </p>
                    <p className={`text-[10px] md:text-[11px] uppercase font-bold truncate mt-1 flex items-center gap-1.5 ${isActive ? 'text-emerald-300/80' : 'text-slate-400'}`}>
                       <span>{s.className}</span>
                       <span className="opacity-30">•</span>
                       <span className="font-mono tracking-tighter"><HighlightText text={s.id} highlight={searchTerm} /></span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                     {s.status === 'x' ? (
                       <span className="text-[9px] font-black bg-rose-500/20 text-rose-500 px-2.5 py-1.5 rounded-lg uppercase border border-rose-500/10">অব্যাহতি</span>
                     ) : brief.isPaid ? (
                       <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-emerald-50 text-emerald-500'}`}>
                          <CheckCircle size={20} />
                       </div>
                     ) : (
                       <div className="flex flex-col items-end">
                          <p className={`text-sm font-black ${isActive ? 'text-white' : 'text-rose-600'}`}>৳{brief.due}</p>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-rose-400'}`}>বকেয়া</p>
                       </div>
                     )}
                  </div>
                </button>
              );
            }) : (
              <div className="p-24 text-center space-y-5">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-100">
                  <Search size={36} className="text-slate-200" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-400 text-base">কোন ছাত্র পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-300 font-bold">আইডি বা নাম পুনরায় চেক করুন</p>
                </div>
                <button onClick={() => {setSearchTerm(''); setSelectedClass('সব');}} className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black hover:bg-emerald-100 transition-all active:scale-95">সার্চ রিসেট করুন</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Detail Section */}
      <div className="flex-1 space-y-8">
        {selectedStudent && studentDetailedData ? (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-8">
            
            {/* Ultra Modern Status Header */}
            <div className={`relative overflow-hidden p-10 md:p-16 rounded-[4rem] shadow-2xl transition-all duration-500 border-4 ${
              selectedStudent.status === 'x' ? 'bg-slate-900 border-slate-700' : studentDetailedData.due > 0 ? 'bg-rose-600 border-rose-400/30' : 'bg-[#064e3b] border-emerald-400/30'
            } text-white`}>
               <div className="absolute right-[-20px] top-[-20px] p-10 opacity-10 pointer-events-none rotate-12">
                  {studentDetailedData.due > 0 ? <AlertTriangle size={240} /> : <CheckCircle size={240} />}
               </div>

               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-6 text-center md:text-left">
                     <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl">
                           {selectedStudent.status === 'x' ? <ShieldAlert size={40} /> : studentDetailedData.due > 0 ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                        </div>
                        <div>
                           <h4 className="text-4xl font-black tracking-tight leading-tight">
                             {selectedStudent.status === 'x' ? 'নিষ্ক্রিয় ছাত্র (OUT)' : studentDetailedData.due > 0 ? 'পেমেন্ট বকেয়া রয়েছে' : 'সকল বকেয়া পরিশোধিত'}
                           </h4>
                           <p className="text-white/60 text-[12px] font-black uppercase tracking-[0.4em] mt-2">অ্যাকাউন্ট স্ট্যাটাস রিপোর্ট</p>
                        </div>
                     </div>
                     <div className="flex gap-3 flex-wrap justify-center md:justify-start">
                        {selectedStudent.status === 'z' && <span className="px-5 py-2 bg-amber-500 border border-amber-400 text-white rounded-full text-[11px] font-black uppercase shadow-lg">Special Case (Z)</span>}
                        {selectedStudent.status === 'p' && <span className="px-5 py-2 bg-blue-500 border border-blue-400 text-white rounded-full text-[11px] font-black uppercase shadow-lg">পাস আউট (P)</span>}
                        <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest">{selectedStudent.className}</span>
                     </div>
                  </div>

                  <div className="text-center md:text-right space-y-1">
                     <div className="flex items-center justify-center md:justify-end gap-3 text-white/50 mb-1">
                        <Wallet size={18} />
                        <span className="text-[11px] font-black uppercase tracking-widest">মোট বকেয়া (বেতন+পরিক্ষা)</span>
                     </div>
                     <p className="text-7xl md:text-9xl font-black tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">৳{studentDetailedData.due}</p>
                  </div>
               </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 space-y-10 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><User size={20} /></div>
                        <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">ছাত্রের প্রোফাইল তথ্য</h3>
                     </div>
                     <Info size={18} className="text-slate-200" />
                  </div>
                  <div className="space-y-8">
                    <DetailItem icon={<User size={16}/>} label="নাম" value={selectedStudent.name} />
                    <DetailItem icon={<Fingerprint size={16}/>} label="আইডি নম্বর" value={selectedStudent.id} />
                    <DetailItem icon={<Hash size={16}/>} label="রোল ও শ্রেণী" value={`রোল: ${selectedStudent.roll} | ${selectedStudent.className}`} />
                    {Number(selectedStudent.transportFee) > 0 && <DetailItem icon={<Truck size={16}/>} label="মাসিক গাড়ি ভাড়া" value={`৳${selectedStudent.transportFee}`} isSpecial />}
                  </div>
               </div>

               <div className="bg-white p-10 rounded-[3.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 space-y-10 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><CreditCard size={20} /></div>
                        <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">বকেয়ার বিস্তারিত বিবরণ</h3>
                     </div>
                     <HistoryIcon size={18} className="text-slate-200" />
                  </div>
                  <div className="bg-slate-50/70 p-8 rounded-[3rem] border border-slate-100/50 space-y-6 shadow-inner">
                     <div className="flex justify-between items-center text-base font-bold">
                        <span className="text-slate-400">বেতন বকেয়া:</span>
                        <span className="text-slate-900 font-black">৳{studentDetailedData.tuitionDue}</span>
                     </div>
                     <div className="flex justify-between items-center text-base font-bold">
                        <span className="text-slate-400">পরিক্ষার ফি বকেয়া:</span>
                        <span className="text-amber-600 font-black">৳{studentDetailedData.examDue}</span>
                     </div>
                     <div className="h-px bg-slate-200/50 my-2"></div>
                     <div className="flex justify-between items-center text-2xl font-black">
                        <span className="text-slate-800">সর্বমোট বকেয়া:</span>
                        <span className="text-emerald-700">৳{studentDetailedData.due}</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center px-6">
                     <span className="text-[12px] font-black text-emerald-600/40 uppercase tracking-widest">মোট জমা হয়েছে</span>
                     <span className="text-3xl font-black text-emerald-600">৳{studentDetailedData.actualPaidTuition + studentDetailedData.actualPaidExam}</span>
                  </div>
               </div>
            </div>

            {/* History Records Table */}
            <div className="bg-white p-10 rounded-[4rem] shadow-xl shadow-emerald-900/5 border border-emerald-50">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-inner"><HistoryIcon size={24} /></div>
                     লেনদেন ইতিহাস
                  </h3>
                  <div className="bg-emerald-50 px-5 py-2 rounded-full text-[11px] font-black text-emerald-600 uppercase tracking-widest">মোট {studentDetailedData.history.length} টি রেকর্ড</div>
               </div>
               
               <div className="space-y-5">
                  {studentDetailedData.history.map((p) => (
                    <div key={p.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50/40 rounded-[2.5rem] border border-transparent hover:border-emerald-200 hover:bg-white transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                             <Wallet size={24} />
                          </div>
                          <div>
                             <p className="font-black text-base text-slate-900 flex items-center gap-2">
                                {p.type} {p.month && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md">({p.month})</span>}{p.examName && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-md">({p.examName})</span>}
                             </p>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                   <Calendar size={10}/> {p.date}
                                </span>
                                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">•</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">রিসিভার: {p.receivedBy}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                          <p className="font-black text-3xl text-[#064e3b]">৳{p.amount}</p>
                          <button 
                            onClick={() => handlePrintReceipt(p)}
                            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all active:scale-90"
                            title="রসিদ ডাউনলোড করুন"
                          >
                             <Printer size={20} />
                          </button>
                       </div>
                    </div>
                  ))}
                  {studentDetailedData.history.length === 0 && (
                    <div className="text-center py-24 text-slate-300 italic text-sm font-bold opacity-30 flex flex-col items-center gap-5">
                       <HistoryIcon size={64} className="animate-pulse" />
                       <p className="text-lg tracking-widest">এখনও কোনো পেমেন্ট রেকর্ড নেই</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[600px] bg-white rounded-[5rem] border-4 border-dashed border-emerald-50/50 flex flex-col items-center justify-center text-center p-16">
             <div className="w-32 h-32 bg-emerald-50 rounded-[3.5rem] flex items-center justify-center text-emerald-200 mb-10 animate-bounce duration-[3s]">
                <Search size={64} />
             </div>
             <h4 className="text-3xl font-black text-slate-800 mb-5 tracking-tight">অ্যাকাউন্ট চেক করার জন্য ছাত্র নির্বাচন করুন</h4>
             <p className="text-slate-400 text-base max-w-sm font-bold leading-relaxed">বামে থাকা সার্চ বারে নাম, আইডি বা রোল লিখে সার্চ করুন এবং কাঙ্ক্ষিত ছাত্রটির ওপর ক্লিক করুন।</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isSpecial }: { icon: React.ReactNode; label: string; value: string; isSpecial?: boolean }) => (
  <div className="flex items-center gap-6 group">
     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSpecial ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600 group-hover:scale-110'}`}>
        {icon}
     </div>
     <div className="min-w-0">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{label}</p>
        <p className={`font-black text-xl truncate ${isSpecial ? 'text-amber-800' : 'text-slate-900'}`}>{value}</p>
     </div>
  </div>
);

const Calendar = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const Truck = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);

export default StudentSearch;
