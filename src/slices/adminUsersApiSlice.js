import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";

// Define your adminUserApiSlice with the endpoint
export const adminUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    countUsers: builder.query({
      query: ({ page = 1, limit = 12, name = "" }) => ({
        url: `admin/all-users?page=${page}&limit=${limit}`,
        method: "GET",
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    totalCountUsers: builder.query({
      query: () => ({
        url: `admin/user/count`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
  }),
});


export const { useCountUsersQuery, useTotalCountUsersQuery } = adminUserApiSlice;
