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
import { Box, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

import { createMaterial, getMaterialsData, deleteMaterial, uploadFile, getTooltip } from '../../slices/material';
import { MaterialHeader, MaterialExcelHeader } from '../../utils/tableHeaders';
import MaterialModal from '../../components/lims-modals/MaterialModal';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const Material = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [materialId, setMaterialId] = React.useState(0);
    const [id, setId] = React.useState('');
    const [defaultClient, setDefaultClient] = React.useState(null);

    const { materials, export_all_data } = useSelector(state => state.material);
    const { clients } = useSelector(state => state.client);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMaterialsData());
        }
    }, [dispatch, isAuthenticated]);

    React.useEffect(() => {
        if (clients.length > 0) {
            setDefaultClient(clients.filter(c => c.name === 'Default')[0])
        }
    }, [clients])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleCreate = async (val) => {
        try {
            if (id !== '') {
                val.id = id;
            }
            dispatch(createMaterial(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const on_create_clicked = () => {
        let _id = 1;
        if (materials.length > 0) {
            const max_id = Math.max.apply(Math, materials.map(data => data.material_id));
            if (max_id === materials.length) {
                _id = max_id + 1;
            } else {
                var a = materials.map(data => Number(data.material_id));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                _id = Math.min.apply(Math, missing)
            }
        }
        setMaterialId(_id);
        setOpen(true);
        setId('')
    }

    const handleDeleteMaterial = (id) => {
        if (window.confirm('Do you really want to delete current material?')) {
            dispatch(deleteMaterial(id));
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
                        headers={MaterialExcelHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-Material.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={materials.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value) & setPage(0)}
                    className={classes.pagination}
                />
            </Box>
            <TableContainer>
                <Table aria-label="table">
                    <TableHead>
                        <TableRow>
                            {MaterialHeader(t)
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
                        {materials.length > 0 ? materials
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                var clientObjs = []; // clients including default client
                                clientObjs.push({ label: "Default", value: defaultClient?._id });
                                row.clients.map((item0) => {
                                    clientObjs.push({ label: item0.name, value: item0._id });
                                    return true;
                                });

                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell>{row.material_id}</TableCell>
                                        <TableCell>
                                            {clientObjs.map((client, index1) => {
                                                return (
                                                    <div key={index1}
                                                        style={{
                                                            marginLeft: client.value === "" ? "0px" : "0.6em",
                                                        }}
                                                    >
                                                        {row.material + " - " + client.label}
                                                    </div>
                                                );
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {clientObjs.map((client, index1) => {
                                                let tooltip = getTooltip(row, client.value);
                                                return <div key={index1}>{tooltip}</div>;
                                            })}
                                        </TableCell>
                                        <TableCell>{row.remark}</TableCell>
                                        <TableCell align='right' sx={{ minWidth: '125px' }}>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDeleteMaterial(row._id)}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell align="center" colSpan={16}>No Data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                open && <MaterialModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    selectedId={materialId}
                    id={id}
                />
            }
        </Box>
    )
}

export default Material;