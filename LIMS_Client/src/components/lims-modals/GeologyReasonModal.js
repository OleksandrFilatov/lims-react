import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
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

const GeologyReasonModal = (props) => {

    const { t } = useTranslation();

    const [reason, setReason] = React.useState('');

    const handleCreate = () => {
        props.handleCreate({
            reason: reason,
        });
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
        // sx={modal}
        >
            <Fade in={props.open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>
                        {t('Confirm shift')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            multiline
                            rows={3}
                            variant="outlined"
                            label="Reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleCreate}>Shift</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyReasonModal;