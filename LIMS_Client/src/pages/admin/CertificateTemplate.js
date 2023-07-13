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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';

import {
    createCertificateTemplate,
    getCertificateTemplatesData,
    deleteCertificateTemplate,
    uploadFile,
    saveFreeText,
    saveProductData,
    saveTableColumns,
    copyRow
} from '../../slices/certificateTemplate';
import { certificateTemplateExcelHeader, CertificateTemplateHeader } from '../../utils/tableHeaders';
import CertificateTemplateModal from '../../components/lims-modals/CertificateTemplateModal';
import CertificateFreeTextModal from '../../components/lims-modals/CertificateFreeTextModal';
import CertificateProductModal from '../../components/lims-modals/CertificateProductModal';
import CertificateTableColumnModal from '../../components/lims-modals/CertificateTableColumnModal';
import { ServerUri } from '../../config';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const CertificateTemplate = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [openFreeText, setOpenFreeText] = React.useState(false);
    const [openProduct, setOpenProduct] = React.useState(false);
    const [openTableCol, setOpenTableCol] = React.useState(false);
    const [id, setId] = React.useState('');

    const { certificateTemplates, export_all_data } = useSelector(state => state.certificateTemplate);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCertificateTemplatesData());
        }
    }, [dispatch, isAuthenticated]);

    const handleCreate = async (data) => {
        try {
            if (id !== '') {
                data.id = id;
            }
            let formData = new FormData();
            var arr = [];
            arr.push(data.fileList[0].originFileObj);
            arr.push(data.fileList_Footer[0].originFileObj);
            for (let i = 0; i < 2; i++) {
                formData.append("files", arr[i]);
            }
            formData.append("logo", data.fileList[0].originFileObj)
            formData.append("footer", data.fileList_Footer[0].originFileObj)
            formData.append("logoUid", data.fileList[0].originFileObj.uid);
            formData.append("footerUid", data.fileList_Footer[0].originFileObj.uid);
            formData.append("name", data.name);
            formData.append("company", data.company);
            formData.append("place", data.place);
            formData.append("rowid", data.rowid);
            formData.append("certificatetitle", data.certificatetitle);
            formData.append("date_format", data.date_format);
            formData.append("header_left", data.header_left);
            formData.append("header_top", data.header_top);
            formData.append("header_width", data.header_width);
            formData.append("header_height", data.header_height);
            formData.append("header_keep_distance", data.header_keep_distance);
            formData.append("footer_left", data.footer_left);
            formData.append("footer_bottom", data.footer_bottom);
            formData.append("footer_width", data.footer_width);
            formData.append("footer_height", data.footer_height);
            formData.append("footer_keep_distance", data.footer_keep_distance);

            dispatch(createCertificateTemplate(formData));

            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const handleDeleteCertificateTemplate = (id) => {
        if (window.confirm('Do you really want to delete current template?')) {
            dispatch(deleteCertificateTemplate(id));
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
            toast.error('File import error');
        }
    }

    const handleSaveFreeText = async (val) => {
        try {
            dispatch(saveFreeText(val));
            setOpenFreeText(false);
        } catch (err) {
            console.log(err)
        }
    }

    const handleSaveProduct = (data) => {
        dispatch(saveProductData(data))
        setOpenProduct(false)
    }

    const handleSaveTableColumns = (data) => {
        dispatch(saveTableColumns(data));
        setOpenTableCol(false);
    }

    const handleCopyRow = (id) => {
        dispatch(copyRow(id));
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

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
                    <Button size='small' variant='contained' onClick={() => setId('') & setOpen(true)}><AddIcon />&nbsp;{t('Create New')}</Button>
                    <CSVLink
                        headers={certificateTemplateExcelHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-CertificateTemplate.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={certificateTemplates.length}
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
                            {CertificateTemplateHeader(t)
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
                        {certificateTemplates.length > 0 ? certificateTemplates
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.name}</TableCell>
                                        <TableCell align='right'>{row.certificatetitle}</TableCell>
                                        <TableCell align='right'>{row.company}</TableCell>
                                        <TableCell align='right'>
                                            <img
                                                src={`${ServerUri}/uploads/certificates/${row.logo_filename}`}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null; // prevents looping
                                                    currentTarget.src = "static/image-not-found.png";
                                                }}
                                                width="50px"
                                                height="50px"
                                                alt=""
                                            />
                                        </TableCell>
                                        <TableCell align='right'>{row.place}</TableCell>
                                        <TableCell align='right'>{row.date_format}</TableCell>
                                        <TableCell align='right'>
                                            <Button variant='contained' onClick={() => setId(row._id) & setOpenProduct(true)}>
                                                {
                                                    row.productdata.productTitle ? (
                                                        <CheckCircleOutlineIcon />
                                                    ) : (
                                                        <BlockIcon />
                                                    )
                                                }
                                            </Button>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Button variant='contained' onClick={() => setId(row._id) & setOpenTableCol(true)}>
                                                {
                                                    row.tablecol.filter((v) => v.name || v.fieldname).length !== 0 ? (
                                                        <CheckCircleOutlineIcon />
                                                    ) : (
                                                        <BlockIcon />
                                                    )
                                                }
                                            </Button>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Button variant='contained' onClick={() => setId(row._id) & setOpenFreeText(true)}>
                                                {
                                                    row.freetext ? (
                                                        <CheckCircleOutlineIcon />
                                                    ) : (
                                                        <BlockIcon />
                                                    )
                                                }
                                            </Button>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <img
                                                src={`${ServerUri}/uploads/certificates/${row.footer_filename}`}
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null; // prevents looping
                                                    currentTarget.src = "static/image-not-found.png";
                                                }}
                                                width="50px"
                                                height="50px"
                                                alt=""
                                            />
                                        </TableCell>
                                        <TableCell align='right' sx={{ minWidth: '125px' }}>
                                            <Button size="small" variant='text' color="success" sx={{ p: 0, minWidth: 0, fontSize: '26px' }} onClick={() => handleCopyRow(row._id)}>
                                                <ContentCopyIcon />
                                            </Button>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, fontSize: '26px' }} onClick={() => handleDeleteCertificateTemplate(row._id)}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell align="center" colSpan={11}>No Data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                open && <CertificateTemplateModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    // selectedId={reasonId}
                    id={id}
                />
            }
            {
                openFreeText && <CertificateFreeTextModal
                    open={openFreeText}
                    handleClose={() => setOpenFreeText(false)}
                    handleSave={handleSaveFreeText}
                    id={id}
                />
            }
            {
                openProduct && <CertificateProductModal
                    open={openProduct}
                    handleClose={() => setOpenProduct(false)}
                    handleSave={handleSaveProduct}
                    id={id}
                />
            }
            {
                openTableCol && <CertificateTableColumnModal
                    open={openTableCol}
                    handleClose={() => setOpenTableCol(false)}
                    handleSave={handleSaveTableColumns}
                    id={id}
                />
            }
        </Box>
    )
}

export default CertificateTemplate;