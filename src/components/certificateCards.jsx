"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import sampleIMG from "@/assets/images/sample.svg";
import Link from "next/link";
const CertificateCard = ({ data }) => {
  const issuedDate = new Date(`${data.issued_date}`).toLocaleString();


  const productImgUrl = data?.product_image?.url;

  return (
    <div className="w-full flex items-center flex-col sm:flex-row  justify-between gap-[1vw] py-3 px-1 sm:px-5">
      <div className="w-full flex items-center justify-evenly sm:justify-between">
        <div className="">
          <Image
            src={productImgUrl || sampleIMG}
            alt="sample"
            width={168}
            height={126}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-koho text-[#080808] font-light text-[16px] md:text-[20px]">
            {data?.name}
          </h3>
          <h3 className="font-koho text-[#080808] font-light text-[16px] md:text-[20px]">
            {issuedDate}
          </h3>
          <h3 className="font-koho text-[#080808] font-light text-[16px] md:text-[20px]">
            Number of certificates {data?.issued}
          </h3>
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex-col pl-[5vw] items-center sm:items-end justify-center gap-3 flex">
        <Link
          href={`/issue-certificate/?saved_draft=${data?.saved_draft}&id=${data?.id}&btn=issueMore`}
        >
          <Button
            className={`bg-[#22477F] text-white w-[189px] h-[26px] hover:text-black rounded-[7px] font-bold font-kodchasan md:text-[16px] lg:text-[20px] capitalize leading-[26px]`}
          >
            Issue More
          </Button>
        </Link>
        <Link href={`/issue-certificate/?saved_draft=${data?.saved_draft}&id=${data?.id}&btn=reissueExisting`}>
          <Button
            className={`bg-[#22477F] text-white w-[189px] h-[26px] hover:text-black  rounded-[7px] font-bold font-kodchasan md:text-[16px] lg:text-[20px] capitalize leading-[26px]`}
          >
            Reissue existing
          </Button>
        </Link>
        <Link
          href={`/issue-certificate/?saved_draft=${data?.saved_draft}&id=${data?.id}&btn=reportIssue`}
        >
          <Button
            className={`bg-[#22477F] text-white w-[189px] h-[26px] hover:text-black rounded-[7px] font-bold font-kodchasan md:text-[16px] lg:text-[20px] capitalize leading-[26px]`}
          >
            Report issue
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default CertificateCard;
