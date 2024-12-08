import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Users"], // Example tagTypes, adjust as needed
  endpoints: (builder) => ({}), // Define endpoints as needed
});

export default apiSlice.reducer;
