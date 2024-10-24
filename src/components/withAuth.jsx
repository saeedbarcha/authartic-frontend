import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const WithAuth = (WrappedComponent, rolesRequired = []) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasRequiredRole, setHasRequiredRole] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (userInfo?.access_token) {
        setIsLoggedIn(true);
        if (rolesRequired.length > 0) {
          setHasRequiredRole(rolesRequired.includes(userInfo?.user?.role));
        } else {
          setHasRequiredRole(true);
        }
      } else {
        setIsLoggedIn(false);
        setHasRequiredRole(false);
      }
      setIsLoading(false);
    }, [userInfo]);

    useEffect(() => {
      if (!isLoading) {
        if (!isLoggedIn) {
          // router.push("/"); // Redirect to login if not logged in
        } else if (!hasRequiredRole) {
          // router.push("/unauthorized"); // Redirect to unauthorized if roles don't match
        }
      }
    }, [isLoading, isLoggedIn, hasRequiredRole, router]);

    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!isLoggedIn || !hasRequiredRole) {
      return null; // Render nothing if not logged in or unauthorized
    }

    return <WrappedComponent {...props} />;
  };

  AuthHOC.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthHOC;
};


export default WithAuth;
