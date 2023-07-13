import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import { Box, Button, Switch } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

import UserTypeModal from '../../components/lims-modals/UserTypeModal';
import { createUserType, getUserTypesData, deleteUserType, uploadFile } from '../../slices/userType';
import { UserTypeHeader } from '../../utils/tableHeaders';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const UserTypes = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [typeId, setTypeId] = React.useState(0);
    const [id, setId] = React.useState('');

    const { userTypes, export_all_data } = useSelector(state => state.userType);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            console.log('connected')
            dispatch(getUserTypesData());
        }
    }, [dispatch, isAuthenticated]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleCreate = async (val) => {
        try {
            // if (userTypes.filter(uType => uType.userType_id === val.userType_id).length > 0) {
            //     toast.error('User Type ID has been already existed');
            //     return;
            // }
            if (id !== '') {
                val.id = id;
            }
            dispatch(createUserType(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const on_create_clicked = () => {
        let _id = 1;
        if (userTypes.length > 0) {
            const max_id = Math.max.apply(Math, userTypes.map(data => data.userType_id));
            if (max_id === userTypes.length) {
                _id = max_id + 1;
            } else {
                var a = userTypes.map(data => Number(data.userType_id));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                _id = Math.min.apply(Math, missing)
            }
            setTypeId(_id);
            setOpen(true);
            setId('')
        }
    }

    const handleDeleteType = (id) => {
        if (window.confirm('Do you really want to delete current user type?')) {
            dispatch(deleteUserType(id));
        }
    }

    const handleFiles = async (files) => {
        try {
            var reader = new FileReader();
            reader.readAsText(files[0]);
            const result = await new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    resolve(reader.result);
                }
            });

            dispatch(uploadFile(result));
        } catch (err) {
            console.log(err);
            toast.error('File import error');
        }
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex">
                    <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                        <Button size='small' variant='contained'><UploadIcon />&nbsp;{t('Import')}</Button>
                    </ReactFileReader>
                    <Button size='small' variant='contained' sx={{ mx: 2 }} onClick={() => csvLink.current.link.click()}>
                        <DownloadIcon />&nbsp;{t('Export')}
                    </Button>
                    <Button size='small' variant='contained' onClick={on_create_clicked}><AddIcon />&nbsp;{t('Create New')}</Button>
                    <CSVLink
                        headers={UserTypeHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-UserType.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={userTypes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value) & setPage(0)}
                    className={classes.pagination}
                />
            </Box>
            <TableContainer>
                <Table className='bordered-table' aria-label="table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center" colSpan={3}>
                                Laboratory
                            </TableCell>
                            <TableCell align="center" colSpan={2}>
                                Stock Management
                            </TableCell>
                            <TableCell align="center" colSpan={3}>
                                HS
                            </TableCell>
                            <TableCell align="center" colSpan={3}>
                                Geology
                            </TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                        <TableRow>
                            {UserTypeHeader(t)
                                .filter(col => col.key !== '_id')
                                .map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.align}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userTypes.length > 0 ? userTypes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.userType_id}</TableCell>
                                        <TableCell align='right'>{row.userType}</TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.labInput} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.labAnalysis} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.labAdmin} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.stockUser} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.stockAdmin} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.hsImport} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.hsExport} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.hsAdmin} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.geologyImport} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.geologyExport} disabled />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={row.geologyAdmin} disabled />
                                        </TableCell>
                                        <TableCell align='right'>{row.remark}</TableCell>
                                        <TableCell align='right'>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDeleteType(row._id)}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell align="center" colSpan={15}>No Data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                open && <UserTypeModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    typeId={typeId}
                    id={id}
                />
            }
        </Box>
    )
}

export default UserTypes;