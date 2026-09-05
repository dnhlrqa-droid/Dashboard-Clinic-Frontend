import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TransactionProps, InvoicesProps, InvoicesPatientIdProps } from "../types/Types";







export const Invoices = createApi({
    reducerPath: "invoices",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_BASE_URL,
        credentials: "include",
        fetchFn(input, init) {
            return fetch(input, {...init, signal: AbortSignal.timeout(10000)})
        },
    }),
    tagTypes: ["invoces"],
    endpoints: (build) => ({
       getInvocesAPI: build.query<InvoicesProps, {search?: string, page?: number, paymentStatus?: string} | void>({
        query: (params) => {
            const queryParams  = new URLSearchParams();
            if(params?.search){
                queryParams.append("search", params?.search);
            }
            if(params?.paymentStatus){
                queryParams.append("paymentStatus", params?.paymentStatus);
            }
            const queryString  = queryParams.toString();
           return {url: queryString ? `invoices?page=${params?.page}&limit=20&${queryString}` :
             `invoices?page=${params?.page}&limit=20`,
              method: 'GET',
            }
        } , 
           providesTags:["invoces"]
       }),
        createTransictionInvoicAPI: build.mutation({
            query: (transaction) => ({
             url: `create/transactions`,
             method: "POST",
             body: transaction,
            }), invalidatesTags: ["invoces"],
        }),
        getTransactionPatientAPI: build.query<TransactionProps, {id: string} | void>({
            query: (params) => {
               return `transactions/patient/${params?.id}`
            }, providesTags: ["invoces"],
        }),
        getInvoicePatientAPI: build.query<InvoicesPatientIdProps, {id: string} | void>({
            query: (params) => {
                return `invoices/patient/${params?.id}`
            }, providesTags: ["invoces"],
        })
    })
    
});

export const {useGetInvocesAPIQuery, useCreateTransictionInvoicAPIMutation, useGetTransactionPatientAPIQuery,
    useGetInvoicePatientAPIQuery
} = Invoices;