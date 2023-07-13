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
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import { ObjectiveHeader } from '../../utils/tableHeaders';
import ObjectiveModal from '../../components/lims-modals/ObjectiveModal';
import { createObjective, deleteObjective, getObjectivesData, uploadFile, dragObjective } from '../../slices/objective';

const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    }
}))

const Objective = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [objectiveId, setObjectiveId] = React.useState(0);
    const [id, setId] = React.useState('');
    const [draggedRow, setDraggedRow] = React.useState(null);

    const { objectives, export_all_data } = useSelector(state => state.objective);
    const { isAuthenticated } = useSelector(state => state.auth);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getObjectivesData());
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
            dispatch(createObjective(val));
            setOpen(false);
        } catch (err) {
            toast.error('Server internal error');
        }
    }

    const on_create_clicked = () => {
        let _id = 1;
        if (objectives.length > 0) {
            const max_id = Math.max.apply(Math, objectives.map(data => data.objective_id));
            if (max_id === objectives.length) {
                _id = max_id + 1;
            } else {
                var a = objectives.map(data => Number(data.objective_id));
                var missing = new Array();

                for (var i = 1; i <= max_id; i++) {
                    if (a.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                _id = Math.min.apply(Math, missing)
            }
        }
        setObjectiveId(_id);
        setOpen(true);
        setId('')
    }

    const handleDelete = (id) => {
        if (window.confirm('Do you really want to delete current objective?')) {
            dispatch(deleteObjective(id));
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

    const handleDragEnd = async ({ source, destination, draggableId }) => {
        if (destination) {
            dispatch(dragObjective(draggedRow._id, source.index, destination.index))
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
                        headers={ObjectiveHeader(t).filter(col => col.key !== 'buttonGroups')}
                        filename="Export-Objective.csv"
                        data={export_all_data}
                        ref={csvLink}
                    ></CSVLink>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    component="div"
                    count={objectives.length}
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
                            {ObjectiveHeader(t)
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
                        {objectives.length > 0 ? objectives
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell align='left'>{row.objective_id}</TableCell>
                                        <TableCell align='right'>{row.objective}</TableCell>
                                        <TableCell align='right'>
                                            <DragDropContext onDragStart={() => setDraggedRow(row)} onDragEnd={handleDragEnd}>
                                                <Box>
                                                    <Droppable droppableId='column' type="card">
                                                        {(provided) => (
                                                            <Box ref={provided.innerRef}>
                                                                {
                                                                    row.units.length > 0 && row.units.map((unit, index) =>
                                                                        <Draggable
                                                                            draggableId={String(index)}
                                                                            index={index}
                                                                            key={index}
                                                                        >
                                                                            {(_provided, snapshot) => (
                                                                                <p
                                                                                    key={index}
                                                                                    className="mb-0"
                                                                                    {..._provided.draggableProps}
                                                                                    {..._provided.dragHandleProps}
                                                                                    dragging="false"//{snapshot.isDragging}
                                                                                    ref={_provided.innerRef}
                                                                                >
                                                                                    {unit.unit}
                                                                                </p>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                }
                                                            </Box>
                                                        )}
                                                    </Droppable>
                                                </Box>
                                            </DragDropContext>
                                        </TableCell>
                                        <TableCell align='right'>{row.remark}</TableCell>
                                        <TableCell align='right'>
                                            <Button size="small" variant='text' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => setId(row._id) & setOpen(true)}>
                                                <SaveAsIcon />
                                            </Button>
                                            <Button size="small" variant='text' color='error' sx={{ p: 0, minWidth: 0, mx: 1, fontSize: '26px' }} onClick={() => handleDelete(row._id)}>
                                                <DeleteForeverIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                <TableCell align="center" colSpan={4}>No Data</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                open && <ObjectiveModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleCreate={handleCreate}
                    selectedId={objectiveId}
                    id={id}
                />
            }
        </Box>
    )
}

export default Objective;