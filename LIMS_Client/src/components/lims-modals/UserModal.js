import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

const UserModal = (props) => {

    const { t } = useTranslation();

    const [userID, setUserID] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [remark, setRemark] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [new_password, setNewPassword] = React.useState('')
    const [confirm_password, setConfirmPassword] = React.useState('')
    const [userType, setUserType] = React.useState('')
    const [duplicated, setDuplicated] = React.useState(false);

    const { users } = useSelector(state => state.user);
    const { userTypes } = useSelector(state => state.userType);

    React.useEffect(() => {
        setUserID(props.selectedId);
    }, [props.selectedId])

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedUser = users.filter(item => item._id === props.id)[0];

            setUserID(selectedUser.user_id);
            setUsername(selectedUser.userName);
            setEmail(selectedUser.email);
            setRemark(selectedUser.remark);
            setPassword(selectedUser.password_text);
            setUserType(userTypes.filter(uType => uType.userType === selectedUser.user_type)[0]._id);
        }
    }, [props.id])

    const handleCreate = () => {
        if (userID === '' || userID === 0) {
            toast.error('user ID is required');
            return;
        }
        if (username === '') {
            toast.error('user name is required');
            return;
        }
        if (password === '') {
            toast.error('Password is required');
            return;
        }
        if (userType === '') {
            toast.error('User Type is required');
            return;
        }
        if (props.id !== '' && new_password !== confirm_password) {
            toast.error('New password does not match');
            return;
        }
        if (props.id === '' && users.filter(uType => uType.userName === username).length > 0) {
            toast.error('User name already exist');
            return;
        }
        const data = {
            user_id: userID,
            userName: username,
            email: email,
            password: password,
            userType: userType,
            remark: remark,
        };
        if (props.id !== '') {
            data.new_password = new_password;
        }
        props.handleCreate(data);
    }

    const handleChangeID = (e) => {
        setUserID(e.target.value)
        setDuplicated(users.filter(item => item.user_id === e.target.value).length > 0);
    }

    const handleChangeInput = (e) => {
        let { value } = e.target;
        value = value.replace(/ /g, '_')
        value = value.replace(/-/g, '_')
        value = value.replace(/,/g, '')
        setUsername(value);
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
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('User')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("User ID")}
                            type="number"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeID}
                            value={userID}
                        />
                        {
                            duplicated && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>User ID already exists.</Box>
                        }
                        <TextField
                            required
                            label={t("User Name")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeInput}
                            value={username}
                        />
                        {
                            (props.id === '' && users.filter(uType => uType.userName === username).length > 0) && <Box className="invalid-feedback d-block" sx={{ color: 'red', fontSize: '12px' }}>User name already exists.</Box>
                        }
                        <TextField
                            label={t("Email")}
                            type="email"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <TextField
                            required
                            label={t("Password")}
                            type="password"
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            disabled={props.id !== ''}
                        />
                        {
                            props.id !== '' && (
                                <Box>
                                    <TextField
                                        required
                                        label={t("New Password")}
                                        type="password"
                                        fullWidth
                                        sx={{ my: 1 }}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={new_password}
                                    />
                                    <TextField
                                        required
                                        label={t("Confirm Password")}
                                        type="password"
                                        fullWidth
                                        sx={{ my: 1 }}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirm_password}
                                    />
                                </Box>
                            )
                        }
                        <FormControl fullWidth>
                            <InputLabel required id="demo-simple-select-autowidth-label">{t("User Type")}</InputLabel>
                            <Select
                                required
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                fullWidth
                                label={t("User Type")}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    userTypes.length > 0 && userTypes.map((uType, index) => (
                                        <MenuItem value={uType._id} key={index}>{uType.userType}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
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
        </Modal>
    )
}

export default UserModal;