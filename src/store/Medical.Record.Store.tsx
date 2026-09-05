import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MedicalRecordData } from "../types/Types";



export const MedicalRecordStore = createApi({
  reducerPath: "medicalRecord",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
    fetchFn: (input, init) => {
        return fetch(input, { ...init, signal: AbortSignal.timeout(10000)});
    }
  }),
   tagTypes: ["medicalRecord"],
    endpoints: (build) => ({
        getMedicalRecordAPI: build.query<MedicalRecordData, {page: number, search: string} | void>({
            query: (params) => { 
                const Search = params?.search;
               return Search ? `medical-records?page=${params?.page || 1}&limit=20&search=${encodeURIComponent(Search)}` :
                `medical-records?page=${params?.page || 1}&limit=20`
            },
            providesTags: ["medicalRecord"],
        }),
        createMedicalRecord: build.mutation({
            query: (newMedicalRecord) => ({
               url: `create/medical-record`,
               method: 'POST',
               body: newMedicalRecord,
            }), invalidatesTags: ["medicalRecord"],
        }),

    })
});


export const { useGetMedicalRecordAPIQuery, useCreateMedicalRecordMutation } = MedicalRecordStore;