import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";

// Define your adminUserApiSlice with the endpoint
export const adminUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    countUsers: builder.query({
      query: ({ page = 1, limit = 12, name = "" }) => ({
        url: `admin/all-users?page=${page}&limit=${limit}&name=${name}`,
        method: "GET",
        params: { page, limit, name },
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
  }),
});


export const { useCountUsersQuery } = adminUserApiSlice;
