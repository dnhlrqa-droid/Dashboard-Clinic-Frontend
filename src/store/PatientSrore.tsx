import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PatientProps } from "../types/Types";



export const PatientAPI = createApi({
    reducerPath: "patient",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_BASE_URL,
        credentials: 'include',
        fetchFn: (input, init) => {
            return fetch(input, { ...init, signal: AbortSignal.timeout(10000) });
        }
    }),
     tagTypes: ['patient'],
     endpoints: (build) => ({
        getPatientsAPI: build.query<PatientProps, {search?: string; page?: number} | void>({
             query: (params) => {
                const search = params?.search;
                const page = params?.page;
                return search ? `patients?page=${page}&limit=20&search=${encodeURIComponent(search)}` : `patients?page=${page}&limit=20`;
             },
              providesTags: ['patient'],
        }),
        createPatientAPI: build.mutation({
            query:(createPatient) => ({
                url: "create/patients",
                method: "POST",
                body: createPatient,
            }), invalidatesTags: ['patient'],
        }),
        updatePatientAPI: build.mutation({
            query: ({patientId, createPatient}) => ({
                url: `update/patients/${patientId}`,
                method: "PATCH",
                body: createPatient
            }), invalidatesTags: ['patient'],
        }),
        toggleStatusAPI: build.mutation({
            query: (patientId) => ({
                url: `patient/${patientId}/status`,
                method: "PATCH"
            }), invalidatesTags: ["patient"]
        }),
     })
});


export const {useGetPatientsAPIQuery, useCreatePatientAPIMutation,
    useUpdatePatientAPIMutation, useToggleStatusAPIMutation
} = PatientAPI;
