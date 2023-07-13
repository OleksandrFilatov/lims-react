import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { ServerUri } from '../../config';
import { handleSaveWeight } from '../../slices/laboratory';
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

const InputWeightModal = (props) => {

    const dispatch = useDispatch();

    const [weight, setWeight] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [viewHistory, setViewHistory] = React.useState(false);
    const [weightHistory, setWeightHistory] = React.useState([]);

    const { laboratories } = useSelector(state => state.laboratory);
    const { settings } = useSelector(state => state.setting);

    React.useEffect(() => {
        const getWeights = async () => {
            try {
                setWeight(laboratories.filter(d => d._id === props.id)[0].weight);
                setComment(laboratories.filter(d => d._id === props.id)[0].weight_comment);
                setViewHistory(false);

                const res = await axiosFetch.get(`/api/weights/${props.id}`);
                console.log("Weight History: ", res.data)
                setWeightHistory(res.data);
            } catch (err) {
                if (Object(err).hasOwnProperty('response')) {
                    if (err.response.status === 401) {
                        dispatch(logout());
                    }
                }
                console.log(err);
            }
        }
        if (props.id !== '') {
            console.log(props.id)
            getWeights();
        }
    }, [props.id])

    const handleCreate = () => {
        try {
            const data = {
                id: props.id,
                weight: weight,
                comment: comment
            }
            dispatch(handleSaveWeight(data));
            props.handleClose();
        } catch (err) {
            console.log(err)
        }
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
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>Weight(actual)</Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Grid container spacing={2}>
                            <Grid item xs={4} sx={{ display: 'flex', alignItems: "center" }}>
                                <Typography className='cursor-pointer' variant='h6' onClick={() => setViewHistory(!viewHistory)}>Weight(actual):</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    variant='outlined'
                                    label="Weight(actual)"
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={4} sx={{ display: 'flex', alignItems: "center" }}>
                                <Typography variant='h6'>Comment:</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    label="Comment"
                                    multiline
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            {
                                viewHistory && <Grid item xs={12} sx={{ mt: 1 }}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Weight</TableCell>
                                                    <TableCell align="right">Author</TableCell>
                                                    <TableCell align="right">Updated Date</TableCell>
                                                    <TableCell align="right">Comment</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {weightHistory.length > 0 ? weightHistory.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.weight}
                                                        </TableCell>
                                                        <TableCell align="right">{row.user.userName}</TableCell>
                                                        <TableCell align="right">{moment(row.updateDate).format(`${settings.date_format} HH:mm:ss`)}</TableCell>
                                                        <TableCell align="right">{row.comment}</TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow
                                                    >
                                                        <TableCell colSpan={4} align='center'>
                                                            No Data
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            }
                        </Grid>
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

export default InputWeightModal;