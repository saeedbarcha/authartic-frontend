import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { DataGrid } from "@mui/x-data-grid";
import { useGetValidationCodeDetailsQuery } from "@/slices/validationCodeApiSlice";
import {
  useGetAllVendorsByAdminQuery,
  useVerifyVendorByAdminMutation,
} from "@/slices/vendorsApliSlices";
import VerificationModal from "@/components/VerificationModal";
import Head from "next/head";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

const options = [
  { name: "Verified users", is_verified: true },
  { name: "Unverified users", is_verified: false },
];

const ITEM_HEIGHT = 48;

export default function UsersTable() {
  const [vendorId, setVendorId] = useState(null);
  const [isVerifiedVendors, setIsVerifiedVendors] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [vendorPage, setVendorPage] = useState(1);
  const [vendorPageSize, setVendorPageSize] = useState(10);
  const [codePage, setCodePage] = useState(1);
  const [codePageSize, setCodePageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [vendorColumns, setVendorColumns] = useState([]);
  const [verificationCodes, setVerificationCodes] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const allVendorsQueryParams = {
    page: vendorPage,
    limit: vendorPageSize,
    is_verified: isVerifiedVendors,
    name: searchName,
  };

  const [verifyVendor] = useVerifyVendorByAdminMutation();
  const {
    data: allVendors,
    isLoading: isAllVendorsLoading,
    error: allVendorsError,
    refetch: fetchVendorsAgain,
  } = useGetAllVendorsByAdminQuery(allVendorsQueryParams);
  const { data: allCodes, refetch: fetchCodesAgain } =
    useGetValidationCodeDetailsQuery({
      page: codePage,
      limit: codePageSize,
      isUsed: false,
    });

  const [isOpenVendors3DotsMenu, setIsOpenVendors3DotsMenu] = useState(null);
  const open3DotsMenu = Boolean(isOpenVendors3DotsMenu);

  const handle3DotsClick = (event) => {
    setIsOpenVendors3DotsMenu(event.currentTarget);
  };

  const handle3DotsClose = (toggleVerifiedAndunverified) => {
    if (toggleVerifiedAndunverified !== undefined) {
      setIsVerifiedVendors(toggleVerifiedAndunverified);
    }
    setIsOpenVendors3DotsMenu(null);
  };

  const handleVerificationSuccess = (code) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.verificationCode === code ? { ...row, verified: true } : row
      )
    );
  };

  const handleSearchValue = (event) => {
    setSearchValue(event.target.value);
  };
  const handleGetSearchResult = () => {
    setSearchName(searchValue);
  };

  useEffect(() => {
    fetchVendorsAgain();
    fetchCodesAgain(); // Ensure codes are fetched whenever vendor filter changes
  }, [
    fetchVendorsAgain,
    fetchCodesAgain,
    vendorPage,
    vendorPageSize,
    isVerifiedVendors,
  ]);

  useEffect(() => {
    if (allVendors) {
      if (allVendorsError) {
        setVendorColumns([
          {
            field: "status",
            headerName: "Status Code",
            minWidth: 150,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "message",
            headerName: "Message",
            flex: 1,
            minWidth: 250,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
        ]);
        setRows([
          {
            id: 1,
            status: allVendorsError?.status,
            message: allVendorsError?.data?.message,
          },
        ]);
      } else {
        setVendorColumns([
          {
            field: "id",
            headerName: "ID",
            minWidth: 70,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "vendor_name",
            headerName: "Vendor name",
            flex: 1,
            minWidth: 150,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 220,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "country",
            headerName: "Country",
            flex: 1,
            minWidth: 150,
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "verified",
            headerName: "Verified",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
              <div>
                {params?.row?.validation_code ? (
                  <DoneIcon style={{ color: "green" }} />
                ) : (
                  <CloseIcon style={{ color: "red" }} />
                )}
              </div>
            ),
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
          {
            field: "verificationCode",
            headerName: "Verification Code",
            flex: 1,
            minWidth: 250,
            renderCell: (params) =>
              params?.row?.validation_code ? (
                params?.row?.validation_code
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <EditNoteIcon
                    style={{ color: "black", cursor: "pointer" }}
                    onClick={() => {
                      setOpen(true); // Open the modal
                      setVendorId(params.id);
                    }}
                  />
                </div>
              ),
            headerClassName: "bg-[#22477F] text-slate-100 text-md",
          },
        ]);
        setRows(allVendors.data);
      }
    } else {
      setVendorColumns([
        {
          field: "status",
          headerName: "Status Code",
          minWidth: 150,
          headerClassName: "bg-[#22477F] text-slate-100 text-md",
        },
        {
          field: "message",
          headerName: "Message",
          flex: 1,
          minWidth: 250,
          headerClassName: "bg-[#22477F] text-slate-100 text-md",
        },
      ]);
      setRows([
        {
          id: 1,
          status: allVendorsError?.status,
          message: allVendorsError?.data?.message,
        },
      ]);
    }
  }, [allVendors, allVendorsError, fetchVendorsAgain, isVerifiedVendors]);

  useEffect(() => {
    if (allCodes) {
      setVerificationCodes(
        allCodes.data.map((code) => ({
          id: code.id,
          code: code.code,
        }))
      );
    }
  }, [allCodes]);

  const VerificationCodesColumns = [
    {
      field: "code",
      headerName: "Available Codes",
      flex: 1,
      minWidth: 200,
      headerClassName: "bg-[#22477F] text-slate-100 text-md",
    },
  ];

  return (
    <>
      <Head>
        <title>Vendors</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <Header />

        <div className="w-full flex flex-col justify-between mx-auto max-w-screen-xl px-2 md:px-7">
          <div className="my-7 text-left w-full">
            <Link
              href={"/admin-dashboard"}
              className="font-koHo font-bold text-1xl text-blue-900 flex items-center justify-start"
            >
              <ArrowBack /> Dashboard
            </Link>
          </div>

          <div className="flex items-start lg:items-end gap-11 flex-col lg:flex-row">
            <div className="w-full h-auto overflow-x-auto">
              <div className="text-left w-full mb-4 flex items-center justify-between">
                <h1 className="font-Poppins font-semibold text-1xl md:text-[27px] xl:text-2xl">
                  {isVerifiedVendors ? "Vendors" : "Unverified Vendors"}
                </h1>
                <div>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open3DotsMenu ? "long-menu" : undefined}
                    aria-expanded={open3DotsMenu ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handle3DotsClick}
                    color="primary"
                  >
                    <MoreVertIcon fontSize="large" />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{ "aria-labelledby": "long-button" }}
                    anchorEl={isOpenVendors3DotsMenu}
                    open={open3DotsMenu}
                    onClose={() => handle3DotsClose()}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option.name}
                        selected={option.is_verified === isVerifiedVendors}
                        onClick={() => handle3DotsClose(option.is_verified)}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  mt: "3rem",
                  mb: "1rem",
                }}
              >
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
              </Box>
              <div className="w-full h-[450px] overflow-x-auto shadow-lg">
                <DataGrid
                  disableColumnMenu
                  rows={rows}
                  columns={vendorColumns}
                  pageSize={vendorPageSize}
                  pagination
                  pageSizeOptions={[vendorPageSize]}
                  paginationMode="server"
                  rowCount={allVendors?.totalCount || 0}
                  paginationModel={{
                    page: vendorPage - 1,
                    pageSize: vendorPageSize,
                  }}
                  onPaginationModelChange={({ page, pageSize }) => {
                    setVendorPage(page + 1);
                    setVendorPageSize(pageSize);
                  }}
                />
              </div>
            </div>

            <div className="w-full h-[450px] overflow-x-auto shadow-lg lg:w-1/3">
              <DataGrid
                disableColumnMenu
                rows={verificationCodes}
                columns={VerificationCodesColumns}
                pageSize={codePageSize}
                pagination
                paginationMode="server"
                rowCount={allCodes?.totalCount || 0}
                paginationModel={{
                  page: codePage - 1,
                  pageSize: codePageSize,
                }}
                onPaginationModelChange={({ page, pageSize }) => {
                  setCodePage(page + 1);
                  setCodePageSize(pageSize);
                }}
              />
            </div>
          </div>
        </div>

        <Footer />
        
        <VerificationModal
          open={open}
          handleClose={() => setOpen(false)}
          handleVerificationSuccess={handleVerificationSuccess}
          verifyVendorFunc={verifyVendor}
          vendorId={vendorId}
          fetchVendorsAgain={fetchVendorsAgain}
          fetchCodesAgain={fetchCodesAgain} // Pass the refetch function to modal
        />
      </div>
    </>
  );
}
