import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetValidationCodeDetailsQuery, useCreateValidationCodeMutation } from '@/slices/validationCodeApiSlice';
import { Box, Typography, Button, TextField, Modal } from '@mui/material';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';

const options = [
  { name: 'Used codes', isUsed: true },
  { name: 'Available codes', isUsed: false },
  { name: 'Add Codes' }
];

const columns = [
  { field: 'id', headerName: 'ID', width: 100, headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg' },
  { field: 'is_used', headerName: 'Is Used', minWidth: 150, headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg' },
  { field: 'code', headerName: 'Code', flex: 1, minWidth: 100, headerClassName: 'bg-[#22477F] text-slate-100 font-bold text-md md:text-lg' },
];

const ITEM_HEIGHT = 48;

export default function PaginatedTable() {
  const [tableRows, setTableRows] = useState([]);
  const [page, setPage] = useState(1);
  const [isUsed, setIsUsed] = useState(false);
  const [numberOfCodes, setNumberOfCodes] = useState('');
  const [createValidationCode, { isLoading: isCreateValidationLoading, error: isCreateValidationError }] = useCreateValidationCodeMutation();
  const { data, isLoading, error, refetch } = useGetValidationCodeDetailsQuery({
    page,
    limit: 10,
    isUsed
  });

  useEffect(() => {
    refetch(); // Fetch data when page or isUsed changes
  }, [page, isUsed, refetch]);

  useEffect(() => {
    if (error) {
      toast.info(error?.message || error?.data?.message || 'An error occurred')
      setTableRows([{ id: 1, code: error?.data?.message }]);
    } else {
      setTableRows(data?.data || []);
    }
  }, [data, error]);

  const [openClose3DotsMenu, setOpenClose3DotsMenu] = useState(null);
  const open = Boolean(openClose3DotsMenu);

  const handleThreeDotsClick = (event) => {
    setOpenClose3DotsMenu(event.currentTarget);
  };

  const handleClose = (isused) => {
    setOpenClose3DotsMenu(null);
    if (typeof isused === 'boolean') {
      setIsUsed(isused);
    }
  };

  const [handleModelOpen, setHandleModelOpen] = useState(false);

  const handleModalOpen = () => setHandleModelOpen(true);
  const handleModalClose = () => {
    setHandleModelOpen(false);
    setNumberOfCodes('');
  };

  const submitHandler = async () => {
    try {
      if (numberOfCodes && !isNaN(numberOfCodes)) {
        await createValidationCode(Number(numberOfCodes));
        toast.success('Validation codes created successfully!');
        refetch(); // Refetch data after creating validation codes
      } else {
        toast.error('Please enter a valid number.');
      }
    } catch (error) {
      toast.error('An error occurred while creating validation codes.');
    }
    handleModalClose();
  };

  return (
    <div className='w-full min-h-screen flex flex-col justify-between'>
      <Header />

      <div className='w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Box sx={{ mb: "2rem" }}>
          <Link href={'/admin-dashboard'} className='flex items-center justify-start gap-1'>
            <ArrowBack color='primary' />
            <Typography variant='h6' color={'primary'} className='text-sm sm:text-base md:text-lg'>
              Admin Dashboard
            </Typography>
          </Link>
        </Box>

        <Box sx={{ width: '100%', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant='h5' color={'primary'}>
            {isUsed ? 'Used Codes' : 'Available Codes'}
          </Typography>
          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleThreeDotsClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={openClose3DotsMenu}
              open={open}
              onClose={() => setOpenClose3DotsMenu(null)}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  selected={option.isUsed === isUsed}
                  onClick={() => {
                    if (option.name === 'Add Codes') {
                      handleModalOpen();
                    } else {
                      handleClose(option.isUsed);
                    }
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>

        <Box sx={{ width: '100%', height: 'auto', maxHeight: 450, overflow: 'auto' }}>
          {isLoading && <Typography variant='h5' color={"primary"}>Loading...</Typography>}

          <DataGrid
            disableColumnFilter
            disableColumnMenu
            rows={tableRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            pagination
            paginationMode="server"
            rowCount={data?.totalCount || 0}
            paginationModel={{
              page: page - 1,
              pageSize: 10,
            }}
            onPaginationModelChange={({ page }) => setPage(page + 1)}
          />
        </Box>
      </div>

      <Modal
        open={handleModelOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-lg w-full">
              <Typography id="modal-title" variant="h6" component="h2">
                Creating Validation Code
              </Typography>
              <Typography id="modal-description" className="mt-2">
                Please enter the number of validation codes to generate
              </Typography>
              <TextField
                label="Number of Validation Codes"
                variant="outlined"
                fullWidth
                type="number"
                value={numberOfCodes}
                onChange={(e) => setNumberOfCodes(e.target.value)}
                className="mt-4"
              />
              <Button
                onClick={submitHandler}
                variant="contained"
                color="primary"
                className="mt-4"
              >
                Create
              </Button>
              <Button
                onClick={handleModalClose}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
