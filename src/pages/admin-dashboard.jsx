import React, { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Head from "next/head";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Link from "next/link";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // For active state
import NotificationsIcon from "@mui/icons-material/Notifications"; // For problem reports
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { useGetAdminALLFontsCountQuery } from "@/slices/fontApiSlice";
import { useCountCountriesQuery } from "@/slices/countriesApiSlice";
import { useCountCodesQuery } from "@/slices/validationCodeApiSlice";
import {

  useTotalCountUsersQuery,
} from "@/slices/adminUsersApiSlice";
import WithAuth from "@/components/withAuth";
import {
  useCountVendorsQuery,
  useTotalVendorsQuery,
} from "@/slices/vendorsApliSlices";
import {
  useAdminNewReportProblemQuery,
  useTotalReportProblemQuery,
} from "@/slices/reportProblemApiSlice";

const AdminDashboard = () => {
  const {
    data: totalFonts,
    isLoading: isTotalFontsLoading,
    error: totalFontsError,
  } = useGetAdminALLFontsCountQuery();

  const {
    data: totalCountries,
    isLoading: isTotalCountriesLoading,
    error: totalCountriesError,
  } = useCountCountriesQuery();

  const {
    data: totalCodes,
    isLoading: isTotalCodesLoading,
    error: totalCodesError,
  } = useCountCodesQuery();

  const {
    data: totalVendors,
    isLoading: isTotalVendorsLoading,
    error: totalVendorsError,
  } = useTotalVendorsQuery();

  const {
    data: totalUsers,
    isLoading: isTotalUsersLoading,
    error: totalUsersError,
  } = useTotalCountUsersQuery();

  const {
    data: totalReportsData,
    isLoading: isTotalReportsDataLoading,
    error: TotalReportsDataError,
  } = useAdminNewReportProblemQuery({ page: 1 });

  const {
    data: totalReportProblem,
    isLoading: isTotalReportProblemLoading,
    error: TotalReportProblemError,
  } = useTotalReportProblemQuery();

  const cards = [
    {
      id: 1,
      title: "Users",
      count: isTotalUsersLoading
        ? "Loading"
        : totalUsersError
        ? totalUsersError?.data?.message
        : totalUsers?.verifiedUsers + totalUsers?.unverifiedUsers + " Total",
        verifiedUsers: totalUsers?.verifiedUsers + " verified",
        unverifiedUsers: totalUsers?.unverifiedUsers + " unverified",
      icon: <PeopleOutlineIcon fontSize="large" />,
    },
    {
      id: 2,
      title: "Vendor",
      count: isTotalVendorsLoading
        ? "Loading..."
        : totalVendorsError
        ? totalVendorsError?.data?.message
        : totalVendors?.verifiedVendors +
          totalVendors?.unverifiedVendors +
          " Total",
      verifiedVendors: totalVendors?.verifiedVendors + " verified",
      unverifiedVendors: totalVendors?.unverifiedVendors + " unverified",

      icon: <ShoppingBagIcon fontSize="large" />,
    },
    {
      id: 3,
      title: "Validation Codes",
      count: isTotalCodesLoading
        ? "Loading..."
        : totalCodesError
        ? totalCodesError?.data?.message
        : totalCodes?.totalValidationCodes + " Total",
      availableValidationCodes:
        totalCodes?.availableValidationCodes + "ValidationCodes",
      icon: <VerifiedUserIcon fontSize="large" />,
    },
    {
      id: 4,
      title: "Countries",
      count: isTotalCountriesLoading
        ? "Loading..."
        : totalCountriesError
        ? totalCountriesError?.data?.message
        : totalCountries?.totalCountries + " Total",
      activeCountries: totalCountries?.activeCountries + " Active",
      icon: <PublicIcon fontSize="large" />,
    },
    {
      id: 5,
      title: "Fonts",
      count: isTotalFontsLoading
        ? "Loading..."
        : totalFontsError
        ? totalFontsError?.data?.message
        : totalFonts?.totalFonts + " Total",
      activeFonts: totalFonts?.activeFonts + " Active",
      icon: <FontDownloadIcon fontSize="large" />,
    },
    {
      id: 6,
      title: "Report Problem",
      count: isTotalReportsDataLoading
        ? "Loading..."
        : TotalReportsDataError
        ? TotalReportsDataError?.data?.message
        : totalReportsData?.count + " Total",
      responded: totalReportProblem?.responded + " Responded",
      unresponded: totalReportProblem?.unresponded + " Unresponded",
      icon: <ReportProblemIcon fontSize="large" />,
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <Header />

      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col max-w-screen-xl mx-auto">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 overflow-auto">
              <div className="mb-6 flex items-center justify-between">
                <Typography
                  variant="h4"
                  component="h4"
                  className="font-bold text-gray-900"
                >
                  Admin Dashboard
                </Typography>
              </div>
              <Grid container spacing={3}>
                {cards.map((specs) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={specs.id}>
                    <Link
                      href={
                        specs.title === "Users"
                          ? "/users"
                          : specs.title === "Vendor"
                          ? "/vendors"
                          : specs.title === "Validation Codes"
                          ? "/validation-codes"
                          : specs.title === "Countries"
                          ? "/admin-countries"
                          : specs.title === "Fonts"
                          ? "/admin-fonts"
                          : specs.title === "Report Problem"
                          ? "/admin-report-problems"
                          : ""
                      }
                    >
                      <Card
                        className="hover:shadow-xl transition-shadow duration-300"
                        style={{ height: "100%" }}
                      >
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div>{specs.icon}</div>
                            <div>
                              <Typography
                                variant="h6"
                                className="text-gray-900"
                              >
                                {specs.title}
                              </Typography>
                              <Typography
                                variant="body1"
                                className="text-gray-600"
                              >
                                {specs.count}
                              </Typography>
                              {specs.activeFonts && (
                                <Typography
                                  variant="body2"
                                  className="text-green-500"
                                >
                                  <CheckCircleIcon fontSize="small" />{" "}
                                  {specs.activeFonts}
                                </Typography>
                              )}
                              {specs.activeCountries && (
                                <Typography
                                  variant="body2"
                                  className="text-green-500"
                                >
                                  <CheckCircleIcon fontSize="small" />{" "}
                                  {specs.activeCountries}
                                </Typography>
                              )}
                              {specs.responded && (
                                <Typography
                                  variant="body2"
                                  className="text-blue-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.responded}
                                </Typography>
                              )}
                              {specs.unresponded && (
                                <Typography
                                  variant="body2"
                                  className="text-red-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.unresponded}
                                </Typography>
                              )}
                              {specs.availableValidationCodes && (
                                <Typography
                                  variant="body2"
                                  className="text-yellow-500"
                                >
                                  <CheckCircleIcon fontSize="small" />{" "}
                                  {specs.availableValidationCodes}
                                </Typography>
                              )}
                              {specs.verifiedVendors && (
                                <Typography
                                  variant="body2"
                                  className="text-blue-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.verifiedVendors}
                                </Typography>
                              )}
                              {specs.unverifiedVendors && (
                                <Typography
                                  variant="body2"
                                  className="text-red-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.unverifiedVendors}
                                </Typography>
                              )}
                              {specs.verifiedUsers && (
                                <Typography
                                  variant="body2"
                                  className="text-blue-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.verifiedUsers}
                                </Typography>
                              )}
                              {specs.unverifiedUsers && (
                                <Typography
                                  variant="body2"
                                  className="text-red-500"
                                >
                                  <NotificationsIcon fontSize="small" />{" "}
                                  {specs.unverifiedUsers}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WithAuth(AdminDashboard, ["ADMIN"]);
