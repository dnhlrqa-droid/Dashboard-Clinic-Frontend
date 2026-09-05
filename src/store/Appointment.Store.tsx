import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AppointmentData } from "../types/Types";




export const AppointmentAPI = createApi({
    reducerPath: "Appointment",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_BASE_URL,
        credentials: "include",
        fetchFn(input, init) {
            return fetch(input, {...init, signal: AbortSignal.timeout(10000)})
        }
    }),
    tagTypes: ["Appointment"],
    endpoints: (build) => ({
        getAppointmentAPI: build.query<AppointmentData, {status?: string; page?: number} | void>({
            query: (params) => {
                const status = params?.status;
                const Page = params?.page;
                return status ? `appointments?page=${Page}&limit=20&status=${encodeURIComponent(status)}` : `appointments?&page=${Page}&limit=20`
            },
            providesTags: ["Appointment"]
        }),
        createAppoinmentAPI: build.mutation({
            query: (appointment) => ({
                url: `create/appointments`,
                method: "POST",
                body: appointment
            }), invalidatesTags: ["Appointment"],
        }),
        toggleAppointmentAPI: build.mutation({
            query: ({appointmentId, status}) => ({
                url: `appointments/${appointmentId}/status`,
                method: "PATCH",
                body: {status}
            }), invalidatesTags: ["Appointment"]
        }),
        getAppointmentTodayAPI: build.query<AppointmentData, void>({
            query: () => `appointments/today`,
            providesTags: ["Appointment"]
        }),
    })
});

export const {useGetAppointmentAPIQuery, useCreateAppoinmentAPIMutation, useToggleAppointmentAPIMutation,
    useGetAppointmentTodayAPIQuery
} = AppointmentAPI;