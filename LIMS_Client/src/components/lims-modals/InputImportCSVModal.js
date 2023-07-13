import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { import_column_list, laboratory_columns } from '../../utils/tableHeaders';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const style = {
    position: 'absolute',
    top: '80px',
    left: '10%',
    width: '80%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const InputImportCSVModal = (props) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { settings } = useSelector(state => state.setting);

    const handleImport = () => {
        try {
            props.handleClose();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>{t("Import CSV")}</Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TableContainer>
                            <Table aria-label="table">
                                <TableHead>
                                    <TableRow>
                                        {
                                            props.parsedCSVHeader.length > 0 && props.parsedCSVHeader.map((item1, index) => (
                                                <TableCell key={index} sx={{ textTransform: 'none' }}>
                                                    {
                                                        item1 === 'Storno' ? item1 : (
                                                            <select
                                                                style={{ minWidth: '150px' }}
                                                                className='form-control'
                                                                defaultValue={import_column_list.filter(column => column.key === item1).length > 0 ?
                                                                    laboratory_columns.filter(labColumn => labColumn.label === import_column_list.filter(column => column.key === item1)[0].label).length > 0 ?
                                                                        laboratory_columns.filter(labColumn => labColumn.label === import_column_list.filter(column => column.key === item1)[0].label)[0].key : '' : ''}
                                                            >
                                                                {
                                                                    laboratory_columns.map((item2, index2) =>
                                                                        <option value={item2.key} key={index2}>{item2.label}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        )
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.parsedCSVRow.length > 0 && props.parsedCSVRow.map((row, index1) =>
                                            <TableRow key={index1}>
                                                {
                                                    props.parsedCSVHeader.map((item, index2) =>
                                                        <TableCell key={index2}>
                                                            {item === 'Pos. Liefer-/Leistungsdatum' || item === 'Ladedatum' ? row[item] !== '' ? moment(row[item], 'DD.MM.YYYY').format(settings.date_format) : '' : row[item]}
                                                        </TableCell>
                                                    )
                                                }
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={props.handleImport}>Import</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InputImportCSVModal;