import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker as AtndDatePicker } from "antd";
import { CSVLink } from "react-csv";
import { Chart } from '../../components/chart';
import moment from 'moment';

import { AuthGuard } from '../../components/authentication/auth-guard';
import { AdminLayout } from '../../components/admin/admin-layout'
import { getMaterials } from '../../slices/material';
import { getClients } from '../../slices/client';
import { anlysisLaboratoryHeader } from '../../utils/tableHeaders';
import { useTranslation } from 'react-i18next';
import axiosFetch from '../../utils/axiosFetch';
import setAuthToken from '../../utils/setAuthToken';

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
    const csvLink = useRef();
    const { t } = useTranslation();

    const [x_date_format, setXDateFormat] = useState('dd.MM.yyyy');

    const [date_format, setDateFormat] = useState('DD.MM.YYYY');
    const [defaultClient, setDefaultClient] = useState({});
    const [selected_materials, setSelectedMaterials] = useState([]);
    const [selected_clients, setSelectedClients] = useState([]);
    const [selected_combinations, setSelectedCombinations] = useState([]);
    const [date_range, setDateRange] = useState([]);
    const [materialOption, setMaterialOption] = useState([{ label: 'ALL', value: 'all' }]);
    const [clientOption, setClientOption] = useState([]);
    const [combinationOption, setCombinationOption] = useState([]);
    const [datasets, setDataset] = useState([]);
    const [excellData, setExcelData] = useState([]);
    const [pending, setPending] = useState(false);

    const { materials } = useSelector(state => state.material);
    const { clients } = useSelector(state => state.client);

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            setAuthToken(token);

            axiosFetch.get("/get_all_materials")
                .then((res) => {
                    dispatch(getMaterials(res.data.materials));
                    dispatch(getClients(res.data.clients));
                })
                .catch(err => {
                    console.log(err.response.data)
                });

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
        if (clients.length > 0) {
            setDefaultClient(clients.filter(c => c.name === 'Default')[0]);
        }
    }, [clients]);

    useEffect(() => {
        if (materials.length > 0) {
            const options = materials.map(material => {
                return { label: material.material, value: material.material }
            });
            if (materialOption.length === 1) {
                setMaterialOption(materialOption.concat(options));
            }
        }
    }, [materials]);

    useEffect(() => {
        if (selected_combinations.length > 0) {
            getChartData();
        }
    }, [selected_materials, selected_clients, selected_combinations, date_range]);

    const getXAxisDateFormat = (format) => {
        var format = '';
        switch (format) {
            case 'DD.MM.YYYY':
                format = 'dd.MM.yyyy';
                break;
            case 'MM.DD.YYYY':
                format = 'MM.dd.yyyy';
                break;
            case 'DD/MM/YYYY':
                format = 'dd/MM/yyyy';
                break;
            case 'MM/DD/YYYY':
                format = 'MM/dd/yyyy';
                break;
            case 'YYYY-MM-DD':
                format = 'yyyy-MM-dd';
                break;
            case 'YYYY-DD-MM':
                format = 'yyyy-dd-MM';
                break;
            case 'MM-DD-YYYY':
                format = 'MM-dd-yyyy';
                break;
            case 'YYYY/MM/DD':
                format = 'yyyy/MM/dd';
                break;
            default:
                format = 'MM.dd.yyyy';
                break;
        }
        return format;
    }

    const handleChangeMaterial = (e) => {
        let filtered_materials = [];
        var filtered_clients = [];

        if (e.target.value.find(option => option === "ALL")) {
            setSelectedMaterials(materialOption.filter(m => m.value !== 'all').map(m => m.label));
            filtered_materials = materials.filter(m => m.value !== 'Default')
        } else {
            setSelectedMaterials(e.target.value);
            filtered_materials = materials.filter(m => e.target.value.indexOf(m.material) > -1);
        }
        filtered_materials.map((filtered_mat) => {
            filtered_mat.clients.map(client => {
                if (filtered_clients.indexOf(client) === -1) {
                    filtered_clients.push(client)
                }
            })
        });

        var client_options = []
        client_options.push({ label: 'ALL', value: 'all' });
        client_options.push({ label: 'Default', value: defaultClient._id });
        filtered_clients.map(c => {
            client_options.push({ label: c.name, value: c._id })
        });
        setClientOption(client_options);
        setSelectedClients([]);
        // const avaiable_a_types = filtered_materials.map(filtered_mat => filtered_mat.aTypesValues);
    }

    const handleChangeClient = (e) => {
        let filtered_clients = [];
        if (e.target.value.find(option => option === "ALL")) {
            setSelectedClients(clientOption.filter(m => m.value !== 'all').map(m => m.label));
            filtered_clients = clientOption.filter(c => c.value !== 'all').map(c => c.label);
        } else {
            setSelectedClients(e.target.value);
            filtered_clients = e.target.value;
        }
        var data = {
            client: clients.filter(c => filtered_clients.indexOf(c.name) > -1).map(c => c._id),
            material: selected_materials,
        }
        axiosFetch.post("/get_available_analysis_type", { data })
            .then((res) => {
                let obj_list = []
                res.data.objValues.map((obj, index) => {
                    obj_list.push({
                        material_id: res.data.material_ids[index],
                        analysisId: obj.analysis,
                        analysis: res.data.analysisTypes.filter(aT => aT._id === obj.analysis)[0].analysisType,
                        objectiveId: obj.id,
                        objective: res.data.objectives.filter(o => o._id === obj.id)[0].objective,
                        unitId: obj.unit,
                        unit: res.data.units.filter(u => u._id === obj.unit)[0].unit,
                        clientId: obj.client,
                    })
                })

                var result = obj_list.reduce((unique, o) => {
                    if (!unique.some(obj => obj.analysisId === o.analysisId && obj.objectiveId === o.objectiveId && obj.unitId === o.unitId)) {
                        unique.push(o);
                    }
                    return unique;
                }, []);
                setCombinationOption(result);
            });
    }

    const handleSelectCombinations = (e) => {
        if (e.target.value.indexOf('all') > -1) {
            setSelectedCombinations(combinationOption.map(item => item.analysis + '-' + item.objective + ' ' + item.unit));
        } else {
            setSelectedCombinations(e.target.value);
        }
    }

    const getChartData = async () => {
        var data = {
            combinations: combinationOption
                .filter(c => selected_combinations.indexOf(c.analysis + '-' + c.objective + ' ' + c.unit) > -1)
                .map(c => c.analysisId + '-' + c.objectiveId + '-' + c.unitId + '-' + c.material_id + '-' + c.clientId),       //aType-objective-unit-material-client
            dateRange: date_range.length > 0 ? (date_range[0] === '' && date_range[1] === '') ? [] : date_range : date_range,
            client: clients.filter(c => selected_clients.indexOf(c.name) > -1).map(c => c._id),
            material: selected_materials,
        }
        var token = localStorage.getItem("accessToken");
        try {
            setPending(true);
            const res = await axiosFetch.post("/get_graph_data", { data, token: token });
            var chart_info = [];
            var export_all_data = [];
            await Promise.all(res.data.map(item => {
                let y_axis = [];
                let y_tooltip = [];
                let x_axis = [];
                let tooltip_materials = [];
                let tooltip_clients = [];
                let temp_tooltip_list = [];
                let lot_numbers = [];
                let actual_weights = [];
                let tooltip_list_dates = [];
                let tooltip_list_values = [];

                const historical_values = getHistoricalValues(item.history);
                historical_values.sorted_hist.map((hh, i) => {
                    temp_tooltip_list = historical_values.history_list[i].map(hhh => hhh.value + " " + hhh.user.userName + " " + moment(hhh.date).format(date_format + ' HH:mm:ss') + " " + hhh.reason).reverse();
                    tooltip_list_dates.push(historical_values.history_list[i].map(hhh => moment(hhh.date).format(date_format + ' HH:mm:ss')).reverse());
                    tooltip_list_values.push(historical_values.history_list[i].map(hhh => hhh.value).reverse());

                    y_axis.push(hh.value);
                    y_tooltip.push(temp_tooltip_list);
                    x_axis.push(moment(hh.date).format(date_format + ' HH:mm:ss'));
                    tooltip_materials.push(materials.filter(m => m._id === hh.labId.material)[0].material);
                    tooltip_clients.push(clients.filter(c => c._id === hh.labId.client)[0].name);
                    lot_numbers.push(hh.labId.charge.length > 0 ? moment(hh.labId.charge[hh.labId.charge.length - 1].date).format(date_format + ' HH:mm:ss') : '');
                    actual_weights.push(hh.labId.weight);
                    return true;
                });

                let label = combinationOption.filter(com => item.combination.indexOf(com.analysisId + '-' + com.objectiveId + '-' + com.unitId + '-' + com.material_id + '-' + com.clientId) > -1)
                    .map(c => c.analysis + '-' + c.objective + ' ' + c.unit).join('');

                let randomColor = Math.floor(Math.random() * 16777215).toString(16);

                y_axis.map((row, i) => {
                    export_all_data.push({
                        c_date: tooltip_list_dates[i].length > 0 ? tooltip_list_dates[i][0] : '',
                        charge: lot_numbers[i],
                        client: tooltip_clients[i],
                        combination: label.replace('-', ' / '),
                        his_date_1: tooltip_list_dates[i].length > 1 ? tooltip_list_dates[i][1] : '',
                        his_date_2: tooltip_list_dates[i].length > 2 ? tooltip_list_dates[i][2] : '',
                        his_date_3: tooltip_list_dates[i].length > 3 ? tooltip_list_dates[i][3] : '',
                        his_date_4: tooltip_list_dates[i].length > 4 ? tooltip_list_dates[i][4] : '',
                        his_date_5: tooltip_list_dates[i].length > 5 ? tooltip_list_dates[i][5] : '',
                        his_date_6: tooltip_list_dates[i].length > 6 ? tooltip_list_dates[i][6] : '',
                        his_date_7: tooltip_list_dates[i].length > 7 ? tooltip_list_dates[i][7] : '',
                        his_val_1: tooltip_list_values[i].length > 1 ? tooltip_list_values[i][1] : '',
                        his_val_2: tooltip_list_values[i].length > 2 ? tooltip_list_values[i][2] : '',
                        his_val_3: tooltip_list_values[i].length > 3 ? tooltip_list_values[i][3] : '',
                        his_val_4: tooltip_list_values[i].length > 4 ? tooltip_list_values[i][4] : '',
                        his_val_5: tooltip_list_values[i].length > 5 ? tooltip_list_values[i][5] : '',
                        his_val_6: tooltip_list_values[i].length > 6 ? tooltip_list_values[i][6] : '',
                        his_val_7: tooltip_list_values[i].length > 7 ? tooltip_list_values[i][7] : '',
                        limitValue: row,
                        material: tooltip_materials[i],
                        weight: actual_weights[i],
                    })
                })

                chart_info.push({
                    backgroundColor: '#' + randomColor,
                    borderColor: '#' + randomColor,
                    fill: false,
                    label: label.replace('-', ' / '),
                    lineTension: 0,
                    borderWidth: 1,
                    data: y_axis,
                    tooltip: y_tooltip,
                    x_axis: x_axis,
                    tooltip_materials: tooltip_materials,
                    tooltip_clients: tooltip_clients,
                    lot_numbers: lot_numbers,
                    weights: actual_weights,
                    tooltip_list_dates: tooltip_list_dates,
                    tooltip_list_values: tooltip_list_values
                })
            }));

            setTimeout(() => {
                setDataset(chart_info);
                setExcelData(export_all_data);
                setPending(false);
            }, 1000);
        } catch (err) {
            setPending(false);
            console.log(err)
        }
    }

    const getHistoricalValues = (history_info) => {
        let temp_history_list = [];
        let history_list = [];
        let correctValues = [];
        for (let j = 0; j < history_info.length; j++) {
            temp_history_list = [];
            const sorted_histories = history_info[j].sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1
            })
            for (let i = 0; i < sorted_histories.length; i++) {
                if (i === sorted_histories.length - 1) {
                    if (sorted_histories[i].reason === "Mehrfach-Probe") {
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                        temp_history_list.push(sorted_histories[i]);
                        history_list.push(temp_history_list);
                        correctValues.push(sorted_histories[i - 1]);
                    } else {
                        temp_history_list.push(sorted_histories[i]);
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                    }
                    correctValues.push(sorted_histories[i]);
                } else {
                    if (sorted_histories[i].reason !== "Mehrfach-Probe") {
                        temp_history_list.push(sorted_histories[i]);
                        continue;
                    } else {
                        history_list.push(temp_history_list);
                        temp_history_list = [];
                        temp_history_list.push(sorted_histories[i]);
                        correctValues.push(sorted_histories[i - 1]);
                    }
                }
            }
        }
        const sorted_list1 = correctValues.sort((a, b) => {
            return new Date(a.date) > new Date(b.date) ? 1 : -1
        });
        const sorted_list2 = history_list.sort((a, b) => {
            return new Date(a[a.length - 1].date) > new Date(b[b.length - 1].date) ? 1 : -1
        })
        return { sorted_hist: sorted_list1, history_list: sorted_list2 };
    }

    const handleFilterPointer = async (dType, index) => {
        var to = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
        var from = moment(to).subtract(7 * dType, 'days').format('YYYY-MM-DD');
        var data = {
            combinations: [combinationOption
                .filter(c => selected_combinations.indexOf(c.analysis + '-' + c.objective + ' ' + c.unit) > -1)
                .map(c => c.analysisId + '-' + c.objectiveId + '-' + c.unitId + '-' + c.material_id + '-' + c.clientId)[index]],       //aType-objective-unit-material-client
            dateRange: [from, to],
            client: clients.filter(c => selected_clients.indexOf(c.name) > -1).map(c => c._id),
            material: selected_materials,
        }
        var token = localStorage.getItem("accessToken");
        try {
            const res = await axiosFetch.post("/get_graph_data", { data, token: token });
            var chart_info = [];
            var export_all_data = [];
            res.data.map(item => {

                let y_axis = [];
                let y_tooltip = [];
                let x_axis = [];
                let tooltip_materials = [];
                let tooltip_clients = [];
                let temp_tooltip_list = [];
                let lot_numbers = [];
                let actual_weights = [];
                let tooltip_list_dates = [];
                let tooltip_list_values = [];

                const historical_values = getHistoricalValues(item.history);
                historical_values.sorted_hist.map((hh, i) => {
                    temp_tooltip_list = historical_values.history_list[i].map(hhh => hhh.value + " " + hhh.user.userName + " " + moment(hhh.date).format(date_format + ' HH:mm:ss') + " " + hhh.reason).reverse();
                    tooltip_list_dates.push(historical_values.history_list[i].map(hhh => moment(hhh.date).format(date_format + ' HH:mm:ss')).reverse());
                    tooltip_list_values.push(historical_values.history_list[i].map(hhh => hhh.value).reverse());

                    y_axis.push(hh.value);
                    y_tooltip.push(temp_tooltip_list);
                    x_axis.push(moment(hh.date).format(date_format + ' HH:mm:ss'));
                    tooltip_materials.push(materials.filter(m => m._id === hh.labId.material)[0].material);
                    tooltip_clients.push(clients.filter(c => c._id === hh.labId.client)[0].name);
                    lot_numbers.push(hh.labId.charge.length > 0 ? moment(hh.labId.charge[hh.labId.charge.length - 1].date).format(date_format + ' HH:mm:ss') : '');
                    actual_weights.push(hh.labId.weight);
                    return true;
                });

                let label = combinationOption.filter(com => item.combination.indexOf(com.analysisId + '-' + com.objectiveId + '-' + com.unitId + '-' + com.material_id + '-' + com.clientId) > -1)
                    .map(c => c.analysis + '-' + c.objective + ' ' + c.unit).join('');

                let randomColor = Math.floor(Math.random() * 16777215).toString(16);
                chart_info.push({
                    backgroundColor: '#' + randomColor,
                    borderColor: '#' + randomColor,
                    fill: false,
                    label: label.replace('-', ' / '),
                    lineTension: 0,
                    borderWidth: 1,
                    data: y_axis,
                    tooltip: y_tooltip,
                    x_axis: x_axis,
                    tooltip_materials: tooltip_materials,
                    tooltip_clients: tooltip_clients,
                    lot_numbers: lot_numbers,
                    weights: actual_weights,
                    tooltip_list_dates: tooltip_list_dates,
                    tooltip_list_values: tooltip_list_values
                })
            });

            chart_info.map(chart => {
                chart.data.map((row, i) => {
                    export_all_data.push({
                        c_date: chart.tooltip_list_dates[i].length > 0 ? chart.tooltip_list_dates[i][0] : '',
                        charge: chart.lot_numbers[i],
                        client: chart.tooltip_clients[i],
                        combination: chart.label,
                        his_date_1: chart.tooltip_list_dates[i].length > 1 ? chart.tooltip_list_dates[i][1] : '',
                        his_date_2: chart.tooltip_list_dates[i].length > 2 ? chart.tooltip_list_dates[i][2] : '',
                        his_date_3: chart.tooltip_list_dates[i].length > 3 ? chart.tooltip_list_dates[i][3] : '',
                        his_date_4: chart.tooltip_list_dates[i].length > 4 ? chart.tooltip_list_dates[i][4] : '',
                        his_date_5: chart.tooltip_list_dates[i].length > 5 ? chart.tooltip_list_dates[i][5] : '',
                        his_date_6: chart.tooltip_list_dates[i].length > 6 ? chart.tooltip_list_dates[i][6] : '',
                        his_date_7: chart.tooltip_list_dates[i].length > 7 ? chart.tooltip_list_dates[i][7] : '',
                        his_val_1: chart.tooltip_list_values[i].length > 1 ? chart.tooltip_list_values[i][1] : '',
                        his_val_2: chart.tooltip_list_values[i].length > 2 ? chart.tooltip_list_values[i][2] : '',
                        his_val_3: chart.tooltip_list_values[i].length > 3 ? chart.tooltip_list_values[i][3] : '',
                        his_val_4: chart.tooltip_list_values[i].length > 4 ? chart.tooltip_list_values[i][4] : '',
                        his_val_5: chart.tooltip_list_values[i].length > 5 ? chart.tooltip_list_values[i][5] : '',
                        his_val_6: chart.tooltip_list_values[i].length > 6 ? chart.tooltip_list_values[i][6] : '',
                        his_val_7: chart.tooltip_list_values[i].length > 7 ? chart.tooltip_list_values[i][7] : '',
                        limitValue: row,
                        material: chart.tooltip_materials[i],
                        weight: chart.weights[i],
                    })

                })
            })
            setDataset(dataset.map((d, i) => i === index ? chart_info[0] : d));
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Box>
            <Head>
                <title>
                    Analysis | Laboratory
                </title>
            </Head>
            <Box>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>Select materials</Box>
                                    <Button
                                        variant='text'
                                        size='small'
                                        onClick={() => setSelectedMaterials([]) & setClientOption([]) & setSelectedClients([]) & setCombinationOption([]) & setSelectedCombinations([])}
                                    >Clear</Button>
                                </Typography>
                                <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                    <InputLabel id="analysis-types-chip-label">Material</InputLabel>
                                    <Select
                                        labelId="analysis-types-chip-label"
                                        id="analysis-types-chip"
                                        multiple
                                        size='small'
                                        value={selected_materials}
                                        onChange={handleChangeMaterial}
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
                                        {materialOption.map((m, index) => (
                                            <MenuItem
                                                key={index}
                                                value={m.label}
                                                style={getStyles(m.label, selected_materials, theme)}
                                            >
                                                {m.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>Select clients</Box>
                                    <Button
                                        variant='text'
                                        size='small'
                                        onClick={() => setSelectedClients([]) & setCombinationOption([])}
                                    >Clear</Button>
                                </Typography>
                                <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                    <InputLabel id="analysis-types-chip-label">Client</InputLabel>
                                    <Select
                                        labelId="analysis-types-chip-label"
                                        id="analysis-types-chip"
                                        multiple
                                        size='small'
                                        value={selected_clients}
                                        onChange={handleChangeClient}
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
                                        {clientOption.map((c, index) => (
                                            <MenuItem
                                                key={index}
                                                value={c.label}
                                                style={getStyles(c.label, selected_clients, theme)}
                                            >
                                                {c.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography component="h6" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>Select Analysis Type/Objective combinations</Box>
                                    <Button
                                        variant='text'
                                        size='small'
                                        onClick={() => setSelectedCombinations([])}
                                    >Clear</Button>
                                </Typography>
                                <FormControl size='small' sx={{ my: 1 }} fullWidth>
                                    <InputLabel id="analysis-types-chip-label">Combination</InputLabel>
                                    <Select
                                        labelId="analysis-types-chip-label"
                                        id="analysis-types-chip"
                                        multiple
                                        size='small'
                                        value={selected_combinations}
                                        onChange={handleSelectCombinations}
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
                                        <MenuItem
                                            value='all'
                                        >
                                            ALL
                                        </MenuItem>
                                        {combinationOption
                                            .map((item) => {
                                                return {
                                                    label: item.analysis + '-' + item.objective + ' ' + item.unit,
                                                    value: item.analysisId + '-' + item.objectiveId + '-' + item.unitId + '-' + item.material_id + '-' + item.clientId
                                                }
                                            }).map((c, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={c.label}
                                                    style={getStyles(c.label, selected_combinations, theme)}
                                                >
                                                    {c.label}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <Typography component="h6">
                                    <Box my={1}>Select Charge Range</Box>
                                </Typography>
                                <RangePicker
                                    className="w-100"
                                    style={{ minHeight: '38px' }}
                                    // showTime
                                    onChange={(date, dateString) => setDateRange(dateString)}
                                    format={date_format}
                                />
                                <Box pt={2} textAlign='right'>
                                    <Button variant='contained' onClick={() => csvLink.current.link.click()}>
                                        <DownloadIcon />&nbsp;{t('Export')}
                                    </Button>
                                    <CSVLink
                                        headers={anlysisLaboratoryHeader}
                                        filename="Export-LIMS.csv"
                                        data={excellData}
                                        ref={csvLink}
                                    ></CSVLink>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {
                        (!pending && datasets.length > 0) && datasets.map((dataset, index) => {
                            return <Grid item xs={12} md={6} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography textAlign="center" fontSize="24px">Analysis</Typography>
                                        <Typography textAlign="center" fontSize="16px">{dataset.label}</Typography>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Grid container spacing={2}>
                                                <Grid item md={6} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box display="flex">
                                                        <Typography fontSize={14}>Min: {dataset.data.length > 0 ? Math.min.apply(Math, dataset.data) : 0};</Typography>
                                                        <Typography fontSize={14}>Max: {dataset.data.length > 0 ? Math.max.apply(Math, dataset.data) : 0};</Typography>
                                                        <Typography fontSize={14}>Average: {dataset.data.length > 0 ? Number(dataset.data.reduce((a, b) => a + b, 0) / dataset.data.length).toFixed(2) : 0}</Typography>
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
                                            colors: [dataset.borderColor],
                                            dataLabels: {
                                                enabled: false,
                                            },
                                            stroke: {
                                                curve: "straight",
                                                width: 3,
                                            },
                                            xaxis: {
                                                type: "datetime",
                                                categories: dataset.x_axis,
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
                                                    // hideOverlappingLabels: false,
                                                    // datetimeUTC: true.valueOf,
                                                    // format: getXAxisDateFormat(date_format) + ' HH:mm:ss',
                                                    // datetimeFormatter: {
                                                    //     year: 'yyyy',
                                                    //     month: 'MMM \'yyyy',
                                                    //     day: 'dd MMM',
                                                    //     hour: 'HH:mm'
                                                    // }
                                                }
                                            },
                                            tooltip: {
                                                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                                                    if (dataset.tooltip.length === 0 || dataset.tooltip_materials.length === 0 || dataset.tooltip_clients.length === 0) return '';
                                                    let str = '<div class="py-1 px-2" style="background-color: #000000cc; color: white; border-bottom: 1px solid #ddd">(' + dataset.label + ') ' + dataset.tooltip_materials[dataPointIndex] + ' ' + dataset.tooltip_clients[dataPointIndex] + '</div>';
                                                    dataset.tooltip[dataPointIndex].map((tooltip, index) => {
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
                                            data: dataset?.data.length > 0 ? dataset?.data : []
                                        }]} type="line" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        })
                    }
                </Grid>
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