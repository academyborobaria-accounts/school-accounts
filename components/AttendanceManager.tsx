
import React, { useState, useMemo } from 'react';
import { CalendarCheck, Save, Users, CheckSquare, Square } from 'lucide-react';
import { Student, AttendanceRecord, StudentClass } from '../types';

interface AttendanceProps {
  students: Student[];
  records: AttendanceRecord[];
  onSave: (record: AttendanceRecord) => void;
}

const AttendanceManager: React.FC<AttendanceProps> = ({ students, records, onSave }) => {
  const [selectedClass, setSelectedClass] = useState<StudentClass>(StudentClass.PLAY);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentIds, setPresentIds] = useState<string[]>([]);

  const filteredStudents = useMemo(() => 
    students.filter(s => s.className === selectedClass).sort((a, b) => Number(a.roll) - Number(b.roll)),
    [students, selectedClass]
  );

  const toggleAttendance = (id: string) => {
    setPresentIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = () => {
    onSave({
      date,
      class: selectedClass,
      presentIds
    });
    alert('হাজিরা সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex items-center gap-4 mr-auto">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CalendarCheck /></div>
          <div>
            <h3 className="text-xl font-bold">দৈনিক হাজিরা</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase">উপস্থিতি নিশ্চিত করুন</p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:w-40 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm"
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value as StudentClass); setPresentIds([]); }}
          >
            {Object.values(StudentClass).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="date"
            className="flex-1 md:w-48 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center">
          <p className="text-sm font-bold text-emerald-800">{selectedClass} শ্রেণী - {filteredStudents.length} জন ছাত্র</p>
          <p className="text-sm font-bold text-emerald-600">উপস্থিত: {presentIds.length}</p>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(s => (
            <button 
              key={s.id}
              onClick={() => toggleAttendance(s.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${presentIds.includes(s.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-100 text-gray-700 hover:border-emerald-300'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${presentIds.includes(s.id) ? 'bg-white/20' : 'bg-gray-100'}`}>
                {s.roll}
              </div>
              <span className="font-bold flex-1 text-left truncate">{s.name}</span>
              {presentIds.includes(s.id) ? <CheckSquare /> : <Square className="opacity-20" />}
            </button>
          ))}
          {filteredStudents.length === 0 && <p className="col-span-full text-center py-20 text-gray-400 italic">এই শ্রেণীতে কোন ছাত্র নেই</p>}
        </div>

        <div className="p-8 border-t border-emerald-50">
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-[#064e3b] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Save className="w-5 h-5" /> হাজিরা সাবমিট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;
