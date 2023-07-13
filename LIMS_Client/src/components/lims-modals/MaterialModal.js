import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Divider, Grid, TextField } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import axiosFetch from '../../utils/axiosFetch';
import { getClients } from '../../slices/client';

const style = {
    position: 'absolute',
    top: '80px',
    left: '25%',
    width: '50%',
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

function getStyles(client, clientObjs, theme) {
    return {
        fontWeight:
            clientObjs.indexOf(client) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function getObjectiveStyles(label, Objs, theme) {
    return {
        fontWeight:
            Objs.filter(item => item.label === label).length === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function getAnalysisStyles(label, aTypes, theme) {
    return {
        fontWeight:
            aTypes.filter(item => item.label === label).length === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const MaterialModal = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [materialID, setMaterialID] = React.useState('')
    const [material, setMaterial] = React.useState('')
    const [selected_clients, setSelectedClients] = React.useState(['Default']);
    const [remark, setRemark] = React.useState('')
    const [_clients, setClients] = React.useState([]);
    const [selected_objectives, setSelectedObjectives] = React.useState([]);
    const [selected_objValues, setSelectedObjValues] = React.useState([]);
    const [filteredObjectives, setFilteredObjectives] = React.useState([]);
    const [selected_aTypes, setSelectedATypes] = React.useState([]);
    const [defaultClient, setDefaultClient] = React.useState(null);
    const [duplicated, setDuplicated] = React.useState(false);

    const { materials, clientOptions, objOptions } = useSelector(state => state.material);
    const { clients } = useSelector(state => state.client);
    const { objectives } = useSelector(state => state.objective);
    const { analysisTypes } = useSelector(state => state.analysisType);

    React.useEffect(() => {
        setMaterialID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (clients.length > 0) {
            const _defaultClient = clients.filter(c => c.name === 'Default')[0];
            setDefaultClient(_defaultClient)
        }
    }, [clients])

    React.useEffect(() => {
        if (objectives.length > 0) {
            setFilteredObjectives(Array.from(
                objectives.reduce((a, o) => a.set(`${o.value}-${o.client}`, o), new Map()).values()
            ));
        }
    }, [objectives]);

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedMaterial = materials.filter(item => item._id === props.id)[0];

            setMaterialID(selectedMaterial.material_id);
            setMaterial(selectedMaterial.material);
            setRemark(selectedMaterial.remark);

            setSelectedObjectives(selectedMaterial.objectiveValues.map(obj => {
                return {
                    label: objectives.filter(item => item._id === obj.id)[0].objective,
                    value: obj.id + "-" + obj.unit,
                    client: obj.client
                }
            }));

            setSelectedATypes(selectedMaterial.aTypesValues)
            if (clients.length > 0) {
                setClients(clients.filter(item => selectedMaterial.clients.map(item => item._id).indexOf(item._id) > -1).map(item => item.name))
                setSelectedClients(prevClient => prevClient.concat(clients.filter(item => selectedMaterial.clients.map(item => item._id).indexOf(item._id) > -1).map(item => item.name)))
            }
        }
    }, [props.id, clients])

    const handleCreate = () => {
        if (materialID === '' || materialID === 0) {
            toast.error('Material ID is required');
            return;
        }
        if (material === '') {
            toast.error('Material is required');
            return;
        }
        if (props.id === '' && materials.filter(m => m.material === material).length > 0) {
            toast.error('Material already exists');
            return;
        }
        var __clients = selected_aTypes.map(item => item.client).filter(item => item !== defaultClient._id);
        console.log(">>>>>>>>>", selected_aTypes)
        const data = {
            aTypesValues: selected_aTypes,
            clients: [...new Set(__clients)],
            material_id: materialID,
            material: material,
            objectiveValues: selected_aTypes.map(item => {
                return {
                    analysis: item.value,
                    client: item.client,
                    id: item.obj.split('-')[0],
                    unit: item.obj.split('-')[1],
                    min: item.min,
                    max: item.max
                }
            }),
            remark: remark
        }
        // console.log(data)
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setMaterialID(e.target.value)
        setDuplicated(materials.filter(item => item.material_id === e.target.value).length > 0);
    }

    const handleChange = async (event) => {
        try {
            const {
                target: { value },
            } = event;
            if (props.id !== "" && value.length < selected_clients.length) {
                var removedItem = selected_clients.filter(c => c !== 'Default' && !value.includes(c))[0];
                const requestData = {
                    material: props.id,
                    client: clients.filter(c => c.name === removedItem)[0]._id
                }
                const res = await axiosFetch.post('/api/materials/check_client', requestData);
                if (res.data.success) {
                    setClients(
                        typeof value === 'string' ? value.split(',') : value,
                    );
                    var _tempOpt = ['Default'];
                    setSelectedClients(_tempOpt.concat(event.target.value))
                } else {
                    toast.error(res.data.message);
                }
            } else {
                setClients(
                    typeof value === 'string' ? value.split(',') : value,
                );
                var _tempOpt = ['Default'];
                setSelectedClients(_tempOpt.concat(event.target.value))
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleMultiSelectChange_Obj = async (e, client, options) => {
        try {
            var _opts = selected_objectives.filter(item => item.client === client).map(item => options.filter(opt => opt.value === item.value)[0].label)
            if (_opts.length > e.target.value.length && props.id) {
                let removedItem = _opts.filter(o => !e.target.value.includes(o))
                if (removedItem.length > 0) {
                    const requestData = {
                        material: props.id,
                        client: client,
                        objective: objectives.filter(o => o.objective === removedItem[0].split(' ')[0])[0]._id
                    }
                    const res = await axiosFetch.post('/api/materials/check_objective', requestData);
                    if (!res.data.success) {
                        toast.error(res.data.message);
                        return;
                    }
                    var _objectives = [];
                    var _objectiveValues = [];

                    selected_objectives.map((item) => {
                        if (item.client !== client) _objectives.push(item);
                        return true;
                    });

                    selected_objValues.map((item) => {
                        if (item !== undefined) {
                            if (item.client !== client) _objectiveValues.push(item);
                            return true;
                        }
                    });

                    selected_objValues
                        .filter(item => item.client === client)
                        .filter(item => e.map(data => data.value).indexOf(item.id + "-" + item.unit) > -1)
                        .map(item => _objectiveValues.push(item))

                    e.target.value.map((item) => {
                        var selected_opt = objOptions.filter(opt => String(opt.label) === String(item))[0]
                        _objectives.push({ label: selected_opt.label, value: selected_opt.value, client: client });
                        return true;
                    });

                    setSelectedObjValues(_objectiveValues);
                    setSelectedObjectives(_objectives)

                    if (props.id === '') {
                        const _filteredATypes = analysisTypes.filter(item => _objectiveValues.map(data => data.id + "-" + data.unit).indexOf(item.obj) > -1)
                        setSelectedATypes(_filteredATypes)
                    }

                }
            } else {
                var _objectives = [];
                var _objectiveValues = [];

                selected_objectives.map((item) => {
                    if (item.client !== client) _objectives.push(item);
                    return true;
                });

                selected_objValues.map((item) => {
                    if (item !== undefined) {
                        if (item.client !== client) _objectiveValues.push(item);
                        return true;
                    }
                });

                selected_objValues
                    .filter(item => item.client === client)
                    .filter(item => e.map(data => data.value).indexOf(item.id + "-" + item.unit) > -1)
                    .map(item => _objectiveValues.push(item))

                e.target.value.map((item) => {
                    var selected_opt = objOptions.filter(opt => String(opt.label) === String(item))[0]
                    _objectives.push({ label: selected_opt.label, value: selected_opt.value, client: client });
                    return true;
                });

                setSelectedObjValues(_objectiveValues);
                setSelectedObjectives(_objectives)

                if (props.id === '') {
                    const _filteredATypes = analysisTypes.filter(item => _objectiveValues.map(data => data.id + "-" + data.unit).indexOf(item.obj) > -1)
                    setSelectedATypes(_filteredATypes)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleMultiSelectChange_A_Types = async (e, obj, client, opts) => {
        try {
            var _analysisTypes = [];

            _analysisTypes = e.target.value.map((item) => {
                return {
                    client: client,
                    obj: obj,
                    label: item,
                    value: analysisTypes.filter(aType => aType.analysisType === item)[0]._id,
                    min: 0,
                    max: 0,
                }
            });
            if (opts.length > e.target.value.length && props.id !== "") {
                let removedItem = opts.filter(opt => e.target.value.indexOf(opt.label) === -1);
                if (removedItem.length) {
                    const requestData = {
                        material: props.id,
                        client: client,
                        analysisType: removedItem[0].value,
                        objective: obj
                    }
                    const res = await axiosFetch.post('/api/materials/check_atype', requestData);
                    if (!res.data.success) {
                        toast.error(res.data.message);
                        return;
                    }
                    setSelectedATypes(prevData => prevData.filter(item => item.client !== client || item.obj !== obj))
                    _analysisTypes.map(data => {
                        if (selected_aTypes.filter(item => item.client === data.client && item.obj === data.obj && item.value === data.value).length === 0) {
                            setSelectedATypes([...selected_aTypes, data])
                        }
                        return true;
                    })
                }
            } else {
                setSelectedATypes(prevData => prevData.filter(item => item.client !== client || item.obj !== obj))
                _analysisTypes.map(data => {
                    if (selected_aTypes.filter(item => item.client === data.client && item.obj === data.obj && item.value === data.value).length === 0) {
                        setSelectedATypes([...selected_aTypes, data])
                    }
                    return true;
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleObjectiveInputChange = (e, type) => {
        setSelectedATypes(aTypes => aTypes.map(aType =>
            (aType.client === type.client && aType.obj === type.obj && aType.value === type.value) ? { ...aType, [e.target.name]: e.target.value } : aType
        ))
    }

    const handleDragEnd = async ({ source, destination, draggableId }) => {
        console.log("Source: ", source);
        console.log("Destination: ", destination);
        console.log("DraggableId: ", draggableId);
        if (destination) {
            let temp = [...selected_objectives];
            let temp2 = [...selected_aTypes];
            console.log("111111111", temp)
            swap(temp, draggableId, destination.index);
            swap(temp2, draggableId, destination.index);
            console.log("22222222", temp)
            setSelectedObjectives(temp);
            setSelectedATypes(temp2)
        }
    }

    const handleDragEnd1 = async ({ source, destination, draggableId }) => {
        // console.log("Source: ", source);
        // console.log("Destination: ", destination);
        // console.log("DraggableId: ", draggableId);
        if (destination) {
            let temp = [...selected_clients];
            let temp2 = [...clients];
            swap(temp, draggableId, destination.index);
            let clients_source_index = temp2.indexOf(temp2.filter(j => j.name === selected_clients[draggableId])[0])
            let clients_dest_index = temp2.indexOf(temp2.filter(j => j.name === selected_clients[destination.index])[0])

            setSelectedClients(temp);
            swap(temp2, clients_source_index, clients_dest_index)
            dispatch(getClients(temp2));
        }
    }

    function swap(input, index_A, index_B) {
        let temp = input[index_A];

        input[index_A] = input[index_B];
        input[index_B] = temp;
    }

    const renderObjectives = (client, objs, options, clientIndex) => {
        return (
            <Draggable
                draggableId={String(clientIndex)}
                index={clientIndex}
                key={clientIndex}
            >
                {(_provided1, snapshot1) => (
                    <Grid
                        container
                        spacing={2}
                        key={clientIndex}
                        {..._provided1.draggableProps}
                        {..._provided1.dragHandleProps}
                        dragging={snapshot1.isDragging}
                        ref={_provided1.innerRef}
                    >
                        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                            {"Objectives - " + client.label}
                        </Grid>
                        <Grid item xs={9}>
                            <FormControl sx={{ my: 1 }} fullWidth>
                                <InputLabel id={`demo-multiple-chip-label-${client.value}`}>{t('Objective')}</InputLabel>
                                <Select
                                    labelId={`demo-multiple-chip-label-${client.value}`}
                                    id={`demo-multiple-chip-label-${client.value}`}
                                    multiple
                                    value={selected_objectives.filter(item => item.client === client.value).map(item => options.filter(opt => opt.value === item.value)[0].label)}
                                    onChange={(e) => handleMultiSelectChange_Obj(e, client.value, options)}
                                    input={<OutlinedInput label="Chip" />}
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
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={index}
                                            value={option.label}
                                            style={getObjectiveStyles(option.label, objOptions, theme)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Box>
                                    <Droppable droppableId='column' type="card">
                                        {(provided) => (
                                            <Box ref={provided.innerRef}>
                                                {Object.keys(selected_objectives).length > 0 && selected_objectives.map((obj, objIdx) => {
                                                    /**
                                                     *  ....very important.....
                                                     */
                                                    if (obj.client !== client.value) return false;

                                                    var _tempOptions = []
                                                    _tempOptions = analysisTypes.filter(item => item.objectives.filter(item_obj => item_obj.id === obj.value.split('-')[0] && item_obj.unit === obj.value.split('-')[1]).length > 0)
                                                        .map(item => {
                                                            return {
                                                                label: item.analysisType,
                                                                value: item._id,
                                                                client: client.value,
                                                                objective: obj.value
                                                            }
                                                        })
                                                    if (obj.label !== "") {
                                                        return renderATypes(
                                                            client,
                                                            obj,
                                                            objIdx,
                                                            _tempOptions,
                                                        );
                                                    }
                                                    return true;
                                                })}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                </Box>
                            </DragDropContext>
                        </Grid>
                        {
                            clientIndex < selected_clients.length - 1 && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2, backgroundColor: '#eda014' }} light />
                                </Grid>
                            )
                        }
                    </Grid>
                )}
            </Draggable>
        )
    }

    const renderATypes = (client, obj, objIdx, aOptions) => {
        return (
            <Draggable
                draggableId={String(objIdx)}
                index={objIdx}
                key={objIdx}
            >
                {(_provided, snapshot) => (
                    <Grid
                        container
                        spacing={2}
                        key={objIdx}
                        {..._provided.draggableProps}
                        {..._provided.dragHandleProps}
                        dragging={snapshot.isDragging}
                        ref={_provided.innerRef}
                    >
                        <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
                            {"Analysis Types - " + obj.label}
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl sx={{ my: 1 }} fullWidth>
                                <InputLabel id={`demo-multiple-chip-label-${client.value}-${obj.value}`}>{t('Analysis Type')}</InputLabel>
                                <Select
                                    labelId={`demo-multiple-chip-label-${client.value}-${obj.value}`}
                                    id={`demo-multiple-chip-label-${client.value}-${obj.value}`}
                                    multiple
                                    name="aTypes"
                                    value={selected_aTypes.filter(item => item.client === client.value && item.obj === obj.value).map(item => item.label)}
                                    onChange={(e) => handleMultiSelectChange_A_Types(e, obj.value, client.value, aOptions)}
                                    input={<OutlinedInput label="Chip" />}
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
                                    {aOptions.map((option, index) => (
                                        <MenuItem
                                            key={index}
                                            value={option.label}
                                            style={getAnalysisStyles(option.label, aOptions, theme)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {selected_aTypes.filter(item => item.client === client.value && item.obj === obj.value)
                            .map((type, typeIdx) => {
                                var label = type.label;

                                var objValue = {
                                    min: type.min,
                                    max: type.max,
                                };

                                if (type.obj !== obj.value) return true;
                                if (type.client !== client.value) return true;

                                return renderminMaxValues(
                                    client,
                                    obj,
                                    type,
                                    typeIdx,
                                    label,
                                    objValue
                                );
                            })}
                    </Grid>
                )}
            </Draggable>
        );
    }

    const renderminMaxValues = (client, obj, type, typeIdx, typeLabel, objValue) => {
        return (
            <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', wordBreak: 'break-all' }}>{type.label}</Grid>
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px' }}>Min Value</span>
                    <TextField
                        name="min"
                        type="number"
                        size="small"
                        sx={{ width: '80px' }}
                        variant='outlined'
                        value={objValue.min}
                        onChange={(e) => handleObjectiveInputChange(e, type)}
                    />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px' }}>Max Value</span>
                    <TextField
                        name="max"
                        type="number"
                        size="small"
                        sx={{ width: '80px' }}
                        value={objValue.max}
                        onChange={(e) => handleObjectiveInputChange(e, type)}
                    />
                </Grid>
            </Grid>
        );
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setMaterial(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Material')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Material ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={materialID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Material ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Material")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={material}
                        />
                        {
                            (props.id === '' && materials.filter(m => m.material === material).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Material name already exists.</Box>
                        }
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="demo-multiple-chip-label">{t('Client')}</InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={_clients}
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
                                {clientOptions
                                    .map((client, index) => (
                                        <MenuItem
                                            key={index}
                                            value={client.label}
                                            style={getStyles(client.label, _clients, theme)}
                                        >
                                            {client.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <DragDropContext onDragEnd={handleDragEnd1}>
                            <Box>
                                <Droppable droppableId='column' type="card">
                                    {(provided1) => (
                                        <Box ref={provided1.innerRef}>
                                            {Object.keys(selected_clients).length > 0 && clients
                                                .filter(item => selected_clients.indexOf(item.name) > -1)
                                                .map(item => {
                                                    return {
                                                        label: item.name,
                                                        value: item._id
                                                    }
                                                }).map((item, index) => {
                                                    var _objectives = [];
                                                    Object.keys(filteredObjectives).length > 0 && filteredObjectives.map((item0) => {
                                                        if (item0.client === item.value) {
                                                            if (_objectives.length === 0) {
                                                                _objectives.push({
                                                                    label: item0.label,
                                                                    value: item0.value,
                                                                });
                                                            } else {
                                                                for (var i = 0; i < _objectives.length; i++) {
                                                                    if (_objectives[i].value !== item0.value) {
                                                                        _objectives.push({
                                                                            label: item0.label,
                                                                            value: item0.value,
                                                                        });
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        return true;
                                                    });
                                                    return renderObjectives(
                                                        item,
                                                        _objectives,
                                                        objOptions,
                                                        index
                                                    );
                                                })}
                                            {provided1.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        </DragDropContext>
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

export default MaterialModal;