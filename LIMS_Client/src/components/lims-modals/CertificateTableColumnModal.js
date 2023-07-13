import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

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

const CertificateTableColumnModal = (props) => {

    const { t } = useTranslation();

    const [selectedId, setSelectedId] = React.useState('')
    const [tableCols, setTableCols] = React.useState([
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
        { name: "", fieldname: null },
    ]);

    const { certificateTemplates } = useSelector(state => state.certificateTemplate);

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedTemplate = certificateTemplates.filter(item => item._id === props.id)[0];
            setSelectedId(props.id);
            var tablecol_data = [
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
                { name: "", fieldname: null },
            ];
            if (selectedTemplate.tablecol.length > 0)
                setTableCols(selectedTemplate.tablecol);
            else
                setTableCols(tablecol_data);
        }
    }, [props.id])

    const handleSave = () => {
        const data = {
            rowid: selectedId,
            data: tableCols,
        };
        props.handleSave(data);
    }

    const onChangeSelect = (e, index) => {
        if (tableCols.filter(c => c.fieldname === e.target.value).length > 0) {
            toast.error('This option already selected');
            return;
        }
        setTableCols(col => col.map((item1, index1) => index === index1 ? { ...item1, fieldname: e.target.value } : item1));
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
                        {t('Table Columns')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <table className='table table-hovered table-responsive borderless-table mt-2'>
                            <tbody>
                                {
                                    tableCols.map((item, index) => (
                                        <tr key={index}>
                                            <td width="10%" style={{ verticalAlign: 'middle' }}>Field{index + 1}</td>
                                            <td width="40%">
                                                <TextField
                                                    fullWidth
                                                    label={`Field${index + 1}`}
                                                    value={item.name}
                                                    onChange={(e) => setTableCols(col => col.map((item1, index1) => index === index1 ? { ...item1, name: e.target.value } : item1))}
                                                />
                                            </td>
                                            <td>
                                                <FormControl fullWidth>
                                                    <InputLabel id={`demo-multiple-chip-label-${index}`}>{t('Select')}</InputLabel>
                                                    <Select
                                                        required
                                                        labelId={`demo-multiple-chip-label-${index}`}
                                                        id={`demo-multiple-chip-label-${index}`}
                                                        value={item.fieldname ? item.fieldname : ''}
                                                        onChange={(e) => onChangeSelect(e, index)}
                                                        label={t("Select")}
                                                    >
                                                        <MenuItem value="analysis">Analysis Types</MenuItem>
                                                        <MenuItem value="value">Value</MenuItem>
                                                        <MenuItem value="user">Author</MenuItem>
                                                        <MenuItem value="date">Date</MenuItem>
                                                        <MenuItem value="reason">Reason</MenuItem>
                                                        <MenuItem value="spec">Specification</MenuItem>
                                                        <MenuItem value="comment">Comment</MenuItem>
                                                        <MenuItem value="certificate">Certificate Type</MenuItem>
                                                        <MenuItem value="obj">AnalysisType-Objective</MenuItem>
                                                        <MenuItem value="norm">Norm</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </td>
                                            <td width="5%" style={{ verticalAlign: 'middle' }}>
                                                <Button
                                                    variant="text"
                                                    sx={{ minWidth: 0, p: 1 }}
                                                    size="small"
                                                    color='error'
                                                    onClick={() => {
                                                        setTableCols(tableCols.filter((c, i) => i !== index))
                                                    }}
                                                ><DeleteForeverIcon sx={{ fontSize: 32 }} /></Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CertificateTableColumnModal;