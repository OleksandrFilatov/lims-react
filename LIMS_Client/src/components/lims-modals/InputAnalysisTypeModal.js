import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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
import { ServerUri } from '../../config';
import { getUnits } from '../../slices/unit';
import { getReasons } from '../../slices/reason';
import { getObjectives } from '../../slices/objective';
import { logout } from '../../slices/auth';
import axiosFetch from '../../utils/axiosFetch';

const style = {
    position: 'absolute',
    top: '80px',
    left: '20%',
    width: '60%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const InputAnalysisTypeModal = (props) => {

    const dispatch = useDispatch();

    const [origAnalysisModalData, setOrigAnalysisModalData] = React.useState({});
    const [analysisTypeModalData, setAnalysisTypeModalData] = React.useState({ comment: '' });
    const [viewHistory, setViewHistory] = React.useState({});
    const [analysisHistories, setAnalysisHistories] = React.useState([]);

    const { laboratories } = useSelector(state => state.laboratory);
    const { settings } = useSelector(state => state.setting);
    const { materials } = useSelector(state => state.material);
    const { objectives } = useSelector(state => state.objective);
    const { units } = useSelector(state => state.unit);
    const { user } = useSelector(state => state.auth);
    const { reasons } = useSelector(state => state.reason);

    React.useEffect(() => {
        const getData = async () => {
            try {
                Object.keys(viewHistory).map(s => setViewHistory({ ...viewHistory, [s]: false }));

                const res = await axiosFetch.post("/api/inputLabs/analysisTypes", { labStockId: props.id, labRowId: props.rowId, analysisId: props.selected_aType._id });

                dispatch(getReasons(res.data.reasons));
                dispatch(getObjectives(res.data.objectives));
                dispatch(getUnits(res.data.units));
                setAnalysisHistories(res.data.histories);

                let latestHistory = []
                let modalData = []
                if (props.id === props.rowId) {
                    modalData = await materials.filter(m => m._id === laboratories.filter(d => d._id === props.id)[0].material._id)[0]
                        .aTypesValues.filter(aT => aT.client === laboratories.filter(d => d._id === props.id)[0].material_category._id)
                        .filter(d => d.value === props.selected_aType._id)
                        .map((data, index) => {
                            latestHistory = res.data.histories.map(hist => hist[0])
                            const histObj = latestHistory.filter(hist => hist.obj === data.obj)
                            return {
                                [`obj-${index}`]: histObj.length > 0 ? histObj[0].obj : '',
                                [`input-${index}`]: histObj.length > 0 ? histObj[0].value : '',
                                [`accept-${index}`]: histObj.length > 0 ? histObj[0].accept === 1 : false,
                                [`reason-${index}`]: histObj.length > 0 ? (
                                    res.data.reasons.filter(r => r.reason === histObj[0].reason).length > 0 ?
                                        res.data.reasons.filter(r => r.reason === histObj[0].reason)[0].reason : ''
                                ) : '',
                                [`isValid-${index}`]: histObj.length > 0 ? histObj[0].isValid === 1 : false
                            }
                        });
                    await modalData.map(mData => {
                        Object.keys(mData).map(k => {
                            if (Object(analysisTypeModalData).hasOwnProperty(k)) {
                                setAnalysisTypeModalData({
                                    ...analysisTypeModalData,
                                    [k]: mData[k]
                                });
                            } else {
                                let tempData = analysisTypeModalData;
                                tempData[k] = mData[k];
                                // console.log(tempData);
                                setAnalysisTypeModalData(tempData);
                            }
                        })
                    })
                    setAnalysisTypeModalData({
                        ...analysisTypeModalData,
                        comment: latestHistory.length > 0 ? latestHistory[0].comment : '',
                        analysisId: props.selected_aType._id
                    });
                    setOrigAnalysisModalData({
                        ...analysisTypeModalData,
                        comment: latestHistory.length > 0 ? latestHistory[0].comment : '',
                        analysisId: props.selected_aType._id
                    })
                } else {
                    let hist = []
                    const specValues = laboratories.filter(d => d._id === props.rowId)[0].stock_specValues.filter(sv => sv.aType === props.selected_aType._id)
                    modalData = await specValues.map(async (sv, index) => {
                        if (analysisHistories[index] !== null && analysisHistories[index] !== undefined) {
                            hist = await analysisHistories[index].filter(h => String(h._id) === String(sv.histId))
                        }
                        return {
                            [`obj-${index}`]: sv.obj,
                            [`input-${index}`]: sv.value,
                            [`accept-${index}`]: hist.length > 0 ? hist[0].accept === 1 : false,
                            [`reason-${index}`]: hist.length > 0 ? (
                                res.data.reasons.filter(r => r.reason === hist[0].reason).length > 0 ?
                                    res.data.reasons.filter(r => r.reason === hist[0].reason)[0]._id : ''
                            ) : '',
                            [`isValid-${index}`]: sv.isValid === 1
                        }
                    })
                    await modalData.map(mData => {
                        Object.keys(mData).map(k => {
                            setAnalysisTypeModalData({
                                ...analysisTypeModalData,
                                [k]: mData[k]
                            });
                        })
                    })
                    setAnalysisTypeModalData({
                        ...analysisTypeModalData,
                        comment: hist.length > 0 ? hist[0].comment : '',
                        analysisId: props.selected_aType._id
                    });
                    setOrigAnalysisModalData({
                        ...analysisTypeModalData,
                        comment: hist.length > 0 ? hist[0].comment : '',
                        analysisId: props.selected_aType._id
                    });
                }
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
            getData();
        }
    }, [props.id])

    function validate(e) {
        var theEvent = e || window.event;

        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\.|\,/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    const onChangeAnalyInput = (e, i, aType) => {
        let val = e.target.value.replace(",", ".");
        if (val.substr(0, 1) === ".") {
            val = "";
            return false;
        }
        if (val.substr(val.length - 1, val.length) === ".") {
            if (val.substr(0, val.length - 1).indexOf(".") > 0) {
                val = val.substr(0, val.length - 1);
            }
        }
        if (val.substr(val.indexOf("."), val.length).length > 5) {
            val = val.substr(0, val.length - 1);
        }
        if (val < Number(aType.min) || val > Number(aType.max)) {
            setAnalysisTypeModalData({
                ...analysisTypeModalData,
                analysisId: aType.value,
                [`input-${i}`]: val,
                [`isValid-${i}`]: false,
                [`obj-${i}`]: aType.obj
            })
        } else {
            setAnalysisTypeModalData({
                ...analysisTypeModalData,
                analysisId: aType.value,
                [`input-${i}`]: val,
                [`isValid-${i}`]: true,
                [`obj-${i}`]: aType.obj
            });
        }
    }

    const handleSaveAnalysis = () => {
        let _flags = []
        const inputData = analysisTypeModalData
        const obj_rows = Object.keys(inputData).filter(key => key.indexOf('accept-') > -1).length
        for (let i = 0; i < obj_rows; i++) {
            _flags.push(false)
        }
        if (inputData.comment !== origAnalysisModalData.comment) {
            for (let i = 0; i < obj_rows; i++) {
                _flags.push(true)
            }
        } else {
            if (Object.keys(inputData).length === Object.keys(origAnalysisModalData).length) {
                Object.keys(inputData).map(key => {
                    if (inputData[key] !== origAnalysisModalData[key] && key.indexOf('-') > -1) {
                        _flags[key.split('-')[1]] = true;
                    }
                })
            }
        }
        if (_flags.filter(f => f === true).length === 0) {
            props.handleClose();
            return;
        }

        let data = []
        const obj_count = materials.filter(m => m._id === laboratories.filter(d => d._id === props.id)[0].material._id)[0]
            .aTypesValues.filter(aT => aT.client === laboratories.filter(d => d._id === props.id)[0].material_category._id)
            .filter(d => d.value === props.selected_aType._id).length;
        for (let i = 0; i < obj_count; i++) {
            if (_flags[i]) {
                const temp = {
                    comment: inputData.comment,
                    obj: inputData[`obj-${i}`],
                    input: (inputData[`input-${i}`] !== null && inputData[`input-${i}`] !== undefined) ? inputData[`input-${i}`] : '',
                    reason: (inputData[`reason-${i}`] !== null && inputData[`reason-${i}`] !== undefined) ? inputData[`reason-${i}`] : '',
                    isValid: (inputData[`isValid-${i}`] !== null && inputData[`isValid-${i}`] !== undefined) ? inputData[`isValid-${i}`] : true,
                    accept: (inputData[`accept-${i}`] !== null && inputData[`accept-${i}`] !== undefined) ? inputData[`accept-${i}`] : false,
                }
                temp.final_validate = temp.accept ? true : temp.isValid
                if (temp.input !== '') {
                    data.push(temp)
                }
            }
        }
        let _flag = true
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                _flag = data[i].final_validate
            } else {
                _flag = _flag & data[i].final_validate
            }
        }

        const requestData = {
            data: data,
            labId: props.id,
            analysisId: inputData.analysisId,
            validate: _flag ? 1 : 2
        }
        if (requestData.data.filter(row => row.reason === "").length > 0) {
            alert("Please select reason field");
            return;
        }
        props.handleSave(requestData);
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
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>{props.selected_aType.analysisType}</Typography>
                    <Box m={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Box className="border-grey p-4">
                            {
                                materials.filter(m => m._id === laboratories.filter(d => d._id === props.id)[0].material._id)[0]
                                    .aTypesValues.filter(aT => aT.client === laboratories.filter(d => d._id === props.id)[0].material_category._id)
                                    .filter(d => d.value === props.selected_aType._id)
                                    .map((data, index) => (
                                        <Grid container key={index} className="mx-0 my-2">
                                            <Grid item xs={4}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <span className="cursor-pointer" onClick={() => {
                                                            setViewHistory({
                                                                ...viewHistory,
                                                                [`analysis_table_flag-${index}`]: (
                                                                    viewHistory[`analysis_table_flag-${index}`] === null || viewHistory[`analysis_table_flag-${index}`] === undefined
                                                                ) ? true : !viewHistory[`analysis_table_flag-${index}`]
                                                            })
                                                        }}>
                                                            {(Object.keys(objectives).length > 0 && Object.keys(units).length > 0) ?
                                                                objectives.filter(obj => obj._id === data.obj.split("-")[0])[0].objective + " " +
                                                                units.filter(u => u._id === data.obj.split("-")[1])[0].unit + " " +
                                                                "[" + data.min + ", " + data.max + "]" : ''
                                                            }
                                                        </span>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Value"
                                                            variant='outlined'
                                                            type="number"
                                                            className={`form-control-sm ${analysisTypeModalData[`accept-${index}`] === true ? `color-green` : (analysisTypeModalData[`isValid-${index}`] !== null && analysisTypeModalData[`isValid-${index}`] !== undefined && analysisTypeModalData[`isValid-${index}`] ? `color-green` : `color-red`)}`}
                                                            onKeyPress={validate}
                                                            onChange={(e) => onChangeAnalyInput(e, index, data)}
                                                            value={analysisTypeModalData[`input-${index}`]}
                                                            defaultValue={0}
                                                            disabled={props.id !== props.rowId}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={4} sx={{ px: 2 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <span>Reason</span>
                                                    </Grid>
                                                    <Grid item xs={9}>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Reason</InputLabel>
                                                            <Select
                                                                value={(analysisTypeModalData[`reason-${index}`] !== null && analysisTypeModalData[`reason-${index}`] !== undefined) ? analysisTypeModalData[`reason-${index}`] : ''}
                                                                label="Reason"
                                                                onChange={(e) => setAnalysisTypeModalData({ ...analysisTypeModalData, [`reason-${index}`]: e.target.value })}
                                                                disabled={props.id !== props.rowId}
                                                            >
                                                                {/* <MenuItem value=""></MenuItem> */}
                                                                {reasons.map((item) => (
                                                                    <MenuItem key={item._id} value={item.reason}>
                                                                        {item.reason}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Grid container>
                                                    <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        Accept value anyway
                                                    </Grid>
                                                    <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            user.labAdmin ? (
                                                                Number(analysisTypeModalData[`input-${index}`]) >= Number(data.min) && Number(analysisTypeModalData[`input-${index}`]) <= Number(data.max) ? (
                                                                    <span
                                                                        className={`d-block cursor-pointer border-dark ${(analysisTypeModalData[`accept-${index}`] !== undefined && analysisTypeModalData[`accept-${index}`] !== null && analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                        style={{ width: '20px', height: '20px' }}
                                                                    ></span>
                                                                ) : (
                                                                    <span
                                                                        className={`d-block cursor-pointer border-dark ${(analysisTypeModalData[`accept-${index}`] !== undefined && analysisTypeModalData[`accept-${index}`] !== null && analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                        style={{ width: '20px', height: '20px' }}
                                                                        onClick={() => {
                                                                            if (props.id !== props.rowId) return;
                                                                            setAnalysisTypeModalData({
                                                                                ...analysisTypeModalData, [`accept-${index}`]: (analysisTypeModalData[`accept-${index}`] === undefined || analysisTypeModalData[`accept-${index}`] === null) ? true : !analysisTypeModalData[`accept-${index}`]
                                                                            })
                                                                        }}
                                                                    ></span>
                                                                )
                                                            ) : (
                                                                <span
                                                                    className={`d-block cursor-pointer border-dark ${(analysisTypeModalData[`accept-${index}`] !== undefined && analysisTypeModalData[`accept-${index}`] !== null && analysisTypeModalData[`accept-${index}`]) && `background-green`}`}
                                                                    style={{ width: '20px', height: '20px' }}
                                                                ></span>
                                                            )
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {
                                                (Object.keys(analysisHistories).length > 0 && analysisHistories[index] !== null && analysisHistories[index] !== undefined && Object.keys(analysisHistories[index]).length > 0 && viewHistory[`analysis_table_flag-${index}`] === true) && (
                                                    <Grid item xs={12} className="mt-2">
                                                        <TableContainer component={Paper}>
                                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Value</TableCell>
                                                                        <TableCell align="right">Author</TableCell>
                                                                        <TableCell align="right">Date</TableCell>
                                                                        <TableCell align="right">Reason</TableCell>
                                                                        <TableCell align="right">Accept</TableCell>
                                                                        <TableCell align="right">Comment</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {(analysisHistories[index] !== null && analysisHistories[index] !== undefined) ? analysisHistories[index].map((item, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell component="th" scope="row">
                                                                                {item.value}
                                                                            </TableCell>
                                                                            <TableCell component="th" scope="row">
                                                                                {item.user.userName}
                                                                            </TableCell>
                                                                            <TableCell component="th" scope="row">
                                                                                {moment(item.date).format(`${settings.date_format} HH:mm:ss`)}
                                                                            </TableCell>
                                                                            <TableCell component="th" scope="row">
                                                                                {item.reason}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <Box className="d-flex">
                                                                                    <span className={`cursor-pointer border-dark ${item.accept === 1 && `background-green`}`} style={{ width: '20px', height: '20px' }}></span>
                                                                                </Box>
                                                                            </TableCell>
                                                                            <TableCell align="right">{item.comment}</TableCell>
                                                                        </TableRow>
                                                                    )) : (
                                                                        <TableRow>
                                                                            <TableCell colSpan={6} align='center'>
                                                                                No Data
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
                            <Grid container spacing={2}>
                                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <span>Comment</span>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        multiline
                                        label="Comment"
                                        variant='outlined'
                                        name="comment"
                                        rows={3}
                                        value={analysisTypeModalData.comment}
                                        onChange={(e) => setAnalysisTypeModalData({ ...analysisTypeModalData, comment: e.target.value })}
                                        fullWidth
                                        disabled={props.id !== props.rowId}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        {
                            props.id === props.rowId && (
                                <Box mb={1} mx={3} display="flex" justifyContent="end">
                                    <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                                    <Button variant="contained" onClick={handleSaveAnalysis}>{props.id === '' ? 'Create' : 'Update'}</Button>
                                </Box>
                            )
                        }
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InputAnalysisTypeModal;