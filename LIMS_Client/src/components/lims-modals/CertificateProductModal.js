import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { analysis_fields, client_fields, laboratoryFields } from '../../utils/tableHeaders';


const style = {
    position: 'absolute',
    top: '50px',
    left: '20%',
    // transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const CertificateProductModal = (props) => {

    const { t } = useTranslation();

    const [selectedId, setSelectedId] = React.useState('')
    const [productTitle, setProductTitle] = React.useState('');
    const [productData, setProductData] = React.useState([
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
        { name: "", pagename: null, fieldname: "" },
    ]);

    const { certificateTemplates } = useSelector(state => state.certificateTemplate);

    React.useEffect(() => {
        if (props.id !== '') {
            const selectedTemplate = certificateTemplates.filter(item => item._id === props.id)[0];
            setSelectedId(props.id);
            setProductTitle(selectedTemplate.productdata.productData.length > 0 ? selectedTemplate.productdata.productTitle : '');

            var empty_Modal_data = [
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
                { name: "", pagename: null, fieldname: "" },
            ];
            console.log(selectedTemplate.productdata.productData)
            if (selectedTemplate.productdata.productData.length > 0)
                setProductData(selectedTemplate.productdata.productData)
            else
                setProductData(empty_Modal_data)
        }
    }, [props.id])

    const handleSave = () => {
        const data = {
            rowid: selectedId,
            title: productTitle,
            data: productData
        };
        props.handleSave(data);
    }

    const handleDragEnd = async ({ source, destination, draggableId }) => {
        console.log("Source: ", source);
        console.log("Destination: ", destination);
        console.log("DraggableId: ", draggableId);
        let temp = [...productData];
        swap(temp, draggableId, destination.index);
        setProductData(temp);
    }

    function swap(input, index_A, index_B) {
        let temp = input[index_A];

        input[index_A] = input[index_B];
        input[index_B] = temp;
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
                        {t('Product Data')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Box display="flex" justifyContent="center">
                            <TextField
                                value={productTitle}
                                onChange={(e) => setProductTitle(e.target.value)} sx={{ maxWidth: '500px' }}
                                label="Product Name"
                            />
                        </Box>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Box className='mt-2'>
                                <Droppable droppableId='column' type="card">
                                    {(provided) => (
                                        <Box ref={provided.innerRef}>
                                            {
                                                productData.map((item, index) => (
                                                    <Draggable
                                                        draggableId={String(index)}
                                                        index={index}
                                                        key={index}
                                                    >
                                                        {(_provided, snapshot) => (
                                                            <Box
                                                                sx={{ width: '100%', display: 'flex' }}
                                                                key={index}
                                                                {..._provided.draggableProps}
                                                                {..._provided.dragHandleProps}
                                                                dragging={snapshot.isDragging}
                                                                ref={_provided.innerRef}
                                                            >
                                                                <Box style={{ width: '10%', display: 'flex', alignItems: 'center', p: 1 }}>Field{index + 1}</Box>
                                                                <Box sx={{ width: '30%', p: 1 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label={`Field${index + 1}`}
                                                                        value={item.name}
                                                                        onChange={(e) => setProductData(product => product.map((item1, index1) => index === index1 ? { ...item1, name: e.target.value } : item1))}
                                                                    />
                                                                </Box>
                                                                <Box sx={{ width: '20%', p: 1 }}>
                                                                    <FormControl fullWidth>
                                                                        <InputLabel id={`demo-multiple-chip-label-${index}`}>{t('Select')}</InputLabel>
                                                                        <Select
                                                                            labelId={`demo-multiple-chip-label-${index}`}
                                                                            id={`demo-multiple-chip-label-${index}`}
                                                                            label={t("Select")}
                                                                            value={item.pagename}
                                                                            onChange={(e) => setProductData(product => product.map((item1, index1) => index === index1 ? { ...item1, pagename: e.target.value } : item1))}
                                                                        >
                                                                            <MenuItem value={0}>Laboratory</MenuItem>
                                                                            <MenuItem value={1}>Analysis Types</MenuItem>
                                                                            <MenuItem value={2}>Client</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                </Box>
                                                                <Box sx={{ width: '30%', p: 1 }}>
                                                                    <FormControl fullWidth>
                                                                        <InputLabel id={`demo-multiple-chip-label12-${index}`}>{t('Select')}</InputLabel>
                                                                        <Select
                                                                            labelId={`demo-multiple-chip-label12-${index}`}
                                                                            id={`demo-multiple-chip-label12-${index}`}
                                                                            value={item.fieldname}
                                                                            onChange={(e) => setProductData(product => product.map((item1, index1) => index === index1 ? { ...item1, fieldname: e.target.value } : item1))}
                                                                            label={t('Select')}
                                                                        >
                                                                            {item.pagename === 0 &&
                                                                                laboratoryFields.map((vl, il) => (
                                                                                    <MenuItem value={vl.key} key={il + "l"}>
                                                                                        {vl.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            {item.pagename === 1 &&
                                                                                analysis_fields.map((vl, il) => (
                                                                                    <MenuItem value={vl.key} key={il + "a"}>
                                                                                        {vl.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            {item.pagename === 2 &&
                                                                                client_fields.map((vl, il) => (
                                                                                    <MenuItem value={vl.key} key={il + "c"}>
                                                                                        {vl.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Box>
                                                                <Box display="flex" alignItems="center" justifyContent="center" sx={{ width: '10%', p: 1 }}>
                                                                    <Button
                                                                        variant="text"
                                                                        sx={{ minWidth: 0, p: 1 }}
                                                                        size="small"
                                                                        color='error'
                                                                        onClick={() => {
                                                                            setProductData(productData.filter((c, i) => i !== index))
                                                                        }}
                                                                    ><DeleteForeverIcon sx={{ fontSize: 32 }} /></Button>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        </DragDropContext>
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

export default CertificateProductModal;