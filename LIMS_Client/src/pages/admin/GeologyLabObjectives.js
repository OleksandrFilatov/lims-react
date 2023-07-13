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

import { createReason, getReasonsData } from '../../slices/reason';
import { GeologyLabObjectiveHeader } from '../../utils/tableHeaders';
import GeologyLabObjectivesModal from '../../components/lims-modals/GeologyLabObjectivesModal';
import { getObjectivesData } from '../../slices/objective';
import { getUnitsData } from '../../slices/unit';
import { getGeologyLabObjectivesData, deleteGeologyLabObjectiveData, uploadGeologyLabObjectives } from '../../slices/geology';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const GeologyLabObjectives = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [id, setId] = React.useState('');

    const { geology_lab_objectives, geology_lab_objectives_excel_data } = useSelector(state => state.geology);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getGeologyLabObjectivesData())
            dispatch(getReasonsData());
            dispatch(getObjectivesData());
            dispatch(getUnitsData());
        }
    }, [dispatch, isAuthenticated]);

    const handleCreate = async (val) => {
        try {
            if (id !== '') {
                val.id = id;
            }
            dispatch(createReason(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const handleDeleteReason = (id) => {
        if (window.confirm('Do you really want to delete current reason?')) {
            dispatch(deleteGeologyLabObjectiveData(id));
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

            dispatch(uploadGeologyLabObjectives(result));
        } catch (err) {
            console.log(err);
            toast.error('File import error');
        }
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
                        headers={GeologyLabObjectiveHeader(t)}
                        filename="Export-GeologyLabObjective.csv"
                        data={geology_lab_objectives_excel_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={geology_lab_objectives.length}
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
                            <TableCell align='left'>
                                Objective ID
                            </TableCell>
                            <TableCell align='right'>
                                Objective
                            </TableCell>
                            <TableCell align='right'>
                                Remark
                            </TableCell>
                            <TableCell align='right'>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {geology_lab_objectives.length > 0 ? geology_lab_objectives
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.objective.objective_id}</TableCell>
                                        <TableCell align='right'>{row.objective.objective} {row.unit.unit}</TableCell>
                                        <TableCell align='right'>{row.objective.remark}</TableCell>
                                        <TableCell align='right' sx={{ minWidth: '125px' }}>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDeleteReason(row._id)}>
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
                open && <GeologyLabObjectivesModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    id={id}
                />
            }
        </Box>
    )
}

export default GeologyLabObjectives;