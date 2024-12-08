import { apiSlice } from "./apiSlice";
import { COUNTRY_URL } from "../utils/constants";
import { ADMIN_COUNTRIES_URL } from "../utils/constants";
import { getTokenFromLocalStorage } from "@/utils/get-token";
export const activeCountryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveCountries: builder.query({
      query: (data) => ({
        url: `${COUNTRY_URL}/status/active`,
        method: "GET",
        body: data,
      }),
    }),
    createCountry: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_COUNTRIES_URL}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
    findAllCountries: builder.query({
      query: ({ page, limit, isActiveCountry, name }) => ({
        url: `${ADMIN_COUNTRIES_URL}/all-countries?page=${page}&limit=${limit}&is_active=${isActiveCountry}&name=${name}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
    updateCountry: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_COUNTRIES_URL}/${data.id}`,
        method: "PUT",
        body: data.bodyData,
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
    deleteCountry: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_COUNTRIES_URL}/${data.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
    countCountries: builder.query({
      query: () => ({
        url: `${ADMIN_COUNTRIES_URL}/country-counts`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
  }),
});
export const { useCreateCountryMutation, useGetActiveCountriesQuery, useFindAllCountriesQuery, useUpdateCountryMutation, useDeleteCountryMutation, useCountCountriesQuery } = activeCountryApiSlice;