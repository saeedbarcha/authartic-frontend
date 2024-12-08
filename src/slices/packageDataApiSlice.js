import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";
import { SUBSCRIPTION_PLAN_URL } from "../utils/constants";

export const subscriptionPlanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getsubscrptionPlan: builder.query({
      query: (data) => ({
        url: `${SUBSCRIPTION_PLAN_URL}/all`,
        method: "GET",
        body: data,
      }),
    }),
    activatePlan: builder.mutation({
      query: (id) => ({
        url: `${SUBSCRIPTION_PLAN_URL}/activate-plan/${id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      })
    })
  }),
});

export const { useGetsubscrptionPlanQuery, useActivatePlanMutation } = subscriptionPlanApiSlice;
