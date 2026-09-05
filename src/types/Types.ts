
import type { ReactNode } from "react";

 type Role = "admin" | "doctor" | "receptionist" ;

export type PropsButton = {
    text: string;
    onClick: () => void;
};


export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
    children: ReactNode;
    footer:ReactNode;
};


export interface IApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: string;
};


// ======= //
export type AlertProps = {
    title: string,
    confirm: () => void,
    onClose: () => void,
};

export type medicalHistory = {
    hasBloodPressure: boolean,
    hasDiabetes:boolean,
    hasSensitive:boolean,
    otherNotes: string,
};

export type DataPatient = {
    createdAt?:string ,
    dentalChart:[],
    gender: 'Male' | 'Female',
    isActive:boolean,
    medicalHistory: medicalHistory,
    name: string,
    doctor: string,
    patientCode: string,
    phone:string ,
    updatedAt:string ,
    otherNotes: string,
    _id: string
};

export type Patient = {
    patients: DataPatient[],
}

type PatientData = {
    page: number,
    count: number,
    patients: DataPatient[],
};
export type PatientProps = {
    data: PatientData,
    status: boolean,
    count: number
};



export interface createPatientProps {
    _id?: string,
   name: string ,
   doctor: string ,
   phone: string, 
   gender: string, 
   patientCode?: string,
   otherNotes: string,
   hasDiabetes: boolean,
   hasBloodPressure: boolean,
   hasSensitive: boolean,
};

// ========== employees ========== //
export interface employee {
    _id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    phone: string,
    isActive?: boolean,
    createdAt?: string,
    updatedAt?: string,
};

export interface EmpluyeeData {
  count: number,
  data: employee[],
  status: boolean
}

export interface EmpluyeeDataVerifySession {
  message: string,
  user: employee,
  status: boolean
}

export interface EmployeeData {
    _id?: string,
    name: string,
    email: string,
    password: string,
    role:  string,
    phone: string,
};

// ================== Appointment ================= //


type patientData = {
    _id: string,
    name: string,
    doctor: string,
    patientCode: string,
    gender: "Male" | "Female"
};
export interface AppointmentProps {
       _id: string,
        patientId: patientData, 
        appointmentDate: string, 
        plannedProcedure: string,
        durationMinutes: number,
        status: 'Pending' | 'Completed' | 'Cancelled' | 'no-show',
        notes: string, 
        createdBy: string,
        createdAt: string;
        updatedAt: string;
};


export interface AppointmentData {
    status: boolean,
    data: AppointmentProps[],
    message: string
};


export interface AppointmentForm {
    id?: string,
    doctorId: string,
    patientCode: string,
    durationMinutes: string,
    appointmentDate: string,
    plannedProcedure: string,
    notes: string
};
export type AppointmentStatus = "Pending" | "Completed" | "Cancelled" | "no-show";

export interface AppointmentStatusDropdownProps {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}

// =================== MedicalRecordStore =================== //
type doctorDataMedicalRecord = {
    _id: string,
    name: string
};


type patientDataMedicalRecord = {
    _id: string,
    name: string,
    patientCode: string,
    gender: 'Male' | 'Female'
};

export type teethTreated = {
     _id?: string,
     toothNumber: number,
     procedure: 'Consultation' | 'Cleaning' | 'Filling' | 'Root-Canal-Session' | 'Extraction' | "",
     newToothCondition: 'Healthy' | 'Caries' | 'Filled' | 'Missing' | 'Crown' | 'Root-Canal' | "",
     cost: number,
};

export interface MedicalRecord {
   _id: string,
   doctorId: doctorDataMedicalRecord,
   patientId: patientDataMedicalRecord,
   appointmentId: string,
   totalCost: number,
   teethTreated: teethTreated[],
   updatedAt: string,
   createdAt: string,
};


export interface MedicalRecordData {
    status: boolean,
    data: MedicalRecord[],
    message: string,
    count: number,
};

export interface createMedicalRecord {
   patientId: string,
   appointmentId: string,
   treatmentStatus: 'No-Action' | 'In-Progress' | 'Completed' | '',
   nextSessionTimeframe: 'ASAP' | 'Within-1-Week' | 'Within-2-Weeks' | 'Within-1-Month' | 'Not-Required' | "",
   notes: string,
};


// =================== invoices ====================== //
type patientDataInvoices = {
    _id: string,
    name: string,
    patientCode: string,
};


type appointmentIdDataInvoices = {
    id_: string,
    plannedProcedure: 'Consultation' | 'Cleaning' | 'Filling' | 'Root-Canal-Session' | 'Extraction',
    createdAt?: string,
};

export interface InvoicesData {
    _id: string,
    balance: number,
    doctorId: string,
    patientId: patientDataInvoices,
    medicalRecordId: string,
    appointmentId: appointmentIdDataInvoices,
    paymentStatus: 'Paid' | 'Partially Paid' | 'Unpaid',
    totalAmount: number,
    createdAt: string,
    updatedAt: string,
};

export interface InvoicesProps {
    status: boolean,
    data: InvoicesData[],
    message: string,
    count: number,
};

export interface InvoicesPatientIdProps {
    status: boolean,
    data: InvoicesData,
    message: string,
    count: number,
};

// ===================== Transaction =================== //

interface TransactionData {
    _id: string,
    amountPaid: string,
    cashierId: string,
    invoiceId: string,
    notes: string,
    patientId: patientDataInvoices,
    paymentMethod: string,
    createdAt: string,
    updatedAt: string,
};
export interface TransactionProps {
    status: string,
    data: TransactionData[],
    message: string,
    count: number
};


export interface CreateTransaction {
    invoiceId: string,
    patientId: string,
    amountPaid: number,
    paymentMethod: string,
    notes: string
};


//  ==================== analytics ================  //


interface Period {
    startDate: string,
    endDate: string,
};

interface analyticsData {
    doctors: number,
    period: Period,
    newPatientsInPeriod: number,
    patients: number,
    appointments: number,
    appointmentToday: AppointmentProps[],
    receptionists:number, 
    totalCollected:number, 
    totalInvoicesCount:number, 
    totalOutstanding:number, 
    totalRevenue:number, 
    totalTransactionsCount: number,
};

export interface analyitcs {
    status: boolean,
    data: analyticsData,
    message: string,
};


// ============== analytice chart ================ //

export interface GroupId {
  year: number;
  month: number;
};

interface AppointmentGroup {
  _id: GroupId;
  totalAppointments: number;
};

interface MedicalRecordGroup {
  _id: GroupId;
  totalMedicalRecords: number;
};

interface InvoiceGroup {
  _id: GroupId;
  totalInvoicesCount: number;
  totalRevenue: number;
  totalBalance: number;
};

interface PatientGroup {
  _id: GroupId;
  totalPatients: number;
};

interface TransactionGroup {
  _id: GroupId;
  totalTransactions: number;
};

export interface AnalyticsResponse {
  appointments: AppointmentGroup[];
  medicalRecords: MedicalRecordGroup[];
  invoices: InvoiceGroup[];
  patients: PatientGroup[];
  transactions: TransactionGroup[];
};

export interface MergedEntry {
  year: number;
  month: number;
  appointments: number;
  medicalRecords: number;
  invoices: number;
  revenue: number;
  balance: number;
  patients: number;
  transactions: number;
};

export interface ChartPeriodData {
  period: string;
  appointments: number;
  medicalRecords: number;
  invoices: number;
};

export interface AnalyticsResponseData {
  status: boolean,
  data: AnalyticsResponse,
  message: string
};

export interface ChartResponseData {
    appointments?: number,
    balance?: number,
    invoices?: number,
    medicalRecords?: number,
    patients?: number,
    period?: string,
    revenue?: number,
    transactions?: number,
};
export interface ChartResponse {
    chartData: ChartResponseData[]
};



