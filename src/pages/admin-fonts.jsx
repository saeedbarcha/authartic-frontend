import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useDebounce from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import { useCreateAdminNewFontMutation, useGetAdminAllFontsQuery, useGetAdminALLFontsCountQuery, useUpdateAdminFontMutation, useDeleteAdminFontMutation } from '@/slices/fontApiSlice';

const options = [
    { name: 'Active Fonts', isActive: true },
    { name: 'Inactive Fonts', isActive: false },
    { name: 'Create Fonts', isCreate: true }
];

const ITEM_HEIGHT = 48;
const PAGE_SIZE = 10; // Number of rows per page

export default function PaginatedTable() {
    const [isActiveFont, setIsActiveFont] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [selectedFont, setSelectedFont] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [fontData, setFontData] = useState({ name: '', family: '' });
    const [rows, setRows] = useState([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const { data: allFontsData, isLoading: isAllFontsLoading, error: allFontsError, refetch: allFontDataRefetch } = useGetAdminAllFontsQuery({
        page,
        limit: pageSize,
        name: debouncedSearchQuery,
        is_active: isActiveFont
    });

    const [createFont, { isLoading: isCreateFontLoading, error: createFontError }] = useCreateAdminNewFontMutation();
    const [updateFont, { isLoading: isUpdateFontLoading, error: updateFontError }] = useUpdateAdminFontMutation();
    const [deleteFont, { isLoading: isDeleteFontLoading, error: deleteFontError }] = useDeleteAdminFontMutation();

    const { data: allFontsCountData } = useGetAdminALLFontsCountQuery();

    useEffect(() => {
        if (allFontsCountData) {
            setTotalCount(allFontsCountData.totalFonts || 0);
        }
    }, [allFontsCountData]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, isActiveFont]);

    useEffect(() => {
        if (allFontsData?.data) {
            const sortedRows = [...allFontsData.data].sort((a, b) => a.id - b.id);
            setRows(sortedRows);
        }
    }, [allFontsData]);

    const [openClose3DotsMenu, setOpenClose3DotsMenu] = useState(null);
    const open = Boolean(openClose3DotsMenu);

    const handleThreeDotsClick = (event) => {
        setOpenClose3DotsMenu(event.currentTarget);
    };

    const handleClose = (option) => {
        setOpenClose3DotsMenu(null);
        if (option.isActive !== undefined) {
            setIsActiveFont(option.isActive);
            setPage(1);
        }
        if (option.isCreate) {
            setOpenCreateModal(true);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleEdit = (row) => {
        setSelectedFont(row);
        setFontData({ name: row.name, family: row.family });
        setOpenEditModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteFont(id).unwrap();
            allFontDataRefetch();
        } catch (error) {
            // Handle error
        }
    };

    const handleModalClose = () => {
        setOpenEditModal(false);
        setOpenCreateModal(false);
    };

    const handleSave = async () => {
        try {
            if (selectedFont) {
                const updatedFont = await updateFont({
                    id: selectedFont.id,
                    bodyData: fontData
                }).unwrap();
    
                setRows(prevRows =>
                    [...prevRows.map(row => row.id === updatedFont.id ? updatedFont : row)].sort((a, b) => a.id - b.id)
                );
    
                allFontDataRefetch();
                handleModalClose();
    
                // Show success toast
                toast.success( updatedFont?.message || updatedFont?.data?.message || "Font updated successfully!");
            } else {
            const response =    await createFont(fontData).unwrap();
                allFontDataRefetch();
                handleModalClose();
    
                // Show success toast
                toast.success(response?.message || response?.data?.message || "Font created successfully!");
            }
        } catch (error) {
            // Show error toast
            toast.error(error?.message || error?.data?.message || "An error occurred while saving the font. Please try again.");
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 100, headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg' },
        { field: 'name', headerName: 'Font Name', flex: 1, minWidth: 200, headerClassName: 'bg-[#22477F] text-slate-100 font-bold text-md md:text-lg' },
        {
            field: 'update',
            headerName: 'Update Font',
            flex: 1, minWidth: 150,
            headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg',
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row)}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete Font',
            flex: 1, minWidth: 150,
            headerClassName: 'bg-[#22477F] text-slate-100 text-md md:text-lg',
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ];

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow'>
                <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', p: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Link href={'/admin-dashboard'} className='flex items-center gap-1'>
                            <ArrowBack color='primary' />
                            <Typography variant='h6' color={'primary'}>
                                Admin Dashboard
                            </Typography>
                        </Link>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant='h5' color={'primary'}>
                            {isActiveFont ? 'Active Fonts' : 'Inactive Fonts'}
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
                                open={Boolean(openClose3DotsMenu)}
                                onClose={() => setOpenClose3DotsMenu(null)}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                    },
                                }}
                            >
                                {options.map((option, index) => (
                                    <MenuItem key={index} selected={option.isActive === isActiveFont} onClick={() => handleClose(option)}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by Font Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    <Box sx={{ height: '450px', overflow: 'auto' }}>
                        {isAllFontsLoading && <Typography variant='h5' color={"primary"}>Loading...</Typography>}
                        {allFontsError && <Typography variant="h5" color={"error"}>{allFontsError?.data?.message || 'Error loading fonts'}</Typography>}

                        <DataGrid
                            disableColumnFilter
                            disableColumnMenu
                            rows={rows}
                            columns={columns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[PAGE_SIZE]}
                            pagination
                            paginationMode="server"
                            rowCount={totalCount} // Total number of rows for pagination calculations
                            paginationModel={{
                                page: page - 1,
                                pageSize,
                            }}
                            onPaginationModelChange={({ page, pageSize }) => {
                                setPage(page + 1);
                                setPageSize(pageSize);
                            }}
                        />
                    </Box>
                </Box>
            </main>
            <Footer />

            {/* Edit Font Modal */}
            <Dialog open={openEditModal} onClose={handleModalClose}>
                <DialogTitle>Edit Font</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Font Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.name}
                        onChange={(e) => setFontData({ ...fontData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Font Family"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.family}
                        onChange={(e) => setFontData({ ...fontData, family: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={isUpdateFontLoading}>
                        {isUpdateFontLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Font Modal */}
            <Dialog open={openCreateModal} onClose={handleModalClose}>
                <DialogTitle>Create Font</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Font Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.name}
                        onChange={(e) => setFontData({ ...fontData, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Font Family"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={fontData.family}
                        onChange={(e) => setFontData({ ...fontData, family: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={isCreateFontLoading}>
                        {isCreateFontLoading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
