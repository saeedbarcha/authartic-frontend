import { apiSlice } from "./apiSlice";
import { getTokenFromLocalStorage } from "@/utils/get-token";
import { RE_ISSUE_EXISTING_URL } from "@/utils/constants";

export const reIssueExistingApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        reIssueExisting: builder.mutation(
            {
                query: (data) => ({
                    url: `${RE_ISSUE_EXISTING_URL}/${data.id}/re-issue-existing`,
                    method: "POST",
                    body: data.body,
                    headers: {
                        Authorization: `Bearer ${getTokenFromLocalStorage()}`
                    }
                })
            })
    })
})

export const { useReIssueExistingMutation } = reIssueExistingApi