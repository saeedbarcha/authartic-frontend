import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { useGetProfileQuery } from "@/slices/userApiSlice";

export default function CustomButton({ title, }) {
  const { data: currentUser, isLoading: isCurrentUserLoading, error: isCurrentUserError, refetch: currentUserRefetch } = useGetProfileQuery()
  const [redirectionURL, setRedirectionURL] = useState('');

  useEffect(() => {
    if (title === "New order") {
      if (currentUser && !isCurrentUserError) {
        currentUserRefetch()
        const dynamicURL = currentUser?.subscriptionStatus?.subscriptionPlan?.name;
        setRedirectionURL(dynamicURL)
      }
    }

  }, [currentUser, currentUserRefetch, isCurrentUserError, title])


  return (
    <Link href={title === "Register" ? "/registration" : redirectionURL === "Pro" ? "/pro-plan-vendor"
      : redirectionURL === "Standard" ? "/standard-plan"
        : redirectionURL === "Starter" ? "/basic-plan" : ''}>
      <Button
        variant="contained"
        className={`w-300 cursor-pointer font-kodchasan text-md md:text-lg xl:text-xl  rounded-[7px] text-white font-normal  py-1 px-5 md:px-9 bg-[#22477F]`}
        sx={{
          textTransform: "none",
          "&:hover": {
            backgroundColor: `bg-[#22477F]`,
          },
        }}
      >
        {title}
      </Button>
    </Link>
  );
}