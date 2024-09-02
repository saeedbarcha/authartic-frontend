import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Logo from "../assets/images/logo.png";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { toast } from "react-toastify";

const Header = ({ disableAccountSettings }) => {
  const router = useRouter();
  const token = useSelector((state) => state.auth.userInfo?.access_token);
  const [logoutApiCall] = useLogoutMutation();

  const [authStatus, setAuthStatus] = useState(false);
  useEffect(() => {
    if (token) {
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
    }
  }, [token]);

 
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      
      router.push("/");
      toast.success("Successfully logged out!"); // Show success toast
    } catch (error) {
      toast.error("Failed to log out. Please try again."); // Show error toast
    }
  };
  
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      className="px-2 sm:px-4 md:px-10"
    >
      <Box display="flex" alignItems="center">
        <Image
          src={Logo}
          alt="Logo"
          height={"auto"}
          width={200}
          className="w-[125px] sm:w-[160px] md:w-[200px] h-auto"
          priority={true}
        />
      </Box>

      {!authStatus ? (
        <Link href={"/"}>
          <Button
            variant="h6"
            color="inherit"
            className="font-Kodchasan text-[20px] font-semibold cursor-pointer  flex items-center gap-1"
          >
            <HomeIcon />
            home
          </Button>
        </Link>
      ) : (
        <div className="flex flex-col items-end gap-1">
          {disableAccountSettings === "Yes" ? (
            <Link href={"/"}>
              <Button
                variant="h6"
                color="inherit"
                className="font-Kodchasan text-[20px] font-semibold cursor-pointer p-0  flex items-center gap-1"
              >
                <HomeIcon />
                Home
              </Button>
            </Link>
          ) : (
            <Link href={"/"}>
              <Button
                variant="h6"
                color="inherit"
                className="font-Kodchasan text-[20px] font-semibold cursor-pointer p-0  flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogoutIcon />
                Logout
              </Button>
            </Link>
          )}

          {disableAccountSettings === "Yes" ? (
            <Link href={"/"}>
              <Button
                variant="h6"
                color="inherit"
                className="font-Kodchasan text-sm font-medium cursor-pointer p-0 flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogoutIcon />
                Logout
              </Button>
            </Link>
          ) : (
            <Link
              href={"/account-settings"}
              className="font-Kodchasan text-sm font-medium cursor-pointer p-0 flex items-center gap-1"
            >
              <ManageAccountsIcon />
              <small>account-settings</small>
            </Link>
          )}
        </div>
      )}
    </Box>
  );
};

export default Header;
