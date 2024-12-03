import { apiSlice } from './apiSlice';
import { getTokenFromLocalStorage } from '@/utils/get-token';
import { ADMIN_VENDORS_URL } from '@/utils/constants';

export const adminApiSlices = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllVendorsByAdmin: builder.query({
            query: (params) => ({
                url: `${ADMIN_VENDORS_URL}/all-vendors?page=${params.page}&limit=${params.limit}&is_verified=${params.is_verified}&name=${params.name}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
        }),

        verifyVendorByAdmin: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_VENDORS_URL}/verify`,
                method: "PUT",
                body: data,
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
        }),

        countVendors: builder.query({
            query: () => ({
                url: `${ADMIN_VENDORS_URL}/all-vendors`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
        }),
        totalVendors: builder.query({
            query: () => ({
                url: `${ADMIN_VENDORS_URL}/count`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getTokenFromLocalStorage()}`
                }
            })
        }),
    }),
});

export const { useGetAllVendorsByAdminQuery, useVerifyVendorByAdminMutation, useCountVendorsQuery, useTotalVendorsQuery } = adminApiSlices;
