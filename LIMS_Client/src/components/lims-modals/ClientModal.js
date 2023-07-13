import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -32%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const ClientModal = (props) => {

    const { t } = useTranslation();

    const [clientID, setClientID] = React.useState('')
    const [name, setName] = React.useState('')
    const [other, setOther] = React.useState('')
    const [countryB, setCountryB] = React.useState('')
    const [zipCodeB, setZipCodeB] = React.useState('')
    const [cityB, setCityB] = React.useState('')
    const [addressB, setAddressB] = React.useState('')
    const [address2B, setAddress2B] = React.useState('')
    const [address3B, setAddress3B] = React.useState('')
    const [address_street, setAddressStreet] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [email2, setEmail2] = React.useState('')
    const [email3, setEmail3] = React.useState('')
    const [remark1, setRemark1] = React.useState('')
    const [remark2, setRemark2] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { clients } = useSelector(state => state.client);

    React.useEffect(() => {
        console.log(props.selectedId)
        setClientID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedUser = clients.filter(item => item._id === props.id)[0];

            setClientID(selectedUser.clientId);
            setName(selectedUser.name);
            setOther(selectedUser.other);
            setCountryB(selectedUser.countryB);
            setZipCodeB(selectedUser.zipCodeB);
            setCityB(selectedUser.cityB);
            setAddressB(selectedUser.addressB);
            setAddress2B(selectedUser.address2B);
            setAddress3B(selectedUser.address3B);
            setAddressStreet(selectedUser.address_street);
            setEmail(selectedUser.email);
            setEmail2(selectedUser.email2);
            setEmail3(selectedUser.email3);
            setRemark1(selectedUser.remark1);
            setRemark2(selectedUser.remark2);
        }
    }, [props.id])

    const handleCreate = () => {
        if (clientID === '' || clientID === 0) {
            toast.error('Client ID is required');
            return;
        }
        if (name === '') {
            toast.error('Client name is required');
            return;
        }
        const data = {
            name: name,
            clientId: clientID,
            other: other,
            countryB: countryB,
            zipCodeB: zipCodeB,
            cityB: cityB,
            addressB: addressB,
            address2B: address2B,
            address3B: address3B,
            address_street: address_street,
            email: email,
            email2: email2,
            email3: email3,
            remark1: remark1,
            remark2: remark2
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setClientID(e.target.value)
        setDuplicated(clients.filter(item => item.clientId === e.target.value).length > 0);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Client')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Client ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={clientID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Client ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Name")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <TextField
                            label={t("Other")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setOther(e.target.value)}
                            value={other}
                        />
                        <TextField
                            label={t("Country B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setCountryB(e.target.value)}
                            value={countryB}
                        />
                        <TextField
                            label={t("Zip Code B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setZipCodeB(e.target.value)}
                            value={zipCodeB}
                        />
                        <TextField
                            label={t("City B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setCityB(e.target.value)}
                            value={cityB}
                        />
                        <TextField
                            label={t("Address B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setAddressB(e.target.value)}
                            value={addressB}
                        />
                        <TextField
                            label={t("Address 2B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setAddress2B(e.target.value)}
                            value={address2B}
                        />
                        <TextField
                            label={t("Address 2B")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setAddress3B(e.target.value)}
                            value={address3B}
                        />
                        <TextField
                            label={t("Address Street")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setAddressStreet(e.target.value)}
                            value={address_street}
                        />
                        <TextField
                            label={t("Email")}
                            type="email"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <TextField
                            label={t("Email 2")}
                            type="email"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setEmail2(e.target.value)}
                            value={email2}
                        />
                        <TextField
                            label={t("Email 3")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setEmail3(e.target.value)}
                            value={email3}
                        />
                        <TextField
                            label={t("Remark1")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setRemark1(e.target.value)}
                            value={remark1}
                        />
                        <TextField
                            label={t("Remark2")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setRemark2(e.target.value)}
                            value={remark2}
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

export default ClientModal;