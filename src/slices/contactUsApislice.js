import { apiSlice } from "./apiSlice";
import { CONTACT_US_URL } from "../utils/constants";

export const contactUsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contactUs: builder.mutation({
      query: (dataToSend) => ({
        url: `${CONTACT_US_URL}`,
        method: "POST",
        body: dataToSend,
      }),
    }),
  }),
});

export const { useContactUsMutation } = contactUsApiSlice;
