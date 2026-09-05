import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import{ type AnalyticsResponseData, type analyitcs } from "../types/Types";







export const analytics = createApi({
    reducerPath: "analytics",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_BASE_URL,
        credentials: "include",
        fetchFn: (input, init) => {
            return fetch(input, { ...init, signal: AbortSignal.timeout(10000) });
        }
    }), tagTypes: ["analytics"],
    endpoints: (build) => ({
        analyticsAPI: build.query<analyitcs, {year: number, month: number, day: number, range: string} | void>({
            query: (params) => { 
                const Year = params?.year;
                const Month = String( params?.month).padStart(2, "0");
                const Day = String( params?.day).padStart(2, "0");
                const Range = params?.range;
              return Year != 0 && Number(Month) != 0 && Number(Day) != 0 ? `analytics/summary?year=${Year}&month=${Month}&day=${Day}` :
               Range ? `analytics/summary?range=${Range}`  : `analytics/summary`
            },
            providesTags: ["analytics"]
        }),
        analyticsHistoryAPI: build.query<AnalyticsResponseData, | void>({
            query: () => `analytics/summary/history`
        }),
    }),
});


export const {useAnalyticsAPIQuery, useAnalyticsHistoryAPIQuery} = analytics;