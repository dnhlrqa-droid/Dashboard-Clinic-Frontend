import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './authStore'; 
import { PatientAPI } from './PatientSrore';
import { analytics } from './analytics.Store';
import { AppointmentAPI } from './Appointment.Store';
import { MedicalRecordStore } from './Medical.Record.Store';
import { Invoices } from '../store/invoices.Store';

export const store = configureStore({
  reducer: {

    [authApi.reducerPath]: authApi.reducer,
    [PatientAPI.reducerPath]: PatientAPI.reducer,
    [analytics.reducerPath]: analytics.reducer,
    [AppointmentAPI.reducerPath]: AppointmentAPI.reducer,
    [MedicalRecordStore.reducerPath]: MedicalRecordStore.reducer,
    [Invoices.reducerPath]: Invoices.reducer,
  },

  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().concat(authApi.middleware, PatientAPI.middleware, analytics.middleware,
    AppointmentAPI.middleware,MedicalRecordStore.middleware,Invoices.middleware
  ),
});
