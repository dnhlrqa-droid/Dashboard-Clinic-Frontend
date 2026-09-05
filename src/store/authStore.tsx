// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { EmpluyeeData, EmpluyeeDataVerifySession } from '../types/Types';


export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: 'include',
    fetchFn: (input, init) => {
        return fetch(input, { ...init, signal: AbortSignal.timeout(15000) });
    }
   }),
   tagTypes: ['Auth', "Employee"],
  endpoints: (build) => ({
    getCurrentUser: build.query<EmpluyeeDataVerifySession, void>({
      query: () => `auth/verify/session`,
       providesTags: ['Auth'],
    }),
    Login: build.mutation({
      query:(employeeCode) => ({
        url: "auth/login",
        method: "POST",
        body: employeeCode
      }), invalidatesTags: ['Auth'],
    }),
    getEmployeeAPI: build.query<EmpluyeeData,{search?: string} |void>({
      query: (params) => {
         const search = params?.search;
         return search ? `auth/users?search=${encodeURIComponent(search)}` : `auth/users`
      }, providesTags: ["Employee"]
    }),
    registerEmployeeAPI: build.mutation({
      query: (employee) => ({
        url: `auth/register`,
         method: "POST",
         body: employee
      }), invalidatesTags: ["Employee"]
    }),
    updateEmployeeAPI: build.mutation({
       query: ({employeeId, createEmployee}) => ({
          url: `auth/update/admin/${employeeId}`,
          method: "PATCH",
          body: createEmployee
       }), invalidatesTags: ["Employee"]
    }),
    toggleStatusEmployeeAPI: build.mutation({
      query: (employeeId) => ({
        url: `auth/toggle-status/${employeeId}`,
        method: "PATCH"
      }), invalidatesTags: ["Employee"]
    })
  }),
})


export const { useGetCurrentUserQuery, useLoginMutation, useGetEmployeeAPIQuery, useRegisterEmployeeAPIMutation,
  useUpdateEmployeeAPIMutation, useToggleStatusEmployeeAPIMutation
 } = authApi


