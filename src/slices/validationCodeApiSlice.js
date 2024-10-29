import { apiSlice } from './apiSlice';
import { getTokenFromLocalStorage } from '@/utils/get-token';
import { VALIDATION_CODE_URL } from '../utils/constants';
import { CREATE_VALIDATION_CODE_URL } from '../utils/constants';

export const validationCodeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createValidationCode: builder.mutation({
      query: (numberOfCertificates) => ({
        url: `${CREATE_VALIDATION_CODE_URL}`,
        method: "POST",
        body: { no_Validation_code: numberOfCertificates },
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      })
    }),
    getValidationCodeByCode: builder.mutation({
      query: (validCode) => ({
        url: `${VALIDATION_CODE_URL}/code/${validCode}`,
        method: 'POST',
        // Optionally, you can pass a body if needed
        body: {},
      }),
    }),

    getValidationCodeDetails: builder.query({
      query: (params) => ({
        url: `${CREATE_VALIDATION_CODE_URL}?page=${params.page}&limit=${params.limit}&is_used=${params.isUsed}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
    countCodes: builder.query({
      query: () => ({
        url: `${CREATE_VALIDATION_CODE_URL}/count`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`
        }
      }),
    }),
  }),
});

export const { useCreateValidationCodeMutation, useGetValidationCodeByCodeMutation, useGetValidationCodeDetailsQuery, useCountCodesQuery } = validationCodeApiSlice;
