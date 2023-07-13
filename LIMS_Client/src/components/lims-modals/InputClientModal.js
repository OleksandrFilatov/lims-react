import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';

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

const InputClientModal = (props) => {

    const [clientId, setClientId] = React.useState('');
    const [name, setName] = React.useState('');
    const [clientData, setClientData] = React.useState({
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

    const { laboratories } = useSelector(state => state.laboratory);
    const { settings } = useSelector(state => state.setting);

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedLaboratory = laboratories.filter(lab => lab._id === props.id)[0];
            setClientId(selectedLaboratory.client.clientId);
            setName(selectedLaboratory.client.name);
            setClientData({
                address_name1: selectedLaboratory.delivery.name1,
                address_name2: selectedLaboratory.delivery.name2,
                address_name3: selectedLaboratory.delivery.name3,
                address_title: selectedLaboratory.delivery.title,
                address_country: selectedLaboratory.delivery.country,
                address_place: selectedLaboratory.delivery.place,
                address_street: selectedLaboratory.delivery.street,
                address_zip: selectedLaboratory.delivery.zipcode,
                customer_product_code: selectedLaboratory.delivery.productCode,
                email_address: selectedLaboratory.delivery.email,
                fetch_date: selectedLaboratory.delivery.fetchDate,
                order_id: selectedLaboratory.delivery.orderId,
                customer_order_id: selectedLaboratory.delivery.customer_orderId,
                pos_id: selectedLaboratory.delivery.posId,
                w_target: selectedLaboratory.delivery.w_target,
            })
        } else {
            setClientId(props.selectedId);
        }
    }, [props.id])


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
                        {name}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            sx={{ my: 1 }}
                            label="Client ID"
                            variant="outlined"
                            fullWidth
                            value={clientId}
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name1"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_name1}
                            onChange={(e) => setDeliveryData({ ...clientData, address_name1: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Title"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_title}
                            onChange={(e) => setDeliveryData({ ...clientData, address_title: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Country"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_country}
                            onChange={(e) => setDeliveryData({ ...clientData, address_country: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name2"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_name2}
                            onChange={(e) => setDeliveryData({ ...clientData, address_name2: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Name3"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_name3}
                            onChange={(e) => setDeliveryData({ ...clientData, address_name3: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Place"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_place}
                            onChange={(e) => setDeliveryData({ ...clientData, address_place: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.Street"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_street}
                            onChange={(e) => setDeliveryData({ ...clientData, address_street: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Delivering.Address.ZIP"
                            variant="outlined"
                            fullWidth
                            value={clientData.address_zip}
                            onChange={(e) => setDeliveryData({ ...clientData, address_zip: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Customer Product Code"
                            variant="outlined"
                            fullWidth
                            value={clientData.customer_product_code}
                            onChange={(e) => setDeliveryData({ ...clientData, customer_product_code: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="E-mail Address"
                            variant="outlined"
                            fullWidth
                            value={clientData.email_address}
                            onChange={(e) => setDeliveryData({ ...clientData, email: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Fetch Date"
                            variant="outlined"
                            fullWidth
                            value={moment(new Date(clientData.fetch_date)).format(settings.date_format)}
                            onChange={(e) => setDeliveryData({ ...clientData, customer_product_code: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Order.ID"
                            variant="outlined"
                            fullWidth
                            value={clientData.order_id}
                            onChange={(e) => setDeliveryData({ ...clientData, order_id: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Customer Order ID"
                            variant="outlined"
                            fullWidth
                            value={clientData.customer_order_id}
                            onChange={(e) => setDeliveryData({ ...clientData, customer_order_id: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Pos.ID"
                            variant="outlined"
                            fullWidth
                            value={clientData.pos_id}
                            onChange={(e) => setDeliveryData({ ...clientData, pos_id: e.target.value })}
                            disabled
                        />
                        <TextField
                            sx={{ my: 1 }}
                            label="Weight(target)[kg]"
                            variant="outlined"
                            fullWidth
                            value={clientData.w_target}
                            onChange={(e) => setDeliveryData({ ...clientData, w_target: e.target.value })}
                            disabled
                        />
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Close</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InputClientModal;