import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";
import {
  REPORT_PROBLEM_URL,
  ADMIN_REPORT_PROBLEM_URL,
} from "@/utils/constants";

export const reportProblemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    reportProblem: builder.mutation({
      query: ({ id, reporting_text }) => ({
        url: `${REPORT_PROBLEM_URL}/${id}`,
        method: "POST", // or 'PUT' depending on your API specification
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Ensure this function works correctly
          "Content-Type": "application/json",
        },
        body: { reporting_text },
      }),
    }),
    adminNewReportProblem: builder.query({
      query: ({ page, limit, status, id }) => ({
        url: `${ADMIN_REPORT_PROBLEM_URL}?page=${page}&limit=${limit}&status=${status}&report_id=${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    adminResponseReport: builder.mutation({
      query: ({ id, responseText, reportStatus }) => ({
        url: `${ADMIN_REPORT_PROBLEM_URL}/${id}`, // Adjust URL as needed
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
        body: { response_text: responseText, report_status: reportStatus },
      }),
    }),
    totalReportProblem: builder.query({
      query: () => ({
        url: `${ADMIN_REPORT_PROBLEM_URL}/count`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
  }),
});

export const {
  useReportProblemMutation,
  useAdminNewReportProblemQuery,
  useAdminResponseReportMutation,
  useTotalReportProblemQuery,
} = reportProblemApiSlice;
