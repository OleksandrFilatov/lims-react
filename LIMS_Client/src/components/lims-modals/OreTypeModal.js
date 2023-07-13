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
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const OreTypeModal = (props) => {

    const { t } = useTranslation();

    const [oreTypeID, setOreTypeID] = React.useState('')
    const [oreType, setOreType] = React.useState('')
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { oreTypes } = useSelector(state => state.oreType);

    React.useEffect(() => {
        setOreTypeID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedUser = oreTypes.filter(item => item._id === props.id)[0];

            setOreTypeID(selectedUser.oreType_id);
            setOreType(selectedUser.oreType);
            setRemark(selectedUser.remark);
        }
    }, [props.id])

    const handleCreate = () => {
        if (oreTypeID === '' || oreTypeID === 0) {
            toast.error('OreType ID is required');
            return;
        }
        if (oreType === '') {
            toast.error('OreType is required');
            return;
        }
        const data = {
            oreType_id: oreTypeID,
            oreType: oreType,
            remark: remark
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setOreTypeID(e.target.value)
        setDuplicated(oreTypes.filter(item => item.oreType_id === e.target.value).length > 0);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('OreType')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("OreType ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={oreTypeID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>OreType ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("OreType")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setOreType(e.target.value)}
                            value={oreType}
                        />
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

export default OreTypeModal;