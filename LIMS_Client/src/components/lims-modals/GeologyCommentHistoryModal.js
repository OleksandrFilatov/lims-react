import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getGeologyComments } from '../../slices/geology'
import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50px',
    left: '30%',
    width: '40%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const GeologyCommentHistoryModal = (props) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { comments } = useSelector(state => state.geology);

    React.useEffect(() => {
        if (props.id) {
            dispatch(getGeologyComments(props.id));
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
                        {t('Movement History')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t("User")}</TableCell>
                                        <TableCell align="right">{t("From")}</TableCell>
                                        <TableCell align="right">{t("To")}</TableCell>
                                        <TableCell align="right">{t("Reason")}</TableCell>
                                        <TableCell align="right">{t("Date")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {comments.length > 0 ? comments.map((row) => (
                                        <TableRow
                                            key={row._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.user.userName}
                                            </TableCell>
                                            <TableCell align="right">{row.from}</TableCell>
                                            <TableCell align="right">{row.to}</TableCell>
                                            <TableCell align="right">{row.reason}</TableCell>
                                            <TableCell align="right">{moment(row.date).format(props.date_format + ' HH:mm:ss')}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" colSpan={6} sx={{ textAlign: 'center' }}>
                                                There is no record to display.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>{t("Close")}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default GeologyCommentHistoryModal;