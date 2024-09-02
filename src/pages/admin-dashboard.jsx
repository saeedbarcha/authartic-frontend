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
import { Typography } from "@mui/material";
import { useGetAdminALLFontsCountQuery } from "@/slices/fontApiSlice";
import { useCountCountriesQuery } from "@/slices/countriesApiSlice";
import { useCountCodesQuery } from "@/slices/validationCodeApiSlice";
import { useCountUsersQuery } from "@/slices/adminUsersApiSlice";
import WithAuth from '@/components/withAuth';
import { useCountVendorsQuery } from "@/slices/vendorsApliSlices";
import { useAdminNewReportProblemQuery } from "@/slices/reportProblemApiSlice";

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
  } = useCountVendorsQuery();
  const {
    data: totalUsers,
    isLoading: isTotalUsersLoading,
    error: totalUsersError,
  } = useCountUsersQuery({ page: 1, limit: 12 });

  const {
    data: totalReportsData,
    isLoading: isTotalReportsDataLoading,
    error: TotalReportsDataError,
  } = useAdminNewReportProblemQuery({ page: 1 });

  useEffect(() => {
    if (totalUsers) {
      // Handle side effects if needed
    }
  }, [totalUsers, totalUsersError]);

  const cards = [
    {
      id: 1,
      title: "Users",
      count: isTotalUsersLoading
        ? "Loading"
        : totalUsersError
        ? totalUsersError?.data?.message
        : totalUsers?.totalCount || 0,
      icon: <PeopleOutlineIcon fontSize="large" />,
    },
    {
      id: 2,
      title: "Vendor",
      count: isTotalVendorsLoading
        ? "Loading..."
        : totalVendorsError
        ? totalVendorsError?.data?.message
        : totalVendors.totalCount || 0,
      icon: <ShoppingBagIcon fontSize="large" />,
    },
    {
      id: 3,
      title: "Validation Codes",
      count: isTotalCodesLoading
        ? "Loading..."
        : totalCodesError
        ? totalCodesError?.data?.message
        : totalCodes?.totalValidationCodes || 0,
      icon: <VerifiedUserIcon fontSize="large" />,
    },
    {
      id: 4,
      title: "Countries",
      count: isTotalCountriesLoading
        ? "Loading..."
        : totalCountriesError
        ? totalCountriesError?.data?.message
        : totalCountries?.totalCountries || 0,
      icon: <PublicIcon fontSize="large" />,
    },
    {
      id: 5,
      title: "Fonts",
      count: isTotalFontsLoading
        ? "Loading..."
        : totalFontsError
        ? totalFontsError?.data?.message
        : totalFonts?.totalFonts || 0,
      icon: <FontDownloadIcon fontSize="large" />,
    },
    {
      id: 6,
      title: "Report Problem",
      count: isTotalReportsDataLoading
        ? "Loading..."
        : TotalReportsDataError
        ? TotalReportsDataError?.data?.message
        : totalReportsData?.count || 0,
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cards.map((specs) => (
                  <Link
                    key={specs.id}
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
                    <div className="bg-white shadow-md rounded-lg p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow">
                      <div className="flex-shrink-0">{specs.icon}</div>
                      <div>
                        <Typography variant="h6" className="text-gray-900">
                          {specs.title}
                        </Typography>
                        <Typography variant="body1" className="text-gray-600">
                          {specs.count}
                        </Typography>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WithAuth(AdminDashboard, ["ADMIN"]);
