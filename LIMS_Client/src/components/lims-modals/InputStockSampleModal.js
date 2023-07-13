import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import toast from 'react-hot-toast';

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

const InputStockSampleModal = (props) => {

    const dispatch = useDispatch();

    const [stock_count, setStockCount] = React.useState(1);
    const [stock_data, setStockData] = React.useState([]);
    const [stockModalData, setStockModalData] = React.useState([{ stock: '', weight: 0 }]);

    const { laboratories } = useSelector(state => state.laboratory);
    const { settings } = useSelector(state => state.setting);
    const { sampleTypes } = useSelector(state => state.sampleType);

    React.useEffect(() => {
        if (props.id !== '') {

            const item = laboratories.filter(lab => lab._id === props.id)[0];
            let _isStock = false;
            if (sampleTypes.filter(sT => sT._id === item.sample_type._id).length > 0) {
                _isStock = sampleTypes.filter(sT => sT._id === item.sample_type._id)[0].stockSample;
            }
            if (_isStock) {
                if (item.material_left === 0 && item.charge.length === 0) {
                    const data = {
                        value: item._id,
                        label: item.material.material + " " + item.material_category.name + " " + "N/A" + " " + item.material_left
                    }
                    setStockData([data]);
                } else {
                    const data = {
                        value: item._id,
                        label: item.material.material + " " + item.material_category.name + " " + moment(item.charge[0].date).format(`${settings.date_format} HH:mm:ss`) + " " + item.material_left
                    }
                    setStockData([data]);
                }
            } else {
                const stocks = laboratories.filter(data => data.sample_type.stockSample === true)
                    .filter(data1 => data1.material._id === item.material._id)
                const filtered_stocks = stocks.filter(s => s.material_left > 0 && s.charge.length > 0)
                let data = [];
                filtered_stocks.map(s => {
                    data.push({
                        value: s._id,
                        label: s.material.material + " " + s.material_category.name + " " + moment(s.charge[0].date).format(`${settings.date_format} HH:mm:ss`) + " " + s.material_left,
                        material: s.material_left,
                        inputed_material: 0
                    })
                })
                setStockData(data);
            }
        }
    }, [props]);

    const handleChangeStockSelect = (e, i) => {
        setStockModalData(stockModalData.map((data, index) =>
            index !== i ? data : { stock: e.target.value, weight: data.weight }));
    }

    const handleChangeStockInput = (e, i) => {
        setStockModalData(stockModalData.map((data, index) =>
            index !== i ? data : { stock: data.stock, weight: e.target.value }));
    }

    const handleSave = () => {
        if (stockModalData.filter(sData => sData.stock === '' || sData.weight === 0 || sData.weight === '').length > 0) {
            toast.error("Please input stock sample correctly");
            return;
        }
        stock_data.map(data => data.inputed_material = 0);

        stock_data.map(data => stockModalData.filter(d =>
            d.stock === data.value).map(i => data.inputed_material += Number(i.weight))
        );
        let isExceed = true;
        for (let i = 0; i < stock_data.length; i++) {
            if (Number(stock_data[i].inputed_material) > Number(stock_data[i].material)) {
                isExceed = false;
                break;
            }
        }
        if (!isExceed) {
            toast.error("Inputed data exceed than current data");
            return;
        }
        let data = []
        for (let j = 0; j < stockModalData.length; j++) {
            if (data.filter(d => String(d.stock) === String(stockModalData[j].stock)).length > 0) {
                data.filter(d => String(d.stock) === String(stockModalData[j].stock))[0].weight += Number(stockModalData[j].weight);
            } else {
                data.push({
                    stock: stockModalData[j].stock,
                    weight: Number(stockModalData[j].weight)
                });
            }
        }
        const requestData = {
            data: data,
            selectedId: props.id
        }
        // console.log(requestData)
        props.handleSave(requestData);
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
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>Stock Sample</Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <Grid container spacing={2}>
                            {
                                Array.from(Array(stock_count).keys()).map((num, i) => (
                                    <Grid item xs={12} key={i}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <label htmlFor="stock" className="control-label">Stock Sample</label>
                                                <Box className="col-lg-12 px-0">
                                                    <select className="form-control" onChange={(e) => handleChangeStockSelect(e, i)}>
                                                        <option value="">*Select stock sample*</option>
                                                        {
                                                            stock_data.map((d, index) => (
                                                                <option key={index} value={d.value}>{d.label}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <label htmlFor="weight" className="control-label">Weight</label>
                                                <Box className="col-lg-12 px-0 d-flex">
                                                    <input type="number" value={stockModalData[i].weight} className="form-control" onChange={(e) => handleChangeStockInput(e, i)} />
                                                    <Button variant='contained' color="error" onClick={() => {
                                                        if (stock_count > 1) {
                                                            setStockModalData([...stockModalData.filter((d, index) => index !== i)]);
                                                            setStockCount(parseInt(stock_count - 1));
                                                        }
                                                    }} sx={{ px: 1 }}><DeleteForeverIcon /></Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                            <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                <Button variant='contained' onClick={() => setStockCount(stock_count + 1) & setStockModalData([...stockModalData, { stock: '', weight: '' }])}><AddIcon /></Button>
                            </Grid>
                        </Grid>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>OK</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InputStockSampleModal;