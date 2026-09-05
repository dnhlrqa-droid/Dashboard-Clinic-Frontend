
import type { AnalyticsResponse, ChartPeriodData, GroupId, medicalHistory, MergedEntry } from "../types/Types";
import { ARABIC_MONTHS } from "./constants";





export function getInitials(name: string){
   return name
   .trim()
   .split(' ')
   .slice(0, 2)
   .map((part) => part[0]?.toUpperCase())
   .join('')
};



const CLINIC_FOUNDING_YEAR = 2026; 

export function getAvailableYears() {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let y = CLINIC_FOUNDING_YEAR; y <= currentYear; y++) {
    years.push(y);
  }
  const month = Array.from({length: 12}).map((_,i) => i + 1);

  return {years, month};
};

export function getDaysInMonth(year: number, month: number) {

  return new Date(year, month, 0).getDate();
};




export function transformAnalyticsToChartData(analytics: AnalyticsResponse): ChartPeriodData[] {
  const { appointments, invoices, medicalRecords, patients, transactions } = analytics;

  const merged = new Map<string, MergedEntry>();

  const getKey = (id: GroupId) => `${id.year}-${id.month}`;

  const ensureEntry = (id: GroupId): MergedEntry => {
    const key = getKey(id);
    if (!merged.has(key)) {
      merged.set(key, {
        year: id.year,
        month: id.month,
        appointments: 0,
        medicalRecords: 0,
        invoices: 0,
        revenue: 0,
        balance: 0,
        patients: 0,
        transactions: 0,
      });
    }
    return merged.get(key)!;
  };

  appointments.forEach((item) => {
    ensureEntry(item._id).appointments = item.totalAppointments;
  });

  medicalRecords.forEach((item) => {
    ensureEntry(item._id).medicalRecords = item.totalMedicalRecords;
  });

  invoices.forEach((item) => {
    const entry = ensureEntry(item._id);
    entry.invoices = item.totalInvoicesCount;
    entry.revenue = item.totalRevenue;
    entry.balance = item.totalBalance;
  });

  patients.forEach((item) => {
    ensureEntry(item._id).patients = item.totalPatients;
  });

  transactions.forEach((item) => {
    ensureEntry(item._id).transactions = item.totalTransactions;
  });

  const sorted = Array.from(merged.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return sorted.map((item) => ({
    period: ARABIC_MONTHS[item.month - 1],
    appointments: item.appointments,
    medicalRecords: item.medicalRecords,
    invoices: item.invoices,
    balance: item.balance,
    revenue: item.revenue,
    patients: item.patients,
    transactions: item.transactions,
  }));
};


export function getConditionTags(history: medicalHistory) {
  const tags: string[] = [];
  if (history.hasDiabetes) tags.push('drunken');
  if (history.hasBloodPressure) tags.push('Blood pressure');
  if (history.hasSensitive) tags.push('sensitive');
  return tags;
};
