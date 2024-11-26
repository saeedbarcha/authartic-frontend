import { apiSlice } from "./apiSlice";
import { ADMIN_FONTS_URL, VENDOR_FONT_URL } from "../utils/constants";
import { getTokenFromLocalStorage } from "@/utils/get-token";

export const allFontApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFonts: builder.query({
      query: () => ({
        url: `${VENDOR_FONT_URL}`,
        method: "GET",
      }),
    }),
    getAdminALLFontsCount: builder.query({
      query: () => ({
        url: `${ADMIN_FONTS_URL}/count`,
        method: "GET",
        headers: {
          Authorization: `Bearer  ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    getAdminAllFonts: builder.query({
      query: (params) => ({
        url: `${ADMIN_FONTS_URL}/all-fonts?page=${params.page}&limit=${params.limit}&name=${params.name}&is_active=${params.is_active}`,
        method: "GET",
        headers: {
          Authorization: `Bearer  ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    createAdminNewFont: builder.mutation({
      query: (bodyData) => ({
        url: `${ADMIN_FONTS_URL}`,
        method: "POST",
        body: bodyData,
        headers: {
          Authorization: `Bearer  ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    updateAdminFont: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_FONTS_URL}/${data.id}`,
        method: "PUT",
        body: data.bodyData,
        headers: {
          Authorization: `Bearer  ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
    DeleteAdminFont: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_FONTS_URL}/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer  ${getTokenFromLocalStorage()}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllFontsQuery,
  useGetAdminAllFontsQuery,
  useGetAdminALLFontsCountQuery,
  useCreateAdminNewFontMutation,
  useUpdateAdminFontMutation,
  useDeleteAdminFontMutation,
  useALLFontsCountQuery,
} = allFontApiSlice;
