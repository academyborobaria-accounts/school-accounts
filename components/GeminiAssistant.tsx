
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrainCircuit, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Payment, Student, ClassConfig, ExamFeeConfig } from '../types';

interface GeminiAssistantProps {
  onClose: () => void;
  payments: Payment[];
  students: Student[];
  classConfigs: ClassConfig[];
  examFeeConfigs: ExamFeeConfig[];
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onClose, payments, students, classConfigs, examFeeConfigs }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'হ্যালো! আমি আপনার স্কুলের AI হিসাব রক্ষক সহকারী। আজ আপনাকে কোন তথ্য দিয়ে সাহায্য করতে পারি? যেমন: মোট সংগ্রহ কত? অথবা কার কত বকেয়া আছে?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        You are a school accounting assistant for 'বড়বাড়িয়া আন-নূর একাডেমি'. 
        Reference Data:
        Students: ${JSON.stringify(students.filter(s => s.status !== 'x'))}
        Payments: ${JSON.stringify(payments.slice(-50))}
        Class Tuition Fees: ${JSON.stringify(classConfigs)}
        Exam Fees Config: ${JSON.stringify(examFeeConfigs)}
        Current Month Index (1-12): ${new Date().getMonth() + 1}
        
        Calculation Logic:
        Debt = (Months passed * (Monthly Fee + Transport Fee)) + (All configured Exam Fees) - Total Payments.
        
        Answer correctly in Bengali about totals, individual debts, or summaries.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const aiResponse = response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।" }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-emerald-900 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI স্মার্ট সহকারী</h3>
              <p className="text-xs text-emerald-300">Gemini Powered Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-gray-100 flex gap-2">
                <div className="w-2 h-2 bg-emerald-200 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-3 bg-gray-50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => setInput("মোট সংগ্রহ কত?")} className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-full text-emerald-600 hover:border-emerald-300">মোট সংগ্রহ?</button>
          <button onClick={() => setInput("মোট বকেয়া রিপোর্ট দাও")} className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-full text-emerald-600 hover:border-emerald-300">বকেয়া রিপোর্ট</button>
          <button onClick={() => setInput("পরিক্ষার ফি কতটুকু বকেয়া আছে?")} className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-full text-emerald-600 hover:border-emerald-300">পরিক্ষার ফি বকেয়া</button>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
          <input 
            type="text"
            placeholder="আপনার প্রশ্ন এখানে লিখুন..."
            className="flex-1 bg-gray-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-gray-900"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 active:scale-95">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
