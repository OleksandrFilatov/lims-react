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
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axiosFetch from '../../utils/axiosFetch';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const GeologyGeneralModal = (props) => {

    const { t } = useTranslation();

    const [selectedGeology, setSelectedGeology] = React.useState({});
    const [values, setValues] = React.useState({
        hole_id: { value: '', reason: null },
        materialType: { value: '', reason: null },
    });
    const [comment, setComment] = React.useState('');
    const [generalID, setGeneralID] = React.useState('');
    const [duplicated, setDuplicated] = React.useState(false);
    const [viewHoleIds, setViewHoleids] = React.useState(false);
    const [viewMaterialTypes, setViewMaterialTypes] = React.useState(false);
    const [histories, setHistories] = React.useState([]);

    const { geologies } = useSelector(state => state.geology);
    const { reasons } = useSelector(state => state.reason);
    const { users } = useSelector(state => state.user);

    React.useEffect(() => {
        const getData = async () => {
            try {
                var geology = geologies.filter(geo => geo._id === props.selectedId)[0];

                setSelectedGeology(geology);
                setGeneralID(geology.geology_id);
                if (geology.general) {
                    setValues({
                        hole_id: {
                            value: geology.general_data[geology.general_data.length - 1].hole_id.value,
                            reason: geology.general_data[geology.general_data.length - 1].hole_id.reason
                        },
                        materialType: {
                            value: geology.general_data[geology.general_data.length - 1].materialType.value,
                            reason: geology.general_data[geology.general_data.length - 1].materialType.reason
                        },
                    });
                    setComment(geology.general_data[geology.general_data.length - 1].comment);
                }

                const res = await axiosFetch.get('/api/geology/general_history', { params: { id: props.selectedId } });
                setHistories(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [props.selectedId]);

    const handleCreate = () => {
        if (generalID === '' || generalID === 0) {
            toast.error('ID is required');
            return;
        }
        if (selectedGeology.general) {
            const old_data = selectedGeology.general_data[selectedGeology.general_data.length - 1];
            if (JSON.stringify(old_data.hole_id) === JSON.stringify(values.hole_id) && JSON.stringify(old_data.materialType) === JSON.stringify(values.materialType)) {
                props.handleClose();
                return;
            }
        }
        const data = {
            geology_id: generalID,
            comment: comment,
            values: values,
            id: props.selectedId,
        };
        props.handleCreate(data);
        props.handleClose();
    }

    const handleChangeID = (e) => {
        setGeneralID(e.target.value)
        setDuplicated(geologies.filter(item => item.geology_id === e.target.value).length > 0);
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
                        {t('General Input')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={generalID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>ID already exists.</Box>
                        }
                        <Grid container spacing={2}>
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Typography onClick={() => setViewHoleids(!viewHoleIds)}>{t("HOLEID")}:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    required
                                    label={t("Value")}
                                    fullWidth
                                    onChange={(e) => setValues({ ...values, hole_id: { ...values.hole_id, value: e.target.value } })}
                                    value={values.hole_id.value}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("Reason")}
                                        onChange={(e) => setValues({ ...values, hole_id: { ...values.hole_id, reason: e.target.value } })}
                                        value={values.hole_id.reason ? values.hole_id.reason : ''}
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
                                viewHoleIds && (
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
                                                            const _str = JSON.stringify(row.hole_id);
                                                            return index === histories.findIndex(obj => {
                                                                return JSON.stringify(obj.hole_id) === _str;
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
                                                                <TableCell align="right">{row.hole_id.value}</TableCell>
                                                                <TableCell align="right">
                                                                    {reasons.filter(reason => reason._id === row.hole_id.reason).length > 0 ? reasons.filter(reason => reason._id === row.hole_id.reason)[0].reason : ''}
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
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Typography onClick={() => setViewMaterialTypes(!viewMaterialTypes)}>{t("Material Type")}:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Value")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("Value")}
                                        onChange={(e) => setValues({ ...values, materialType: { ...values.materialType, value: e.target.value } })}
                                        value={values.materialType.value}
                                    >
                                        <MenuItem value="Baryte">Baryte</MenuItem>
                                        <MenuItem value="Fluorite">Fluorite</MenuItem>
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
                                        onChange={(e) => setValues({ ...values, materialType: { ...values.materialType, reason: e.target.value } })}
                                        value={values.materialType.reason ? values.materialType.reason : ''}
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
                                viewMaterialTypes && (
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
                                                            const _str = JSON.stringify(row.materialType);
                                                            return index === histories.findIndex(obj => {
                                                                return JSON.stringify(obj.materialType) === _str;
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
                                                                <TableCell align="right">{row.materialType.value}</TableCell>
                                                                <TableCell align="right">
                                                                    {reasons.filter(reason => reason._id === row.materialType.reason).length > 0 ? reasons.filter(reason => reason._id === row.materialType.reason)[0].reason : ''}
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
                            <Button variant="contained" onClick={handleCreate}>{!geologies.filter(geo => geo._id === props.selectedId)[0].general ? t("Create") : t("Update")}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyGeneralModal;