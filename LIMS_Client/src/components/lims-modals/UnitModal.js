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

const UnitModal = (props) => {

    const { t } = useTranslation();

    const [unitID, setUnitID] = React.useState('')
    const [unit, setUnit] = React.useState('')
    const [remark, setRemark] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { units } = useSelector(state => state.unit);

    React.useEffect(() => {
        setUnitID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedUnit = units.filter(item => item._id === props.id)[0];

            setUnitID(selectedUnit.unit_id);
            setUnit(selectedUnit.unit);
            setRemark(selectedUnit.remark);
        }
    }, [props.id])

    const handleCreate = () => {
        if (unitID === '' || unitID === 0) {
            toast.error('Unit ID is required');
            return;
        }
        if (unit === '') {
            toast.error('Unit is required');
            return;
        }
        if (props.id === '' && units.filter(u => u.unit === unit).length > 0) {
            toast.error('Unit already exists');
            return;
        }
        const data = {
            unit_id: unitID,
            unit: unit,
            remark: remark,
        };
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setUnitID(e.target.value)
        setDuplicated(units.filter(item => item.unit_id === e.target.value).length > 0);
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setUnit(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Unit')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Unit ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={unitID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Unit ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("Unit")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={unit}
                        />
                        {
                            (props.id === '' && units.filter(u => u.unit === unit).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>Unit already exists.</Box>
                        }
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

export default UnitModal;