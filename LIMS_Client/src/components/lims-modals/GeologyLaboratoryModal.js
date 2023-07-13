import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Grid, Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

const fields = ['date', 'level', 'subset', 'thickness', 'distance'];

const GeologyLaboratoryModal = (props) => {

    const { t } = useTranslation();

    const [selectedGeology, setSelectedGeology] = React.useState({});
    const [fixedValues, setFixedValues] = React.useState({
        date: { value: new Date(), reason: null },
        level: { value: '', reason: null },
        subset: { value: '', reason: null },
        thickness: { value: 0, reason: null },
        distance: { value: 0, reason: null },
        weight: { value: 0, reason: null },
    });
    const [objValues, setObjValues] = React.useState([]);
    const [comment, setComment] = React.useState('');
    const [histories, setHistories] = React.useState([]);
    const [view, setView] = React.useState('');

    const { geologies, geology_lab_objectives } = useSelector(state => state.geology);
    const { analysisTypes } = useSelector(state => state.analysisType);
    const { reasons } = useSelector(state => state.reason);

    React.useEffect(() => {
        const getData = async () => {
            try {
                var geology = geologies.filter(geo => geo._id === props.selectedId)[0];
                setSelectedGeology(geology);
                console.log(geology);
                if (geology.laboratory) {
                    setComment(geology.laboratory_data.comment);
                    setFixedValues({
                        date: {
                            value: geology.laboratory_data.date.value,
                            reason: geology.laboratory_data.date.reason
                        },
                        level: {
                            value: geology.laboratory_data.level.value,
                            reason: geology.laboratory_data.level.reason
                        },
                        subset: {
                            value: geology.laboratory_data.subset.value,
                            reason: geology.laboratory_data.subset.reason
                        },
                        thickness: {
                            value: geology.laboratory_data.thickness.value,
                            reason: geology.laboratory_data.thickness.reason
                        },
                        distance: {
                            value: geology.laboratory_data.distance.value,
                            reason: geology.laboratory_data.distance.reason
                        },
                        weight: {
                            value: geology.laboratory_data.weight.value,
                            reason: geology.laboratory_data.weight.reason
                        },
                    });
                    var obj_values = geology.laboratory_data.objective_values.map(item => {
                        return {
                            obj: item.obj?._id,
                            analysisType: item.analysisType,
                            value: item.value,
                            reason: item.reason
                        }
                    })
                    geology_lab_objectives.map(obj => {
                        if (obj_values.filter(_obj => _obj.obj === obj._id).length === 0) {
                            obj_values.push({ obj: obj._id, analysisType: null, value: 0, reason: null })
                        }
                    });
                    setObjValues(obj_values)
                } else {
                    if (geology_lab_objectives.length > 0) {
                        let temp_values = [];
                        geology_lab_objectives.map(obj => temp_values.push({ obj: obj._id, analysisType: null, value: 0, reason: null }));
                        setObjValues(temp_values);
                    }
                }

                const res = await axiosFetch.get('/api/geology/laboratory_history', { params: { id: props.selectedId } });
                res.data.pop();
                setHistories(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getData();
    }, [props.selectedId, geology_lab_objectives]);

    const getDateFormat = (_format) => {
        var format = '';
        switch (_format) {
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
        return format;
    }

    const handleCreate = () => {
        if (selectedGeology.laboratory) {
            const old_data = selectedGeology.laboratory_data;
            if (JSON.stringify(old_data.date) === JSON.stringify(fixedValues.date) && JSON.stringify(old_data.level) === JSON.stringify(fixedValues.level) &&
                JSON.stringify(old_data.subset) === JSON.stringify(fixedValues.subset) && JSON.stringify(old_data.thickness) === JSON.stringify(fixedValues.thickness) &&
                JSON.stringify(old_data.distance) === JSON.stringify(fixedValues.distance) && JSON.stringify(old_data.weight) === JSON.stringify(fixedValues.weight) &&
                JSON.stringify(old_data.objective_values.map(item => {
                    return {
                        obj: item.obj?._id,
                        analysisType: item.analysisType,
                        value: item.value,
                        reason: item.reason
                    }
                })) === JSON.stringify(objValues)
            ) {
                props.handleClose();
                return;
            }
        }
        const data = {
            comment: comment,
            fixedValues: fixedValues,
            objValues: objValues,
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
        >
            <Fade in={props.open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>
                        {t('Input Laboratory')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        {
                            fields.map((field, index) => (
                                <Grid container spacing={1} key={index} sx={{ my: 1 }}>
                                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <Typography onClick={() => setView(view === field ? '' : field)}>{t(capitalizeFirstLetter(field))}:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {
                                            field === 'date' ? (
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={2}>
                                                        <DatePicker
                                                            inputFormat={getDateFormat(props.date_format)}
                                                            label={t("Date")}
                                                            value={fixedValues.date.value}
                                                            onChange={(val) => setFixedValues({ ...fixedValues, date: { ...fixedValues.date, value: val } })}
                                                            renderInput={(params) => <TextField {...params} />}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            ) : (
                                                <TextField
                                                    type={(field === 'level' || field === 'subset') ? 'text' : 'number'}
                                                    required
                                                    label={t("Value")}
                                                    fullWidth
                                                    onChange={(e) => setFixedValues({ ...fixedValues, [field]: { ...fixedValues[field], value: e.target.value } })}
                                                    value={fixedValues[field].value}
                                                />
                                            )
                                        }

                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label={t("Reason")}
                                                onChange={(e) => setFixedValues({ ...fixedValues, [field]: { ...fixedValues[field], reason: e.target.value } })}
                                                value={fixedValues[field].reason ? fixedValues[field].reason : ''}
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
                                                                            {row.user.userName}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {field === 'date' ? moment(row.date.value).format(props.date_format) : row[field].value}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {row[field].reason?.reason}
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
                        <Divider sx={{ borderColor: '#eee' }} light />
                        {
                            geology_lab_objectives?.map((field, index) => (
                                <Grid container spacing={1} key={index} sx={{ my: 1 }}>
                                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <Typography onClick={() => setView(view === field.objective.objective ? '' : field.objective.objective)}>{t(capitalizeFirstLetter(field.objective.objective))}:</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">{t("Analysis Type")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label={t("Analysis Type")}
                                                onChange={(e) => setObjValues(prev => prev.map(obj => obj.obj === field._id ? { ...obj, analysisType: e.target.value } : obj))}
                                                value={objValues.filter(obj => obj.obj === field._id)[0]?.analysisType ? objValues.filter(obj => obj.obj === field._id)[0]?.analysisType : ''}
                                            >
                                                {
                                                    analysisTypes.filter(aType => aType.objectives.filter(obj => obj.id === field.objective._id).length > 0)
                                                        .map(aType => (
                                                            <MenuItem value={aType._id} key={aType._id}>{aType.analysisType}</MenuItem>
                                                        ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            type="number"
                                            required
                                            label={t("Value")}
                                            fullWidth
                                            onChange={(e) => setObjValues(prev => prev.map(obj => obj.obj === field._id ? { ...obj, value: e.target.value } : obj))}
                                            value={objValues.filter(obj => String(obj.obj) === String(field._id))[0]?.value}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {field.unit.unit}
                                                </InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label={t("Reason")}
                                                onChange={(e) => setObjValues(prev => prev.map(obj => obj.obj === field._id ? { ...obj, reason: e.target.value } : obj))}
                                                value={objValues.filter(obj => obj.obj === field._id)[0]?.reason ? objValues.filter(obj => obj.obj === field._id)[0]?.reason : ''}
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
                                        view === field.objective.objective && (
                                            <Grid item xs={12} sx={{ my: 1 }}>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>{t("User")}</TableCell>
                                                                <TableCell align="right">{t("Analysis Type")}</TableCell>
                                                                <TableCell align="right">{t("Value")}</TableCell>
                                                                <TableCell align="right">{t("Reason")}</TableCell>
                                                                <TableCell align="right">{t("Date")}</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {histories.length > 0 ? histories
                                                                .filter((row, index) => {
                                                                    const _obj1 = row.objective_values.filter(obj => obj.obj.objective === field.objective._id && obj.obj.unit === field.unit._id)[0];
                                                                    const _str1 = {
                                                                        analysisType: _obj1.analysisType ? _obj1.analysisType?._id : null,
                                                                        value: _obj1.value,
                                                                        reason: _obj1.reason._id
                                                                    }
                                                                    return index === histories.findIndex(item => {
                                                                        const _obj2 = item.objective_values.filter(obj => obj.obj.objective === field.objective._id && obj.obj.unit === field.unit._id)[0];
                                                                        const _str2 = {
                                                                            analysisType: _obj2.analysisType ? _obj2.analysisType?._id : null,
                                                                            value: _obj2.value,
                                                                            reason: _obj2.reason._id
                                                                        }
                                                                        return JSON.stringify(_str1) === JSON.stringify(_str2);
                                                                    });
                                                                })
                                                                .map((row) => (
                                                                    <TableRow
                                                                        key={row._id}
                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                    >
                                                                        <TableCell component="th" scope="row">
                                                                            {row.user.userName}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {
                                                                                row.objective_values.filter(obj => obj.obj.objective === field.objective._id).length > 0 ?
                                                                                    row.objective_values.filter(obj => obj.obj.objective === field.objective._id)[0].analysisType?.analysisType : ''
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {
                                                                                row.objective_values.filter(obj => obj.obj.objective === field.objective._id).length > 0 ?
                                                                                    row.objective_values.filter(obj => obj.obj.objective === field.objective._id)[0].value : ''
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {
                                                                                row.objective_values.filter(obj => obj.obj.objective === field.objective._id).length > 0 ?
                                                                                    row.objective_values.filter(obj => obj.obj.objective === field.objective._id)[0].reason.reason : ''
                                                                            }
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
                        <Divider sx={{ borderColor: '#eee' }} light />
                        <Grid container spacing={1} sx={{ my: 1 }}>
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <Typography onClick={() => setView(view === 'weight' ? '' : 'weight')}>{t('Weight')}:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    required
                                    label={t("Value")}
                                    fullWidth
                                    onChange={(e) => setFixedValues({ ...fixedValues, weight: { ...fixedValues.weight, value: e.target.value } })}
                                    value={fixedValues.weight.value}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{t("Reason")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label={t("Reason")}
                                        onChange={(e) => setFixedValues({ ...fixedValues, weight: { ...fixedValues.weight, reason: e.target.value } })}
                                        value={fixedValues.weight.reason ? fixedValues.weight.reason : ''}
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
                                view === 'weight' && (
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
                                                            const _str = JSON.stringify(row.weight);
                                                            return index === histories.findIndex(obj => {
                                                                return JSON.stringify(obj.weight) === _str;
                                                            });
                                                        })
                                                        .map((row) => (
                                                            <TableRow
                                                                key={row._id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {row.user.userName}
                                                                </TableCell>
                                                                <TableCell align="right">{row.weight.value}</TableCell>
                                                                <TableCell align="right">
                                                                    {row.weight.reason.reason}
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
                            <Button variant="contained" onClick={handleCreate}>{!geologies.filter(geo => geo._id === props.selectedId)[0].laboratory ? t("Create") : t("Update")}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyLaboratoryModal;