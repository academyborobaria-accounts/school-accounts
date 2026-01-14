
import React from 'react';
import { 
  Coins, 
  ClipboardList, 
  ArrowRight, 
  School, 
  GraduationCap,
  Calendar,
  Banknote
} from 'lucide-react';
import { ClassConfig, ExamFeeConfig } from '../types';

interface FeeStructureProps {
  classConfigs: ClassConfig[];
  examFeeConfigs: ExamFeeConfig[];
}

const FeeStructure: React.FC<FeeStructureProps> = ({ classConfigs, examFeeConfigs }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Info */}
      <div className="bg-[#064e3b] p-10 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none rotate-12">
            <Coins size={200} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">ফি কাঠামো {currentYear}</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-3">সকল নির্ধারিত ফি তালিকা</h2>
               <p className="text-emerald-200/80 font-bold text-sm max-w-lg">বর্তমান বছরের জন্য নির্ধারিত মাসিক টিউশন ফি এবং পরিক্ষার ফি এর পূর্ণাঙ্গ তালিকা নিচে দেওয়া হলো।</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center">
                  <Calendar className="text-emerald-400 mb-2" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">বর্তমান বছর</p>
                  <p className="text-2xl font-black">{currentYear}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Tuition Fees Card */}
        <section className="bg-white rounded-[3.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-emerald-50/30">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Banknote size={28}/></div>
                <div>
                   <h3 className="text-xl font-black text-slate-800">মাসিক টিউশন ফি</h3>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">প্রতিটি শ্রেণীর জন্য নির্ধারিত</p>
                </div>
             </div>
             <div className="hidden sm:block">
                <School className="text-slate-100" size={40} />
             </div>
          </div>
          
          <div className="p-6 md:p-10 divide-y divide-slate-50">
             {classConfigs.length > 0 ? classConfigs.map((cfg) => (
               <div key={cfg.className} className="py-6 flex items-center justify-between group hover:bg-emerald-50/50 px-4 rounded-2xl transition-all">
                  <div className="flex items-center gap-5">
                     <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        {cfg.className.substring(0, 1)}
                     </div>
                     <span className="text-lg font-black text-slate-700">{cfg.className}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-2xl font-black text-emerald-700">৳{cfg.monthlyFee}</span>
                     <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
               </div>
             )) : (
               <div className="p-20 text-center text-slate-300 italic">কোন তথ্য পাওয়া যায়নি। সিঙ্ক করুন।</div>
             )}
          </div>
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={12}/> প্রতি মাসের ১০ তারিখের মধ্যে ফি পরিশোধ করতে হয়।
             </p>
          </div>
        </section>

        {/* Exam Fees Card */}
        <section className="bg-white rounded-[3.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-blue-50/30">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><ClipboardList size={28}/></div>
                <div>
                   <h3 className="text-xl font-black text-slate-800">পরীক্ষার ফি তালিকা</h3>
                   <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">শ্রেণী ভিত্তিক ফি কাঠামো</p>
                </div>
             </div>
             <div className="hidden sm:block">
                <GraduationCap className="text-slate-100" size={40} />
             </div>
          </div>

          <div className="p-6 md:p-10 space-y-8 overflow-y-auto max-h-[600px] custom-scrollbar">
             {examFeeConfigs.length > 0 ? examFeeConfigs.map((ex) => (
               <div key={ex.examName} className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h4 className="text-lg font-black text-blue-900">{ex.examName}</h4>
                     <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg">EXAM FEE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {Object.entries(ex.fees).map(([cls, fee]) => (
                       <div key={cls} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                          <span className="text-xs font-bold text-slate-500">{cls}</span>
                          <span className="text-base font-black text-slate-900">৳{fee}</span>
                       </div>
                     ))}
                  </div>
               </div>
             )) : (
               <div className="p-20 text-center text-slate-300 italic">কোন তথ্য পাওয়া যায়নি। সিঙ্ক করুন।</div>
             )}
          </div>
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={12}/> পরীক্ষার ৩ দিন আগে ফি পরিশোধ করা বাধ্যতামূলক।
             </p>
          </div>
        </section>

      </div>
    </div>
  );
};

const Info = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

export default FeeStructure;
