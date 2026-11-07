import type { AppointmentStatus } from "../types/Types";


// ==================== roles ====================
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONST: 'receptionist',
} as const;


// ==================== MONTHS ====================
export const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
] as const;




// ==================== Messages System ====================
export const MESSAGES = {
  // success
  SUCCESS_LOGIN: 'Logged in successfully.',
  SUCCESS_LOGOUT: 'Logged out successfully.',
  SUCCESS_CREATE_PATIENT: 'Patient successfully created.',
  SUCCESS_UPDATE_PATIENT: 'Patient data has been successfully updated.',
  SUCCESS_CREATE_APPOINTMENT: 'Appointment successfully created.',
  SUCCESS_UPDATE_APPOINTMENT: 'Appointment data has been successfully updated.',
  SUCCESS_UPDATE_APPOINTMENT_STATUS: 'Appointment status has been successfully updated.',
  SUCCESS_DELETE_PATIENT: 'The patient has been successfully deleted.',
  SUCCESS_CREATE_EMPLOYEE: 'The employee has been successfully added.',
  SUCCESS_UPDATE_EMPLOYEE: 'Employee data has been updated successfully.',
  SUCCESS_DELETE_EMPLOYEE: 'The employee has been successfully deleted.',
  SUCCESS_CREATE_MEDICAL_RECORD: 'created medical record successfully.',

  // errors

  ERROR_NETWORK: 'Network connection error',
  ERROR_SERVER: 'Server Error',
  ERROR_UNEXPECTED: 'An unexpected error occurred',
  ERROR_ENTER_INPUTS: 'Please enter the inputs!',
  

  CONFIRM_DELETE_PRODUCT: 'Are you sure you want to delete this patient?',
  CONFIRM_DELETE_EMPLOYEE: 'Are you sure you want to delete this employee?',

  
} as const;


// ==================== colors ====================
export const COLORS = {
  PRIMARY: 'text-blue-700 bg-blue-300/20 rounded-md p-1',
  GREEN: 'text-green-700 bg-green-300/20 rounded-md p-1',
  DARK: 'text-gray-900 bg-gray-300/20 rounded-md p-1',
} as const;


export type Role = "admin" | "doctor" | "receptionist";

export const ROLE_STYLES: Record<Role, string> = {
  admin: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  doctor: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  receptionist: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
};


// ==================== routes ====================
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: 'dashboard',
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  BILLING: 'invoices',
  MEDICAL_RECORDS: 'medical-records',
  ERROR_NETWORK: '/error-network',
} as const;

export const ROUTES_ROLES = {
  admin: "/admin/dashboard",
  doctor: "/doctor/medical-records",
  receptionist: "/receptionist/patients",
} as const;

export const ROUTES_ROLES_PATH = {
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  RECEPTIONIST: "/receptionist",
} as const;


export const ROUTES_ROLES_PATH_LINKS = {
  admin: "/admin/",
  doctor: "/doctor/",
  receptionist: "/receptionist/",
} as const;


// ===================== appointment statuses ===================== //


export const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  Pending: ["Completed", "Cancelled", "no-show"],
  Completed: [],
  Cancelled: [],
  "no-show": ["Cancelled"],
};


export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  Pending: "Pending",
  Completed: "Completed",
  Cancelled: "Cancelled",
  "no-show": "No Show",
};

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-600 ring-1 ring-inset ring-rose-200",
  "no-show": "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300",
};


// ===================== medical records statuses ===================== //
export const STATUS_INVOICES = {
  Paid: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
  "Partially Paid": "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200",
  Unpaid: "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200",
};

// <FontAwesomeIcon icon={faArrowTrendUp} />
// <FontAwesomeIcon icon={faArrowUp} /> <FontAwesomeIcon icon={faChartLine} />