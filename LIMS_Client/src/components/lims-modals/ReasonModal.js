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

const ReasonModal = (props) => {

    const { t } = useTranslation();

    const [reasonID, setReasonID] = React.useState('')
    const [reason, setReason] = React.useState('')
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { reasons } = useSelector(state => state.reason);

    React.useEffect(() => {
        setReasonID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedUser = reasons.filter(item => item._id === props.id)[0];

            setReasonID(selectedUser.reason_id);
            setReason(selectedUser.reason);
            setRemark(selectedUser.remark);
        }
    }, [props.id])

    const handleCreate = () => {
        if (reasonID === '' || reasonID === 0) {
            toast.error('Reason ID is required');
            return;
        }
        if (reason === '') {
            toast.error('Reason is required');
            return;
        }
        const data = {
            reason_id: reasonID,
            reason: reason,
            remark: remark
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setReasonID(e.target.value)
        setDuplicated(reasons.filter(item => item.reason_id === e.target.value).length > 0);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Reason')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Reason ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={reasonID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Reason ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Reason")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setReason(e.target.value)}
                            value={reason}
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

export default ReasonModal;