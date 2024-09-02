"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import faqAsset from "@/assets/jsonData/FAQAsset";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);
  const [chooseIndex, setChooseIndex] = useState(null);

  const handleChange = () => {
    setExpanded(!expanded);
  };
  return (
    <main className="w-full min-h-screen flex flex-col justify-between">
      <Header />

      <div className="w-full xl:max-w-[80%] h-full flex flex-col items-center justify-start gap-11 xl:gap-[3vw] px-2 sm:px-4 md:px-10 mx-auto my-5">
        {faqAsset &&
          faqAsset.map((asset, index) => (
            <div className="w-full" key={index}>
              <Accordion
                expanded={index === chooseIndex && expanded}
                onChange={handleChange}
                onClick={() => setChooseIndex(index)}
                className={`shadow-md rounded-lg bg-white border-2 md:px-3 lg:px-5 xl:px-[1vw] xl:py-[1vw] ${
                  index === chooseIndex && expanded
                    ? "border-[#4A3AFF]"
                    : "border-transparent"
                }`}
              >
                <AccordionSummary
                  expandIcon={
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-[2vw] xl:h-[2vw] flex ml-3 items-center justify-center bg-[#4A3AFF] rounded-full`}
                    >
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-[1vw] xl:h-[1vw]"
                        viewBox="0 0 24 24"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                      </svg>
                    </div>
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="py-3 px-4"
                >
                  <Typography
                    variant="subtitle1"
                    className="text-[#170F49] font-DMSans font-medium text-[14px] sm:text-[17px] lg:text-[22px] xl:text-[1vw]"
                  >
                    {asset.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails className="bg-white py-2 px-4 pb-3 w-[90%] xl:py-[1vw] xl:px-[1vw] xl:pb-[3vw]">
                  <Typography
                    variant="body1"
                    className="text-[#6F6C90] font-normal text-[12px] sm:text-[15px] lg:text-[18px] xl:text-[.8vw] font-DMSans"
                  >
                    {asset.desc}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </div>

      <Footer />
    </main>
  );
};

export default FAQ;
