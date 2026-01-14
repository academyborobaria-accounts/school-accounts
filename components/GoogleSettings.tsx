
import React, { useState } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  Database, 
  FileSpreadsheet, 
  Wallet, 
  ListTodo, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Copy,
  Code,
  TableProperties,
  X,
  Settings2,
  Users,
  Coins,
  ClipboardList,
  BookmarkCheck,
  FileCode,
  Layout,
  Layers
} from 'lucide-react';

interface GoogleSettingsProps {
  urls: { rawStudents: string; payments: string; finance: string };
  onUpdateUrls: (urls: any) => void;
  onValidate: (url: string) => Promise<{ success: boolean; message: string }>;
}

const GoogleSettings: React.FC<GoogleSettingsProps> = ({ urls, onUpdateUrls, onValidate }) => {
  const [localUrls, setLocalUrls] = useState(urls);
  const [activeTab, setActiveTab] = useState<'links' | 'rules' | 'scripts'>('links');
  const [activeScript, setActiveScript] = useState<1 | 2 | 3>(1);
  const [validationStates, setValidationStates] = useState<any>({});
  const [isValidating, setIsValidating] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{title: string, desc: string} | null>(null);

  const handleSave = () => {
    onUpdateUrls(localUrls);
    alert('সেটিংস সফলভাবে সেভ করা হয়েছে!');
  };

  const handleCheckLink = async (key: string, url: string) => {
    if (!url) {
      setValidationStates({ ...validationStates, [key]: { success: false, message: 'আগে লিংকটি প্রবেশ করান।' } });
      return;
    }
    setIsValidating(key);
    const result = await onValidate(url);
    setValidationStates({ ...validationStates, [key]: result });
    setIsValidating(null);
  };

  const script1RawData = `function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (action == "validate") return ContentService.createTextOutput(JSON.stringify({status: "OK", foundTab: "RawData System"})).setMimeType(ContentService.MimeType.JSON);
  
  if (action == "getBaseData") {
    // 1. Students
    var studentSheet = ss.getSheetByName("Students");
    var students = [];
    if(studentSheet){
      var data = studentSheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if(!data[i][0] && !data[i][3]) continue; 
        students.push({ id: String(data[i][0] || ""), className: String(data[i][1] || ""), roll: String(data[i][2] || "0"), name: String(data[i][3] || ""), transportFee: Number(data[i][24] || 0), status: String(data[i][25] || "") });
      }
    }
    
    // 2. Multi-year Tuition Fees (বেতন ট্যাব)
    var tuitionSheet = ss.getSheetByName("বেতন");
    var tuitionConfigs = [];
    if(tuitionSheet){
      var tData = tuitionSheet.getDataRange().getValues();
      var currentYear = new Date().getFullYear();
      var yearIdx = -1;
      for(var c=1; c<tData[0].length; c++){ if(String(tData[0][c]).includes(currentYear)){ yearIdx = c; break; } }
      for(var j=1; j<tData.length; j++){
        if(!tData[j][0]) continue;
        tuitionConfigs.push({ className: tData[j][0], monthlyFee: Number(tData[j][yearIdx !== -1 ? yearIdx : 1] || 0) });
      }
    }

    // 3. Multi-year Exam Fees (পরিক্ষার ফি ট্যাব)
    var examFeeSheet = ss.getSheetByName("পরিক্ষার ফি");
    var examFeeConfigs = [];
    if(examFeeSheet){
      var eData = examFeeSheet.getDataRange().getValues();
      var currentYear = new Date().getFullYear();
      var yearIdx = -1;
      for(var c=1; c<eData[0].length; c++){ if(String(eData[0][c]).includes(currentYear)){ yearIdx = c; break; } }
      
      var classNames = ["প্লে", "নার্সারি", "প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ", "পঞ্চম"];
      for(var k=1; k<eData.length; k++){
        if(!eData[k][0]) continue;
        var feesString = String(eData[k][yearIdx !== -1 ? yearIdx : 1] || "");
        var feesArray = feesString.split(",").map(function(f){ return Number(f.trim()) || 0; });
        var classFees = {};
        for(var m=0; m<classNames.length; m++){ classFees[classNames[m]] = feesArray[m] || 0; }
        examFeeConfigs.push({ examName: eData[k][0], fees: classFees });
      }
    }

    // 4. Teachers
    var teacherSheet = ss.getSheetByName("Teachers");
    var teachers = [];
    if(teacherSheet){
      var teachersData = teacherSheet.getDataRange().getValues();
      for(var l=1; l<teachersData.length; l++){ if(!teachersData[l][0]) continue; teachers.push({ name: String(teachersData[l][0]), status: String(teachersData[l][1] || "") }); }
    }
    return ContentService.createTextOutput(JSON.stringify({students: students, configs: tuitionConfigs, examFees: examFeeConfigs, teachers: teachers})).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const script2Payments = `function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Payments");
  if (!sheet) return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.date, data.studentId, data.amount, data.type, data.month || data.examName || "", data.receivedBy]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`;

  const script3Finance = `function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Finance");
  if (!sheet) return ContentService.createTextOutput("Error").setMimeType(ContentService.MimeType.TEXT);
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.date, data.title, data.amount, data.type, data.category, data.notedBy]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`;

  const getActiveCode = () => {
    if (activeScript === 1) return script1RawData;
    if (activeScript === 2) return script2Payments;
    return script3Finance;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveCode());
    alert(`${activeScript} নম্বর স্ক্রিপ্ট কোড কপি হয়েছে!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 relative font-['Hind_Siliguri']">
      
      <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-emerald-100 gap-1 overflow-x-auto scrollbar-hide">
        <TabButton active={activeTab === 'links'} onClick={() => setActiveTab('links')} icon={<Cloud size={16} />} label="কানেকশন লিংক" />
        <TabButton active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} icon={<TableProperties size={16} />} label="শিট ও কলাম রুলস" />
        <TabButton active={activeTab === 'scripts'} onClick={() => setActiveTab('scripts')} icon={<Code size={16} />} label="গুগল স্ক্রিপ্ট" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-emerald-50 overflow-hidden min-h-[600px]">
        
        {activeTab === 'links' && (
          <div className="animate-in slide-in-from-left duration-300 p-8 space-y-10">
            <div className="bg-[#064e3b] text-white p-8 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Cloud /> কানেকশন লিংক সেটআপ</h3>
                    <p className="text-emerald-200 text-sm font-bold">৩টি আলাদা শিটের ৩টি আলাদা Web App URL এখানে দিন।</p>
                </div>
            </div>

            <UrlInputSection 
              id="raw"
              icon={<Database className="text-blue-500" />}
              label="১. Raw Data শিট লিংক (ছাত্র, শিক্ষক ও সকল ফি কাঠামো)"
              placeholder="Script 1: Web App URL..."
              value={localUrls.rawStudents}
              onChange={(val: string) => setLocalUrls({...localUrls, rawStudents: val})}
              onCheck={() => handleCheckLink('raw', localUrls.rawStudents)}
              isValidating={isValidating === 'raw'}
              status={validationStates['raw']}
              tabName="Main Data"
              tabColor="bg-blue-600"
            />
            
            <UrlInputSection 
              id="pay"
              icon={<FileSpreadsheet className="text-emerald-500" />}
              label="২. Payments শিট লিংক (ছাত্র বেতন)"
              placeholder="Script 2: Web App URL..."
              value={localUrls.payments}
              onChange={(val: string) => setLocalUrls({...localUrls, payments: val})}
              onCheck={() => handleCheckLink('pay', localUrls.payments)}
              isValidating={isValidating === 'pay'}
              status={validationStates['pay']}
              tabName="Payments"
              tabColor="bg-emerald-600"
            />

            <UrlInputSection 
              id="fin"
              icon={<Wallet className="text-amber-500" />}
              label="৩. Finance শিট লিংক (আয়-ব্যয়)"
              placeholder="Script 3: Web App URL..."
              value={localUrls.finance}
              onChange={(val: string) => setLocalUrls({...localUrls, finance: val})}
              onCheck={() => handleCheckLink('fin', localUrls.finance)}
              isValidating={isValidating === 'fin'}
              status={validationStates['fin']}
              tabName="Finance"
              tabColor="bg-amber-600"
            />

            <div className="pt-6">
              <button onClick={handleSave} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">
                <ShieldCheck /> সেটিংস সেভ করুন
              </button>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="p-8 md:p-12 animate-in slide-in-from-right duration-300 space-y-12">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><ListTodo /></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">শিট ও কলাম সেটআপ গাইড</h3>
                  <p className="text-xs text-slate-400 font-bold">প্রতিটি আইটেমে ক্লিক করলে বিস্তারিত নিয়ম দেখা যাবে।</p>
               </div>
            </div>

            <div className="space-y-16">
              
              {/* SHEET 1 CATEGORY */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full w-fit">
                  <Database size={18} className="text-blue-600" />
                  <span className="text-sm font-black text-blue-800 uppercase tracking-widest">শিট ১ (Raw Data) - Script 1 এর জন্য</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormatCard 
                    title="বাধ্যতামূলক ট্যাবের নামসমূহ" 
                    icon={<BookmarkCheck size={18} className="text-blue-600" />}
                    columns={[
                      {id: '১', name: 'Students', desc: 'এই ট্যাবে সকল ছাত্রের তথ্য থাকবে। বানান অবশ্যই "Students" হতে হবে।'}, 
                      {id: '২', name: 'বেতন', desc: 'এই ট্যাবে মাসিক টিউশন ফি এর চার্ট থাকবে। বানান অবশ্যই "বেতন" হতে হবে।'}, 
                      {id: '৩', name: 'পরিক্ষার ফি', desc: 'এই ট্যাবে পরিক্ষার ফি এর তালিকা থাকবে। বানান অবশ্যই "পরিক্ষার ফি" হতে হবে।'}, 
                      {id: '৪', name: 'Teachers', desc: 'এই ট্যাবে শিক্ষকদের তালিকা থাকবে। বানান অবশ্যই "Teachers" হতে হবে।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `ট্যাব নাম: ${col.name}`, desc: col.desc})}
                    themeColor="border-blue-100 bg-blue-50/10"
                  />

                  <FormatCard 
                    title="Students ট্যাবের কলাম নিয়ম" 
                    icon={<Users size={18} className="text-emerald-500" />}
                    columns={[
                      {id: 'A', name: 'ID', desc: 'ছাত্রের ইউনিক ডিজিটাল আইডি (যেমন: 101, 202)।'}, 
                      {id: 'B', name: 'Class', desc: 'ছাত্রের বর্তমান শ্রেণী (প্লে, নার্সারি, প্রথম...)।'}, 
                      {id: 'C', name: 'Roll', desc: 'ছাত্রের রোল নম্বর।'}, 
                      {id: 'D', name: 'Name', desc: 'ছাত্রের পূর্ণ নাম।'}, 
                      {id: 'Y', name: 'Transport Fee', desc: 'মাসিক গাড়ি ভাড়ার পরিমাণ (Y কলাম)।'}, 
                      {id: 'Z', name: 'Status', desc: 'x = আউট ছাত্র, z = স্পেশাল সুবিধাভোগী ছাত্র।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `কলাম ${col.id}: ${col.name}`, desc: col.desc})}
                    themeColor="border-emerald-100 bg-emerald-50/10"
                  />

                  <FormatCard 
                    title="বেতন ট্যাবের কলাম নিয়ম" 
                    icon={<Coins size={18} className="text-amber-500" />}
                    columns={[
                      {id: 'A', name: 'Class', desc: 'শ্রেণীর নাম।'}, 
                      {id: 'B', name: '২০২৬', desc: '২০২৬ সালের জন্য নির্ধারিত মাসিক টিউশন ফি।'}, 
                      {id: 'C', name: '২০২৭', desc: '২০২৭ সালের নির্ধারিত মাসিক টিউশন ফি।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `কলাম ${col.id}: ${col.name}`, desc: col.desc})}
                    themeColor="border-amber-100 bg-amber-50/10"
                  />

                  <FormatCard 
                    title="পরিক্ষার ফি ট্যাবের নিয়ম" 
                    icon={<ClipboardList size={18} className="text-purple-500" />}
                    columns={[
                      {id: 'A', name: 'Exam Name', desc: 'পরিক্ষার নাম (যেমন: ১ম সাময়িক)।'}, 
                      {id: 'B', name: '২০২৬ ফি', desc: '২০২৬ সালের জন্য কমা (,) দিয়ে ৭টি ক্লাসের ফি লিখুন। উদাহরণ: 10,20,30,40,50,60,70 (প্লে থেকে ৫ম)।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `পরিক্ষার ফি: ${col.name}`, desc: col.desc})}
                    themeColor="border-purple-100 bg-purple-50/10"
                  />
                </div>
              </div>

              {/* SHEET 2 CATEGORY */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full w-fit">
                  <FileSpreadsheet size={18} className="text-emerald-600" />
                  <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">শিট ২ (Payments) - Script 2 এর জন্য</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormatCard 
                    title="বাধ্যতামূলক ট্যাব ও কলাম" 
                    icon={<BookmarkCheck size={18} className="text-emerald-600" />}
                    columns={[
                      {id: '১', name: 'Payments', desc: 'শিট ২ এর ট্যাবের নাম অবশ্যই "Payments" হতে হবে।'}, 
                      {id: 'A', name: 'Date', desc: 'টাকা জমার তারিখ।'}, 
                      {id: 'B', name: 'Student ID', desc: 'ছাত্রের আইডি নম্বর।'}, 
                      {id: 'C', name: 'Amount', desc: 'টাকার পরিমাণ।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `শিট ২: ${col.name}`, desc: col.desc})}
                    themeColor="border-emerald-100 bg-emerald-50/10"
                  />
                </div>
              </div>

              {/* SHEET 3 CATEGORY */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-full w-fit">
                  <Wallet size={18} className="text-amber-600" />
                  <span className="text-sm font-black text-amber-800 uppercase tracking-widest">শিট ৩ (Finance) - Script 3 এর জন্য</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormatCard 
                    title="বাধ্যতামূলক ট্যাব ও কলাম" 
                    icon={<BookmarkCheck size={18} className="text-amber-600" />}
                    columns={[
                      {id: '১', name: 'Finance', desc: 'শিট ৩ এর ট্যাবের নাম অবশ্যই "Finance" হতে হবে।'}, 
                      {id: 'A', name: 'Date', desc: 'লেনদেনের তারিখ।'}, 
                      {id: 'B', name: 'Title', desc: 'বিবরণ (কিসের জন্য আয় বা ব্যয়)।'}, 
                      {id: 'C', name: 'Amount', desc: 'টাকার পরিমাণ।'}
                    ]}
                    onToggleTooltip={(col: any) => setActiveTooltip({title: `শিট ৩: ${col.name}`, desc: col.desc})}
                    themeColor="border-amber-100 bg-amber-50/10"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="animate-in slide-in-from-bottom duration-300 p-8 md:p-12 space-y-10">
            <div className="flex flex-col md:flex-row gap-4">
               <ScriptSelectBtn active={activeScript === 1} onClick={() => setActiveScript(1)} num="১" title="Raw Data" desc="তালিকা ও সকল ফি কাঠামো" />
               <ScriptSelectBtn active={activeScript === 2} onClick={() => setActiveScript(2)} num="২" title="Payments" desc="ছাত্র বেতন রেকর্ড" />
               <ScriptSelectBtn active={activeScript === 3} onClick={() => setActiveScript(3)} num="৩" title="Finance" desc="আয়-ব্যয় ও শিক্ষক" />
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Code size={28} /></div>
                  <div>
                     <h3 className="text-xl font-black text-emerald-900">স্ক্রিপ্ট {activeScript} কোড</h3>
                     <p className="text-emerald-700/60 text-sm font-bold">কোডটি কপি করে শিট নম্বর {activeScript}-এ পেস্ট করুন।</p>
                  </div>
               </div>
               <button onClick={copyToClipboard} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-700 shadow-xl transition-all active:scale-95">
                 <Copy size={20} /> কোড কপি করুন
               </button>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl max-h-[400px] overflow-y-auto custom-scrollbar">
               <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                  {getActiveCode()}
               </pre>
            </div>
          </div>
        )}
      </div>

      {activeTooltip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setActiveTooltip(null)}>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full border-4 border-emerald-500/20 relative animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
              <button onClick={() => setActiveTooltip(null)} className="absolute top-5 right-5 text-slate-300 hover:text-rose-500 transition-colors"><X size={24} /></button>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Info size={28} /></div>
              <h4 className="text-emerald-900 font-black text-xl mb-3">{activeTooltip.title}</h4>
              <p className="text-slate-600 text-sm font-bold leading-relaxed">{activeTooltip.desc}</p>
              <button onClick={() => setActiveTooltip(null)} className="mt-8 w-full py-4 bg-[#064e3b] text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">ঠিক আছে</button>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap ${active ? 'bg-[#064e3b] text-white shadow-lg scale-105 z-10' : 'text-slate-400 hover:bg-slate-50'}`}>{icon} {label}</button>
);

const ScriptSelectBtn = ({ active, onClick, num, title, desc }: any) => (
  <button onClick={onClick} className={`flex-1 p-6 rounded-[2rem] border-2 text-left transition-all ${active ? 'bg-emerald-50 border-emerald-500 shadow-lg' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
    <div className="flex items-center gap-3 mb-1">
       <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{num}</span>
       <h4 className={`font-black text-xs ${active ? 'text-emerald-900' : 'text-slate-600'}`}>{title}</h4>
    </div>
    <p className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{desc}</p>
  </button>
);

const FormatCard = ({ title, icon, columns, onToggleTooltip, themeColor }: any) => (
  <div className={`p-6 rounded-[2.5rem] border-2 shadow-sm transition-all hover:shadow-md ${themeColor}`}>
    <div className="flex items-center gap-3 border-b border-black/5 pb-3 mb-4">
       {icon}
       <p className="text-[12px] font-black text-slate-700 uppercase tracking-widest">{title}</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {columns.map((col: any) => (
        <button 
          key={col.id} 
          onClick={() => onToggleTooltip(col)}
          className="bg-white p-3 rounded-2xl border border-black/5 flex items-center gap-2 hover:border-black/20 hover:shadow-sm transition-all text-left group"
        >
           <span className="w-6 h-6 bg-slate-800 text-white text-[10px] font-black flex items-center justify-center rounded-lg shrink-0 group-hover:bg-black">{col.id}</span>
           <span className="text-[11px] font-bold text-slate-600 truncate">{col.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const UrlInputSection = ({ icon, label, placeholder, value, onChange, onCheck, isValidating, status, tabName, tabColor }: any) => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
      <label className="flex items-center gap-3 text-xs font-black text-slate-600 uppercase tracking-widest">{icon} {label}</label>
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full"><span className="text-[9px] font-black text-slate-400 uppercase">ফাইল:</span><span className={`${tabColor} text-white px-2 py-0.5 rounded text-[10px] font-black`}>{tabName}</span></div>
    </div>
    <div className="flex flex-col md:flex-row gap-3">
      <input type="text" placeholder={placeholder} className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs text-slate-900 font-bold placeholder:text-slate-300 transition-all shadow-inner" value={value} onChange={(e) => onChange(e.target.value)} />
      <button onClick={onCheck} disabled={isValidating} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50 shadow-lg">{isValidating ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} চেক</button>
    </div>
    {status && <div className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>{status.success ? <CheckCircle size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}<span>{status.message}</span></div>}
  </div>
);

export default GoogleSettings;
