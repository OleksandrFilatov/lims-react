import * as React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, TextField, Grid } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import axiosFetch from '../../utils/axiosFetch';
import { capitalizeFirstLetter } from '../../utils/capitalize';

const style = {
    position: 'absolute',
    top: '50px',
    left: '30%',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const fields = ['east', 'north', 'elev', 'length', 'category', 'to', 'azimut', 'dip'];

const GeologyMarkscheidereiModal = (props) => {

    const { t } = useTranslation();

    const [selectedGeology, setSelectedGeology] = React.useState({});
    const [values, setValues] = React.useState({
        east: { value: 0, reason: null },
        north: { value: 0, reason: null },
        elev: { value: 0, reason: null },
        length: { value: 0, reason: null },
        category: { value: '', reason: null },
        to: { value: 0, reason: null },
        azimut: { value: 0, reason: null },
        dip: { value: 0, reason: null },
    });
    const [comment, setComment] = React.useState('');
    const [histories, setHistories] = React.useState([]);
    const [view, setView] = React.useState('');

    const { geologies } = useSelector(state => state.geology);
    const { reasons } = useSelector(state => state.reason);
    const { users } = useSelector(state => state.user);

    React.useEffect(() => {
        const getData = async () => {
            try {
                var geology = geologies.filter(geo => geo._id === props.selectedId)[0];
                setSelectedGeology(geology);

                if (geology.markscheiderei) {
                    setComment(geology.markscheiderei_data[geology.markscheiderei_data.length - 1].comment);
                    setValues({
                        east: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].east.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].east.reason
                        },
                        north: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].north.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].north.reason
                        },
                        elev: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].elev.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].elev.reason
                        },
                        length: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].length.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].length.reason
                        },
                        category: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].category.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].category.reason
                        },
                        to: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].to.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].to.reason
                        },
                        azimut: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].azimut.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].azimut.reason
                        },
                        dip: {
                            value: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].dip.value,
                            reason: geology.markscheiderei_data[geology.markscheiderei_data.length - 1].dip.reason
                        },
                    });
                }

                const res = await axiosFetch.get('/api/geology/markscheiderei_history', { params: { id: props.selectedId } });
                setHistories(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [props.selectedId])

    const handleCreate = () => {
        if (values.category.value === '') {
            toast.error('Category is required');
            return;
        }
        if (selectedGeology.markscheiderei) {
            const old_data = selectedGeology.markscheiderei_data[selectedGeology.markscheiderei_data.length - 1];
            if (JSON.stringify(old_data.east) === JSON.stringify(values.east) && JSON.stringify(old_data.north) === JSON.stringify(values.north) &&
                JSON.stringify(old_data.elev) === JSON.stringify(values.elev) && JSON.stringify(old_data.length) === JSON.stringify(values.length) &&
                JSON.stringify(old_data.category) === JSON.stringify(values.category) && JSON.stringify(old_data.to) === JSON.stringify(values.to) &&
                JSON.stringify(old_data.azimut) === JSON.stringify(values.azimut) && JSON.stringify(old_data.dip) === JSON.stringify(values.dip)
            ) {
                props.handleClose();
                return;
            }
        }
        const data = {
            comment: comment,
            values: values,
            id: props.selectedId
        };
        props.handleCreate(data);
        props.handleClose();
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
        // sx={modal}
        >
            <Fade in={props.open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>
                        {t('Input by Markscheiderei')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        {
                            fields.filter(field => field !== 'category').map((field, index) => (
                                <Grid container spacing={1} key={index} sx={{ my: 1 }}>
                                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <Typography onClick={() => setView(view === field ? '' : field)}>{t(capitalizeFirstLetter(field))}:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            required
                                            label={t("Value")}
                                            fullWidth
                                            onChange={(e) => setValues({ ...values, [field]: { ...values[field], value: e.target.value } })}
                                            value={values[field].value}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label={t("Reason")}
                                                onChange={(e) => setValues({ ...values, [field]: { ...values[field], reason: e.target.value } })}
                                                value={values[field].reason ? values[field].reason : ''}
                                            >
                                                {
                                                    reasons.map(reason => (
                                                        <MenuItem value={reason._id} key={reason._id}>{reason.reason}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {
                                        view === field && (
                                            <Grid item xs={12} sx={{ my: 1 }}>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>{t("User")}</TableCell>
                                                                <TableCell align="right">{t("Value")}</TableCell>
                                                                <TableCell align="right">{t("Reason")}</TableCell>
                                                                <TableCell align="right">{t("Date")}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {histories.length > 0 ? histories
                                                                .filter((row, index) => {
                                                                    const _str = JSON.stringify(row[field]);
                                                                    return index === histories.findIndex(obj => {
                                                                        return JSON.stringify(obj[field]) === _str;
                                                                    });
                                                                })
                                                                .map((row) => (
                                                                    <TableRow
                                                                        key={row._id}
                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                    >
                                                                        <TableCell component="th" scope="row">
                                                                            {users.filter(user => user._id === row.user).length ? users.filter(user => user._id === row.user)[0].userName : ''}
                                                                        </TableCell>
                                                                        <TableCell align="right">{row[field].value}</TableCell>
                                                                        <TableCell align="right">
                                                                            {reasons.filter(reason => reason._id === row[field].reason).length > 0 ? reasons.filter(reason => reason._id === row[field].reason)[0].reason : ''}
                                                                        </TableCell>
                                                                        <TableCell align="right">{moment(row.reg_date).format(props.date_format + ' HH:mm:ss')}</TableCell>
                                                                    </TableRow>
                                                                )) : (
                                                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row" colSpan={4} sx={{ textAlign: 'center' }}>
                                                                        There is no record to display.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            ))
                        }
                        <Grid container spacing={1} sx={{ my: 1 }}>
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Typography onClick={() => setView(view === 'category' ? '' : 'category')}>{t("Category")}:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Value")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.category.value}
                                        label={t("Value")}
                                        onChange={(e) => setValues({ ...values, category: { ...values.category, value: e.target.value } })}
                                    >
                                        <MenuItem value="SP">SP</MenuItem>
                                        <MenuItem value="VP">VP</MenuItem>
                                        <MenuItem value="BN">BN</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("Reason")}
                                        onChange={(e) => setValues({ ...values, category: { ...values.category, reason: e.target.value } })}
                                        value={values.category.reason ? values.category.reason : ''}
                                    >
                                        {
                                            reasons.map(reason => (
                                                <MenuItem value={reason._id} key={reason._id}>{reason.reason}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            {
                                view === 'category' && (
                                    <Grid item xs={12} sx={{ my: 1 }}>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{t("User")}</TableCell>
                                                        <TableCell align="right">{t("Value")}</TableCell>
                                                        <TableCell align="right">{t("Reason")}</TableCell>
                                                        <TableCell align="right">{t("Date")}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {histories.length > 0 ? histories
                                                        .filter((row, index) => {
                                                            const _str = JSON.stringify(row.category);
                                                            return index === histories.findIndex(obj => {
                                                                return JSON.stringify(obj.category) === _str;
                                                            });
                                                        })
                                                        .map((row) => (
                                                            <TableRow
                                                                key={row._id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {users.filter(user => user._id === row.user).length ? users.filter(user => user._id === row.user)[0].userName : ''}
                                                                </TableCell>
                                                                <TableCell align="right">{row.category.value}</TableCell>
                                                                <TableCell align="right">
                                                                    {reasons.filter(reason => reason._id === row.category.reason).length > 0 ? reasons.filter(reason => reason._id === row.category.reason)[0].reason : ''}
                                                                </TableCell>
                                                                <TableCell align="right">{moment(row.reg_date).format(props.date_format + ' HH:mm:ss')}</TableCell>
                                                            </TableRow>
                                                        )) : (
                                                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row" colSpan={4} sx={{ textAlign: 'center' }}>
                                                                There is no record to display.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                )
                            }
                        </Grid>
                        <TextField
                            multiline
                            rows={3}
                            fullWidth
                            sx={{ my: 1 }}
                            label={t("Comment")}
                            variant='outlined'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>{t("Cancel")}</Button>
                            <Button variant="contained" onClick={handleCreate}>
                                {geologies.filter(geo => geo._id === props.selectedId)[0].markscheiderei === null ? t("Create") : t("Update")}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyMarkscheidereiModal;