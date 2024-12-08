import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  useCreateCountryMutation,
  useFindAllCountriesQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
} from "@/slices/countriesApiSlice";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Switch,
} from "@mui/material";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";

const options = [
  { name: "Active Countries", isActive: true },
  { name: "Inactive Countries", isActive: false },
  { name: "Create Countries" },
];

const ITEM_HEIGHT = 48;

export default function PaginatedTable() {
  const [tableRows, setTableRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [page, setPage] = useState(1);
  const [isActiveCountry, setIsActiveCountry] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [
    createCountry,
    { isLoading: isCreateCountryLoading, error: createCountryError },
  ] = useCreateCountryMutation();
  const [
    updateCountry,
    { isLoading: isUpdateCountryLoading, error: updateCountryError },
  ] = useUpdateCountryMutation();
  const [
    deleteCountry,
    { isLoading: isDeleteCountryLoading, error: deleteCountryError },
  ] = useDeleteCountryMutation();
  const { data, isLoading, error, refetch } = useFindAllCountriesQuery(
    {
      page,
      limit: 10,
      isActiveCountry,
      name: searchTerm,
    },
    { skip: !page }
  );

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_deleted: false,
    status: 1,
  });
  const [createFormData, setCreateFormData] = useState({
    name: "",
    code: "",
  });

  // Menu states
  const [openClose3DotsMenu, setOpenClose3DotsMenu] = useState(null);
  const open = Boolean(openClose3DotsMenu);

  const handleThreeDotsClick = (event) => {
    setOpenClose3DotsMenu(event.currentTarget);
  };

  const handleClose = (isactive) => {
    setOpenClose3DotsMenu(null);
    setIsActiveCountry(isactive);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleUpdate = (country) => {
    setSelectedCountry(country);
    setFormData({
      name: country.name || "",
      code: country.code || "",
      is_deleted: country.is_deleted || false,
      status: country.status || 1,
    });
    setOpenModal(true);
  };

  const handleDelete = useCallback(
    (id) => {
      toast.info("Deleting country...");
      deleteCountry({ id })
        .then(() => {
          refetch();
          toast.success("Country deleted successfully!");
        })
        .catch(() => {
          toast.error("Failed to delete country.");
        });
    },
    [deleteCountry, refetch]
  );

  const handleCreateCountry = () => {
    setOpenCreateModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: value,
    });
  };

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? 2 : 1;
    setFormData({ ...formData, status: newStatus });
  };

  const handleSubmit = async () => {
    toast.info("Updating country...");

    try {
      if (selectedCountry) {
        // Await the updateCountry call
        const response = await updateCountry({
          id: selectedCountry.id,
          bodyData: formData,
        }).unwrap();

        // Refetch the data and update the UI
        refetch();
        setOpenModal(false);

        // Show success toast
        toast.success(
          response?.message ||
            response?.data?.message ||
            "Country updated successfully!"
        );
      }
    } catch (error) {
      // Show error toast if something goes wrong
      toast.error(
        error?.message || error?.data?.message || "Failed to update country."
      );
    }
  };

  const handleCreateSubmit = async () => {
    toast.info("Creating country...");

    try {
      // Await the createCountry call
      const res = await createCountry(createFormData).unwrap(); // Assuming unwrap is needed if using RTK Query

      // Refetch data and update the UI
      refetch();
      setOpenCreateModal(false);
      setCreateFormData({ name: "", code: "" });

      // Show success toast
      toast.success(
        res?.message || res?.data?.message || "Country created successfully!"
      );
    } catch (error) {
      // Show error toast if something goes wrong
      toast.error(
        error?.message || error?.data?.message || "Failed to create country."
      );
    }
  };

  useEffect(() => {
    if (isLoading) {
      toast.info("Loading data...");
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      setColumns([
        {
          field: "id",
          headerName: "ID",
          minWidth: 100,
          headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
        },
        {
          field: "code",
          headerName: "Code",
          minWidth: 150,
          headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
        },
        {
          field: "name",
          headerName: "Country",
          flex: 1,
          minWidth: 100,
          headerClassName:
            "bg-[#22477F] text-slate-100 font-bold text-md md:text-lg",
        },
        {
          field: "update",
          headerName: "Update Country",
          flex: 1,
          minWidth: 150,
          headerClassName:
            "bg-[#22477F] text-slate-100 font-bold text-md md:text-lg",
          renderCell: (params) => (
            <IconButton
              aria-label="update"
              onClick={() => handleUpdate(params.row)}
            >
              <EditIcon />
            </IconButton>
          ),
        },
        {
          field: "delete",
          headerName: "Delete Country",
          flex: 1,
          minWidth: 150,
          headerClassName:
            "bg-[#22477F] text-slate-100 font-bold text-md md:text-lg",
          renderCell: (params) => (
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ]);
      setTableRows(
        data.data.length > 0
          ? data.data
          : [{ id: 1, name: "No countries found" }]
      );
      setDataLength(data.totalCount);
    }
    if (error) {
      setColumns([
        {
          field: "status",
          headerName: "Status Code",
          minWidth: 200,
          headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
        },
        {
          field: "message",
          headerName: "Message",
          flex: 1,
          minWidth: 250,
          headerClassName: "bg-[#22477F] text-slate-100 text-md md:text-lg",
        },
      ]);
      setTableRows([
        { id: 1, status: error.status, message: error.data.message },
      ]);
      setDataLength(0);
    }
  }, [data, error, handleDelete]);

  useEffect(() => {
    refetch();
  }, [page, isActiveCountry, searchTerm, refetch]);

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100">
      <Box sx={{ width: "100%", height: "auto" }}>
        <Header />
        <div className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-3">
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
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" color={"primary"} marginBottom={1}>
                {isActiveCountry ? "Active Countries" : "Inactive Countries"}
              </Typography>
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleThreeDotsClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={openClose3DotsMenu}
                  open={Boolean(openClose3DotsMenu)}
                  onClose={() => setOpenClose3DotsMenu(null)}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "20ch",
                    },
                  }}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      selected={option.isActive === isActiveCountry}
                      onClick={() => {
                        if (option.name === "Create Countries") {
                          handleCreateCountry();
                        } else {
                          handleClose(option.isActive);
                        }
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            </Box>

            <Box sx={{ width: "100%", mb: 2 }}>
              <TextField
                label="Search by Country Name"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "450px",
                overflow: "auto",
              }}
            >
              {isLoading && (
                <Typography variant="h5" color={"primary"}>
                  Loading...
                </Typography>
              )}
              <DataGrid
                disableColumnFilter
                disableColumnMenu
                rows={tableRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                pagination
                paginationMode="server"
                rowCount={dataLength || 0}
                paginationModel={{
                  page: page - 1,
                  pageSize: 10,
                }}
                onPaginationModelChange={({ page }) => setPage(page + 1)}
              />
            </Box>
          </Box>
        </div>
      </Box>
      <Footer />

      {/* Modal for Edit Country */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-blue-500 text-white">
          Edit Country
        </DialogTitle>
        <DialogContent className="bg-gray-100">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "1rem",
            }}
          >
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleFormChange}
              className="bg-white"
            />
            <TextField
              label="Code"
              name="code"
              variant="outlined"
              value={formData.code}
              onChange={handleFormChange}
              className="bg-white"
            />
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="bg-white p-2 rounded-md"
            >
              <Typography variant="body1" className="mr-2">
                Is Deleted
              </Typography>
              <Checkbox
                name="is_deleted"
                checked={formData.is_deleted}
                onChange={handleFormChange}
                className="bg-gray-200"
              />
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="bg-white p-2 rounded-md"
            >
              <Typography variant="body1" className="mr-2">
                Status
              </Typography>
              <Switch
                checked={formData.status === 2}
                onChange={handleSwitchChange}
                color="primary"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="bg-gray-200">
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Create Country */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-blue-500 text-white">
          Create Country
        </DialogTitle>
        <DialogContent className="bg-gray-100">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: "1rem",
            }}
          >
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              value={createFormData.name}
              onChange={handleCreateFormChange}
              className="bg-white"
            />
            <TextField
              label="Code"
              name="code"
              variant="outlined"
              value={createFormData.code}
              onChange={handleCreateFormChange}
              className="bg-white"
            />
          </Box>
        </DialogContent>
        <DialogActions className="bg-gray-200">
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button
            onClick={handleCreateSubmit}
            variant="contained"
            color="primary"
          >
            Create Country
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
