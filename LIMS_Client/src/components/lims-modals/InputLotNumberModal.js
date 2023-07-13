import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ServerUri } from '../../config';
import { handleSaveCharge, handleSaveWeight } from '../../slices/laboratory';
import { logout } from '../../slices/auth';
import axiosFetch from '../../utils/axiosFetch';

const style = {
    position: 'absolute',
    top: '80px',
    left: '30%',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const InputLotNumberModal = (props) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [date_format, setDateFormat] = React.useState('dd.MM.yyyy');
    const [charge_date, setChargeDate] = React.useState(new Date());
    const [comment, setComment] = React.useState('');
    const [viewHistory, setViewHistory] = React.useState(false);
    const [chargeHistory, setChargeHistory] = React.useState([]);

    const { laboratories } = useSelector(state => state.laboratory);
    const { settings } = useSelector(state => state.setting);
    const { sampleTypes } = useSelector(state => state.sampleType);

    React.useEffect(() => {
        const getCharges = async () => {
            try {
                const selectedLaboratory = laboratories.filter(d => d._id === props.id)[0];
                setChargeDate(selectedLaboratory.charge.length > 0 ? selectedLaboratory.charge[selectedLaboratory.charge.length - 1].date : new Date());
                setComment(selectedLaboratory.charge.length > 0 ? selectedLaboratory.charge[selectedLaboratory.charge.length - 1].comment : '');
                setViewHistory(false);

                const res = await axiosFetch.get(`/api/charges/${props.id}`);
                setChargeHistory(res.data);
            } catch (err) {
                if (Object(err).hasOwnProperty('response')) {
                    if (err.response.status === 401) {
                        dispatch(logout());
                    }
                }
                console.log(err);
            }
        }
        if (props.id !== '') {
            getCharges();
        }
    }, [props.id])

    React.useEffect(() => {
        if (settings.hasOwnProperty('date_format')) {
            var format = '';
            switch (settings.date_format) {
                case 'DD.MM.YYYY':
                    format = 'dd.MM.yyyy';
                    break;
                case 'MM.DD.YYYY':
                    format = 'MM.dd.yyyy';
                    break;
                case 'DD/MM/YYYY':
                    format = 'dd/MM/yyyy';
                    break;
                case 'MM/DD/YYYY':
                    format = 'MM/dd/yyyy';
                    break;
                case 'YYYY-MM-DD':
                    format = 'yyyy-MM-dd';
                    break;
                case 'YYYY-DD-MM':
                    format = 'yyyy-dd-MM';
                    break;
                case 'MM-DD-YYYY':
                    format = 'MM-dd-yyyy';
                    break;
                case 'YYYY/MM/DD':
                    format = 'yyyy/MM/dd';
                    break;
                default:
                    format = 'dd.MM.yyyy';
                    break;
            }
            setDateFormat(format);
        }
    }, [settings]);

    const handleCreate = () => {
        try {
            const data = {
                is_stock: sampleTypes.filter(i => i._id === laboratories.filter(d => d._id === props.id)[0].sample_type._id).length > 0 ?
                    sampleTypes.filter(i => i._id === laboratories.filter(d => d._id === props.id)[0].sample_type._id)[0].stockSample : false,
                id: props.id,
                charge_date: charge_date,
                comment: comment
            }
            dispatch(handleSaveCharge(data));
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
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>{t("Lot Number")}</Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Grid container spacing={2}>
                            <Grid item xs={4} sx={{ display: 'flex', alignItems: "center" }}>
                                <Typography className='cursor-pointer' variant='h6' onClick={() => setViewHistory(!viewHistory)}>Lot Number:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={2} sx={{ my: 1 }}>
                                        <DatePicker
                                            label="Lot Number"
                                            value={charge_date}
                                            onChange={(val) => setChargeDate(val)}
                                            renderInput={(params) => <TextField {...params} />}
                                            inputFormat={`${date_format} hh:mm:ss`}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={4} sx={{ display: 'flex', alignItems: "center" }}>
                                <Typography variant='h6'>Comment:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    label="Comment"
                                    multiline
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            {
                                viewHistory && <Grid item xs={12} sx={{ mt: 1 }}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Charge Date</TableCell>
                                                    <TableCell align="right">Author</TableCell>
                                                    <TableCell align="right">Updated Date</TableCell>
                                                    <TableCell align="right">Comment</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {chargeHistory.length > 0 ? chargeHistory.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">
                                                            {row.chargeDate}
                                                        </TableCell>
                                                        <TableCell align="right">{row.user.userName}</TableCell>
                                                        <TableCell align="right">{moment(row.updateDate).format(`${settings.date_format} HH:mm:ss`)}</TableCell>
                                                        <TableCell align="right">{row.comment}</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align='center'>
                                                            No Data
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            }
                        </Grid>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleCreate}>{props.id === '' ? 'Create' : 'Update'}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InputLotNumberModal;