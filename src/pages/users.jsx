import * as React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { DataGrid } from "@mui/x-data-grid";
import { useCountUsersQuery } from "@/slices/adminUsersApiSlice"; // Assuming this fetches users

import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const columns = [
  { field: "user_name", headerName: "User Name", width: 250 },
  { field: "email", headerName: "Email", width: 250 },
];

export default function UsersTable() {
  const [userPage, setUserPage] = React.useState(1); // User pagination state
  const [userPageSize, setUserPageSize] = React.useState(10); // User page size
  const [searchName, setSearchName] = React.useState(""); // Search term for filtering users

  const [searchValue, setSearchValue] = React.useState(""); // Local state for search input

  // Define the query params to be passed to the API
  const alluserQueryParams = {
    page: userPage,
    limit: userPageSize,
  };

  // Query to fetch users
  const { data: totalUsers, isLoading: isTotalUsersLoading, error: totalUsersError } = useCountUsersQuery(alluserQueryParams);

  

  // Handle search value change
  const handleSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  // Handle submitting the search (filtering users)
  const handleGetSearchResult = () => {
    setSearchName(searchValue);
  };

  // Handle pagination change
  const handlePaginationChange = ({ page, pageSize }) => {
    setUserPage(page + 1); // Pagination in API is 1-indexed
    setUserPageSize(pageSize);
  };

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <Header />

        <div className="w-screen lg:w-[1010px] h-full mx-auto mb-7 px-2 md:px-7">
          <div className="my-7 text-left w-full">
            <Link
              href={"/admin-dashboard"}
              className="font-koHo font-bold text-1xl text-blue-900 flex items-center justify-start"
            >
              <ArrowBack /> Dashboard
            </Link>
          </div>

          <div className="text-left w-full">
            <h1 className="font-Poppins font-semibold text-1xl md:text-[27px] xl:text-2xl">
              Users
            </h1>
          </div>

          {/* Search Box */}
          {/* <Box sx={{ width: "100%", mt: "3rem", mb: "1rem" }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchValue}
              onChange={handleSearchValue}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      fontSize="large"
                      sx={{ cursor: "pointer" }}
                      onClick={handleGetSearchResult}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box> */}

          {/* DataGrid to display the users */}
          <div className="w-full overflow-x-auto shadow-lg">
            <DataGrid
              rows={totalUsers?.data || []} // Use the fetched user data
              columns={columns}
              pageSize={userPageSize}
              autoHeight
              pagination
              paginationMode="server"
              rowCount={totalUsers?.totalCount || 0} // Total users count for pagination
              paginationModel={{
                page: userPage - 1, // DataGrid expects 0-indexed pages
                pageSize: userPageSize,
              }}
              onPaginationModelChange={handlePaginationChange}
              loading={isTotalUsersLoading}
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
