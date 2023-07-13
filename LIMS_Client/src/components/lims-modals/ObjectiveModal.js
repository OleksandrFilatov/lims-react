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

function getStyles(unit, objectiveUnits, theme) {
    return {
        fontWeight:
            objectiveUnits.indexOf(unit) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const ObjectiveModal = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();

    const [objectiveID, setObjectiveID] = React.useState('')
    const [objective, setObjective] = React.useState('')
    const [objectiveUnits, setObjectiveUnits] = React.useState([])
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { objectives } = useSelector(state => state.objective);
    const { units } = useSelector(state => state.unit);

    React.useEffect(() => {
        setObjectiveID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedObjective = objectives.filter(item => item._id === props.id)[0];
            const unit_ids = selectedObjective.units.map(obj => obj._id);

            setObjectiveID(selectedObjective.objective_id);
            setObjective(selectedObjective.objective);
            setObjectiveUnits(units.filter(u => unit_ids.indexOf(u._id) > -1).map(item => item.unit))
            setRemark(selectedObjective.remark);
        }
    }, [props.id])

    const handleChange = async (event) => {
        try {
            const {
                target: { value },
            } = event;
            if (objectiveUnits.length > value.length && props.id !== '') {
                var removedItem = objectiveUnits.filter(obj => !value.includes(obj))[0];

                const requestData = {
                    objective: props.id,
                    unit: units.filter(u => u.unit === removedItem)[0]._id
                }
                const res = await axiosFetch.post('/check_obj_unit', requestData);
                if (!res.data.success) {
                    toast.error(res.data.message);
                    return;
                } else {
                    setObjectiveUnits(
                        typeof value === 'string' ? value.split(',') : value,
                    );
                }
            } else {
                setObjectiveUnits(
                    typeof value === 'string' ? value.split(',') : value,
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCreate = () => {
        if (objectiveID === '' || objectiveID === 0) {
            toast.error('Objective ID is required');
            return;
        }
        if (objective === '') {
            toast.error('Objective is required');
            return;
        }
        if (props.id === '' && objectives.filter(o => o.objective === objective).length > 0) {
            toast.error('Objective already exists');
            return;
        }
        const data = {
            objective_id: objectiveID,
            objective: objective,
            units: units.filter(u => objectiveUnits.indexOf(u.unit) > -1)
                .map(item => item._id),
            remark: remark,
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setObjectiveID(e.target.value)
        setDuplicated(objectives.filter(item => item.objective_id === e.target.value).length > 0);
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setObjective(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Objective')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Objective ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={objectiveID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Objective ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Objective")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={objective}
                        />
                        {
                            (props.id === '' && objectives.filter(o => o.objective === objective).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Objective already exists.</Box>
                        }
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="demo-multiple-chip-label">{t('Units')}</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={objectiveUnits}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                                fullWidth
                            >
                                {units.map((unit, index) => (
                                    <MenuItem
                                        key={index}
                                        value={unit.unit}
                                        style={getStyles(unit.unit, objectiveUnits, theme)}
                                    >
                                        {unit.unit}
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

export default ObjectiveModal;