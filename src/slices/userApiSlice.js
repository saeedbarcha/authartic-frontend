import { apiSlice } from "./apiSlice";
import { AUTH_URL, USER_URL } from "../utils/constants";
import { getTokenFromLocalStorage } from "@/utils/get-token";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`, // Make sure AUTH_URL is correctly defined in constants
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/user/logout`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: () => ({
        url: "/user/resend-verification-email-vendor",
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    findEmail: builder.mutation({
      query: (requestData) => ({
        url: "/user/find-email",
        method: "POST",
        body: requestData,
      }),
    }),
    sendOtpEmail: builder.mutation({
      query: (otpRequestData) => ({
        url: "/user/send-otp-email",
        method: "POST",
        body: otpRequestData,
      }),
    }),
    verificationAccount: builder.mutation({
      query: (verifyData) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: verifyData,
      }),
    }),
    updatePassword: builder.mutation({
      query: (updateData) => ({
        url: '/user/update-password',
        method: 'PUT',
        body: updateData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useRegisterMutation,
  useUpdateProfileMutation,
  useLogoutMutation,
  useResendVerificationEmailMutation,
  useFindEmailMutation,
  useSendOtpEmailMutation,
  useVerificationAccountMutation,
  useUpdatePasswordMutation 
} = usersApiSlice;
