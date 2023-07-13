import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { createGeologyLabObjective } from '../../slices/geology';

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

const GeologyLabObjectivesModal = (props) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const { t } = useTranslation();

    const [objectiveData, setObjectiveData] = React.useState([]);
    const [objectiveOptions, setObjectiveOptions] = React.useState([]);

    const { geology_lab_objectives } = useSelector(state => state.geology);
    const { objectives } = useSelector(state => state.objective);
    const { units } = useSelector(state => state.unit);

    React.useEffect(() => {
        if (objectives.length > 0 && units.length > 0) {
            var objOptions = [];
            objectives.map((item) => {
                item.units.map((item0) => {
                    objOptions.push({
                        label: item.objective + " " + item0.unit,
                        value: item._id + "-" + item0._id,
                    });
                    return true;
                });
            });
            setObjectiveOptions(objOptions);
        }
    }, [objectives, units]);

    React.useEffect(() => {
        if (props.id !== '' && objectiveOptions.length > 0) {
            var selectedItem = geology_lab_objectives.filter(item => item._id === props.id).length > 0 ? geology_lab_objectives.filter(item => item._id === props.id)[0] : null;
            if (selectedItem) {
                setObjectiveData([selectedItem.objective.objective + ' ' + selectedItem.unit.unit]);
            }
        }
    }, [objectiveOptions, props.id])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setObjectiveData(
            typeof value === 'string' ? value.split('-') : value,
        );
    }

    const handleCreate = () => {
        if (objectiveData.length === 0) {
            toast.error('Objective is required');
            return;
        }
        const duplicated = objectiveData.filter(item => geology_lab_objectives.filter(obj => obj.objective.objective === item.split(' ')[0] && geology_lab_objectives.filter(obj => obj.unit.unit === item.split(' ')[1])).length > 0);
        if (duplicated.length > 0) {
            toast.error(duplicated.join(',') + ' already exist');
            return;
        }
        const data = objectiveData.map(item => {
            return {
                objective: objectives.filter(obj => obj.objective === item.split(' ')[0])[0]._id,
                unit: units.filter(unit => unit.unit === item.split(' ')[1])[0]._id
            }
        });
        dispatch(createGeologyLabObjective({ data: data, id: props.id }));
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
                        {t('Geology Lab Objectives')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="demo-multiple-chip-label">{t('Objectives')}</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple={props.id === ''}
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

export default GeologyLabObjectivesModal;