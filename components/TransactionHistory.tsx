
import React, { useMemo } from 'react';
import { Payment, Student, FinanceRecord, FinanceType, PaymentType } from '../types';
import { FileText, Filter, Calendar, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface TransactionHistoryProps {
  payments: Payment[];
  financeRecords: FinanceRecord[];
  students: Student[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ payments, financeRecords, students }) => {
  // Merge and sort all transactions
  const allTransactions = useMemo(() => {
    const studentTxs = payments.map(p => ({
      id: p.id,
      date: p.date,
      amount: p.amount,
      title: students.find(s => s.id === p.studentId)?.name || 'Unknown Student',
      subtitle: `${p.type}${p.month ? ` (${p.month})` : ''}`,
      category: 'Student Fee',
      type: 'INCOME', // Student payments are always income
      raw: p
    }));

    const financeTxs = financeRecords.map(f => ({
      id: f.id,
      date: f.date,
      amount: f.amount,
      title: f.title,
      subtitle: f.category,
      category: f.category,
      type: f.type === FinanceType.INCOME ? 'INCOME' : 'EXPENSE',
      raw: f
    }));

    return [...studentTxs, ...financeTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, financeRecords, students]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><FileText className="w-6 h-6" /></div>
           <div>
              <h3 className="text-2xl font-black text-gray-800">লেনদেনের সার্বিক খাতা</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">সকল আয় ও ব্যয়ের সমন্বিত তালিকা</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 border border-slate-100 bg-slate-50 rounded-2xl text-xs font-black text-slate-500 hover:bg-white hover:shadow-md transition-all">
            <Filter className="w-4 h-4" /> ফিল্টার
          </button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-left">
              <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest rounded-l-3xl">তারিখ</th>
              <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest">বিবরণ (কার থেকে/কি বাবদ)</th>
              <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest">ধরন ও বিভাগ</th>
              <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-right rounded-r-3xl">টাকার পরিমাণ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="py-6 px-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-black text-slate-500">{tx.date}</span>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {tx.type === 'INCOME' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800">{tx.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {tx.type === 'INCOME' ? 'আয় (CREDIT)' : 'ব্যয় (DEBIT)'}
                  </span>
                </td>
                <td className={`py-6 px-6 text-right font-black text-lg transition-transform origin-right group-hover:scale-105 ${
                  tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {tx.type === 'INCOME' ? '+' : '-'}৳{tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allTransactions.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center gap-4 opacity-30">
            <Wallet size={48} />
            <p className="italic font-bold">এখনও কোন লেনদেন রেকর্ড করা হয়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
