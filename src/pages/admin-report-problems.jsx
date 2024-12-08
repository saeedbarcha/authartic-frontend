import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import useDebounce from "@/hooks/useDebounce";
import {
  useAdminNewReportProblemQuery,
  useAdminResponseReportMutation,
} from "@/slices/reportProblemApiSlice";

export default function PaginatedTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [reportData, setReportData] = useState({
    reportText: "",
    status: "",
    id: "",
  });

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch the data based on the debounced search query and filter
  const {
    data: reportsData,
    isLoading: isReportsLoading,
    error: reportsError,

    refetch: reportsDataRefetch,
  } = useAdminNewReportProblemQuery({
    limit: 1000, // Fetch a large number of rows to avoid pagination
    status: "active", // Always fetch only active reports
    id: debouncedSearchQuery,
  });

  const [
    adminResponseReport,
    { isLoading: isUpdateReportLoading, error: updateReportError },
  ] = useAdminResponseReportMutation();

  // Effect to handle data fetching and setting rows
  useEffect(() => {
    if (reportsData?.data) {
      const formattedRows = reportsData.data.map((report) => ({
        id: report.id,
        date: report.reporting_date,
        reportText: report.reporting_text,
        vendorName: report.vendor?.user_name,
        status: report.report_status,
      }));

      setRows(formattedRows);
    }
  }, [reportsData]);

  // Effect to fetch reports data on search query change
  useEffect(() => {
    reportsDataRefetch();
  }, [debouncedSearchQuery, reportsDataRefetch]);

  // Handle Edit Click
  const handleEdit = (row) => {
    setSelectedReport(row);
    setReportData({
      reportText: row.reportText || "", // Load existing report text
      status: row.status,
      id: row.id,
    });
    setOpenEditModal(true);
  };

  // Handle Save (Update Report)
  const handleSend = async () => {
    try {
      if (selectedReport) {
        // Await the adminResponseReport API call
        const res = await adminResponseReport({
          id: selectedReport.id,
          responseText: reportData.reportText,
          reportStatus: parseInt(reportData.status, 10),
        }).unwrap(); // Assuming unwrap is needed if using RTK Query

        // Refetch data and close the modal upon success
        reportsDataRefetch();
        handleModalClose();

        // Show success toast
        toast.success(
          res?.message || res?.data?.message || "Report sent successfully!"
        );
      }
    } catch (error) {
      // Show error toast if something goes wrong
      toast.error(
        error.message ||
          error?.data?.message ||
          "Failed to send report. Please try again."
      );
    }
  };

  // Handle Modal Close and Clear State
  const handleModalClose = () => {
    setOpenEditModal(false);
    setReportData({
      reportText: "",
      status: "",
      id: "",
    });
    setSelectedReport(null);
  };

  // Handle Status Change
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setReportData({
      ...reportData,
      status: newStatus,
      reportText:
        newStatus === "1" || newStatus === "2" ? "" : reportData.reportText, // Clear report text if status is 1 or 2
    });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 180,
      headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
    },
    {
      field: "reportText",
      headerName: "Report Text",
      flex: 1,
      minWidth: 200,
      headerClassName:
        "bg-[#22477F] text-slate-100 font-bold text-md md:text-lg",
    },
    {
      field: "vendorName",
      headerName: "Vendor Name",
      flex: 1,
      minWidth: 180,
      headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
    },
    {
      field: "update",
      headerName: "Update Report",
      flex: 1,
      minWidth: 150,
      headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleEdit(params.row)}
          disabled={params.row.status === 3 || params.row.status === 4} // Disable the button if status is 3 or 4
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Header />
      <Box sx={{ width: "100%", height: "auto", flexGrow: 1 }}>
        <div className="w-full md:w-[90%] lg:w-[70%] mx-auto mt-3">
          <Box sx={{ mb: "2rem" }}>
            <Link
              href={"/admin-dashboard"}
              className="flex items-center justify-start gap-1"
            >
              <ArrowBack color="primary" />
              <Typography
                variant="h6"
                color={"primary"}
                className="text-sm sm:text-base md:text-lg"
              >
                Admin Dashboard
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" color={"primary"} marginBottom={1}>
              Active Reports
            </Typography>
          </Box>

          <Box sx={{ width: "100%", height: "auto", mb: "1rem" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by Report ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          <Box sx={{ width: "100%", height: "450px", overflow: "auto" }}>
            {isReportsLoading && (
              <Typography variant="h5" color={"primary"}>
                Loading...
              </Typography>
            )}
            {reportsError && (
              <Typography variant="h5" color={"error"}>
                {reportsError?.message || "Error loading reports"}
              </Typography>
            )}

            <DataGrid
              disableColumnFilter
              disableColumnMenu
              rows={rows}
              columns={columns}
              pageSize={rows.length} // Set pageSize to number of rows to display all data
              rowsPerPageOptions={[]} // Disable options to change page size
              pagination={false} // Disable pagination
              paginationMode="client" // Switch to client-side pagination (although pagination is disabled)
            />
          </Box>
        </div>
      </Box>
      <Footer />

      {/* Edit Report Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleModalClose}
        maxWidth="sm" // Set maximum width
        fullWidth // Use full width of the container
      >
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent
          sx={{ width: "600px" }} // Custom width for content
        >
          <Typography variant="body1" color="textSecondary" mb={2}>
            Report ID: {reportData.id}
          </Typography>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={reportData.status || ""} // Use the reportData.status for editing, default to empty if undefined
              label="Status"
              onChange={handleStatusChange} // Update state and clear text if needed
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Response Text"
            type="text"
            fullWidth
            variant="outlined"
            multiline // Make it a text area
            rows={6} // Number of visible rows
            value={reportData.reportText || ""} // Use the reportData.reportText for editing, default to empty if undefined
            onChange={(e) =>
              setReportData({ ...reportData, reportText: e.target.value })
            }
            disabled={reportData.status === 1 || reportData.status === 2} // Disable if status is 1 or 2
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            color="primary"
            disabled={isUpdateReportLoading}
          >
            {isUpdateReportLoading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
