import { apiSlice } from "./apiSlice";
import { UPLOAD_ATTACHMENT_URL } from "../utils/constants";

export const UploadAttachmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    UploadAttachment: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_ATTACHMENT_URL}/upload`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadAttachmentMutation } = UploadAttachmentApiSlice;
