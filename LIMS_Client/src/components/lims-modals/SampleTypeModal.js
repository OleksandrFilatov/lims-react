import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, TextField } from '@mui/material';
import Switch from '@mui/material/Switch';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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

const SampleTypeModal = (props) => {

    const { t } = useTranslation();

    const [sampleTypeID, setSampleTypeID] = React.useState('')
    const [sampleType, setSampleType] = React.useState('')
    const [material, setMaterial] = React.useState('')
    const [client, setClient] = React.useState(false)
    const [packingType, setPackingType] = React.useState(false)
    const [stockSample, setStockSample] = React.useState(false)
    const [dueDate, setDueDate] = React.useState(false)
    const [sampleDate, setSampleDate] = React.useState(false)
    const [sendingDate, setSendingDate] = React.useState(false)
    const [analysisType, setAnalysisType] = React.useState(false)
    const [incomingProduct, setIncomingProduct] = React.useState(false)
    const [distributor, setDistributor] = React.useState(false)
    const [certificateType, setCerticateType] = React.useState(false)
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { sampleTypes } = useSelector(state => state.sampleType);

    React.useEffect(() => {
        setSampleTypeID(props.typeId);
    }, [props.typeId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedType = sampleTypes.filter(item => item._id === props.id)[0];

            setSampleTypeID(selectedType.sampleType_id);
            setSampleType(selectedType.sampleType);
            setMaterial(selectedType.material);
            setClient(selectedType.client);
            setPackingType(selectedType.packingType);
            setStockSample(selectedType.stockSample);
            setDueDate(selectedType.dueDate);
            setSampleDate(selectedType.sampleDate);
            setSendingDate(selectedType.sendingDate);
            setAnalysisType(selectedType.analysisType);
            setIncomingProduct(selectedType.incomingProduct);
            setDistributor(selectedType.distributor);
            setCerticateType(selectedType.certificateType);
            setRemark(selectedType.remark);
        }
    }, [props.id])

    const handleCreate = () => {
        if (sampleTypeID === '' || sampleTypeID === 0) {
            toast.error('Sample Type ID is required');
            return;
        }
        if (sampleType === '') {
            toast.error('Sample Type is required');
            return;
        }
        const data = {
            sampleType_id: sampleTypeID,
            sampleType: sampleType,
            material: material,
            client: client,
            packingType: packingType,
            stockSample: stockSample,
            dueDate: dueDate,
            sampleDate: sampleDate,
            sendingDate: sendingDate,
            analysisType: analysisType,
            incomingProduct: incomingProduct,
            distributor: distributor,
            certificateType: certificateType,
            remark: remark
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setSampleTypeID(e.target.value)
        setDuplicated(sampleTypes.filter(item => item.sampleType_id === e.target.value).length > 0);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Sample Type')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            id="outlined-required"
                            label="Sample Type ID"
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={sampleTypeID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Sample Type ID already exists.</Box>
                        }
                        <TextField
                            required
                            id="outlined-required"
                            label="Sample Type"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setSampleType(e.target.value)}
                            value={sampleType}
                        />
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Material")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setMaterial(e.target.checked)} checked={material} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{t("Client")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setClient(e.target.checked)} checked={client} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Packing Type")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setPackingType(e.target.checked)} checked={packingType} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{t("Stock Sample")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setStockSample(e.target.checked)} checked={stockSample} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Due Date")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setDueDate(e.target.checked)} checked={dueDate} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{t("Sample Date")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setSampleDate(e.target.checked)} checked={sampleDate} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Sending Date")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setSendingDate(e.target.checked)} checked={sendingDate} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{t("Analysis Type")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setAnalysisType(e.target.checked)} checked={analysisType} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Incoming Product")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setIncomingProduct(e.target.checked)} checked={incomingProduct} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>{t("Distributor")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setDistributor(e.target.checked)} checked={distributor} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>{t("Certificate Type")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setCerticateType(e.target.checked)} checked={certificateType} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <TextField
                            id="outlined-required"
                            label="Remark"
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
        </Modal >
    )
}

export default SampleTypeModal;