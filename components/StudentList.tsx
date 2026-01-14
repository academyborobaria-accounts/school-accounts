
import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, 
  Database, 
  Users, 
  Star, 
  XCircle, 
  Truck, 
  Search, 
  X, 
  UserPlus,
  Filter
} from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  isSyncing: boolean;
  onRefresh: () => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, isSyncing, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;

    return students.filter(s => 
      (s.name || '').toLowerCase().includes(term) || 
      (s.id || '').toLowerCase().includes(term) || 
      String(s.roll || '').toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <mark key={i} className="bg-blue-100 text-blue-900 font-bold px-0.5 rounded-sm">{part}</mark> : part
        )}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Stats */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Database size={28} />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-gray-800">অনলাইন ছাত্র ডাটাবেজ</h3>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Raw Sheet (A,B,C,D,Y,Z) সিনক্রোনাইজড</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-right hidden sm:block mr-2">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">মোট রেজিস্টার্ড</p>
            <p className="text-2xl font-black text-blue-600 leading-none mt-1">{students.length} <span className="text-xs">জন</span></p>
          </div>
          <button 
            onClick={onRefresh}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#064e3b] text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-900/10 hover:bg-emerald-900 active:scale-95 transition-all"
          >
            <RefreshCw className={isSyncing ? 'animate-spin' : ''} size={18} />
            শিট রিফ্রেশ করুন
          </button>
        </div>
      </div>

      {/* Database Search & Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden flex flex-col">
        
        {/* Search Bar - Real-time */}
        <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center bg-slate-50/30">
           <div className="relative flex-1 w-full group">
              <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-blue-500' : 'text-slate-300'}`} size={20} />
              <input 
                type="text"
                placeholder="নাম, আইডি বা রোল দিয়ে ডাটাবেজ ফিল্টার করুন..."
                className="w-full pl-16 pr-14 py-5 bg-white border-2 border-transparent rounded-[1.8rem] outline-none focus:border-blue-500/20 text-base text-slate-900 font-bold transition-all shadow-sm placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all active:scale-90"
                >
                  <X size={14} />
                </button>
              )}
           </div>
           
           <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-100 text-slate-400">
              <Filter size={16} />
              <span className="text-xs font-black uppercase tracking-widest">ফিল্টার্ড: {filteredStudents.length}</span>
           </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100/50 text-slate-400 text-left">
                <th className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] rounded-tl-[3rem]">রোল নম্বর</th>
                <th className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em]">ছাত্রের নাম ও স্ট্যাটাস</th>
                <th className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em]">শ্রেণী</th>
                <th className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em]">অতিরিক্ত সুবিধা</th>
                <th className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-right rounded-tr-[3rem]">ডিজিটাল আইডি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map(s => (
                <tr key={s.id} className={`group transition-all ${s.status === 'x' ? 'bg-rose-50/40 hover:bg-rose-50/60' : 'hover:bg-blue-50/30'}`}>
                  <td className="py-5 px-8">
                     <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm transition-all group-hover:scale-110 ${
                       s.status === 'x' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg'
                     }`}>
                        <HighlightText text={String(s.roll)} highlight={searchTerm} />
                     </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className={`font-black text-base ${s.status === 'x' ? 'text-rose-700/60 line-through decoration-2' : 'text-slate-800'}`}>
                          <HighlightText text={s.name} highlight={searchTerm} />
                        </span>
                        <div className="flex gap-1.5 mt-1">
                          {s.status === 'z' && <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-amber-200">Special</span>}
                          {s.status === 'p' && <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-blue-200">Promoted</span>}
                          {s.status === 'x' && <span className="bg-rose-600 text-white text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest shadow-sm">নিষ্ক্রিয় (OUT)</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      s.status === 'x' ? 'bg-white text-rose-400 border-rose-100' : 'bg-white text-emerald-600 border-emerald-100'
                    }`}>
                      {s.className}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-wrap gap-2">
                      {Number(s.transportFee) > 0 ? (
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${
                          s.status === 'x' ? 'text-slate-400 border-slate-100' : 'text-amber-700 bg-amber-50 border-amber-100'
                        }`}>
                          <Truck size={14} className={s.status === 'x' ? 'opacity-30' : ''} /> ৳{s.transportFee}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold italic">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                     <p className={`font-mono text-[11px] font-black tracking-tight ${s.status === 'x' ? 'text-slate-300' : 'text-slate-400'}`}>
                        <HighlightText text={s.id} highlight={searchTerm} />
                     </p>
                  </td>
                </tr>
              ))}
              
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-6 text-slate-300 animate-in fade-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                         <Search size={40} className="opacity-20" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xl font-black text-slate-400 tracking-tight">কোন ডাটা খুঁজে পাওয়া যায়নি</p>
                         <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">সার্চ টার্মটি পুনরায় চেক করুন</p>
                      </div>
                      <button onClick={() => setSearchTerm('')} className="text-blue-600 font-black text-xs hover:underline uppercase tracking-widest">সার্চ রিসেট করুন</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center md:justify-end gap-6">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">অ্যাক্টিভ প্রোফাইল</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">আউট প্রোফাইল</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
