import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable, Draggable } from 'react-beautiful-dnd';

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

function getATypeStyles(aType, aTypeObjs, theme) {
    return {
        fontWeight:
            aTypeObjs.filter(item => item.analysisType === aType).length === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function getObjStyles(obj, obj_options, theme) {
    return {
        fontWeight:
            obj_options.filter(item => item.label === obj).length === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const CertificateTypeModal = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();

    const [certificateTypeID, setCertificateTypeID] = React.useState('')
    const [certificateType, setCertificateType] = React.useState('')
    const [selected_client, setSelectedClient] = React.useState([]);
    const [selected_material, setSelectedMaterial] = React.useState([]);
    const [selected_aTypes, setSelectedATypes] = React.useState([]);
    const [clientOptions, setClientOptions] = React.useState([]);
    const [aTypeOptions, setATypeOptions] = React.useState([]);
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { materials } = useSelector(state => state.material);
    const { clients } = useSelector(state => state.client);
    const { analysisTypes } = useSelector(state => state.analysisType);
    const { certificateTypes } = useSelector(state => state.certificateType);
    const { units } = useSelector(state => state.unit);
    const { objectives } = useSelector(state => state.objective);

    React.useEffect(() => {
        setCertificateTypeID(props.selectedId);
    }, [props.selectedId]);

    React.useEffect(() => {
        if (clients.length > 0) {
            setClientOptions(clients
                .filter(item => item.name === 'Default')
                .map(item => {
                    return {
                        label: item.name + '-' + item.clientId,
                        value: item._id
                    }
                })
            );
        }
    }, [clients])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedCertificateType = certificateTypes.filter(item => item._id === props.id)[0];

            const filtered_clients = clients.filter(item => item._id === selectedCertificateType.client)
                .filter(item => item.name !== 'Default')
                .map(item => {
                    return {
                        label: item.name + '-' + item.clientId,
                        value: item._id
                    }
                })
            if (filtered_clients.length > 0) {
                setClientOptions(prev => prev.concat(filtered_clients))
            }

            if (materials.filter(material => material._id === selectedCertificateType.material).length > 0) {
                const matched_aTypes = materials.filter(material => material._id === selectedCertificateType.material)[0].aTypesValues
                    .filter(aType => aType.client === selectedCertificateType.client)
                    .map(aType => aType.value);
                setATypeOptions(analysisTypes.filter(aType => matched_aTypes.indexOf(aType._id) > -1));
            }

            const objs = selectedCertificateType.analysises.map(item => {
                return {
                    id: item.id,
                    analysisType: analysisTypes.filter(aType => aType._id === item.id)[0]?.analysisType,
                    objectives: item.objectives.map(obj => {
                        return {
                            id: obj.id,
                            unit: obj.unit,
                            label: objectives.filter(o => o._id === obj.id)[0]?.objective + " " + units.filter(u => u._id === obj.unit)[0]?.unit
                        }
                    })
                }
            })
            setSelectedATypes(objs)

            setCertificateTypeID(selectedCertificateType.certificateType_id);
            setCertificateType(selectedCertificateType.certificateType);
            setSelectedMaterial(selectedCertificateType.material);
            setSelectedClient(selectedCertificateType.client);
            setRemark(selectedCertificateType.remark);

        }
    }, [props.id])

    const handleCreate = () => {
        if (certificateTypeID === '' || certificateTypeID === 0) {
            toast.error('CertificateType ID is required');
            return;
        }
        if (certificateType === '') {
            toast.error('CertificateType is required');
            return;
        }
        if (props.id === '' && certificateTypes.filter(cT => cT.certificateType === certificateType).length > 0) {
            toast.error('CertificateType already exists');
            return;
        }
        const data = {
            certificateType_id: certificateTypeID,
            certificateType: certificateType,
            material: selected_material,
            client: selected_client,
            remark: remark,
            analysises: selected_aTypes.map(aType => {
                return {
                    id: aType.id,
                    objectives: aType.objectives.map(obj => {
                        return {
                            id: obj.id,
                            unit: obj.unit
                        }
                    })
                }
            })
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setCertificateTypeID(e.target.value)
        setDuplicated(certificateTypes.filter(item => item.certificateType_id === e.target.value).length > 0);
    }

    const handleChangeMaterial = (e) => {
        setSelectedMaterial(e.target.value);
        const material_clients = materials.filter(item => item._id === e.target.value)[0].clients;
        const filtered_clients = clients.filter(item => material_clients.indexOf(item._id) > -1)
            .map(item => {
                return {
                    label: item.name + '-' + item.clientId,
                    value: item._id
                }
            })
        if (filtered_clients.length > 0) {
            setClientOptions(prev => prev.concat(filtered_clients))
        }
    }

    const handleChangeClient = (e) => {
        setSelectedClient(e.target.value);
        if (materials.filter(material => material._id === selected_material).length > 0) {
            const matched_aTypes = materials.filter(material => material._id === selected_material)[0].aTypesValues
                .filter(aType => aType.client === e.target.value)
                .map(aType => aType.value);
            setATypeOptions(analysisTypes.filter(aType => matched_aTypes.indexOf(aType._id) > -1));
        }
    }

    const handleChangeAnalysisType = (e) => {
        const options = e.target.value.map(item => {
            return {
                analysisType: item,
                id: analysisTypes.filter(aType => aType.analysisType === item)[0]._id,
                objectives: []
            }
        })
        setSelectedATypes(options);
    }

    const handleChangeObjective = (e, aType) => {
        let _objectives = [];
        e.target.value.map(item => {
            _objectives.push({
                id: objectives.filter(data => data.objective === item.split(' ')[0])[0]._id,
                unit: units.filter(data => data.unit === item.split(' ')[1])[0]._id,
                label: item
            });
        });

        setSelectedATypes(prev => prev.map(data => data.id !== aType.id ? data :
            { ...data, objectives: _objectives }
        ))
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setCertificateType(value);
    }

    const handleDragEnd = async ({ source, destination, draggableId }) => {
        if (destination) {
            let temp = [...selected_aTypes];
            swap(temp, draggableId, destination.index);
            setSelectedATypes(temp);
        }
    }

    function swap(input, index_A, index_B) {
        let temp = input[index_A];

        input[index_A] = input[index_B];
        input[index_B] = temp;
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Certificate Type')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Certificate Type ID")}
                            type="number"
                            fullWidth
                            onChange={handleChangeID}
                            value={certificateTypeID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Certificate Type ID already exists.</Box>
                        }
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">{t("Material")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selected_material}
                                label={t("Material")}
                                onChange={handleChangeMaterial}
                            >
                                {
                                    materials.map((material, index) => (
                                        <MenuItem value={material._id} key={index}>{material.material}-{material.material_id}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label1">{t("Client")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label1"
                                id="demo-simple-select1"
                                value={selected_client}
                                label={t("Client")}
                                onChange={handleChangeClient}
                            >
                                {
                                    clientOptions.map((item, index) => (
                                        <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            label={t("Certificate Type")}
                            fullWidth
                            sx={{ mt: 2 }}
                            onChange={handleChangeInput}
                            value={certificateType}
                        />
                        {
                            (props.id === '' && certificateTypes.filter(cT => cT.certificateType === certificateType).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>CertificateType already exists.</Box>
                        }
                        <Grid container spacing={2}>
                            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                                Analysis Types
                            </Grid>
                            <Grid item xs={9}>
                                <FormControl sx={{ my: 1 }} fullWidth>
                                    <InputLabel id="demo-multiple-chip-label2">{t('Analysis Type')}</InputLabel>
                                    <Select
                                        labelId="demo-multiple-chip-label2"
                                        id="demo-multiple-chip2"
                                        multiple
                                        value={selected_aTypes.map(item => item.analysisType)}
                                        onChange={handleChangeAnalysisType}
                                        input={<OutlinedInput id="select-multiple-chip2" label="Chip" />}
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
                                        {aTypeOptions
                                            .map((aType, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={aType.analysisType}
                                                    style={getATypeStyles(aType.analysisType, aTypeOptions, theme)}
                                                >
                                                    {aType.analysisType}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Box className='mt-2'>
                                        <Droppable droppableId='column' type="card">
                                            {(provided) => (
                                                <Box ref={provided.innerRef}>
                                                    {selected_aTypes.map((item, index1) => {

                                                        const matched_objs = materials.filter(m => m._id === selected_material)[0].objectiveValues
                                                            .filter(m => m.client === selected_client && m.analysis === item.id)
                                                            .map(obj => {
                                                                return {
                                                                    label: objectives.filter(o => o._id === obj.id)[0].objective + " " + units.filter(u => u._id === obj.unit)[0].unit,
                                                                    value: obj.id + "-" + obj.unit
                                                                }
                                                            })

                                                        if (item.analysisType !== "") {
                                                            return (
                                                                <Draggable
                                                                    draggableId={String(index1)}
                                                                    index={index1}
                                                                    key={index1}
                                                                >
                                                                    {(_provided, snapshot) => (
                                                                        <Grid
                                                                            container
                                                                            spacing={2}
                                                                            key={index1}
                                                                            {..._provided.draggableProps}
                                                                            {..._provided.dragHandleProps}
                                                                            dragging={snapshot.isDragging}
                                                                            ref={_provided.innerRef}
                                                                        >
                                                                            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                {item.analysisType}
                                                                            </Grid>
                                                                            <Grid item xs={8}>
                                                                                <FormControl sx={{ my: 1 }} fullWidth>
                                                                                    <InputLabel id="demo-multiple-chip-label3">{t('Objective')}</InputLabel>
                                                                                    <Select
                                                                                        labelId="demo-multiple-chip-label3"
                                                                                        id="demo-multiple-chip3"
                                                                                        multiple
                                                                                        // value={[]}
                                                                                        value={selected_aTypes.filter(data => data.id === item.id)[0]?.objectives.map(data => data.label)}
                                                                                        onChange={(e) => handleChangeObjective(e, item)}
                                                                                        input={<OutlinedInput id="select-multiple-chip3" label="Chip" />}
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
                                                                                        {matched_objs
                                                                                            .map((obj, index) => (
                                                                                                <MenuItem
                                                                                                    key={index}
                                                                                                    value={obj.label}
                                                                                                    style={getObjStyles(obj.label, matched_objs, theme)}
                                                                                                >
                                                                                                    {obj.label}
                                                                                                </MenuItem>
                                                                                            ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )}
                                                                </Draggable>
                                                            );
                                                        }
                                                        return false;
                                                    })}
                                                    {provided.placeholder}
                                                </Box>
                                            )}
                                        </Droppable>
                                    </Box>
                                </DragDropContext>
                            </Grid>
                        </Grid>
                        <TextField
                            label={t("Remark")}
                            fullWidth
                            sx={{ mt: 2 }}
                            onChange={(e) => setRemark(e.target.value)}
                            value={remark}
                        />
                        <Box mt={2} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleCreate}>{props.id === '' ? 'Create' : 'Update'}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CertificateTypeModal;