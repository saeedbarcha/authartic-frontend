import React, { useEffect, useState } from "react";
import CustomButton from "@/components/muiButton";
import { Box, Button, Typography } from "@mui/material";
import SampleCard from "@/components/certificateCards";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useGetMyCertificateInfoQuery } from "@/slices/certificateInfoApiSlice";
import WithAuth from '@/components/withAuth';

const Index = () => {
  const [drafttext, setDraftText] = useState("Drafts");
  const [certificateData, setCertificateData] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    saved_draft: false,
  });
  
  const {
    data: allCertificateData,
    error,
    isLoading,
    refetch,
  } = useGetMyCertificateInfoQuery(params);
  


  // Update certificates and handle errors
  useEffect(() => {
    if (allCertificateData) {
      setCertificateData(allCertificateData);
    } else if (error) {
      setCertificateData([]); // Handle error state
    }
    refetch()
  }, [allCertificateData, error]);

  // Handle draft button click
  const handleDraftCertificates = () => {
    if (drafttext === "Drafts") {
      setDraftText("Issued Certificates");
      setParams({
        page: 1,
        limit: 10,
        saved_draft: true,
      });
    } else {
      setDraftText("Drafts");
      setParams({
        page: 1,
        limit: 10,
        saved_draft: false,
      });
    }
    refetch(); // Refetch certificates based on new params
  };

  return (
    <>
      <Box className="min-h-screen flex flex-col justify-between">
        <Box className="w-full">
          <Header />
          <Box className="w-full max-w-[962px] relative mx-auto mt-1">
            <Box className="flex flex-col items-center w-full">
              <Box className="flex flex-col items-end gap-1">
                <CustomButton title={"New order"} />
                <Button
                  className="bg-white text-black hover:bg-white"
                  onClick={handleDraftCertificates}
                >
                  {drafttext}
                </Button>
              </Box>
            </Box>
            <div className="w-full my-8 flex flex-col justify-start items-center gap-[70px]">
              {isLoading && (
                <Typography className="text-green-700 font-bold text-xl">
                  Loading...
                </Typography>
              )}
              {!error && certificateData?.data?.map((data, index) => (
               
                <SampleCard data={data} key={index} />
              ))}
              {error && (
                <Typography className="font-bold text-xl">
                  {error?.data?.message || "An error occurred"}
                </Typography>
              )}
              {certificateData?.total === 0 && (
                <Typography className="font-bold text-xl">
                  No Certificates Available
                </Typography>
              )}
            </div>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default WithAuth(Index, ['VENDOR']);
