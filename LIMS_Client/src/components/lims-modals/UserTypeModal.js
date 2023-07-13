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

const UserTypeModal = (props) => {

    const { t } = useTranslation();

    const [userTypeID, setUserTypeID] = React.useState('')
    const [userType, setUserType] = React.useState('')
    const [remark, setRemark] = React.useState('')
    const [labInput, setLabInput] = React.useState(false)
    const [labAnalysis, setLabAnalysis] = React.useState(false)
    const [labAdmin, setLabAdmin] = React.useState(false)
    const [stockUser, setStockUser] = React.useState(false)
    const [stockAdmin, setStockAdmin] = React.useState(false)
    const [hsImport, setHsImport] = React.useState(false)
    const [hsExport, setHsExport] = React.useState(false)
    const [hsAdmin, setHsAdmin] = React.useState(false)
    const [geologyImport, setGeoImport] = React.useState(false)
    const [geologyExport, setGeoExport] = React.useState(false)
    const [geologyAdmin, setGeoAdmin] = React.useState(false)
    const [duplicated, setDuplicated] = React.useState(false);

    const { userTypes } = useSelector(state => state.userType);

    React.useEffect(() => {
        setUserTypeID(props.typeId);
    }, [props.typeId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedType = userTypes.filter(item => item._id === props.id)[0];

            setUserTypeID(selectedType.userType_id);
            setUserType(selectedType.userType);
            setLabInput(selectedType.labInput);
            setLabAnalysis(selectedType.labAnalysis);
            setLabAdmin(selectedType.labAdmin);
            setStockUser(selectedType.stockUser);
            setStockAdmin(selectedType.stockAdmin);
            setHsImport(selectedType.hsImport);
            setHsExport(selectedType.hsExport);
            setHsAdmin(selectedType.hsAdmin);
            setGeoImport(selectedType.geologyImport);
            setGeoExport(selectedType.geologyExport);
            setGeoAdmin(selectedType.geologyAdmin);
            setRemark(selectedType.remark);
        }
    }, [props.id])

    const handleCreate = () => {
        if (userTypeID === '' || userTypeID === 0) {
            toast.error('user Type ID is required');
            return;
        }
        if (userTypeID === '') {
            toast.error('user Type is required');
            return;
        }
        if (props.id === '' && userTypes.filter(uType => uType.userType === userType).length > 0) {
            toast.error('User Type already exist');
            return;
        }
        const data = {
            userType_id: userTypeID,
            userType: userType,
            labInput: labInput,
            labAnalysis: labAnalysis,
            labAdmin: labAdmin,
            stockUser: stockUser,
            stockAdmin: stockAdmin,
            hsImport: hsImport,
            hsExport: hsExport,
            hsAdmin: hsAdmin,
            geologyImport: geologyImport,
            geologyExport: geologyExport,
            geologyAdmin: geologyAdmin,
            remark: remark
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setUserTypeID(e.target.value)
        setDuplicated(userTypes.filter(item => item.userType_id === e.target.value).length > 0);
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setUserType(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('User Type')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            id="outlined-required"
                            label="User Type ID"
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={userTypeID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>User Type ID already exists.</Box>
                        }
                        <TextField
                            required
                            id="outlined-required"
                            label="User Type"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={userType}
                        />
                        {
                            (props.id === '' && userTypes.filter(uType => uType.userType === userType).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>User Type already exists.</Box>
                        }
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>Laboratory</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Input</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setLabInput(e.target.checked)} checked={labInput} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Analysis</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setLabAnalysis(e.target.checked)} checked={labAnalysis} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Admin</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setLabAdmin(e.target.checked)} checked={labAdmin} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>Stock Management</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">User</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setStockUser(e.target.checked)} checked={stockUser} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Admin</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setStockAdmin(e.target.checked)} checked={stockAdmin} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>HS</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Import</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setHsImport(e.target.checked)} checked={hsImport} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Export</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setHsExport(e.target.checked)} checked={hsExport} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Admin</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setHsAdmin(e.target.checked)} checked={hsAdmin} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box my={1}>
                            <Grid container spacing={2} display="flex" alignItems="center">
                                <Grid item xs={3}>
                                    <Typography>Geology</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Import</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setGeoImport(e.target.checked)} checked={geologyImport} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Export</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setGeoExport(e.target.checked)} checked={geologyExport} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} display="flex" alignItems="center">Admin</Grid>
                                        <Grid item xs={6} display="flex" alignItems="center">
                                            <Switch onChange={(e) => setGeoAdmin(e.target.checked)} checked={geologyAdmin} />
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

export default UserTypeModal;