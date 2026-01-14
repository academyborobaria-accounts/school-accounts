
import React from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Wallet, 
  Users, 
  TrendingDown, 
  Landmark, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  History as HistoryIcon,
  Banknote,
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import { Payment, Expense } from '../types';

interface DashboardProps {
  stats: { 
    totalCollection: number; 
    totalExpense: number; 
    totalDue: number;
    studentFees: number;
    otherIncome: number;
    studentCount: number; 
    balance: number 
  };
  payments: Payment[];
  expenses: Expense[];
  urls: { rawStudents: string; payments: string; finance: string };
  onNavigateToSettings: () => void;
}

const COLORS = ['#059669', '#f43f5e', '#fbbf24', '#3b82f6'];

const Dashboard: React.FC<DashboardProps> = ({ stats, payments, expenses, urls, onNavigateToSettings }) => {
  const missingLinks = [];
  if (!urls.rawStudents) missingLinks.push("ছাত্র ডাটাবেজ");
  if (!urls.payments) missingLinks.push("ফি এন্ট্রি সিঙ্ক");
  if (!urls.finance) missingLinks.push("আয়-ব্যয় ডায়েরি");

  const summaryData = [
    { name: 'আয় (Income)', value: stats.totalCollection },
    { name: 'ব্যয় (Expense)', value: stats.totalExpense }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Main Stats Header */}
      <section className="relative overflow-hidden bg-[#064e3b] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border-4 border-emerald-400/20">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Landmark size={200} />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg"><Landmark size={20} /></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">স্কুল একাউন্টস সামারি</h3>
               </div>
               <h2 className="text-4xl md:text-7xl font-black">৳{stats.balance}</h2>
               <p className="text-emerald-200/60 font-bold text-sm">হাতে নগদ (Cash in Hand)</p>
               
               <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                    <GraduationCap size={14} className="text-emerald-400" />
                    <span className="text-[11px] font-bold">ছাত্র ফি: ৳{stats.studentFees}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                    <TrendingUp size={14} className="text-blue-400" />
                    <span className="text-[11px] font-bold">অন্যান্য আয়: ৳{stats.otherIncome}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-2">
                  <TrendingUp className="text-emerald-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/70">মোট সংগ্রহ</p>
                  <p className="text-xl font-black">৳{stats.totalCollection}</p>
               </div>
               <div className="bg-rose-500/20 backdrop-blur-md p-6 rounded-3xl border border-rose-500/20 flex flex-col items-center gap-2">
                  <AlertTriangle className="text-rose-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-200/70">মোট বকেয়া (বেতন+পরিক্ষা)</p>
                  <p className="text-xl font-black text-rose-300">৳{stats.totalDue}</p>
               </div>
            </div>
         </div>

         {missingLinks.length > 0 && (
           <div onClick={onNavigateToSettings} className="mt-8 bg-amber-500/20 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-500/30 transition-all">
              <div className="flex items-center gap-3">
                 <AlertCircle size={18} className="text-amber-400" />
                 <p className="text-[11px] font-bold text-amber-100">সিঙ্ক করতে লিংক সেটআপ করুন ({missingLinks.length}টি বাকি)</p>
              </div>
              <ArrowRight size={14} />
           </div>
         )}
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="মোট আয়" value={`৳${stats.totalCollection}`} icon={<TrendingUp className="text-emerald-600" />} color="bg-emerald-50" trend="ছাত্র ফি + অন্যান্য" />
        <StatCard title="মোট ব্যয়" value={`৳${stats.totalExpense}`} icon={<TrendingDown className="text-rose-600" />} color="bg-rose-50" trend="স্কুল খরচসমূহ" />
        <StatCard title="মোট শিক্ষার্থী" value={`${stats.studentCount} জন`} icon={<Users className="text-blue-600" />} color="bg-blue-50" trend="অধ্যয়নরত" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-slate-800">আয় বনাম ব্যয় বিশ্লেষণ</h3>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                <CreditCard size={14} /> রিপোর্ট
             </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summaryData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {summaryData.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} cornerRadius={4} />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-emerald-50/50 rounded-2xl flex items-center gap-3 border border-emerald-100">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div> 
              <div>
                 <p className="text-[10px] font-black text-emerald-600/60 uppercase">আয়</p>
                 <p className="text-sm font-black text-emerald-700">{Math.round((stats.totalCollection / (stats.totalCollection + stats.totalExpense || 1)) * 100)}%</p>
              </div>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-2xl flex items-center gap-3 border border-rose-100">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> 
              <div>
                 <p className="text-[10px] font-black text-rose-600/60 uppercase">ব্যয়</p>
                 <p className="text-sm font-black text-rose-700">{Math.round((stats.totalExpense / (stats.totalCollection + stats.totalExpense || 1)) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 hover:shadow-xl transition-all flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-slate-800">সাম্প্রতিক ব্যয়সমূহ</h3>
             <HistoryIcon size={18} className="text-slate-300" />
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar max-h-72">
            {expenses.slice(-5).reverse().map(e => (
              <div key={e.id} className="flex justify-between items-center p-5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-rose-100 hover:bg-white transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{e.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{e.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-rose-600">-৳{e.amount}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{e.date}</p>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-3">
                  <HistoryIcon size={40} className="opacity-20" />
                  <p className="italic text-sm">কোন ব্যয় রেকর্ড করা হয়নি</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-50 hover:shadow-lg transition-all flex flex-col gap-6">
    <div className={`w-14 h-14 ${color} rounded-[1.5rem] flex items-center justify-center shadow-inner`}>{icon}</div>
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-800">{value}</p>
    </div>
    <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
       <span className="text-[10px] font-bold text-emerald-600/70">{trend}</span>
    </div>
  </div>
);

export default Dashboard;
