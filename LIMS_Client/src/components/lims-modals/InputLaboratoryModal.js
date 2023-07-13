import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Chip, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import toast from 'react-hot-toast';
import { logout } from '../../slices/auth';
import axiosFetch from '../../utils/axiosFetch';

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

function getStyles(unit, objectiveUnits, theme) {
    return {
        fontWeight:
            objectiveUnits.indexOf(unit) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const InputLaboratoryModal = (props) => {

    const { t } = useTranslation();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [labID, setLabID] = React.useState('');
    const [deliveryID, setDeliveryID] = React.useState('');
    const [modalData, setModalData] = React.useState({
        sample_type: '',
        client: '',
        material: '',
        material_category: '',
        packing_type: '',
        due_date: new Date(),
        sample_date: new Date(),
        sending_date: new Date(),
        aType: [],
        cType: [],
        distributor: '',
        geo_locaion: '',
        remark: ''
    })
    const [deliveryData, setDeliveryData] = React.useState({
        address_name1: '',
        address_name2: '',
        address_name3: '',
        address_title: '',
        address_country: '',
        address_place: '',
        address_street: '',
        address_zip: '',
        customer_product_code: '',
        email_address: [],
        fetch_date: new Date(),
        order_id: '',
        customer_order_id: '',
        pos_id: '',
        w_target: '',
    });
    const [defaultClient, setDefaultClient] = React.useState({});
    const [filtered_aTypes, setFilteredATypes] = React.useState([]);
    const [filtered_cTypes, setFilteredCTypes] = React.useState([]);
    const [material_clients, setMaterialClients] = React.useState([]);
    const [date_format, setDateFormat] = React.useState('dd.MM.yyyy');

    const { laboratories } = useSelector(state => state.laboratory);
    const { sampleTypes } = useSelector(state => state.sampleType);
    const { clients } = useSelector(state => state.client);
    const { materials } = useSelector(state => state.material);
    const { packingTypes } = useSelector(state => state.packingType);
    const { settings } = useSelector(state => state.setting);

    React.useEffect(() => {
        const handleClickUpdate = async () => {
            try {
                const item = laboratories.filter(lab => lab._id === props.id)[0];
                const res = await axiosFetch.get(`/api/materials/clients/${item.material._id}`)

                const a_Types = res.data.material.aTypesValues.filter(aType => String(aType.client) === String(item.material_category._id));
                let filtered_aTypes = []
                a_Types.map(aType => {
                    if (filtered_aTypes.filter(aT => aT.value === aType.value).length === 0) {
                        filtered_aTypes.push(aType)
                    }
                });
                setMaterialClients(res.data.material.clients);
                setFilteredATypes(filtered_aTypes.sort((a, b) => {
                    return a.label - b.label
                }));
                setFilteredCTypes(res.data.certTypes);

                const aTypeItems = item.a_types.map(aT => aT.analysisType);
                const cTypeItems = item.c_types.map(cT => cT.certificateType);
                setLabID(props.id);
                setDeliveryID(item.delivery._id);
                const data1 = {
                    sample_type: item.sample_type._id,
                    client: item.client._id,
                    material: item.material._id,
                    material_category: item.material_category._id,
                    packing_type: item.packing_type[0]._id,
                    due_date: item.due_date,
                    sample_date: item.sample_date,
                    sending_date: item.sending_date,
                    aType: aTypeItems,
                    cType: cTypeItems,
                    distributor: item.distributor,
                    geo_locaion: item.geo_location,
                    remark: item.remark
                };
                const data2 = {
                    address_name1: item.delivery.name1,
                    address_name2: item.delivery.name2,
                    address_name3: item.delivery.name3,
                    address_title: item.delivery.title,
                    address_country: item.delivery.country,
                    address_place: item.delivery.place,
                    address_street: item.delivery.street,
                    address_zip: item.delivery.zipcode,
                    customer_product_code: item.delivery.productCode,
                    email_address: item.delivery.email === "" ? [] : item.delivery.email.split(","),
                    fetch_date: item.delivery.fetchDate,
                    order_id: item.delivery.orderId,
                    customer_order_id: item.delivery.customer_orderId,
                    pos_id: item.delivery.posId,
                    w_target: item.delivery.w_target
                }
                setModalData(data1);
                setDeliveryData(data2);
            } catch (err) {
                if (Object(err).hasOwnProperty('response')) {
                    if (err.response.status === 401) {
                        dispatch(logout());
                    }
                }
                console.log(err)
            }
        }
        if (props.id !== '') {
            handleClickUpdate();
        }
    }, [props.id])

    React.useEffect(() => {
        if (clients.length > 0) {
            setDefaultClient(clients.filter(c => c.name === 'Default')[0]);
            setModalData({
                ...modalData,
                client: clients.filter(c => c.name === 'Default')[0]._id,
                material_category: clients.filter(c => c.name === 'Default')[0]._id,
            })
        }
    }, [clients])

    React.useEffect(() => {
        if (settings.hasOwnProperty('date_format')) {
            var format = '';
            switch (settings.date_format) {
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
            setDateFormat(format);
        }
    }, [settings]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setModalData(
            { ...modalData, [event.target.name]: typeof value === 'string' ? value.split(',') : value }
        );
    }

    const clearDeliveryData = () => {
        setDeliveryData({
            address_name1: '',
            address_name2: '',
            address_name3: '',
            address_title: '',
            address_country: '',
            address_place: '',
            address_street: '',
            address_zip: '',
            customer_product_code: '',
            email_address: [],
            fetch_date: new Date(),
            order_id: '',
            customer_order_id: '',
            pos_id: '',
            w_target: '',
        })
    }

    const handleChangeMaterial = async (e) => {
        try {
            const res = await axiosFetch.get(`/api/materials/clients/${e.target.value}`)
            const aTypes = res.data.material.aTypesValues.filter(aType => aType.client === modalData.material_category)
            setFilteredATypes(aTypes);
            setFilteredCTypes(res.data.certTypes);
            setMaterialClients(res.data.material.clients);
        } catch (err) {
            if (Object(err).hasOwnProperty('response')) {
                if (err.response.status === 401) {
                    dispatch(logout());
                }
            }
            console.log(err)
        }
    }

    const handleChangeMaterialCategory = async (e) => {
        try {
            if (e.target.value !== '') {
                const res = await axiosFetch.get(`/api/materials/clients/${modalData.material}`)

                setModalData({
                    ...modalData,
                    material_category: e.target.value,
                    aType: [],
                    cType: []
                });
                clearDeliveryData();

                const aTypes = res.data.material.aTypesValues.filter(aType => aType.client === e.target.value)
                let _aTypes = []
                aTypes.map(aType => {
                    if (_aTypes.filter(item => item.value === aType.value).length === 0) {
                        _aTypes.push(aType)
                    }
                });
                setFilteredATypes(_aTypes.sort((a, b) => {
                    return a.label - b.label
                }));
                setFilteredCTypes(
                    res.data.certTypes.filter(cT => cT.client === e.target.value || cT.client === defaultClient._id)
                        .reduce((acc, current) => {
                            const x = acc.find(item => item._id === current._id);
                            if (!x) {
                                return acc.concat([current]);
                            } else {
                                return acc;
                            }
                        }, []));
            }
        } catch (err) {
            if (Object(err).hasOwnProperty('response')) {
                if (err.response.status === 401) {
                    dispatch(logout());
                }
            }
            console.log(err)
        }
    }

    const handleCreate = () => {
        if (modalData.sample_type === '') {
            toast.error('Sample type is required');
            return;
        }
        if (modalData.material === '') {
            toast.error('Material is required');
            return;
        }
        if (modalData.material_category === '') {
            toast.error('Material Category is required');
            return;
        }
        if (modalData.packing_type === '') {
            toast.error('Packing Type is required');
            return;
        }
        const data = {
            labs: modalData,
            delivery: deliveryData,
            selectedId: labID,
            selectedDelivery: deliveryID
        }
        props.handleCreate(data);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Sample')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel id="sampleType-select-label">{t("Sample Type")}</InputLabel>
                            <Select
                                labelId="sampleType-select-label"
                                id="sampleType-select"
                                value={modalData.sample_type}
                                label={t("Sample Type")}
                                onChange={(e) => setModalData({
                                    ...modalData,
                                    sample_type: e.target.value,
                                    packing_type: '',
                                    distributor: '',
                                    geo_locaion: '',
                                    remark: ''
                                }) & clearDeliveryData()}
                                fullWidth
                            >
                                {
                                    sampleTypes.length > 0 && sampleTypes.slice()
                                        .sort((a, b) => { return a.sampleType_id > b.sampleType_id ? 1 : -1 })
                                        .map((sT, index) => (
                                            <MenuItem value={sT._id} key={index}>{sT.sampleType}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel id="client-select-label">{t("Client")}</InputLabel>
                            <Select
                                labelId="client-select-label"
                                id="client-select"
                                value={modalData.client}
                                label={t("Client")}
                                onChange={(e) => setModalData({ ...modalData, client: e.target.value })}
                                fullWidth
                            >
                                {
                                    clients.length > 0 && clients.slice()
                                        .sort((a, b) => { return String(a.clientId).toUpperCase() > String(b.clientId).toUpperCase() ? 1 : -1 })
                                        .map((c, index) => (
                                            <MenuItem value={c._id} key={index}>{c.name}-{c.clientId}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel id="material-select-label">{t("Material")}</InputLabel>
                            <Select
                                labelId="material-select-label"
                                id="material-select"
                                value={modalData.material}
                                label={t("Material")}
                                onChange={(e) => setModalData({
                                    ...modalData,
                                    material: e.target.value,
                                    packing_type: '',
                                    distributor: '',
                                    geo_locaion: '',
                                    remark: '',
                                    aType: [],
                                    cType: []
                                }) & clearDeliveryData() & handleChangeMaterial(e)}
                                fullWidth
                            >
                                {
                                    materials.length > 0 && materials.slice()
                                        .sort((a, b) => { return String(a.material_id).toUpperCase() > String(b.material_id).toUpperCase() ? 1 : -1 })
                                        .map((m, index) => (
                                            <MenuItem value={m._id} key={index}>{m.material}-{m.material_id}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel id="material-category-select-label">{t("Material Category")}</InputLabel>
                            <Select
                                labelId="material-category-select-label"
                                id="material-category-select"
                                value={modalData.material_category}
                                label={t("Material Category")}
                                onChange={handleChangeMaterialCategory}
                                fullWidth
                            >
                                <MenuItem value={defaultClient._id}>Default-0</MenuItem>
                                {
                                    material_clients.length > 0 && material_clients.slice()
                                        .sort((a, b) => { return String(a.clientId).toUpperCase() > String(b.clientId).toUpperCase() ? 1 : -1 })
                                        .map((c, index) => (
                                            <MenuItem value={c._id} key={index}>{c.name}-{c.clientId}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name1"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_name1}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_name1: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Title"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_title}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_title: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Country"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_country}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_country: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name2"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_name2}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_name2: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name3"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_name3}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_name3: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Place"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_place}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_place: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Street"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_street}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_street: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.ZIP"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.address_zip}
                            onChange={(e) => setDeliveryData({ ...deliveryData, address_zip: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Customer Product Code"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.customer_product_code}
                            onChange={(e) => setDeliveryData({ ...deliveryData, customer_product_code: e.target.value })}
                        />
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <ReactMultiEmail
                                emails={deliveryData.email_address}
                                onChange={(e) => setDeliveryData({ ...deliveryData, email_address: e })}
                                validateEmail={(email) => {
                                    return isEmail(email);
                                }}
                                getLabel={(email, index, removeEmail) => {
                                    return (
                                        <div data-tag key={index}>
                                            {email}
                                            <span data-tag-handle onClick={() => removeEmail(index)}>×</span>
                                        </div>
                                    );
                                }}
                                style={{ minHeight: '54px', fontSize: '18px' }}
                                placeholder="E-mail Address"
                            />
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2} sx={{ my: 1 }}>
                                <DatePicker
                                    inputFormat={date_format}
                                    label="Fetch Date"
                                    value={modalData.fetch_date}
                                    onChange={(val) => setDeliveryData({ ...modalData, fetch_date: val })}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <TextField
                            sx={{ my: 1 }}
                            label="Order.ID"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.order_id}
                            onChange={(e) => setDeliveryData({ ...deliveryData, order_id: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Customer Order ID"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.customer_order_id}
                            onChange={(e) => setDeliveryData({ ...deliveryData, customer_order_id: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Pos.ID"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.pos_id}
                            onChange={(e) => setDeliveryData({ ...deliveryData, pos_id: e.target.value })}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Weight(target)[kg]"
                            variant="outlined"
                            fullWidth
                            value={deliveryData.w_target}
                            onChange={(e) => setDeliveryData({ ...deliveryData, w_target: e.target.value })}
                        />
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel id="packing-type-select-label">{t("Packing Type")}</InputLabel>
                            <Select
                                labelId="packing-type-select-label"
                                id="packing-type-select"
                                value={modalData.packing_type}
                                label={t("Packing Type")}
                                onChange={(e) => setModalData({ ...modalData, packing_type: e.target.value })}
                                fullWidth
                            >
                                {
                                    packingTypes.length > 0 && packingTypes.slice()
                                        .sort((a, b) => { return String(a.packingType_id).toUpperCase() > String(b.packingType_id).toUpperCase() ? 1 : -1 })
                                        .map((pT, index) => (
                                            <MenuItem value={pT._id} key={index}>{`${pT.packingType}-${pT.packingType_id}${pT.remark !== "" ? '-' + pT.remark : ''}`}</MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2} sx={{ my: 1 }}>
                                <DatePicker
                                    label="Due Date"
                                    value={modalData.due_date}
                                    onChange={(val) => setModalData({ ...modalData, due_date: val })}
                                    renderInput={(params) => <TextField {...params} />}
                                    inputFormat={date_format}
                                />
                                <DatePicker
                                    label="Sample Date"
                                    value={modalData.sample_date}
                                    onChange={(val) => setModalData({ ...modalData, sample_date: val })}
                                    renderInput={(params) => <TextField {...params} />}
                                    inputFormat={date_format}
                                />
                                <DatePicker
                                    label="Sending Date"
                                    value={modalData.sending_date}
                                    onChange={(val) => setModalData({ ...modalData, sending_date: val })}
                                    renderInput={(params) => <TextField {...params} />}
                                    inputFormat={date_format}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="analysis-types-chip-label">{t('Analysis Types')}</InputLabel>
                            <Select
                                labelId="analysis-types-chip-label"
                                id="analysis-types-chip"
                                multiple
                                name='aType'
                                value={modalData.aType}
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
                                {filtered_aTypes.slice()
                                    .sort((a, b) => { return String(a.label).toUpperCase() > String(b.label).toUpperCase() ? 1 : -1 })
                                    .map(aType => {
                                        return {
                                            label: aType.label,
                                            value: aType.value
                                        }
                                    })
                                    .map((aT, index) => (
                                        <MenuItem
                                            key={index}
                                            value={aT.label}
                                            style={getStyles(aT.label, modalData.aType, theme)}
                                        >
                                            {aT.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ my: 1 }} fullWidth>
                            <InputLabel id="certificate-types-chip-label">{t('Certificate Types')}</InputLabel>
                            <Select
                                labelId="certificate-types-chip-label"
                                id="certificate-types-chip"
                                multiple
                                name='cType'
                                value={modalData.cType}
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
                                {filtered_cTypes.slice()
                                    .sort((a, b) => { return String(a.certificateType).toUpperCase() > String(b.certificateType).toUpperCase() ? 1 : -1 })
                                    .map(cType => {
                                        return {
                                            label: cType.certificateType,
                                            value: cType._id
                                        }
                                    })
                                    .map((cT, index) => (
                                        <MenuItem
                                            key={index}
                                            value={cT.label}
                                            style={getStyles(cT.label, modalData.cType, theme)}
                                        >
                                            {cT.label}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label={t("Distributor")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setModalData({ ...modalData, distributor: e.target.value })}
                            value={modalData.distributor}
                        />
                        <TextField
                            label={t("Geo-Location")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setModalData({ ...modalData, geo_locaion: e.target.value })}
                            value={modalData.geo_locaion}
                        />
                        <TextField
                            label={t("Remark")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setModalData({ ...modalData, remark: e.target.value })}
                            value={modalData.remark}
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

export default InputLaboratoryModal;