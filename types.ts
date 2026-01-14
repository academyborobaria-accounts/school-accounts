
export enum StudentClass {
  PLAY = 'প্লে',
  NURSERY = 'নার্সারি',
  ONE = 'প্রথম',
  TWO = 'দ্বিতীয়',
  THREE = 'তৃতীয়',
  FOUR = 'চতুর্থ',
  FIVE = 'পঞ্চম'
}

export enum PaymentType {
  TUITION = 'বেতন (Tuition)',
  SESSION = 'সেশন ফি',
  EXAM = 'পরিক্ষার ফি',
  BOOKS = 'বইয়ের টাকা',
  OTHERS = 'অন্যান্য'
}

export enum FinanceType {
  INCOME = 'আয় (Income)',
  EXPENSE = 'ব্যয় (Expense)'
}

export enum ExpenseCategory {
  STAFF_SALARY = 'শিক্ষক-কর্মচারী বেতন',
  UTILITY = 'বিদ্যুৎ/পানি বিল',
  RENT = 'ভাড়া',
  STATIONARY = 'স্টেশনারি',
  MAINTENANCE = 'মেরামত',
  OTHERS = 'অন্যান্য'
}

export { ExpenseCategory as ExpenseType };

export interface ClassConfig {
  className: StudentClass | string;
  monthlyFee: number;
}

export interface ExamFeeConfig {
  examName: string;
  fees: Record<string, number>; // Mapping class name to fee
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: PaymentType;
  date: string;
  month?: string;
  examName?: string;
  receivedBy: string;
}

export interface FinanceRecord {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  category: string;
  date: string;
  notedBy: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  notedBy: string;
}

export interface AttendanceRecord {
  date: string;
  class: StudentClass;
  presentIds: string[];
}

export interface Teacher {
  name: string;
  status: string;
}

export interface Student {
  id: string; 
  roll: string; 
  name: string; 
  className: StudentClass; 
  fatherName: string;
  phone: string;
  totalPaid: number;
  admissionDate?: string;
  transportFee?: number; 
  status?: 'z' | 'p' | 'x' | string; 
}

export interface RawDataResponse {
  students: Student[];
  configs: ClassConfig[];
  teachers: Teacher[];
  examFees: ExamFeeConfig[];
}
