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

import { createCertificateType, getCertificateTypesData, deleteCertificateType, uploadFile, getMaterialMinMax } from '../../slices/certificateType';
import { CertificateTypeHeader } from '../../utils/tableHeaders';
import CertificateTypeModal from '../../components/lims-modals/CertificateTypeModal';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const CertificateType = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [certificateTypeId, setCertificateTypeId] = React.useState(0);
    const [id, setId] = React.useState('');

    const { materials } = useSelector(state => state.material);
    const { clients } = useSelector(state => state.client);
    const { analysisTypes } = useSelector(state => state.analysisType);
    const { objectives } = useSelector(state => state.objective);
    const { units } = useSelector(state => state.unit);
    const { certificateTypes, export_all_data } = useSelector(state => state.certificateType);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCertificateTypesData());
        }
    }, [dispatch, isAuthenticated]);

    const handleCreate = async (val) => {
        try {
            // if (users.filter(user => user.user_id === val.user_id).length > 0) {
            //     toast.error('User ID has been already existed');
            //     return;
            // }
            if (id !== '') {
                val.id = id;
            }
            dispatch(createCertificateType(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const on_create_clicked = () => {
        let _id = 1;
        if (certificateTypes.length > 0) {
            const max_id = Math.max.apply(Math, certificateTypes.map(data => data.certificateType_id));
            if (max_id === certificateTypes.length) {
                _id = max_id + 1;
            } else {
                var a = certificateTypes.map(data => Number(data.certificateType_id));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                _id = Math.min.apply(Math, missing)
            }
        }
        setCertificateTypeId(_id);
        setOpen(true);
        setId('')
    }

    const handleDeleteCertificateType = (id) => {
        if (window.confirm('Do you really want to delete current certificate type?')) {
            dispatch(deleteCertificateType(id));
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const getAnalysises = (analysises, material, client) => {
        if (analysises === "" || analysises === undefined) return "";

        var returnVal = "";
        analysises.map((item, index) => {
            var label = analysisTypes.filter(aType => aType._id === item.id)[0].analysisType;
            if (label !== '') {
                item.objectives.map((item0) => {
                    var subLabel = objectives.filter(obj => obj._id === item0.id)[0].objective;
                    var subUnit = units.filter(unit => unit._id === item0.unit)[0].unit;

                    if (subLabel !== '' && subUnit !== '')
                        returnVal = returnVal + label + ' - ' + subLabel + ' ' + subUnit + ' ' + getMaterialMinMax(material, item0.id, item0.unit, client) + '\n';
                    return true;
                });
            }
            return true;
        });
        return returnVal;
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
                        headers={CertificateTypeHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-CertificateType.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={certificateTypes.length}
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
                            {CertificateTypeHeader(t)
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
                        {certificateTypes.length > 0 ? certificateTypes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.certificateType_id}</TableCell>
                                        <TableCell align='right'>
                                            {materials.filter(item => item._id === row.material)[0].material} - {clients.filter(item => item._id === row.client)[0].name}
                                        </TableCell>
                                        <TableCell align='right'>{row.certificateType}</TableCell>
                                        <TableCell align='right'>{getAnalysises(
                                            row.analysises,
                                            row.material,
                                            row.client
                                        )}</TableCell>
                                        <TableCell align='right'>{row.remark}</TableCell>
                                        <TableCell align='right' sx={{ minWidth: '125px' }}>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDeleteCertificateType(row._id)}>
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
                open && <CertificateTypeModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    selectedId={certificateTypeId}
                    id={id}
                />
            }
        </Box>
    )
}

export default CertificateType;