import * as React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  // { field: "id", headerName: "ID", width: 70 },
  { field: "fullName", headerName: "User name", width: 250 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "verificationCode", headerName: "Verification_Code", width: 250 },
];

const rows = [
  { id: 1, fullName: "Jon", email: "jon@gmail.com", verificationCode: 9870 },
  { id: 2, fullName: "Cersei", email: "jon@gmail.com", verificationCode: 9870 },
  { id: 3, fullName: "Jaime", email: "jon@gmail.com", verificationCode: 9870 },
  { id: 4, fullName: "Arya", email: "jon@gmail.com", verificationCode: 9870 },
  {
    id: 5,
    fullName: "Daenerys",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  { id: 6, fullName: "Afridi", email: "jon@gmail.com", verificationCode: 9870 },
  {
    id: 7,
    fullName: "Ferrara",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 8,
    fullName: "Rossini",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  { id: 9, fullName: "Harvey", email: "jon@gmail.com", verificationCode: 9870 },
  {
    id: 10,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 11,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 12,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 13,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 14,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
  {
    id: 15,
    fullName: "Harvey",
    email: "jon@gmail.com",
    verificationCode: 9870,
  },
];

export default function UsersTable() {
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

          <div className="w-full overflow-x-auto shadow-lg">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }} 
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
