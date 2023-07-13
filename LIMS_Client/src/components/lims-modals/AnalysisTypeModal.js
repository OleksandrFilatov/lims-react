import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axiosFetch from '../../utils/axiosFetch';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(obj, opts, theme) {
    return {
        fontWeight:
            opts.indexOf(obj) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AnalysisTypeModal = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();

    const [analysisTypeID, setAnalysisTypeID] = React.useState('')
    const [analysisType, setAnalysisType] = React.useState('')
    const [norm, setNorm] = React.useState('')
    const [objectiveData, setObjectiveData] = React.useState([])
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false)
    const [objectiveOptions, setObjectiveOptions] = React.useState([])

    const { analysisTypes } = useSelector(state => state.analysisType);
    const { units } = useSelector(state => state.unit);
    const { objectives } = useSelector(state => state.objective);

    React.useEffect(() => {
        setAnalysisTypeID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (objectives.length > 0 && units.length > 0) {
            var objOptions = [];
            objectives.map((item) => {
                item.units.map((item0) => {
                    var unit = units.filter(u => u._id === item0)[0].unit;
                    if (unit !== "")
                        objOptions.push({
                            label: item.objective + " " + unit,
                            value: item._id + "-" + item0,
                        });
                    return true;
                });
            });
            setObjectiveOptions(objOptions);
        }
    }, [objectives, units])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedAnalysisType = analysisTypes.filter(item => item._id === props.id)[0];
            const selected_objectives = selectedAnalysisType.objectives.map(obj => {
                return objectives.filter(o => o._id === obj.id)[0].objective + " " + units.filter(u => u._id === obj.unit)[0].unit;
            })
            setAnalysisTypeID(selectedAnalysisType.analysisType_id);
            setAnalysisType(selectedAnalysisType.analysisType);
            setNorm(selectedAnalysisType.norm);
            setObjectiveData(selected_objectives)
            setRemark(selectedAnalysisType.remark);
        }
    }, [props.id])

    const handleChange = async (event) => {
        try {
            const {
                target: { value },
            } = event;
            if (objectiveData.length > value.length && props.id !== "") {
                var removedItem = objectiveData.filter(obj => !value.includes(obj))[0];

                const requestData = {
                    aType: props.id,
                    objective: objectives.filter(obj => obj.objective === removedItem.split(' ')[0])[0]._id,
                    unit: units.filter(unit => unit.unit === removedItem.split(' ')[1])[0]._id,
                }
                const res = await axiosFetch.post('/api/analysis/check_obj', requestData);
                if (res.data.success) {
                    setObjectiveData(
                        typeof value === 'string' ? value.split('-') : value,
                    );
                } else {
                    toast.error(res.data.message);
                }
            } else {
                setObjectiveData(
                    typeof value === 'string' ? value.split('-') : value,
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCreate = () => {
        if (analysisTypeID === '' || analysisTypeID === 0) {
            toast.error('Analysis Type ID is required');
            return;
        }
        if (analysisType === '') {
            toast.error('Analysis Type is required');
            return;
        }
        if (props.id === '' && analysisTypes.filter(aT => aT.analysisType === analysisType).length > 0) {
            toast.error('Analysis Type already exists');
            return;
        }
        const data = {
            analysisType_id: analysisTypeID,
            analysisType: analysisType,
            norm: norm,
            objectives: objectiveData.map(obj => {
                return {
                    id: objectives.filter(o => o.objective === obj.split(' ')[0])[0]._id,
                    unit: units.filter(u => u.unit === obj.split(' ')[1])[0]._id
                }
            }),
            remark: remark,
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setAnalysisTypeID(e.target.value)
        setDuplicated(analysisTypes.filter(item => item.analysisType_id === e.target.value).length > 0);
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setAnalysisType(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Analysis Type')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Analysis Type ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={analysisTypeID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Analysis Type ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Analysis Type")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={analysisType}
                        />
                        {
                            (props.id === '' && analysisTypes.filter(aT => aT.analysisType === analysisType).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Analysis Type already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Norm")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setNorm(e.target.value)}
                            value={norm}
                        />
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="demo-multiple-chip-label">{t('Objectives')}</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={objectiveData}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                                fullWidth
                            >
                                {objectiveOptions.map((obj, index) => (
                                    <MenuItem
                                        key={index}
                                        value={obj.label}
                                        style={getStyles(obj, objectiveOptions, theme)}
                                    >
                                        {obj.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label={t("Remark")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setRemark(e.target.value)}
                            value={remark}
                        />
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

export default AnalysisTypeModal;