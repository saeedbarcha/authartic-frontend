import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Logo from "../assets/images/logo.png";
import { useSelector, useDispatch } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useRouter } from "next/router";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { toast } from "react-toastify";
import { logout } from "@/slices/authSlice";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useGetProfileQuery } from "@/slices/userApiSlice";

const Header = ({ disableAccountSettings }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {data:logedInUserDetails} = useGetProfileQuery()
  const token = useSelector((state) => state.auth.userInfo?.access_token);
  const [logoutApiCall] = useLogoutMutation();

  const [logedInUser,setLogedInUser]=useState({})
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [authStatus, setAuthStatus] = useState(false);

  
  useEffect(()=>{
    if(logedInUserDetails){
      setLogedInUser(logedInUserDetails)
}
  },[logedInUserDetails])

  useEffect(() => {
    if (token) {
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      // Call the API to log out
      const response = await logoutApiCall().unwrap();

      // Dispatch the Redux logout action to clear local storage and update state
      dispatch(logout());

      // Redirect to home page

      // Show success toast
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Successfully logged out!"
      );
      if(logedInUser?.role === "ADMIN"){
        router.push("/admin-login");
      }else{
        router.push("/");
      }
    } catch (error) {
      // Show error toast
      toast.error(
        error?.message ||
          error?.data?.message ||
          "Failed to log out. Please try again."
      );
    }
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          height="auto"
          width={200}
          className="w-[125px] sm:w-[160px] md:w-[200px] h-auto"
          priority
        />
      </Box>

      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {!authStatus ? (
            <Link href="/">
              <Button
                variant="h6"
                color="inherit"
                className="font-Kodchasan text-[20px] font-semibold cursor-pointer flex items-center gap-1"
              >
                <HomeIcon />
                Home
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-end gap-1">
              {disableAccountSettings === "Yes" ? (
                <MenuItem onClick={handleClose}>
                  <Link href="/">
                    <Button
                      variant="h6"
                      color="inherit"
                      className="font-Kodchasan text-[20px] font-semibold cursor-pointer p-0 flex items-center gap-1"
                    >
                      <HomeIcon />
                      Home
                    </Button>
                  </Link>
                </MenuItem>
              ) : (
                <MenuItem onClick={handleClose}>
                  <Button
                    variant="h6"
                    color="inherit"
                    className="!font-Kodchasan !text-[20px] !font-semibold !cursor-pointer !p-0 !flex !items-center !gap-1"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    Logout
                  </Button>
                </MenuItem>
              )}

              {disableAccountSettings === "Yes" ? (
                <MenuItem onClick={handleClose}>
                  <Button
                    variant="h6"
                    color="inherit"
                    className="font-Kodchasan text-sm font-medium cursor-pointer p-0 flex items-center gap-1"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                    Logout
                  </Button>
                </MenuItem>
              ) : logedInUser?.role !=="ADMIN" && (
                <MenuItem onClick={handleClose}>
                  <Link
                    href="/account-settings"
                    className="font-Kodchasan text-sm font-medium cursor-pointer p-0 flex items-center gap-1"
                  >
                    <ManageAccountsIcon />
                    <small>Account Settings</small>
                  </Link>
                </MenuItem>
              )}
            </div>
          )}
        </Menu>
      </div>
    </Box>
  );
};

export default Header;
