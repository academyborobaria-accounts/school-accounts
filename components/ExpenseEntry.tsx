
import React, { useState } from 'react';
import { Save, WalletCards, ReceiptText, CheckCircle } from 'lucide-react';
import { Expense, ExpenseType } from '../types';

interface ExpenseEntryProps {
  onAdd: (expense: Expense) => void;
}

const ExpenseEntry: React.FC<ExpenseEntryProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: ExpenseType.STAFF_SALARY,
    date: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const newExpense: Expense = {
      id: `E${Date.now()}`,
      title: formData.title,
      amount: Number(formData.amount),
      type: formData.type,
      date: formData.date,
      notedBy: 'Admin'
    };

    onAdd(newExpense);
    setShowSuccess(true);
    setFormData({
      title: '',
      amount: '',
      type: ExpenseType.STAFF_SALARY,
      date: new Date().toISOString().split('T')[0]
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-rose-50">
        <div className="bg-rose-700 p-8 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">ব্যয় হিসাব (Expense)</h2>
            <p className="text-rose-200 text-sm">স্কুলের সকল খরচ এখানে এন্ট্রি করুন।</p>
          </div>
          <WalletCards className="w-12 h-12 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">খরচের বিবরণ</label>
            <input 
              type="text"
              placeholder="যেমন: জানু মাসের বেতন, বিদ্যুৎ বিল..."
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-100"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">টাকার পরিমাণ</label>
              <input 
                type="number"
                placeholder="0.00"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-xl font-bold text-rose-700"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">খরচের ধরন</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as ExpenseType})}
              >
                {/* Fixed mapping of ExpenseType to fix Key and ReactNode errors */}
                {(Object.values(ExpenseType) as string[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">তারিখ</label>
            <input 
              type="date"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold text-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-100"
          >
            <Save /> খরচ সেভ করুন
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom">
          <CheckCircle /> ব্যয়ের তথ্য সংরক্ষিত হয়েছে।
        </div>
      )}
    </div>
  );
};

export default ExpenseEntry;
