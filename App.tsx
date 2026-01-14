
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Search, 
  PlusCircle,
  BrainCircuit,
  School,
  GraduationCap,
  Menu,
  RefreshCw,
  Users,
  WalletCards,
  Database,
  WifiOff,
  Wifi,
  Landmark,
  UserCheck,
  Receipt
} from 'lucide-react';
import { Student, Payment, StudentClass, PaymentType, ClassConfig, ExamFeeConfig, FinanceRecord, FinanceType, Teacher } from './types';
import Dashboard from './components/Dashboard';
import StudentSearch from './components/StudentSearch';
import PaymentEntry from './components/PaymentEntry';
import TransactionHistory from './components/TransactionHistory';
import GoogleSettings from './components/GoogleSettings';
import GeminiAssistant from './components/GeminiAssistant';
import StudentList from './components/StudentList';
import FinanceManager from './components/FinanceManager';
import TeacherManager from './components/TeacherManager';
import FeeStructure from './components/FeeStructure';

const STORAGE_KEYS = {
  STUDENTS: 'annur_students',
  PAYMENTS: 'annur_payments',
  FINANCE: 'annur_finance',
  CONFIGS: 'annur_configs',
  EXAM_CONFIGS: 'annur_exam_configs',
  TEACHERS: 'annur_teachers',
  URL_RAW_STUDENTS: 'annur_url_raw',
  URL_PAYMENTS: 'annur_url_payments',
  URL_FINANCE: 'annur_url_finance',
  LAST_SYNC: 'annur_last_sync_time'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'list' | 'entry' | 'search' | 'history' | 'settings' | 'finance' | 'teachers' | 'fees'>('dashboard');
  
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]'));
  const [payments, setPayments] = useState<Payment[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]'));
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.FINANCE) || '[]'));
  const [classConfigs, setClassConfigs] = useState<ClassConfig[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIGS) || '[]'));
  const [examFeeConfigs, setExamFeeConfigs] = useState<ExamFeeConfig[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAM_CONFIGS) || '[]'));
  const [teachers, setTeachers] = useState<Teacher[]>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHERS) || '[]'));
  
  const [urls, setUrls] = useState({
    rawStudents: localStorage.getItem(STORAGE_KEYS.URL_RAW_STUDENTS) || '',
    payments: localStorage.getItem(STORAGE_KEYS.URL_PAYMENTS) || '',
    finance: localStorage.getItem(STORAGE_KEYS.URL_FINANCE) || ''
  });

  const [lastSyncTime, setLastSyncTime] = useState(() => localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'কখনো নয়');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(financeRecords));
    localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(classConfigs));
    localStorage.setItem(STORAGE_KEYS.EXAM_CONFIGS, JSON.stringify(examFeeConfigs));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    localStorage.setItem(STORAGE_KEYS.URL_RAW_STUDENTS, urls.rawStudents);
    localStorage.setItem(STORAGE_KEYS.URL_PAYMENTS, urls.payments);
    localStorage.setItem(STORAGE_KEYS.URL_FINANCE, urls.finance);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastSyncTime);
  }, [students, payments, financeRecords, classConfigs, examFeeConfigs, teachers, urls, lastSyncTime]);

  const refreshBaseData = useCallback(async () => {
    if (!isOnline) {
      alert("আপনি অফলাইনে আছেন! ডাটা সিঙ্ক করতে ইন্টারনেট অন করুন।");
      return;
    }
    if (!urls.rawStudents) {
      alert("সেটিংস থেকে ১ নম্বর ছাত্র তালিকার লিংক সেট করুন।");
      return;
    }
    
    setIsSyncing(true);
    try {
      const response = await fetch(`${urls.rawStudents}?action=getBaseData`);
      if (!response.ok) throw new Error("গুগল সার্ভার থেকে ভুল রেসপন্স এসেছে।");
      
      const data = await response.json();
      if (data.students) setStudents(data.students);
      if (data.configs) setClassConfigs(data.configs);
      if (data.examFees) setExamFeeConfigs(data.examFees);
      if (data.teachers) setTeachers(data.teachers);
      setLastSyncTime(new Date().toLocaleTimeString('bn-BD'));
    } catch (error: any) {
      alert("নেটওয়ার্ক এরর! কানেকশন চেক করুন।");
    } finally {
      setIsSyncing(false);
    }
  }, [urls.rawStudents, isOnline]);

  const validateLink = async (url: string) => {
    if (!isOnline) return { success: false, message: 'আপনার ইন্টারনেট কানেকশন নেই। ' };
    if (!url) return { success: false, message: 'লিংক খালি রাখা যাবে না। ' };
    try {
      const res = await fetch(`${url}?action=validate`, { cache: 'no-store' });
      const data = await res.json();
      if (data.status === "OK") return { success: true, message: `সাফল্য! "${data.foundTab}" ট্যাবটি পাওয়া গেছে।` };
      return { success: false, message: data.error || 'ট্যাব পাওয়া যায়নি। ' };
    } catch (e: any) {
      return { success: false, message: 'নেটওয়ার্ক এরর!' };
    }
  };

  const handleAddPayment = async (p: any) => {
    const newPayment = { ...p, id: `PAY-${Date.now()}` };
    setPayments(prev => [...prev, newPayment]);
    if (urls.payments && isOnline) {
      try {
        await fetch(urls.payments, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPayment)
        });
      } catch (e) { console.error("Sync failed", e); }
    }
  };

  const handleAddFinance = async (rec: FinanceRecord) => {
    setFinanceRecords(prev => [...prev, rec]);
    if (urls.finance && isOnline) {
      try {
        await fetch(urls.finance, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rec)
        });
      } catch (e) { console.error("Sync failed", e); }
    }
  };

  const stats = useMemo(() => {
    const studentPaymentsTotal = payments.reduce((acc, p) => acc + Number(p.amount), 0);
    const otherIncomeTotal = financeRecords
      .filter(r => r.type === FinanceType.INCOME)
      .reduce((acc, r) => acc + Number(r.amount), 0);
    const totalCollection = studentPaymentsTotal + otherIncomeTotal;
    const totalExpense = financeRecords
      .filter(r => r.type === FinanceType.EXPENSE)
      .reduce((acc, r) => acc + Number(r.amount), 0);

    // Calculate Global Debt (বকেয়া)
    let totalDue = 0;
    const monthsPassed = new Date().getMonth() + 1;

    students.forEach(student => {
      if (student.status === 'x') return; // Skip inactive students

      // 1. Tuition expected
      const config = classConfigs.find(c => c.className === student.className);
      const monthlyFee = config?.monthlyFee || 0;
      const transportFee = Number(student.transportFee) || 0;
      const totalExpectedTuition = monthsPassed * (monthlyFee + transportFee);
      
      const paidTuition = payments
        .filter(p => p.studentId === student.id && p.type === PaymentType.TUITION)
        .reduce((acc, p) => acc + Number(p.amount), 0);
      
      totalDue += Math.max(0, totalExpectedTuition - paidTuition);

      // 2. Exam fees expected (All exams in config)
      const totalExpectedExam = examFeeConfigs.reduce((acc, ex) => acc + (ex.fees[student.className] || 0), 0);
      const paidExam = payments
        .filter(p => p.studentId === student.id && p.type === PaymentType.EXAM)
        .reduce((acc, p) => acc + Number(p.amount), 0);

      totalDue += Math.max(0, totalExpectedExam - paidExam);
    });

    return { 
      totalCollection, 
      totalExpense, 
      totalDue,
      studentFees: studentPaymentsTotal,
      otherIncome: otherIncomeTotal,
      studentCount: students.length, 
      balance: totalCollection - totalExpense 
    };
  }, [payments, financeRecords, students, classConfigs, examFeeConfigs]);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-['Hind_Siliguri'] overflow-hidden select-none">
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 bg-rose-600 text-white py-2 text-center text-[12px] font-black z-[200] flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-300">
          <WifiOff size={16} className="animate-pulse" /> ইন্টারনেট কানেকশন বিচ্ছিন্ন! অ্যাপ এখন অফলাইন মোডে চলছে।
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-[#064e3b] text-white flex flex-col shadow-2xl transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col items-center border-b border-emerald-800/50 bg-[#065f46]">
          <div className="bg-emerald-700 p-4 rounded-3xl mb-4 shadow-inner group"><School className="w-8 h-8 group-hover:rotate-12 transition-transform" /></div>
          <h1 className="text-xl font-bold text-emerald-50 text-center leading-tight">বড়বাড়িয়া আন-নূর একাডেমি</h1>
          <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-black">ডিজিটাল অ্যাকাউন্টস</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="ড্যাশবোর্ড" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Landmark size={18} />} label="একাউন্টস (হিসাব)" active={activeTab === 'accounts'} onClick={() => { setActiveTab('accounts'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Database size={18} />} label="ছাত্র ডাটাবেজ" active={activeTab === 'list'} onClick={() => { setActiveTab('list'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Receipt size={18} />} label="ফি কাঠামো" active={activeTab === 'fees'} onClick={() => { setActiveTab('fees'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<PlusCircle size={18} />} label="ছাত্র ফি এন্ট্রি" active={activeTab === 'entry'} onClick={() => { setActiveTab('entry'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<UserCheck size={18} />} label="শিক্ষক ও বেতন" active={activeTab === 'teachers'} onClick={() => { setActiveTab('teachers'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<WalletCards size={18} />} label="অন্যান্য আয়-ব্যয়" active={activeTab === 'finance'} onClick={() => { setActiveTab('finance'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<Search size={18} />} label="বকেয়া ও রিপোর্ট" active={activeTab === 'search'} onClick={() => { setActiveTab('search'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={<History size={18} />} label="লেনদেন ইতিহাস" active={activeTab === 'history'} onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }} />
          <div className="pt-6 border-t border-emerald-800/40 mt-6">
            <SidebarItem icon={<Settings size={18} />} label="সেটিংস ও গাইড" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} />
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <header className={`bg-white h-20 shadow-sm px-6 flex items-center justify-between border-b border-emerald-100 shrink-0 z-50 transition-all ${!isOnline ? 'mt-8 md:mt-10' : ''}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-emerald-700 bg-emerald-50 rounded-xl"><Menu /></button>
            <div className="flex flex-col">
               <h2 className="text-lg md:text-2xl font-black text-[#064e3b] flex items-center gap-3">
                {activeTab === 'dashboard' && 'ড্যাশবোর্ড'}
                {activeTab === 'accounts' && 'একাউন্টস (হিসাব)'}
                {activeTab === 'list' && 'ছাত্র তালিকা'}
                {activeTab === 'finance' && 'আয়-ব্যয় ডায়েরি'}
                {activeTab === 'entry' && 'ছাত্র ফি সংগ্রহ'}
                {activeTab === 'search' && 'বকেয়া ও রিপোর্ট'}
                {activeTab === 'history' && 'লেনদেন ইতিহাস'}
                {activeTab === 'settings' && 'ক্লাউড সেটিংস'}
                {activeTab === 'teachers' && 'শিক্ষক ও বেতন ব্যবস্থাপনা'}
                {activeTab === 'fees' && 'ফি কাঠামো (বর্তমান বছর)'}
                
                <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                   <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                   {isOnline ? 'অনলাইন' : 'অফলাইন'}
                </span>
              </h2>
            </div>
          </div>
          <button onClick={refreshBaseData} className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2">
            <span className="hidden md:inline text-xs font-black uppercase tracking-widest">সিঙ্ক করুন</span>
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-24 lg:pb-8">
            {(activeTab === 'dashboard' || activeTab === 'accounts') && (
              <Dashboard 
                stats={stats}
                payments={payments} 
                expenses={financeRecords
                  .filter(r => r.type === FinanceType.EXPENSE)
                  .map(r => ({ id: r.id, title: r.title, amount: r.amount, type: r.category, date: r.date, notedBy: r.notedBy }))
                } 
                urls={urls}
                onNavigateToSettings={() => setActiveTab('settings')}
              />
            )}
            {activeTab === 'list' && <StudentList students={students} isSyncing={isSyncing} onRefresh={refreshBaseData} />}
            {activeTab === 'finance' && <FinanceManager onAdd={handleAddFinance} />}
            {activeTab === 'entry' && <PaymentEntry students={students} examFeeConfigs={examFeeConfigs} classConfigs={classConfigs} onAdd={handleAddPayment} />}
            {activeTab === 'fees' && <FeeStructure classConfigs={classConfigs} examFeeConfigs={examFeeConfigs} />}
            {activeTab === 'search' && <StudentSearch students={students} payments={payments} classConfigs={classConfigs} examFeeConfigs={examFeeConfigs} />}
            {activeTab === 'teachers' && <TeacherManager teachers={teachers} financeRecords={financeRecords} onAddSalary={handleAddFinance} />}
            {activeTab === 'history' && <TransactionHistory payments={payments} financeRecords={financeRecords} students={students} />}
            {activeTab === 'settings' && <GoogleSettings urls={urls} onUpdateUrls={setUrls} onValidate={validateLink} />}
          </div>
        </div>

        <button onClick={() => setShowAiAssistant(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-[#064e3b] text-white rounded-2xl shadow-2xl flex items-center justify-center z-[100] border-2 border-emerald-400/30 hover:scale-110 transition-transform active:scale-95 group">
          <BrainCircuit size={28} className="group-hover:rotate-12 transition-transform" />
        </button>
      </main>

      {showAiAssistant && (
        <GeminiAssistant 
          onClose={() => setShowAiAssistant(false)} 
          payments={payments} 
          students={students} 
          classConfigs={classConfigs} 
          examFeeConfigs={examFeeConfigs}
        />
      )}
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${active ? 'bg-emerald-600 text-white shadow-xl translate-x-1' : 'text-emerald-100/70 hover:bg-emerald-800/40 hover:text-white hover:translate-x-1'}`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default App;
