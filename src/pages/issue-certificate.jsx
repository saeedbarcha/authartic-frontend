import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Typography, Button, TextField, Box, Checkbox, CircularProgress } from "@mui/material";
import {
  useGetCertificateinfoByIdQuery,
  useReIssueCertificatesMutation,
} from "@/slices/certificateInfoApiSlice";
import Header from "@/components/header";
import Footer from "@/components/footer";
import image from "../assets/images/image.png";
import WithAuth from '@/components/withAuth';
import { useReportProblemMutation } from "@/slices/reportProblemApiSlice";
import { useReIssueExistingMutation } from "@/slices/reIssueExistingApiSlice";

function IssueMore() {
  const router = useRouter();
  const [issueState, setIssueState] = useState('');
  const [reIssueCertificateNo, setReIssueCertificateNo] = useState(0);
  const [reIssueExistingId, setReIssueExistingId] = useState(0);
  const [acknowledge, setAcknowledge] = useState(false);
  const [reportText, setReportText] = useState(""); // State for report problem

  const { id: certificateInfoId, saved_draft: certificateSavedDraft, btn: clickedinfo } = router.query;

  const [reIssueExisting, { isLoading: isReIssueExistingLoading }] = useReIssueExistingMutation();

  const [
    reIssueCertificate,
    { isLoading: isLoadingReIssueCertificates },
  ] = useReIssueCertificatesMutation();

  const [
    reportProblem,
    { isLoading: isLoadingreportProblem },
  ] = useReportProblemMutation();

  const {
    data: certificateInfo,
    isLoading: isCertificateInfoLoading,
    error: isCertificateInfoError,
    refetch,
  } = useGetCertificateinfoByIdQuery({
    certificateInfoId,
    certificateSavedDraft,
  });

  const reIssueHandler = async () => {
    try {
      const res = await reIssueCertificate({
        certificateInfoId,
        bodyData: { number_of_certificate: parseInt(reIssueCertificateNo) },
      });

      if (res?.error) {
        if (res.error.status === 404) {
          toast.error(res?.error?.data?.message);
        } else {
          toast.error("An error occurred: " + (res.error.message || "Unknown error"));
        }
      } else {
        toast.success(res?.data?.message);
        refetch();
        setReIssueCertificateNo(0);
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

  const reportProblemHandler = async () => {
    try {
      if (!certificateInfoId) {
        throw new Error("Certificate ID is not defined");
      }

      const res = await reportProblem({ id: certificateInfoId, reporting_text: reportText });

      if (res?.error) {
        toast.error("An error occurred: " + (res.error.message || "Unknown error"));
      } else {
        toast.success("Your problem report has been submitted.");
        setReportText(""); // Clear the text field
        setIssueState("issueMore"); // Optionally, revert to the initial state
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

  const handleReIssueExistingSubmit = async () => {
    const data2Send = {
      id: certificateInfoId,
      body: {
        certificate_id: reIssueExistingId
      }
    }
    try {
      const response = await reIssueExisting(data2Send).unwrap()
      if (response) {
        toast.success(response?.message || 'Certificate reissued successfully.');
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.error || error?.status || error?.data?.error || error?.data?.statusCode)
    }
  }

  const handleReIssueExistingCancel = () => {
    setReIssueExistingId(0);
    router.push("/home-after-login")
  }

  const handleCancel = () => {
    setReIssueCertificateNo(0);
    setAcknowledge(false);
    setReportText(""); // Clear the report text field
    router.push("/home-after-login")
  };

  useEffect(() => {
    if (clickedinfo) {
      setIssueState(clickedinfo)
    }
  }, [clickedinfo])

  const lastIssuedDate = new Date(certificateInfo?.issued_date).toLocaleString();

  return (
    <>
      <Header />
      <Box className="min-h-screen">
        <Box className="flex items-center justify-center flex-col sm:flex-row gap-[1vw]">
          <Box>
            <Image
              src={certificateInfo?.product_image?.url || image}
              alt="sample"
              width={168}
              height={126}
            />
          </Box>

          <Box className="flex flex-col gap-1">
            <Typography className="font-koho text-[#080808] font-light text-[20px]">
              {certificateInfo?.name || "example name"}
            </Typography>
            <Typography className="font-koho text-[#080808] font-light text-[20px]">
              {lastIssuedDate || "example Date"}
            </Typography>
            <Typography className="font-koho text-[#080808] font-light text-[20px]">
              <span className="text-slate-500">number of certificates issued</span> {certificateInfo?.issued || 0}
            </Typography>
          </Box>

          <Box className="flex flex-col pl-[5vw] gap-5">
            <Button
              type="submit"
              variant="contained"
              className={`rounded-[7px] font-kodchasan float-end py-0 ${issueState === "issueMore" ? "bg-[#C2C3CE]" : "bg-[#22477F]"
                }`}
              onClick={() => setIssueState("issueMore")}
            >
              Issue More
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={`rounded-[7px] font-kodchasan float-end py-0 ${issueState === "reissueExisting" ? "bg-[#C2C3CE]" : "bg-[#22477F]"
                }`}
              onClick={() => setIssueState("reissueExisting")}
            >
              Reissue existing
            </Button>
            <Button
              type="button"
              variant="contained"
              className={`rounded-[7px] font-kodchasan py-0 ${issueState === "reportIssue" ? "bg-[#C2C3CE]" : "bg-[#22477F]"
                }`}
              onClick={() => setIssueState("reportIssue")}
            >
              Report Problem
            </Button>
          </Box>
        </Box>
        {issueState === "issueMore" ? (
          <Box className="max-w-[602px] w-full mx-auto bg-[#22477F] py-6 my-6 rounded-[30px]">
            <Box className="flex items-center justify-center flex-col mx-20 my-4">
              <Typography className="font-koho text-[#fff] font-light text-[20px]">
                How many more would you like to issue?
              </Typography>

              <Box>
                <input
                  type="number"
                  placeholder="Enter number here"
                  className="w-full min-h-[40px] px-2 py-1 rounded-sm text-base md:text-xl bg-white border-none outline-2 outline-[#606060] my-6"
                  value={reIssueCertificateNo}
                  onChange={(e) => setReIssueCertificateNo(e.target.value)}
                />
              </Box>
              <Typography color={"white"}>
                The issues you are ordering right now will have all the same exact information as the previously ordered certificates for “Certificate Name”
              </Typography>

              <Box className="flex items-center">
                <Checkbox
                  checked={acknowledge}
                  onChange={(e) => setAcknowledge(e.target.checked)}
                  sx={{
                    color: "#fff",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  I acknowledge
                </Typography>
              </Box>

              <Button
                variant="contained"
                className="bg-[#27A213] rounded-[7px] font-kodchasan w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
                onClick={reIssueHandler}
                disabled={!acknowledge}
              >
                {isLoadingReIssueCertificates ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="contained"
                className="bg-[#A21313] rounded-[7px] font-kodchasan mt-5 w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : issueState === "reissueExisting" ? (
          <Box className="max-w-[602px] w-full mx-auto bg-[#22477F] py-6 my-6 rounded-[30px]">
            <Box className="mx-10 my-4">
              <Typography className="font-koho text-[#fff] font-light text-[20px]">
                Certificate number to be reissued:
              </Typography>

              <Box>
                <TextField
                  type="number"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter certificate number here"
                  className="my-6"
                  value={reIssueExistingId}
                  onChange={e => setReIssueExistingId(e.target.value)}
                  sx={{
                    backgroundColor: "#fff",
                    maxWidth: "508px",
                    width: "100%",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#606060",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#606060",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#606060",
                      },
                    },
                  }}
                />
              </Box>
              <Typography className="font-koho text-[#fff] font-light text-[20px]">
                Reason for request:
              </Typography>

              <Box>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  name="description"
                  sx={{
                    backgroundColor: "#fff",
                    maxWidth: "508px",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                  className="mt-4 lg:mt-0 md:mt-0"
                />
              </Box>
            </Box>
            <Box className="flex justify-center items-center flex-col">
              <Button
                onClick={handleReIssueExistingSubmit}
                disabled={isReIssueExistingLoading}
                variant="contained"
                className="bg-[#27A213] rounded-[7px] font-kodchasan w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
              >
                {isReIssueExistingLoading ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
              <Button
                onClick={handleReIssueExistingCancel}
                variant="contained"
                className="bg-[#A21313] rounded-[7px] font-kodchasan mt-5 w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : issueState === "reportIssue" ? (
          <Box className="max-w-[602px] w-full mx-auto bg-[#22477F] py-6 my-6 rounded-[30px]">
            <Box className="mx-10 my-4">
              <Typography className="font-koho text-[#fff] font-light text-[20px]">
                Report your problem:
              </Typography>

              <Box>
                <TextField
                  multiline
                  rows={10}
                  variant="outlined"
                  fullWidth
                  name="description"
                  placeholder="Enter your problem description here"
                  sx={{
                    backgroundColor: "#fff",
                    maxWidth: "508px",
                    width: "100%",
                    borderRadius: "10px",
                  }}
                  className="mt-4 lg:mt-0 md:mt-0"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </Box>
            </Box>
            <Box className="flex justify-center items-center flex-col">
              <Button
                variant="contained"
                className="bg-[#27A213] rounded-[7px] font-kodchasan w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
                onClick={reportProblemHandler}
                disabled={isLoadingreportProblem}
              >
                {isLoadingreportProblem ? <CircularProgress size={24} /> : "Submit"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="contained"
                className="bg-[#A21313] rounded-[7px] font-kodchasan mt-5 w-[189px]"
                sx={{ fontFamily: "Kodchasan, sans-serif" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : null}
      </Box>
      <Footer />
    </>
  );
}

export default WithAuth(IssueMore, ["VENDOR"]);
