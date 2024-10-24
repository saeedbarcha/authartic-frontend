import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      className="w-full flex justify-center items-center h-24 bg-[#22477F]"
      component="footer"
    >
      <Box className="flex flex-wrap justify-around sm:justify-center sm:gap-14 text-white w-full px-4">
        <Link href="/about">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            className="font-kodchasan responsive"
          >
            About
          </Typography>
        </Link>
        <Link href="/terms">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            className="font-kodchasan responsive"
          >
            Terms
          </Typography>
        </Link>
        <Link href="/contact-us">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            className="font-kodchasan responsive"
          >
            Contact
          </Typography>
        </Link>
        <Link href="/FAQ">
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            className="font-kodchasan responsive "
          >
            Help
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
