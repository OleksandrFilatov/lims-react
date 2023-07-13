import * as React from 'react';
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
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const style = {
    position: 'absolute',
    top: '50px',
    left: '25%',
    width: '50%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const fields = ['sample', 'from', 'to', 'thk', 'oreType', 'rxqual', 'fest', 'locker', 'sanding', 'drills'];

const GeologyGeologyModal = (props) => {

    const { t } = useTranslation();

    const [selectedGeology, setSelectedGeology] = React.useState({});
    const [values, setValues] = React.useState({
        sample: { value: 0, reason: null },
        from: { value: 0, reason: null },
        to: { value: 0, reason: null },
        thk: { value: 0, reason: null },
        oreType: { value: '', reason: null },
        rxqual: { value: 0, reason: null },
        fest: { value: 0, reason: null },
        locker: { value: 0, reason: null },
        sanding: { value: 0, reason: null },
        drills: { value: '', reason: null },
    });
    const [comment, setComment] = React.useState('');
    const [histories, setHistories] = React.useState([]);
    const [view, setView] = React.useState('');

    const { geologies } = useSelector(state => state.geology);
    const { oreTypes } = useSelector(state => state.oreType);
    const { reasons } = useSelector(state => state.reason);
    const { users } = useSelector(state => state.user);

    React.useEffect(() => {
        const getData = async () => {
            try {
                var geology = geologies.filter(geo => geo._id === props.selectedId)[0];
                setSelectedGeology(geology);

                if (geology.geology) {
                    setComment(geology.geology_data[0].comment);
                    setValues({
                        sample: {
                            value: geology.geology_data[0].sample.value,
                            reason: geology.geology_data[0].sample.reason
                        },
                        from: {
                            value: geology.geology_data[0].from.value,
                            reason: geology.geology_data[0].from.reason
                        },
                        to: {
                            value: geology.geology_data[0].to.value,
                            reason: geology.geology_data[0].to.reason
                        },
                        thk: {
                            value: geology.geology_data[0].thk.value,
                            reason: geology.geology_data[0].thk.reason
                        },
                        oreType: {
                            value: geology.geology_data[0].oreType.value,
                            reason: geology.geology_data[0].oreType.reason
                        },
                        rxqual: {
                            value: geology.geology_data[0].rxqual.value,
                            reason: geology.geology_data[0].rxqual.reason
                        },
                        fest: {
                            value: geology.geology_data[0].fest.value,
                            reason: geology.geology_data[0].fest.reason
                        },
                        locker: {
                            value: geology.geology_data[0].locker.value,
                            reason: geology.geology_data[0].locker.reason
                        },
                        sanding: {
                            value: geology.geology_data[0].sanding.value,
                            reason: geology.geology_data[0].sanding.reason
                        },
                        drills: {
                            value: geology.geology_data[0].drills.value,
                            reason: geology.geology_data[0].drills.reason
                        }
                    });
                }

                const res = await axiosFetch.get('/api/geology/geology_history', { params: { id: props.selectedId } });
                setHistories(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [props.selectedId])

    const handleCreate = () => {
        if (values.oreType.value === '') {
            toast.error('OreType is required');
            return;
        }
        console.log(selectedGeology);
        if (selectedGeology.geology) {
            const old_data = selectedGeology.geology_data[selectedGeology.geology_data.length - 1];
            if (JSON.stringify(old_data.sample) === JSON.stringify(values.sample) && JSON.stringify(old_data.from) === JSON.stringify(values.from) &&
                JSON.stringify(old_data.to) === JSON.stringify(values.to) && JSON.stringify(old_data.thk) === JSON.stringify(values.thk) &&
                JSON.stringify(old_data.oreType) === JSON.stringify(values.oreType) && JSON.stringify(old_data.rxqual) === JSON.stringify(values.rxqual) &&
                JSON.stringify(old_data.fest) === JSON.stringify(values.fest) && JSON.stringify(old_data.locker) === JSON.stringify(values.locker) &&
                JSON.stringify(old_data.sanding) === JSON.stringify(values.sanding) && JSON.stringify(old_data.drills) === JSON.stringify(values.drills)
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
                        {t('Input by Geology')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Grid container spacing={1} sx={{ my: 1 }}>
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Typography onClick={() => setView(view === 'oreType' ? '' : 'oreType')}>{t("OreType")}:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Value")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.oreType.value}
                                        label={t("Value")}
                                        onChange={(e) => setValues({ ...values, oreType: { ...values.oreType, value: e.target.value } })}
                                    >
                                        {
                                            oreTypes.map((ore, index) => (
                                                <MenuItem value={ore._id} key={index}>{ore.oreType}</MenuItem>
                                            ))
                                        }
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
                                        onChange={(e) => setValues({ ...values, oreType: { ...values.oreType, reason: e.target.value } })}
                                        value={values.oreType.reason ? values.oreType.reason : ''}
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
                                view === 'oreType' && (
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
                                                            const _str = JSON.stringify(row.oreType);
                                                            return index === histories.findIndex(obj => {
                                                                return JSON.stringify(obj.oreType) === _str;
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
                                                                <TableCell align="right">
                                                                    {oreTypes.filter(oType => oType._id === row.oreType.value).length ? oreTypes.filter(oType => oType._id === row.oreType.value)[0].oreType : ''}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {reasons.filter(reason => reason._id === row.oreType.reason).length > 0 ? reasons.filter(reason => reason._id === row.oreType.reason)[0].reason : ''}
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
                        {
                            fields.filter(field => field !== 'oreType').map((field, index) => (
                                <Grid container spacing={1} key={index} sx={{ my: 1 }}>
                                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <Typography onClick={() => setView(view === field ? '' : field)}>{t(capitalizeFirstLetter(field))}:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type={field === 'drills' ? 'text' : 'number'}
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
                            <Button variant="contained" onClick={handleCreate}>{!geologies.filter(geo => geo._id === props.selectedId)[0].geology ? t("Create") : t("Update")}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyGeologyModal;