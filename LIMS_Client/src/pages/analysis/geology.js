import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    ButtonGroup,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { DatePicker as AtndDatePicker } from "antd";
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { AuthGuard } from '../../components/authentication/auth-guard';
import { AdminLayout } from '../../components/admin/admin-layout'
import { Chart } from '../../components/chart';
import axiosFetch from '../../utils/axiosFetch';
import setAuthToken from '../../utils/setAuthToken';
import { getOreTypesData } from '../../slices/oreType';
import { getReasonsData } from '../../slices/reason';
import { getGeologyLabObjectivesData } from '../../slices/geology';

const { RangePicker } = AtndDatePicker;

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

const laboratory_options = [
    { label: 'ALL', value: 'all' },
    { label: 'CaF2', value: 'CaF2' },
    { label: 'BaSO4', value: 'BaSO4' },
    { label: 'SiO2', value: 'SiO2' },
    { label: 'Mg', value: 'Mg' },
    { label: 'Ag', value: 'Ag' },
    { label: 'Cu', value: 'Cu' },
    { label: 'As', value: 'As' },
    { label: 'Sb', value: 'Sb' },
    { label: 'Pb', value: 'Pb' },
    { label: 'Fe', value: 'Fe' },
    { label: 'P', value: 'P' },
    { label: 'Mn', value: 'Mn' },
    { label: 'Zn', value: 'Zn' },
    { label: 'Cr', value: 'Cr' }
];

const category_options = [
    { label: 'ALL', value: 'all' },
    { label: 'SP', value: 'SP' },
    { label: 'VP', value: 'VP' },
    { label: 'BN', value: 'BN' }
];

function getStyles(unit, objectiveUnits, theme) {
    return {
        fontWeight:
            objectiveUnits.indexOf(unit) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AnalysisLaboratory = () => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const { t } = useTranslation();

    const [date_format, setDateFormat] = useState('DD.MM.YYYY');
    const [selected_values, setSelectedValues] = useState([]);
    const [selected_categories, setSelectedCategories] = useState([]);
    const [selected_oreTypes, setSelectedOreTypes] = useState([]);
    const [date_range, setDateRange] = useState([]);
    const [holeId, setHoleId] = useState('');
    const [level, setLevel] = useState('');
    const [chartData, setChartData] = useState([]);
    const [pending, setPending] = useState(false);
    const [laboratory_options, setLaboratoryOptions] = useState([{ label: 'ALL', value: 'all' }]);

    const { oreTypes } = useSelector(state => state.oreType);
    const { reasons } = useSelector(state => state.reason);
    const { geology_lab_objectives } = useSelector(state => state.geology);

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            setAuthToken(token);
            dispatch(getOreTypesData());
            dispatch(getReasonsData())
            dispatch(getGeologyLabObjectivesData());

            axiosFetch.get("/api/settings/date_format")
                .then(res => {
                    if (res.data.date_format === 'DD.MM.YYYY') {
                        setDateFormat('MM.DD.YYYY');
                    } else if (res.data.date_format === 'DD-MM-YYYY') {
                        setDateFormat('MM-DD-YYYY')
                    } else if (res.data.date_format === 'DD/MM/YYYY') {
                        setDateFormat('MM/DD/YYYY')
                    } else if (res.data.date_format === 'YYYY-DD-MM') {
                        setDateFormat('YYYY-MM-DD')
                    } else {
                        setDateFormat(res.data.date_format);
                    }
                }).catch(err => {
                    console.log(err.response.data)
                })
        }
    }, []);

    useEffect(() => {
        if (geology_lab_objectives.length > 0) {
            geology_lab_objectives.map(item => {
                if (laboratory_options.filter(option => option.value === item.objective.objective + ' ' + item.unit.unit).length === 0) {
                    setLaboratoryOptions(prev => [...prev, {
                        label: item.objective.objective + ' ' + item.unit.unit,
                        value: item.objective.objective + ' ' + item.unit.unit,
                        id: item._id
                    }])
                }
            })
        }
    }, [geology_lab_objectives])

    useEffect(() => {
        if (selected_values?.length) {
            getChartData();
        }
    }, [selected_values, selected_categories, selected_oreTypes, date_range, holeId, level]);

    const handleChangeValues = (e) => {
        if (e.target.value.find(option => option === "ALL")) {
            setSelectedValues(laboratory_options.filter(m => m.value !== 'all').map(m => m.label));
        } else {
            setSelectedValues(e.target.value);
        }
    }

    const handleChangeCategory = (e) => {
        if (e.target.value.find(option => option === "ALL")) {
            setSelectedCategories(category_options.filter(m => m.value !== 'all').map(m => m.label));
        } else {
            setSelectedCategories(e.target.value);
        }
    }

    const handleChangeOreType = (e) => {
        if (e.target.value.indexOf('all') > -1) {
            setSelectedOreTypes(oreTypes.map(m => m.oreType));
        } else {
            setSelectedOreTypes(e.target.value);
        }
    }

    const getChartData = async () => {
        try {
            setPending(true);
            let ores = oreTypes.filter(ore => selected_oreTypes.includes(ore.oreType)).map(ore => ore._id);
            const res = await axiosFetch.post('/api/geology/chartdata', { selected_values, selected_categories, ores, date_range, holeId, level });

            let y_axis = [];
            let y_tooltip = [];
            let x_axis = [];
            let hole_ids = [];
            let chart_data = [];
            let item_reason = '';

            await Promise.all(selected_values.map(val => {
                y_axis = [];
                y_tooltip = [];
                x_axis = [];
                hole_ids = [];

                res.data
                    .sort((a, b) => new Date(a.laboratory_data[a.laboratory_data?.length - 1].date.value) < new Date(b.laboratory_data[b.laboratory_data?.length - 1].date.value) ? 1 : -1)
                    .map(item => {
                        var objective_values = item.laboratory_data[item.laboratory_data?.length - 1].objective_values;
                        var id = geology_lab_objectives.filter(obj => obj.objective.objective + ' ' + obj.unit.unit === val)[0]._id;
                        var selected_value = objective_values.filter(value => value.obj === id)[0];

                        y_axis.push(selected_value.value);
                        x_axis.push(item.laboratory_data[item.laboratory_data?.length - 1].date.value);
                        hole_ids.push(item.hole_id);
                        y_tooltip.push(item.laboratory_data.map(lab => {
                            objective_values = lab.objective_values;
                            id = geology_lab_objectives.filter(obj => obj.objective.objective + ' ' + obj.unit.unit === val)[0]._id;
                            selected_value = objective_values.filter(value => value.obj === id)[0];

                            item_reason = reasons.filter(reason => reason._id === selected_value?.reason).length > 0 ? reasons.filter(reason => reason._id === selected_value.reason)[0].reason : '';
                            return selected_value?.value + ' ' + lab.user.userName + ' ' + moment(lab.date.value).format(date_format) + ' ' + item_reason;
                        }))
                        y_tooltip.map(item => item.splice(0, 1));
                    })
                chart_data.push({
                    label: val,
                    x: x_axis,
                    y: y_axis,
                    tooltip: y_tooltip,
                    hole_id: hole_ids
                })
            }))
            console.log(chart_data);
            setPending(false);
            setChartData(chart_data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleFilterPointer = async (dType, index) => {
        try {
            var from = moment(to).subtract(7 * dType, 'days').format(date_format);
            var to = moment(new Date()).format(date_format);
            let value = [selected_values[index]];
            let range = [from, to];
            let ores = oreTypes.filter(ore => selected_oreTypes.includes(ore.oreType)).map(ore => ore._id);

            setPending(true);
            const res = await axiosFetch.post('/api/geology/chartdata', {
                selected_values: value,
                selected_categories: selected_categories,
                ores: ores,
                date_range: range,
                holeId: holeId,
                level: level
            });

            let y_axis = [];
            let y_tooltip = [];
            let x_axis = [];
            let hole_ids = [];
            let chart_data = [];
            let item_reason = '';

            await Promise.all(value.map(val => {
                y_axis = [];
                y_tooltip = [];
                x_axis = [];
                hole_ids = [];

                res.data
                    .sort((a, b) => new Date(a.laboratory_data[a.laboratory_data?.length - 1].date) < new Date(b.laboratory_data[b.laboratory_data?.length - 1].date) ? 1 : -1)
                    .map(item => {
                        y_axis.push(item.laboratory_data[item.laboratory_data?.length - 1][val].value);
                        x_axis.push(item.laboratory_data[item.laboratory_data?.length - 1].date.value);
                        hole_ids.push(item.hole_id);
                        y_tooltip.push(item.laboratory_data.map(lab => {
                            item_reason = reasons.filter(reason => reason._id === lab[val].reason).length > 0 ? reasons.filter(reason => reason._id === lab[val].reason)[0].reason : '';
                            return lab[val].value + ' ' + lab.user.userName + ' ' + moment(lab.date.value).format(date_format) + ' ' + item_reason;
                        }))
                    })
                chart_data.push({
                    label: val,
                    x: x_axis,
                    y: y_axis,
                    tooltip: y_tooltip,
                    hole_id: hole_ids
                })
            }))
            setPending(false);
            setChartData(chartData.map((cData, i) => i === index ? chart_data[0] : cData));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Box>
            <Head>
                <title>
                    Analysis | Geology
                </title>
            </Head>
            <Box>
                {
                    pending ? <Backdrop
                        sx={{ color: '#fff', zIndex: '9999999' }}
                        open={pending}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop> : (
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>{t("Select Input Laboratory Values")}</Box>
                                            <Button
                                                variant='text'
                                                size='small'
                                                onClick={() => setSelectedValues([])}
                                            >{t("Clear")}</Button>
                                        </Typography>
                                        <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                            <InputLabel id="analysis-types-chip-label">{t("Values")}</InputLabel>
                                            <Select
                                                labelId="analysis-types-chip-label"
                                                id="analysis-types-chip"
                                                multiple
                                                size='small'
                                                value={selected_values}
                                                onChange={handleChangeValues}
                                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                                fullWidth
                                            >
                                                {laboratory_options.map((m, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={m.label}
                                                        style={getStyles(m.label, selected_values, theme)}
                                                    >
                                                        {m.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>{t("Select Category")}</Box>
                                            <Button
                                                variant='text'
                                                size='small'
                                                onClick={() => setSelectedCategories([])}
                                            >{t("Clear")}</Button>
                                        </Typography>
                                        <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                            <InputLabel id="analysis-types-chip-label">{t("Category")}</InputLabel>
                                            <Select
                                                labelId="analysis-types-chip-label"
                                                id="analysis-types-chip"
                                                multiple
                                                size='small'
                                                value={selected_categories}
                                                onChange={handleChangeCategory}
                                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                                fullWidth
                                            >
                                                {category_options.map((c, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={c.label}
                                                        style={getStyles(c.label, selected_categories, theme)}
                                                    >
                                                        {c.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>{t("Select Ore")}</Box>
                                            <Button
                                                variant='text'
                                                size='small'
                                                onClick={() => setSelectedOreTypes([])}
                                            >{t("Clear")}</Button>
                                        </Typography>
                                        <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                            <InputLabel id="analysis-types-chip-label">{t("Ore")}</InputLabel>
                                            <Select
                                                labelId="analysis-types-chip-label"
                                                id="analysis-types-chip"
                                                multiple
                                                size='small'
                                                value={selected_oreTypes}
                                                onChange={handleChangeOreType}
                                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                                fullWidth
                                            >
                                                <MenuItem value='all'>ALL</MenuItem>
                                                {oreTypes.map((c, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={c.oreType}
                                                        style={getStyles(c.oreType, selected_oreTypes, theme)}
                                                    >
                                                        {c.oreType}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Typography component="h6">
                                            <Box my={1}>{t("Select Date")}</Box>
                                        </Typography>
                                        <RangePicker
                                            className="w-100"
                                            style={{ minHeight: '38px' }}
                                            // showTime
                                            onChange={(date, dateString) => setDateRange(dateString)}
                                            format={date_format}
                                        />
                                        <Typography component="h6">
                                            <Box my={2}>{t("Select HOLEID")}</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={t("HOLEID")}
                                            variant='outlined'
                                            value={holeId}
                                            onChange={(e) => setHoleId(e.target.value)} />
                                        <Typography component="h6">
                                            <Box my={2}>Select Level</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label={t("Level")}
                                            variant='outlined'
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)} />
                                    </CardContent>
                                </Card>
                            </Grid>
                            {
                                (!pending && chartData?.length > 0) && chartData.map((dataset, index) => {
                                    return (
                                        <Grid item md={6} xs={12} key={index}>
                                            <Card>
                                                <CardContent>
                                                    <Typography textAlign="center" fontSize="24px">{t("Analysis")}</Typography>
                                                    <Typography textAlign="center" fontSize="16px">{dataset?.label}</Typography>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                        <Grid container spacing={2}>
                                                            <Grid item md={6} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box display="flex">
                                                                    <Typography fontSize={14}>Min: {dataset?.y?.length > 0 ? Math.min.apply(Math, dataset?.y) : 0};</Typography>
                                                                    <Typography fontSize={14}>Max: {dataset?.y?.length > 0 ? Math.max.apply(Math, dataset?.y) : 0};</Typography>
                                                                    <Typography fontSize={14}>Average: {dataset?.y?.length > 0 ? Number(Number(dataset?.y.reduce((a, b) => a + b, 0) / dataset?.y?.length).toFixed(2)) : 0}</Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item md={6} xs={12} sx={{ display: 'flex', justifyContent: 'end' }} className="justify-content-xs-start">
                                                                <Box display="flex">
                                                                    <ButtonGroup variant="contained" aria-label="outlined primary button group" size='small'>
                                                                        <Button sx={{ textTransform: 'none', fontSize: '10px', p: '5px', minWidth: '32px !important' }} onClick={() => handleFilterPointer(1, index)}>1W</Button>
                                                                        <Button sx={{ textTransform: 'none', fontSize: '10px', p: '5px', minWidth: '32px !important' }} onClick={() => handleFilterPointer(2, index)}>2W</Button>
                                                                        <Button sx={{ textTransform: 'none', fontSize: '10px', p: '5px', minWidth: '32px !important' }} onClick={() => handleFilterPointer(4, index)}>4W</Button>
                                                                        <Button sx={{ textTransform: 'none', fontSize: '10px', p: '5px', minWidth: '32px !important' }} onClick={() => handleFilterPointer(1000, index)}>Max</Button>
                                                                    </ButtonGroup>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Chart height={300} options={{
                                                        chart: {
                                                            height: 350,
                                                            type: "line",
                                                            zoom: {
                                                                type: "x",
                                                                enabled: true,
                                                                autoScaleYaxis: true,
                                                            },
                                                            animations: {
                                                                enabled: false
                                                            },
                                                            toolbar: {
                                                                autoSelected: "zoom",
                                                                tools: {
                                                                    download: true,
                                                                    selection: true,
                                                                    zoom: true,
                                                                    zoomin: false,
                                                                    zoomout: false,
                                                                    pan: true,
                                                                    reset: true,
                                                                    customIcons: []
                                                                },
                                                                offsetX: 0,
                                                                offsetY: 0,
                                                            },
                                                        },
                                                        colors: ['#8a082e'],
                                                        dataLabels: {
                                                            enabled: false,
                                                        },
                                                        stroke: {
                                                            curve: "straight",
                                                            width: 3,
                                                        },
                                                        xaxis: {
                                                            type: "datetime",
                                                            categories: dataset?.x,
                                                            tooltip: {
                                                                enabled: true,
                                                                formatter: function (val, opts) {
                                                                    return moment(new Date(val)).format(date_format + ' HH:mm:ss');
                                                                }
                                                            },
                                                            labels: {
                                                                formatter: function (val, opts) {
                                                                    return moment(new Date(val)).format('HH:mm:ss');
                                                                },
                                                            }
                                                        },
                                                        tooltip: {
                                                            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                                                                if (dataset?.tooltip?.length === 0) return '';
                                                                let str = '<div class="py-1 px-2" style="background-color: #000000cc; color: white; border-bottom: 1px solid #ddd">' + dataset?.label + ' HOLEID: ' + dataset.hole_id[dataPointIndex] + '</div>';
                                                                dataset?.tooltip[dataPointIndex]
                                                                    .filter((tooltip, index) => {
                                                                        const _str = JSON.stringify(tooltip);
                                                                        return index === dataset?.tooltip[dataPointIndex].findIndex(obj => {
                                                                            return JSON.stringify(obj) === _str;
                                                                        });
                                                                    })
                                                                    .reverse()
                                                                    .map((tooltip, index) => {
                                                                        if (index === 0) {
                                                                            str += '<div class="pb-1 px-2 d-flex align-items-center" style="background-color: #000000cc; color: white"><span style="width: 10px; height: 10px; background-color: #1eb11e"></span>&nbsp;' + tooltip + '</div>';
                                                                        } else {
                                                                            str += '<div class="pb-1 px-2" style="background-color: #000000cc; color: white">' + tooltip + '</div>';
                                                                        }
                                                                    })
                                                                return str;
                                                            },
                                                        },
                                                    }} series={[{
                                                        name: 'Specifications',
                                                        data: dataset?.y
                                                    }]} type="line" />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    )
                }
            </Box>
        </Box>
    )
}


AnalysisLaboratory.getLayout = (page) => (
    <AuthGuard>
        <AdminLayout>
            {page}
        </AdminLayout>
    </AuthGuard>
);
export default AnalysisLaboratory;