
import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Wallet, 
  History, 
  PlusCircle, 
  X, 
  Search, 
  TrendingDown, 
  AlertCircle,
  Save,
  CheckCircle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Teacher, FinanceRecord, FinanceType, ExpenseCategory } from '../types';

interface TeacherManagerProps {
  teachers: Teacher[];
  financeRecords: FinanceRecord[];
  onAddSalary: (record: any) => void;
}

const TeacherManager: React.FC<TeacherManagerProps> = ({ teachers, financeRecords, onAddSalary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter running and former teachers
  const runningTeachers = useMemo(() => 
    teachers.filter(t => !t.status && t.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [teachers, searchTerm]);

  const formerTeachers = useMemo(() => 
    teachers.filter(t => t.status === 'x' && t.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [teachers, searchTerm]);

  // Salary history for a teacher
  const getTeacherHistory = (name: string) => {
    return financeRecords.filter(r => 
      r.type === FinanceType.EXPENSE && 
      r.category === ExpenseCategory.STAFF_SALARY && 
      r.title.includes(name)
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handlePaySalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !amount) return;

    const record = {
      id: `T-SAL-${Date.now()}`,
      title: `${selectedTeacher.name} - বেতন (${month || 'চলতি মাস'})`,
      amount: Number(amount),
      type: FinanceType.EXPENSE,
      category: ExpenseCategory.STAFF_SALARY,
      date: new Date().toISOString().split('T')[0],
      notedBy: 'Accountant'
    };

    onAddSalary(record);
    setShowSuccess(true);
    setAmount('');
    setMonth('');
    setTimeout(() => {
      setShowSuccess(false);
      setShowSalaryForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
           <input 
             type="text"
             placeholder="শিক্ষকের নাম দিয়ে খুঁজুন..."
             className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500/20 focus:bg-white font-bold text-slate-800 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Running Teachers List */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden flex flex-col">
          <div className="p-7 bg-emerald-50/50 border-b border-emerald-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg"><UserCheck size={20}/></div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">রানিং শিক্ষকবৃন্দ</h3>
             </div>
             <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">{runningTeachers.length} জন</span>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[500px] custom-scrollbar">
             {runningTeachers.map(t => (
               <button 
                key={t.name}
                onClick={() => { setSelectedTeacher(t); setShowSalaryForm(false); }}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-emerald-50 transition-all group ${selectedTeacher?.name === t.name ? 'bg-emerald-50' : ''}`}
               >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                       <Wallet size={20}/>
                    </div>
                    <div>
                       <p className="font-black text-slate-800">{t.name}</p>
                       <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">সক্রিয় শিক্ষক</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-slate-200 group-hover:translate-x-1 transition-transform" />
               </button>
             ))}
             {runningTeachers.length === 0 && <div className="p-20 text-center text-slate-300 italic">কোন শিক্ষক পাওয়া যায়নি</div>}
          </div>
        </div>

        {/* Red List (Former Teachers) */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-rose-900/5 border border-rose-50 overflow-hidden flex flex-col">
          <div className="p-7 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg"><ShieldAlert size={20}/></div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">সাবেক শিক্ষক (Red List)</h3>
             </div>
             <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-3 py-1 rounded-full">{formerTeachers.length} জন</span>
          </div>
          <div className="divide-y divide-rose-50 overflow-y-auto max-h-[500px] custom-scrollbar">
             {formerTeachers.map(t => (
               <button 
                key={t.name}
                onClick={() => { setSelectedTeacher(t); setShowSalaryForm(false); }}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-rose-50 transition-all group ${selectedTeacher?.name === t.name ? 'bg-rose-50' : ''}`}
               >
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center opacity-70">
                       <History size={20}/>
                    </div>
                    <div>
                       <p className="font-black text-rose-700/60 line-through decoration-rose-200">{t.name}</p>
                       <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">অব্যাহতিপ্রাপ্ত</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-rose-200" />
               </button>
             ))}
             {formerTeachers.length === 0 && <div className="p-20 text-center text-slate-200 italic">সাবেক তালিকায় কেউ নেই</div>}
          </div>
        </div>
      </div>

      {/* Teacher Detail View (Modal Style but integrated) */}
      {selectedTeacher && (
        <div className="animate-in fade-in zoom-in duration-500 bg-white rounded-[3.5rem] border-4 border-emerald-100 shadow-2xl overflow-hidden mt-12">
          <div className={`p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white ${selectedTeacher.status === 'x' ? 'bg-slate-900' : 'bg-emerald-900'}`}>
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20">
                   <UserCheck size={40} />
                </div>
                <div>
                   <h2 className="text-3xl font-black">{selectedTeacher.name}</h2>
                   <p className="text-white/60 font-black uppercase tracking-widest text-[12px] mt-1">
                      {selectedTeacher.status === 'x' ? 'অব্যাহতিপ্রাপ্ত শিক্ষক (রেকর্ড শুধুমাত্র)' : 'বেতন ও লেনদেন প্রোফাইল'}
                   </p>
                </div>
             </div>
             
             {!selectedTeacher.status && (
                <button 
                  onClick={() => setShowSalaryForm(!showSalaryForm)}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl transition-all active:scale-95"
                >
                   {showSalaryForm ? <X size={20} /> : <PlusCircle size={20} />}
                   {showSalaryForm ? 'বাতিল করুন' : 'নতুন বেতন প্রদান'}
                </button>
             )}
          </div>

          <div className="p-10">
            {showSalaryForm ? (
               <form onSubmit={handlePaySalary} className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">বেতনের মাস</label>
                        <input 
                           type="text"
                           placeholder="যেমন: জানুয়ারি ২০২৪"
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500/20 text-base font-bold text-slate-900"
                           value={month}
                           onChange={(e) => setMonth(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">টাকার পরিমাণ</label>
                        <input 
                           type="number"
                           placeholder="0.00"
                           className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500/20 text-2xl font-black text-emerald-700"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           required
                        />
                     </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                     <Save size={22} /> বেতন সংরক্ষণ করুন
                  </button>
                  {showSuccess && (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold animate-pulse">
                       <CheckCircle size={18} /> সফলভাবে সেভ হয়েছে!
                    </div>
                  )}
               </form>
            ) : (
               <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <History size={16} /> পূর্ববর্তী বেতনের ইতিহাস
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                     {getTeacherHistory(selectedTeacher.name).map((rec, idx) => (
                       <div key={rec.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-emerald-200 hover:bg-white transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                                <TrendingDown size={18} />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800 text-sm leading-tight">{rec.title.split('-')[1]?.trim() || 'বেতন'}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">{rec.date}</p>
                             </div>
                          </div>
                          <p className="text-xl font-black text-slate-900">৳{rec.amount}</p>
                       </div>
                     ))}
                     {getTeacherHistory(selectedTeacher.name).length === 0 && (
                       <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300 gap-3 border-2 border-dashed border-slate-50 rounded-[3rem]">
                          <AlertCircle size={40} className="opacity-20" />
                          <p className="font-bold text-sm">কোনো লেনদেন রেকর্ড পাওয়া যায়নি</p>
                       </div>
                     )}
                  </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManager;
