"use client";
import * as React from "react";
import { useActivatePlanMutation } from "@/slices/packageDataApiSlice";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress"; // Import the CircularProgress spinner

export default function PackageCard({ data }) {
  const router = useRouter();
  const [activateSubscriptionPlan, { isLoading: isActivationLoading, error: isActivationError }] = useActivatePlanMutation();

  const standardPlanPrice = data.id === 2 && data.price;
  const proPlanPrice = data.id === 3 && data.price;

  const submitHandler = async (id) => {
    try {
      let res = await activateSubscriptionPlan(id);

      if (res?.error) {
        if (res.error.status === 404) {
          toast.error(res?.error?.data?.message);
        } else {
          toast.error("An error occurred: " + (res.error.message || "Unknown error"));
        }
      } else {
        toast.success("Subscribed Plan Successfully");
        router.push('/home-after-login');
      }
    } catch (err) {
      if (err?.response?.data) {
        toast.error(err.response.data.message || "An unknown error occurred");
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={`w-[80%] sm:w-[100%] justify-self-center md:justify-self-auto md:max-w-[329px] relative lg:w-[329px]`}>
      <Box sx={{ border: "3px solid #2E2E3A", borderRadius: "20px", overflow: "hidden" }} className={`w-full`}>
        <Card variant="outlined" className={`${data.id === 1 ? "bg-[#919197]" : data.id === 2 ? "bg-[#2E2E3A]" : data.id === 3 ? "bg-[#1D1D27]" : ""} lg:px-1`}>
          <React.Fragment>
            <CardContent className="text-white">
              <Typography variant="h5" component="div" sx={{ textAlign: "left" }} className={`font-poppins font-medium lg:my-1 whitespace-nowrap`}>
                {data.name}
                <span className="font-poppins font-medium text-[12px] ml-2">{data.id === 2 && "(" + data?.description + ")"}</span>
              </Typography>
              <div className="flex flex-col items-start py-2">
                {data?.subscriptionPlanFeatures?.map((li, index) => (
                  <Typography key={index} color="white" variant="div" className={`flex items-start justify-start gap-1 ${data.id === 3 ? "my-2" : "my-1"}`}>
                    <CheckIcon sx={{ color: "#A009B9" }} />
                    <b className={`font-poppins font-semibold text-[19px] md:text-[14px] lg:text-[19px]`}>
                      {li.value && li.value} {li.name && li.name}
                    </b>
                  </Typography>
                ))}
              </div>
            </CardContent>
            <CardActions className="justify-center">
              <Button
                onClick={() => submitHandler(data?.id)}
                size="small"
                className="text-[18px] font-medium bg-[#387AFA] text-white h-[34px] rounded-[20px] w-full font-poppins hover:bg-[#3879fac9]"
                disabled={isActivationLoading} // Disable button while loading
              >
                {isActivationLoading ? (
                  <CircularProgress size={24} sx={{ color: "white", marginRight: 1 }} /> // Show spinner when loading
                ) : (
                  <>
                    {data.id === 1 ? "Free Plan" : data.id === 2 ? `$${standardPlanPrice}` : data.id === 3 ? `$${proPlanPrice}` : ""}
                    <span className="font-poppins font-medium text-[10px] mx-1 leading-[12px] text-left">
                      {data.id === 2 || data.id === 3 ? "Billed Monthly, Cancel any time" : ""}
                    </span>
                  </>
                )}
              </Button>
            </CardActions>
          </React.Fragment>
        </Card>
      </Box>
      {data.id === 2 ? (
        <div className="flex justify-center">
          <p className="max-w-[329px] text-center md:h-[150px] md:absolute top-1000px left-200px my-5 font-koho font-light text-[16px] text-[#080808] p-3">
            *Customize Certificates by choosing fonts and certificate colors
          </p>
        </div>
      ) : data.id === 3 ? (
        <div className="flex justify-center">
          <p className="max-w-[329px] text-center md:h-[150px] md:absolute top-1000px left-200px my-5 font-koho font-light text-[16px] text-[#080808] p-3">
            *Customize Certificates by choosing fonts and certificate colors and certificate frame as well as setting a custom image background
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
