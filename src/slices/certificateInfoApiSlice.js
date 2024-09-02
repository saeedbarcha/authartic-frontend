import { apiSlice } from "./apiSlice";
import { CERTIFICATE_INFO_URL } from "../utils/constants";
import { getTokenFromLocalStorage } from "@/utils/get-token";

export const certificateInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyCertificateInfo: builder.query({
      query: (params) => ({
        url: `${CERTIFICATE_INFO_URL}?page=${params?.page}&limit=${params?.limit}&saved_draft=${params?.saved_draft}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
      }),
    }),
    getCertificateinfoById: builder.query({
      query: (params) => ({
        url: `${CERTIFICATE_INFO_URL}/${params.certificateInfoId}?saved_draft=${params.certificateSavedDraft}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
      }),
    }),
    reIssueCertificates: builder.mutation({
      query: (data) => ({
        url: `${CERTIFICATE_INFO_URL}/reissue/${data.certificateInfoId}`,
        method: "POST",
        body: data.bodyData,
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Replace with your function to get the token
        },
      }),
    }),
    postCertificateInfo: builder.mutation({
      query: (data) => ({
        url: `${CERTIFICATE_INFO_URL}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      }),
    })
  }),
});

export const { useGetMyCertificateInfoQuery, usePostCertificateInfoMutation, useGetCertificateinfoByIdQuery, useReIssueCertificatesMutation } = certificateInfoApiSlice;