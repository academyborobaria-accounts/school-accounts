
import React, { useState } from 'react';
import { Save, Wallet, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { FinanceRecord, FinanceType, ExpenseCategory } from '../types';

interface FinanceProps {
  onAdd: (record: FinanceRecord) => void;
}

const FinanceManager: React.FC<FinanceProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: FinanceType.INCOME,
    category: 'অন্যান্য',
    date: new Date().toISOString().split('T')[0]
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const record: FinanceRecord = {
      id: `F${Date.now()}`,
      title: formData.title,
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      notedBy: 'Admin'
    };

    onAdd(record);
    setShowSuccess(true);
    setFormData({ ...formData, title: '', amount: '' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <div className={`p-8 text-white flex items-center justify-between transition-colors ${formData.type === FinanceType.INCOME ? 'bg-emerald-700' : 'bg-rose-700'}`}>
          <div>
            <h2 className="text-2xl font-bold">স্কুল আয় ও ব্যয় ডায়েরি</h2>
            <p className="text-white/70 text-sm">প্রতিদিনের সকল আর্থিক হিসাব এখানে রেকর্ড করুন।</p>
          </div>
          <Wallet className="w-12 h-12 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="flex gap-4 mb-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: FinanceType.INCOME})}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.type === FinanceType.INCOME ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
            >
              <TrendingUp size={18} /> আয় (Income)
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, type: FinanceType.EXPENSE})}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${formData.type === FinanceType.EXPENSE ? 'bg-rose-50 border-rose-600 text-rose-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
            >
              <TrendingDown size={18} /> ব্যয় (Expense)
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">বিবরণ (কিসের জন্য)</label>
            <input 
              type="text"
              placeholder="যেমন: ইলেকট্রিক বিল, অনুদান, বই বিক্রয়..."
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100"
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
                className={`w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-xl font-bold ${formData.type === FinanceType.INCOME ? 'text-emerald-700' : 'text-rose-700'}`}
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-2">ক্যাটাগরি</label>
              <select 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {formData.type === FinanceType.EXPENSE ? 
                  Object.values(ExpenseCategory).map(c => <option key={c} value={c}>{c}</option>) :
                  ['অনুদান', 'ফি সংগ্রহ', 'বই বিক্রয়', 'অন্যান্য'].map(c => <option key={c} value={c}>{c}</option>)
                }
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-5 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${formData.type === FinanceType.INCOME ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
          >
            <Save /> {formData.type === FinanceType.INCOME ? 'আয় হিসেবে সেভ করুন' : 'ব্যয় হিসেবে সেভ করুন'}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom">
          <CheckCircle /> তথ্য সফলভাবে সংরক্ষিত হয়েছে।
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
