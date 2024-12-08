import React from "react";
import Head from "next/head";
import Image from "next/image";
import LogoPic from "@/assets/images/logo.svg";
import LogInForm from "@/components/logInForm";
import AppleIcon from "@mui/icons-material/Apple";
import googlePlayPic from "@/assets/images/googleplay.svg";
import Link from "next/link";
import Footer from "../components/footer";
import RegisterBTN from "@/components/muiButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <main className={`min-h-screen w-full flex flex-col justify-between bg-white`}>
        {/* Home Page Logo */}
        <div className="w-full flex justify-center items-center max-w-[1440px] mx-auto relative">
          <Image
            src={LogoPic}
            alt="logo"
            height={204}
            priority="true"
            className="h-[120px] sm:h-[150px] md:h-[204px] w-auto "
          />
          <div className="absolute right-7 top-7 md:block hidden">
            <RegisterBTN title={"Register"} />
          </div>
        </div>

        {/* Home Page main screen */}
        <div className="w-full flex justify-center items-center max-w-[1440px] mx-auto my-11">
          <div className="flex gap-7 sm:gap-0 items-center md:items-start justify-around w-full flex-col-reverse md:flex-row pb-7 md:pb-0">
            <div className="text-black flex flex-col items-center lg:items-start gap-4">
              <h1 className={`text-[20px] md:text-[18px] lg:text-[20px] text-[#080808] font-light Koho-light`}>
                FOR PERSONAL USE
              </h1>

              <div className="flex items-center justify-center flex-wrap sm:flex-row md:flex-col gap-3">
                <Link href={"https://www.appstore.com/authartic"} target="_blank">
                  <div className="min-w-[190px] flex gap-2 p-[5px] items-center bg-black md:w-[280px] lg:w-[300px] text-white rounded-xl sm:rounded-3xl px-5 md:px-3 py-1 shadow-lg">
                    <div className="sm:p-[5px] md:p-[10px]">
                      <div>
                        <AppleIcon color="white" className="text-[40px] sm:text-[60px]" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-[.8rem] sm:text-[1rem] md:text-[1.2rem]">
                        download on the
                      </h3>
                      <h1 className="text-[1.2rem] sm:text-[1.5rem] md:text-[2rem]">
                        App Store
                      </h1>
                    </div>
                  </div>
                </Link>

                <Link href={"https://play.google.com/store/apps/authartic"} target="_blank" >
                  <div className="min-w-[190px] flex  gap-2 p-[5px] items-center bg-black md:w-[280px] lg:w-[300px] text-white rounded-xl sm:rounded-3xl px-5 md:px-3 py-1 shadow-lg">
                    <div className="sm:p-[5px] md:p-[10px]">
                      <div className="w-[40px] sm:w-[55px] p-[5px]">
                        <Image
                          src={googlePlayPic}
                          alt="google play"
                          width={100}
                          height={"auto"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-[.8rem] sm:text-[1rem] md:text-[1.2rem]">
                        Get It On
                      </h3>
                      <h1 className="text-[1.2rem] sm:text-[1.5rem] md:text-[2rem]">
                        Google play
                      </h1>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <LogInForm title={"VENDOR LOGIN"} />
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
