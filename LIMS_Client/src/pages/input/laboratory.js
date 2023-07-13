import * as React from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { makeStyles } from '@mui/styles';
import { Box, Button, ButtonGroup, FormControl, MenuItem, Select, TextField, SwipeableDrawer, Card, Grid, List, ListItem, ListItemButton, ListItemText, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CSVLink } from "react-csv";
import ReactFileReader from 'react-file-reader';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { ServerUri } from "../../config";
import fileDownload from 'js-file-download';
import Papa from 'papaparse';

import { createLaboratory, deleteLaboratory, getCertificateTemplateList, getInputLaboratoryData, saveAnalysisType, saveStockData, uploadFile } from '../../slices/laboratory';
import { InputLaboratoryHeader, input_laboratory_excel_header } from '../../utils/tableHeaders';
import InputLaboratoryModal from '../../components/lims-modals/InputLaboratoryModal';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { AdminLayout } from '../../components/admin/admin-layout'
import { setUser } from '../../slices/auth';
import InputClientModal from '../../components/lims-modals/InputClientModal';
import InputWeightModal from '../../components/lims-modals/InputWeightModal';
import InputLotNumberModal from '../../components/lims-modals/InputLotNumberModal';
import InputAnalysisTypeModal from '../../components/lims-modals/InputAnalysisTypeModal';
import { processData } from '../../utils/readFile';
import InputImportCSVModal from '../../components/lims-modals/InputImportCSVModal';
import InputStockSampleModal from '../../components/lims-modals/InputStockSampleModal';
import setAuthToken from '../../utils/setAuthToken';
import { authApi } from '../../api/auth-api';
import axiosFetch from '../../utils/axiosFetch';
import axios from "axios";


const useStyles = makeStyles(theme => ({
    pagination: {
        '&.MuiTablePagination-root p': {
            marginBottom: 0
        }
    },
    paper: {
        width: '75%',
        marginTop: '64px'
    }
}))

const InputLaboratory = () => {

    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const csvLink = React.useRef();
    const fileRef = React.useRef();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [open, setOpen] = React.useState(false);
    const [openClientModal, setOpenClientModal] = React.useState(false);
    const [openWeightModal, setOpenWeightModal] = React.useState(false);
    const [openChargeModal, setOpenChargeModal] = React.useState(false);
    const [openCSVModal, setOpenCSVModal] = React.useState(false);
    const [openCertificate, setOpenCertificate] = React.useState(false);
    const [openAnalysisTypeModal, setOpenAnalysisTypeModal] = React.useState(false);
    const [not_show_closed, setNotShowClosed] = React.useState(false);
    const [openStockModal, setOpenStockModal] = React.useState(false);
    const [id, setId] = React.useState('');
    const [search_analysisType, setSearchAnalysisType] = React.useState('');
    const [sameId, setSameId] = React.useState(false);
    const [selected_aType, setSelectedAType] = React.useState('');
    const [selected_cType, setSelectedCType] = React.useState('');
    const [pdfData, setPdfData] = React.useState([]);
    const [pdfColumns, setPdfColumns] = React.useState([]);
    const [rowId, setRowId] = React.useState('');
    const [importedFile, setImportedFile] = React.useState(null);
    const [parsedCSVHeader, setParsedCSVHeader] = React.useState([]);
    const [parsedCSVRow, setParsedCSVRow] = React.useState([]);
    const [filteredTableData, setFilteredTableData] = React.useState([]);
    const [tableRows, setTableRows] = React.useState([]);
    const [sort_status, setSortStatus] = React.useState({
        due_date: false,
        sample_type: false,
        material: false,
        material_category: false,
        client: false,
        packing_type: false,
        analysis_type: false,
        certificate: false,
        sending_date: false,
        sample_date: false,
        weight: false,
        material_left: false,
        lot_number: false,
        stock_sample: false,
        remark: false,
        pos_id: false
    })

    const { laboratories, export_all_data } = useSelector(state => state.laboratory);
    const { analysisTypes } = useSelector(state => state.analysisType);
    const { certificateTypes } = useSelector(state => state.certificateType);
    const { isAuthenticated } = useSelector(state => state.auth);
    const { settings } = useSelector(state => state.setting);
    const { materials } = useSelector(state => state.material);
    const { certificateTemplates } = useSelector(state => state.certificateTemplate);
    const { objectives } = useSelector(state => state.objective);
    const { units } = useSelector(state => state.unit);
    const { sampleTypes } = useSelector(state => state.sampleType);

    React.useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                setAuthToken(token);
                const user = await authApi.me(token);
                dispatch(setUser(user));
            }
        }
        checkAuth();
    }, []);

    React.useEffect(() => {
        if (isAuthenticated) {
            dispatch(getInputLaboratoryData());
        }
    }, [dispatch, isAuthenticated]);

    React.useEffect(() => {
        if (laboratories.length > 0) {
            setFilteredTableData(laboratories);
        } else {
            setFilteredTableData([]);
        }
    }, [laboratories]);

    React.useEffect(() => {
        setTableRows(filteredTableData);
    }, [filteredTableData]);

    React.useEffect(() => {
        setTableRows(not_show_closed ? filteredTableData.filter(dd => dd.download_status.filter(status => status.status === 0).length > 0) : filteredTableData)
    }, [not_show_closed]);

    const createPDF = (pdfdata, pdfcolumns) => {
        axiosFetch.post("api/inputLabs/createPDF", { pdfdata, pdfcolumns })
            .catch(err => {
                toast.error("Error in Communication with the PDF Engine: " + err);
            })
            //.then(res =>{
            //   const file = new Blob([res.data], {type: "application/pdf;charset=utf-8"});
            //  FileSaver.saveAs(file, "certificate.pdf");
            // })
            .then(res => {
                if (res.status === 200) downloadPDF();
            })
    }

    const downloadPDF = async () => {
        try {
            const res = await axios.get(ServerUri + '/api/inputLabs/downloadPDF', { responseType: 'blob' });

            fileDownload(res.data, 'certificate.pdf');

            const requestData = {
                labId: id,
                cType: selected_cType._id
            }
            await axiosFetch.post('/api/inputLabs/download_status', requestData);
            dispatch(getInputLaboratoryData());
        } catch (err) {
            console.log(err);
        }
    }

    const handleCreate = async (data) => {
        try {
            const _data = {
                ...data,
                labs: {
                    ...data.labs,
                    aType: analysisTypes.filter(aT => data.labs.aType.indexOf(aT.analysisType) > -1).map(aT => {
                        return { label: aT.analysisType, value: aT._id }
                    }),
                    cType: certificateTypes.filter(cT => data.labs.cType.indexOf(cT.certificateType) > -1).map(cT => {
                        return { label: cT.certificateType, value: cT._id }
                    })
                }
            }
            dispatch(createLaboratory(_data));
            setOpen(false);
        } catch (err) {
            toast.error('error');
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Do you really want to delete current row?')) {
            dispatch(deleteLaboratory(id));
        }
    }

    const handleFiles = async (files) => {
        try {
            var reader = new FileReader();
            reader.readAsText(files[0]);
            const result = await new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    resolve(reader.result);
                }
            });

            dispatch(uploadFile(result));
        } catch (err) {
            console.log(err);
            toast.error('File import error');
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleClickAnalysisTypeColumn = (_id, _aType, _rowId) => {
        setId(_id);
        setSelectedAType(_aType);
        setRowId(_rowId);
        setOpenAnalysisTypeModal(true);
    }

    const handleSaveAnalysisType = (data) => {
        dispatch(saveAnalysisType(data));
        setOpenAnalysisTypeModal(false);
    }

    const handleClickCertificate = async (data, cType) => {
        try {
            if (data.charge.length === 0 || data.weight === 0) return;
            dispatch(getCertificateTemplateList())

            setId(data._id);
            setOpenCertificate(true);
            setSelectedCType(cType);
            setPdfData([]);
        } catch (err) {
            console.log(err)
        }
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];

        setImportedFile(file);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            encoding: 'ISO-8859-1',
            complete: function (results) {
                setParsedCSVRow(results.data);
                setParsedCSVHeader(results.meta.fields);
                setOpenCSVModal(true);
            },
        });
    }

    const importCSV = async () => {
        if (window.confirm(`Current date format is ${settings.date_format}. If the date format does not match, it will happed some errors when importing CSV file. Do you really import file?`)) {
            var reader = new FileReader();
            reader.readAsText(importedFile);
            const result = await new Promise((resolve, reject) => {
                reader.onload = function (e) {
                    resolve(reader.result);
                }
            })
            axiosFetch.post("/api/inputLabs/importCSV", { parsedCSVHeader, parsedCSVRow })
                .then(res => {
                    if (res.data.invalidRows.length > 0) {
                        alert(`The basic data of packing_type or material or client are not inputed in line ${res.data.invalidRows.toString()}`)
                    }
                    if (res.data.success) {
                        toast.success('Import success!');
                        dispatch(getInputLaboratoryData());
                    }
                    setOpenCSVModal(false);
                    setParsedCSVHeader([]);
                    setParsedCSVRow([]);
                    setImportedFile(null);

                    fileRef.current.value = "";
                }).catch(err => {
                    setOpenCSVModal(false);
                    setParsedCSVHeader([]);
                    setParsedCSVRow([]);
                    setImportedFile(null);

                    fileRef.current.value = "";
                    toast.error('Date format does not match')
                    console.log(err.response.data)
                })
        }
    }

    const getAnalysisType = (mid, cid) => {
        const client_array = [cid];
        const aTypes = materials.filter(material => material._id === mid)[0]
            .aTypesValues.filter(aT => client_array.includes(aT.client))
            .map(data => data.value);
        let uniqueaTypes = [...new Set(aTypes)];
        return uniqueaTypes;
    }

    function getHistoricalValue(history_info) {
        const sorted_histories = history_info.sort((a, b) => {
            return new Date(a.date) > new Date(b.date) ? 1 : -1
        })
        // if (sorted_histories.filter(hist => hist.reason === "Mehrfach-Probe").length === 0) {
        //     return sorted_histories[sorted_histories.length - 1].value;
        // }
        let correctValues = [];
        for (let i = 0; i < sorted_histories.length; i++) {
            if (i === sorted_histories.length - 1) {
                if (sorted_histories[i].reason === "Mehrfach-Probe") {
                    correctValues.push(sorted_histories[i - 1].value);
                }
                correctValues.push(sorted_histories[i].value);
            } else {
                if (sorted_histories[i].reason !== "Mehrfach-Probe") {
                    continue;
                } else {
                    correctValues.push(sorted_histories[i - 1].value);
                }
            }
        }
        const retValue = Number(correctValues.reduce((a, b) => a + b, 0) / correctValues.length).toFixed(2);
        return retValue;
    }

    const getCertificateData = async (row) => {
        try {
            const input_Ids = [id];
            laboratories.filter(d => d.sample_type.stockSample === true && d.material._id === laboratories.filter(d => d._id === id)[0].material._id)
                .filter(dd => laboratories.filter(d => d._id === id)[0].stock_weights.filter(ii => ii.stock === dd._id).length > 0)
                .map(data => {
                    input_Ids.push(data._id)
                });
            const columns = [];
            const pdf_data = [];
            await Promise.all(input_Ids.map(async (id) => {
                const selectedInputLab = laboratories.filter(d => d._id === id)[0];
                const pdfData = {};

                const clientData = await axiosFetch.get(`/api/clients/${selectedInputLab.material_category._id}`);

                pdfData.filename = selected_cType.certificateType;
                pdfData.date = moment(selectedInputLab.sample_date).format(row.date_format);
                pdfData.productName = row.productdata.productTitle;
                pdfData.freetext = row.freetext;
                pdfData.address = {
                    name: selectedInputLab.material_category.name,
                    addressB: clientData.data.addressB,
                    zipcodeB: clientData.data.zipCodeB,
                    cityB: clientData.data.cityB,
                    address2B: clientData.data.address2B,
                    country: clientData.data.countryB
                };
                pdfData.header_styles = row.header_styles;
                pdfData.footer_styles = row.footer_styles;
                pdfData.c_title = row.certificatetitle;
                pdfData.footer = row.footer_filename;
                pdfData.logo = row.logo_filename;
                pdfData.place = row.place;

                pdfData.productData = row.productdata.productData.filter(pD => pD.name !== '')
                    .map(d => {
                        let fieldValue = '';
                        if (d.pagename === 0) {
                            switch (d.fieldname) {
                                case 'due_date':
                                    fieldValue = moment(selectedInputLab.due_date).format(row.date_format);
                                    break;
                                case 'sample_type':
                                    fieldValue = selectedInputLab.sample_type.sampleType;
                                    break;
                                case 'material':
                                    fieldValue = selectedInputLab.material.material;
                                    break;
                                case 'client':
                                    fieldValue = selectedInputLab.material_category.name;
                                    break;
                                case 'packing_type':
                                    fieldValue = selectedInputLab.packing_type.map(pType => pType.packingType + ', ');
                                    break;
                                case 'a_types':
                                    const a_types = getAnalysisType(selectedInputLab.material._id, selectedInputLab.material_category._id);
                                    fieldValue = analysisTypes.filter(aT => a_types.includes(aT._id))
                                        .map(aType => aType.analysisType + ', ');
                                    break;
                                case 'c_types':
                                    // const default_client = defaultClient._id;
                                    // const c_types = certificateTypes
                                    //     .filter(cType => cType.material === selectedInputLab.material._id && cType.client === default_client)
                                    //     .map(data => data.certificateType);
                                    // fieldValue = selectedInputLab.c_types.map(cType => cType.certificateType + ', ').concat(c_types + ', ');
                                    fieldValue = selectedInputLab.c_types.map(cType => cType.certificateType + ', ');
                                    fieldValue = [...new Set(fieldValue)];
                                    break;
                                case 'sending_date':
                                    fieldValue = moment(selectedInputLab.sending_date).format(row.date_format);
                                    break;
                                case 'sample_date':
                                    fieldValue = moment(selectedInputLab.sample_date).format(row.date_format);
                                    break;
                                case 'distributor':
                                    fieldValue = selectedInputLab.distributor;
                                    break;
                                case 'geo_location':
                                    fieldValue = selectedInputLab.geo_locaion;
                                    break;
                                case 'remark':
                                    fieldValue = selectedInputLab.remark;
                                    break;
                                case 'weight':
                                    fieldValue = selectedInputLab.weight;//selectedInputLab.sample_type.sampleType ? selectedInputLab.weight - selectedInputLab.material_left : selectedInputLab.weight;
                                    break;
                                case 'lot_number':
                                    fieldValue = selectedInputLab.charge.map(c => moment(c.date).format(row.date_format)).toString();
                                    break;
                                case 'delivering_address_name1':
                                    fieldValue = selectedInputLab.delivery.name1;
                                    break;
                                case 'delivering_address_name2':
                                    fieldValue = selectedInputLab.delivery.name2;
                                    break;
                                case 'delivering_address_name3':
                                    fieldValue = selectedInputLab.delivery.name3;
                                    break;
                                case 'delivering_address_title':
                                    fieldValue = selectedInputLab.delivery.title;
                                    break;
                                case 'delivering_address_country':
                                    fieldValue = selectedInputLab.delivery.country;
                                    break;
                                case 'delivering_address_street':
                                    fieldValue = selectedInputLab.delivery.street;
                                    break;
                                case 'delivering_address_zip':
                                    fieldValue = selectedInputLab.delivery.zipCode;
                                    break;
                                case 'delivering_customer_product_code':
                                    fieldValue = selectedInputLab.delivery.productCode;
                                    break;
                                case 'delivering_email_address':
                                    fieldValue = selectedInputLab.delivery.email;
                                    break;
                                case 'delivering_fetch_date':
                                    fieldValue = selectedInputLab.delivery.fetchDate;
                                    break;
                                case 'delivering_order_id':
                                    fieldValue = selectedInputLab.delivery.orderId;
                                    break;
                                case 'delivering_pos_id':
                                    fieldValue = selectedInputLab.delivery.posId;
                                    break;
                                case 'delivering_w_target':
                                    fieldValue = selectedInputLab.delivery.w_target;
                                    break;
                                case 'productCode':
                                    fieldValue = selectedInputLab.delivery.productCode;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return {
                            name: d.name,
                            value: d.pagename === 0 ? (
                                fieldValue
                            ) : (
                                d.pagename === 1 ? (
                                    d.fieldname == 'objectives'
                                        ? selected_cType.analysises.map(aT => aT.objectives.map(obj => objectives.filter(o => o._id === obj.id)[0].objective + "-" + units.filter(u => u._id === obj.unit)[0].unit + ", "))
                                        : selected_cType.analysises.map(aT => {
                                            return analysisTypes.filter(aType => String(aType._id) === String(aT.id))[0][d.fieldname] + ', '
                                        })
                                ) : (
                                    selectedInputLab.material_category[d.fieldname]
                                )

                            )
                        }
                    })

                let cert_array = [];
                const certificate = selected_cType.analysises;
                certificate.map(c => c.objectives.map(obj => cert_array.push(obj)));
                const analysisIds = selectedInputLab.a_types.map(aT => aT._id);
                const rowObjectives = materials.filter(m => m._id === selectedInputLab.material._id)[0]
                    .objectiveValues.filter(obj => obj.client === selectedInputLab.material_category._id && analysisIds.indexOf(obj.analysis) > -1);

                const filtered_certs = rowObjectives.filter(rObj => cert_array.filter(c => c.id === rObj.id && c.unit === rObj.unit).length > 0);

                try {
                    const data = {
                        labId: id,
                        analysisIds: filtered_certs.map(d => d.analysis)
                    };
                    const res = await axiosFetch.post("/api/inputLabs/analysisInputValue", data);

                    let tableValues = res.data.map(d => {
                        let averageValue = getHistoricalValue(d.history);
                        return {
                            certificate: selected_cType.certificateType,
                            value: averageValue,//data.history[0].value,
                            user: d.history.length > 0 ? d.history[0].user.userName : '',
                            date: d.history.length > 0 ? moment(d.history[0].date).format(row.date_format) : '',
                            reason: d.history.length > 0 ? d.history[0].reason : '',
                            spec: '[' + filtered_certs.filter(c => c.analysis === d.analysisId)[0].min + ', ' + filtered_certs.filter(c => c.analysis === d.analysisId)[0].max + ']',
                            comment: d.history.length > 0 ? d.history[0].comment : '',
                            analysis: analysisTypes.filter(aType => aType._id === d.analysisId).length > 0 ?
                                analysisTypes.filter(aType => aType._id === d.analysisId)[0].analysisType : '',
                            obj: analysisTypes.filter(aType => aType._id === d.analysisId)[0].analysisType + "-" +
                                objectives.filter(o => o._id === d.history[0].obj.split('-')[0])[0].objective + ', ' +
                                units.filter(u => u._id === d.history[0].obj.split('-')[1])[0].unit,
                            norm: analysisTypes.filter(aType => aType._id === d.analysisId)[0].norm
                        }
                    })
                    const tableColumns = row.tablecol.filter(col => col.name !== '');
                    tableValues = tableValues.map(col => {
                        let tempObj = {}
                        tableColumns.map(tCol => {
                            tempObj[tCol.fieldname] = col[tCol.fieldname]
                        })
                        return tempObj
                    });
                    pdfData.tableValues = tableValues;
                    pdf_data.push(pdfData);
                    columns.push(tableColumns);
                } catch (err) {
                    console.log(err)
                }
            }))
            setPdfData(pdf_data);
            setPdfColumns(columns);
        } catch (err) {
            console.log(err)
        }
    }

    const handleClickMButton = (item) => {
        let _isStock = false;
        if (sampleTypes.filter(sT => sT._id === item.sample_type._id).length > 0) {
            _isStock = sampleTypes.filter(sT => sT._id === item.sample_type._id)[0].stockSample
        }
        if (!_isStock) {
            const stocks = laboratories.filter(data => data.sample_type.stockSample === true)
                .filter(data1 => data1.material._id === item.material._id)
            const filtered_stocks = stocks.filter(s => s.material_left > 0 && s.charge.length > 0)
            if (filtered_stocks.length === 0) {
                toast.error('Please Input weight and charge of stock data');
                return;
            }
        }
        setOpenStockModal(true);
        setId(item._id);
    }

    const handleSaveStockData = (val) => {
        dispatch(saveStockData(val));
        setOpenStockModal(false);
        setId('');
    }

    const handleSearch = (e) => {
        const search_key = e.target.value
        const valueContainFilter = val => String(val).toLowerCase().includes(search_key.toLowerCase())
        const filtered_result = laboratories.filter((row, index) => {
            let isInclude = []
            InputLaboratoryHeader(t).map(field => {
                switch (field.key) {
                    case 'due_date':
                    case 'sending_date':
                    case 'sample_date':
                    case 'material_left':
                    case 'remark':
                        isInclude.push(valueContainFilter(moment(row[field.key]).format(settings.date_format)))
                        break;
                    case 'Weight':
                        isInclude.push(valueContainFilter(row.weight))
                        break;
                    case 'sample_type':
                        isInclude.push(valueContainFilter(row[field.key].sampleType))
                        break;
                    case 'material':
                        isInclude.push(valueContainFilter(row[field.key].material))
                        break;
                    case 'client':
                        isInclude.push(valueContainFilter(row[field.key].name))
                        break;
                    case 'packing_type':
                        isInclude.push(valueContainFilter(row[field.key][0].packingType))
                        break;
                    case 'a_types':
                        const result = row[field.key].map(aT => aT.analysisType.toLowerCase().includes(search_key.toLowerCase()))
                        isInclude.push(result.includes(true))
                        break;
                    case 'c_types':
                        const result1 = row[field.key].map(cT => cT.certificateType.toLowerCase().includes(search_key.toLowerCase()))
                        isInclude.push(result1.includes(true))
                        break;
                    case 'Charge':
                        const fff = row.charge.map(c => c.date.includes(search_key))
                        isInclude.push(fff)
                        break;
                    case 'stockSample':
                        let stockSamples = []
                        row.sample_type.stockSample === false &&
                            (
                                laboratories.filter(data => data.sample_type.stockSample === true)
                                    .filter(data1 =>
                                        data1.material._id === row.material._id &&
                                        data1.charge.length > 0 && row.charge.filter(i => i.date === data1.charge[0].date).length > 0
                                    )
                                    .map(i => (
                                        stockSamples.push(i.sample_type.sampleType + " " + i.material.material + " " + i.material_category.name + " " + moment(i.charge[0].date).format(`${settings.date_format} HH:mm:ss`))
                                    ))
                            )
                        isInclude.push(stockSamples.filter(s => s.toLowerCase().includes(search_key.toLowerCase())).length > 0)
                        break;
                    case 'orderId':
                        isInclude.push(valueContainFilter(row.delivery[field.key]))
                        break;
                    default:
                        break;
                }
            })
            return isInclude.includes(true)
        })

        setFilteredTableData(filtered_result);
    }

    return (
        <Box sx={{ height: '100%' }}>
            <Head>
                <title>
                    Input | Laboratory
                </title>
            </Head>
            <Box p={2} sx={{ backgroundColor: 'white', height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={search_analysisType}
                                label="Age"
                                onChange={(e) => setSearchAnalysisType(e.target.value)}
                                size="small"
                            >
                                <MenuItem disabled value="">
                                    <em>*Search Analysis Type*</em>
                                </MenuItem>
                                {
                                    analysisTypes.map((aType, index) => (
                                        <MenuItem key={index} value={aType._id}>{aType.analysisType}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormGroup sx={{ mx: 2, minWidth: '235px' }}>
                            <FormControlLabel
                                control={<Checkbox checked={not_show_closed} onChange={() => setNotShowClosed(!not_show_closed)} />}
                                label="Don't show closed tasks"
                            />
                        </FormGroup>
                    </Box>
                    <Box display="flex">
                        <Box sx={{ mx: 2 }}>
                            <Button size='small' variant='contained' onClick={() => fileRef.current.click()}>
                                <FileUploadIcon />&nbsp;Import CSV
                            </Button>
                            <input type="file" className='d-none' accept='.csv' ref={fileRef} onChange={handleImportCSV} />
                        </Box>
                        <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                            <Button size='small' variant='contained'><UploadIcon />&nbsp;{t('Import')}</Button>
                        </ReactFileReader>
                        <Button size='small' variant='contained' sx={{ mx: 2 }} onClick={() => csvLink.current.link.click()}>
                            <DownloadIcon />&nbsp;{t('Export')}
                        </Button>
                        <Button size='small' variant='contained' onClick={() => setOpen(true) & setId('')}><AddIcon />&nbsp;{t('Create New')}</Button>
                        <CSVLink
                            headers={input_laboratory_excel_header}
                            filename="Export-Laboratory.csv"
                            data={export_all_data}
                            ref={csvLink}
                        ></CSVLink>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                    <TextField
                        size='small'
                        label="Enter search key"
                        variant="outlined"
                        onChange={handleSearch}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        component="div"
                        count={laboratories.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value) & setPage(0)}
                        className={classes.pagination}
                    />
                </Box>
                <TableContainer sx={{ maxHeight: 700 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {/* {InputLaboratoryHeader(t)
                                    .filter(col => col.key !== '_id')
                                    .map((column, index) => ( */}
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Due Date')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, due_date: !sort_status.due_date });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.due_date ? new Date(b.due_date) - new Date(a.due_date) : new Date(a.due_date) - new Date(b.due_date)))
                                            }}
                                        >{sort_status.due_date ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                {/* ))} */}
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Sample Type')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, sample_type: !sort_status.sample_type });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.sample_type ? b.sample_type.sampleType.localeCompare(a.sample_type.sampleType) : a.sample_type.sampleType.localeCompare(b.sample_type.sampleType)))
                                            }}
                                        >{sort_status.sample_type ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Order.ID')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, order_id: !sort_status.order_id });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.order_id ? b.delivery.orderId - a.delivery.orderId : a.delivery.orderId - b.delivery.orderId))
                                            }}
                                        >{sort_status.order_id ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Pos.ID')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, pos_id: !sort_status.pos_id });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.pos_id ? b.delivery.posId - a.delivery.posId : a.delivery.posId - b.delivery.posId))
                                            }}
                                        >{sort_status.pos_id ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Material')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, material: !sort_status.material });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.material ? b.material.material.localeCompare(a.material.material) : a.material.material.localeCompare(b.material.material)))
                                            }}
                                        >{sort_status.material ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Material Category')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, material_category: !sort_status.material_category });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.material_category ? b.material_category.name.localeCompare(a.material_category.name) : a.material_category.name.localeCompare(b.material_category.name)))
                                            }}
                                        >{sort_status.material_category ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('client')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, client: !sort_status.client });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.client ? b.client.name.localeCompare(a.client.name) : a.client.name.localeCompare(b.client.name)))
                                            }}
                                        >{sort_status.client ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Packing Type')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, packing_type: !sort_status.packing_type });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.packing_type ? b.packing_type[0].packingType.localeCompare(a.packing_type[0].packingType) : a.packing_type[0].packingType.localeCompare(b.packing_type[0].packingType)))
                                            }}
                                        >{sort_status.packing_type ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Analysis Type')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => setSortStatus({ ...sort_status, analysis_type: !sort_status.analysis_type })}
                                        >{sort_status.analysis_type ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Certificate')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => setSortStatus({ ...sort_status, certificate: !sort_status.certificate })}
                                        >{sort_status.certificate ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Sending Date')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, sending_date: !sort_status.sending_date });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.sending_date ? new Date(b.sending_date) - new Date(a.sending_date) : new Date(a.sending_date) - new Date(b.sending_date)))
                                            }}
                                        >{sort_status.sending_date ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Sample Date')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, sample_date: !sort_status.sample_date });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.sample_date ? new Date(b.sample_date) - new Date(a.sample_date) : new Date(a.sample_date) - new Date(b.sample_date)))
                                            }}
                                        >{sort_status.sample_date ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Weight(actual)[kg]')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, weight: !sort_status.weight });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.weight ? b.weight - a.weight : a.weight - b.weight))
                                            }}
                                        >{sort_status.weight ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Material Left')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, material_left: !sort_status.material_left });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.material_left ? b.material_left - a.material_left : a.material_left - b.material_left))
                                            }}
                                        >{sort_status.material_left ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Lot Number')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => setSortStatus({ ...sort_status, lot_number: !sort_status.lot_number })}
                                        >{sort_status.lot_number ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Stock Sample')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => setSortStatus({ ...sort_status, stock_sample: !sort_status.stock_sample })}
                                        >{sort_status.stock_sample ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <span>{t('Remark')}</span>
                                        <Button
                                            variant='text'
                                            sx={{ p: 0, minWidth: 0 }}
                                            onClick={() => {
                                                setSortStatus({ ...sort_status, remark: !sort_status.remark });
                                                var arrayForSort = [...tableRows];
                                                setTableRows(arrayForSort.sort((a, b) => sort_status.remark ? b.remark.localeCompare(a.remark) : a.remark.localeCompare(b.remark)))
                                            }}
                                        >{sort_status.remark ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}</Button>
                                    </Box>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.length > 0 ? tableRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell align='left'>{moment(item.due_date).format(settings?.date_format)}</TableCell>
                                            <TableCell align='left'>{item.sample_type.sampleType}</TableCell>
                                            <TableCell align='left'>{item.delivery.orderId}</TableCell>
                                            <TableCell align='left'>{item.delivery.posId}</TableCell>
                                            <TableCell align='left'>{item.material.material}</TableCell>
                                            <TableCell align='left'>
                                                {item.material_category === undefined ? '' : item.material_category.name}
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Box className="cursor-pointer" onClick={() => setOpenClientModal(true) & setId(item._id)}>
                                                    {item.client === undefined ? '' : item.client.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell align='left'>
                                                {item.packing_type.map((pT, index) => pT.packingType)}
                                            </TableCell>
                                            {
                                                item.sample_type.stockSample === false ? (
                                                    <TableCell align='left'>
                                                        {
                                                            item.a_types.length > 0 && (
                                                                item.charge.length === 0 ? item.a_types.map((aType, k) => (
                                                                    <div key={k} className="px-2 py-1">
                                                                        <Button variant='container' className={`font-size--small color-white ${item.aT_validate.filter(a => a.aType === aType._id).length === 0 ?
                                                                            `background-gray` :
                                                                            (item.aT_validate.filter(a => a.aType === aType._id)[0].isValid === 1 ? `background-green` : `background-red`)}`}
                                                                            size="sm" onClick={() => {
                                                                                setSameId(true)
                                                                                handleClickAnalysisTypeColumn(item._id, aType, item._id)
                                                                            }}
                                                                        >{aType.analysisType}</Button>
                                                                    </div>
                                                                )) : item.c_types.map(ch => item.a_types.map((aType, k) => (
                                                                    <div key={k} className="px-2 py-1">
                                                                        <Button className={`font-size--small color-white ${item.aT_validate.filter(a => a.aType === aType._id).length === 0 ?
                                                                            `background-gray` :
                                                                            (item.aT_validate.filter(a => a.aType === aType._id)[0].isValid === 1 ? `background-green` : `background-red`)}`}
                                                                            size="sm" onClick={() => {
                                                                                setSameId(true)
                                                                                handleClickAnalysisTypeColumn(item._id, aType, item._id)
                                                                            }}
                                                                        >{aType.analysisType}</Button>
                                                                    </div>
                                                                )))
                                                            )
                                                        }
                                                        {
                                                            item.charge.length > 0 &&
                                                            laboratories.filter(d => d.sample_type.stockSample === true && d.material._id === item.material._id)
                                                                .filter(dd => item.stock_weights.filter(ii => String(ii.stock) === String(dd._id)).length > 0)
                                                                .map(data => data.a_types.map((aT, i) => {
                                                                    const specValues = item.stock_specValues.filter(sv => sv.stock.toString() === data._id.toString() && sv.aType.toString() === aT._id.toString())
                                                                    let color_info = []
                                                                    if (materials.filter(mat => mat._id === item.material._id)[0]
                                                                        .aTypesValues.filter(aTValue => aTValue.client === item.material_category._id && aTValue.value === aT._id).length > 0) {
                                                                        specValues.map((sv) => {
                                                                            if (sv.value !== 0 && sv.obj !== '') {
                                                                                const matched_obj = materials.filter(mat => mat._id === item.material._id)[0].objectiveValues
                                                                                    .filter(objValue1 => objValue1.client === item.material_category._id && objValue1.analysis === aT._id)
                                                                                    .filter(objValue2 => String(objValue2.id + '-' + objValue2.unit) === sv.obj)
                                                                                if (matched_obj.length === 0) {
                                                                                    color_info.push(1)
                                                                                } else {
                                                                                    color_info.push(sv.value >= matched_obj[0].min && sv.value <= matched_obj[0].max ? 1 : 2)
                                                                                }
                                                                            } else {
                                                                                color_info.push(0)
                                                                            }
                                                                        })
                                                                    } else {
                                                                        color_info.push(2)
                                                                    }
                                                                    return (
                                                                        <div key={i} className="px-2 py-1">
                                                                            <Button
                                                                                className={`font-size--small color-white ${color_info.length > 0 ? (
                                                                                    color_info.filter(color => color === 0).length > 0 ? `background-gray` : (
                                                                                        color_info.filter(color => color === 2).length > 0 ? `background-red` : `background-green`
                                                                                    )
                                                                                ) : `background-gray`}`}
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setSameId(false);
                                                                                    handleClickAnalysisTypeColumn(data._id, aT, item._id)
                                                                                }}
                                                                            >{data.sample_type.sampleType + "-" + aT.analysisType}</Button>
                                                                        </div>
                                                                    )
                                                                }))
                                                        }
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align='left'>
                                                        {
                                                            item.a_types.map((aT, k) => {
                                                                return (
                                                                    <div key={k} className="px-2 py-1">
                                                                        <Button className={`font-size--small color-white ${item.aT_validate.filter(a => a.aType === aT._id).length === 0 ?
                                                                            `background-gray` :
                                                                            (item.aT_validate.filter(a => a.aType === aT._id)[0].isValid === 1 ? `background-green` : `background-red`)}`}
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setSameId(true);
                                                                                handleClickAnalysisTypeColumn(item._id, aT, item._id)
                                                                            }}
                                                                        >{aT.analysisType}</Button>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </TableCell>
                                                )
                                            }
                                            {
                                                item.sample_type.stockSample === false ? (
                                                    <TableCell align='left'>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                                            <Box>
                                                                {item.c_types.map((cT, k) => (
                                                                    <Box key={k} className="p-2">
                                                                        {
                                                                            (item.aT_validate.length > 0 && item.aT_validate.filter(v => parseInt(v.isValid) !== 1).length === 0 && item.aT_validate.length === item.a_types.length) ? (item.charge.length === 0 || item.weight === 0) ?
                                                                                (
                                                                                    <Box sx={{ color: 'black' }}>
                                                                                        {cT.certificateType}
                                                                                    </Box>
                                                                                ) : (
                                                                                    <Button sx={{ color: 'black' }} onClick={() => handleClickCertificate(item, cT)}>
                                                                                        {cT.certificateType}
                                                                                    </Button>
                                                                                ) : (
                                                                                <Box sx={{ color: 'black' }}>
                                                                                    {cT.certificateType}
                                                                                </Box>
                                                                            )
                                                                        }
                                                                    </Box>
                                                                ))}
                                                                {
                                                                    item.charge.length > 0 &&
                                                                    laboratories.filter(d => d.sample_type.stockSample === true && d.material._id === item.material._id)
                                                                        .filter(dd => item.stock_weights.filter(ii => ii.stock === dd._id).length > 0)
                                                                        .map(data => data.c_types.map((cT, i) => {
                                                                            return (
                                                                                <Box key={i} className="px-2 py-1">
                                                                                    <Button sx={{ color: 'black' }} onClick={() => handleClickCertificate(data, cT)}>
                                                                                        {data.sample_type.sampleType + "-" + cT.certificateType}
                                                                                    </Button>
                                                                                </Box>
                                                                            )
                                                                        }))
                                                                }
                                                            </Box>
                                                            {
                                                                (item.download_status.length > 0 && item.download_status.filter(s => s.status === 0).length === 0) && (
                                                                    <img src='/static/checkmark.png' width="24px" height="24px" alt='' title='Closed task' />
                                                                )
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell align='left'>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                                            <Box style={{ display: "column" }}>
                                                                {item.c_types.map((v, k) => {
                                                                    return (
                                                                        <Box key={k} className="p-2">
                                                                            {
                                                                                (item.aT_validate.length > 0 && item.aT_validate.length === item.a_types.length &&
                                                                                    item.aT_validate.filter(v => parseInt(v.isValid) !== 1).length === 0) ? (
                                                                                    <Button sx={{ color: 'black' }} onClick={() => handleClickCertificate(item, v)}>
                                                                                        {v.certificateType}
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Box sx={{ color: 'black' }}>
                                                                                        {v.certificateType}
                                                                                    </Box>
                                                                                )
                                                                            }
                                                                        </Box>
                                                                    );
                                                                })}
                                                            </Box>
                                                            {
                                                                (item.download_status.length > 0 && item.download_status.filter(s => s.status === 0).length === 0) && (
                                                                    <img src='/static/checkmark.png' width="24px" height="24px" alt='' title='Closed task' />
                                                                )
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                )
                                            }
                                            <TableCell align='left'>{moment(item.sending_date).format(settings.date_format)}</TableCell>
                                            <TableCell align='left'>{moment(item.sample_date).format(settings.date_format)}</TableCell>
                                            <TableCell align='left'>
                                                {
                                                    item.sample_type.stockSample ? (
                                                        <Box className='cursor-pointer' onClick={(e) => setId(item._id) & setOpenWeightModal(true)}>
                                                            {item.weight === 0 ? 'N/A' : item.weight}
                                                        </Box>
                                                    ) : (
                                                        (item.stock_weights.length > 0) ? (
                                                            <Box>
                                                                <Box className='py-1 px-2'>Total: {item.weight !== 0 ? item.weight : 'N/A'}</Box>
                                                                {item.stock_weights.map(s_weight => laboratories.filter(lab => lab._id === s_weight.stock).map((stock_lab, stock_index) => (
                                                                    <Box className='py-1 px-2' key={stock_index}>
                                                                        {stock_lab.sample_type.sampleType + ' ' + stock_lab.material.material + ' ' + stock_lab.material_category.name}: {s_weight.weight}
                                                                    </Box>
                                                                )))}
                                                            </Box>
                                                        ) : (
                                                            <Box className='cursor-pointer' onClick={(e) => setId(item._id) & setOpenWeightModal(true)}>
                                                                {item.weight === 0 ? 'N/A' : item.weight}
                                                            </Box>
                                                        )
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align='left'>{item.sample_type.stockSample ? item.material_left : ''}</TableCell>
                                            <TableCell align='left'>
                                                {
                                                    item.sample_type.stockSample ? (
                                                        item.charge.length > 0 ? item.charge.map((data, index) => (
                                                            <Box className='cursor-pointer' key={index} onClick={() => setId(item._id) & setOpenChargeModal(true)}>
                                                                {(data.date === undefined || data.date === '') ? 'N/A' : moment(data.date).format(`${settings.date_format} HH:mm:ss`)}
                                                            </Box>
                                                        )) : <Box className="text-center cursor-pointer" onClick={() => setId(item._id) & setOpenChargeModal(true)} >
                                                            <Box variant='text'>N/A</Box>
                                                        </Box>
                                                    ) : (
                                                        item.stock_weights.length > 0 ? (
                                                            <ul>
                                                                {
                                                                    item.charge.map((data, index) => (
                                                                        <li key={index}>{moment(data.date).format(`${settings.date_format} HH:mm:ss`)}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        ) : <Box variant='text' className='cursor-pointer' onClick={() => setId(item._id) & setOpenChargeModal(true)} >
                                                            {item.charge.length > 0 ? moment(item.charge[0].date).format(`${settings.date_format} HH:mm:ss`) : 'N/A'}
                                                        </Box>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align='left'>
                                                {
                                                    item.sample_type.stockSample === false &&
                                                    (
                                                        <ul>
                                                            {
                                                                laboratories.filter(data => data.sample_type.stockSample === true)
                                                                    .filter(data1 =>
                                                                        data1.material._id === item.material._id &&
                                                                        // data1.material_left > 0 && data1.charge.length > 0 &&
                                                                        data1.charge.length > 0 && item.charge.filter(i => i.date === data1.charge[0].date).length > 0
                                                                    )
                                                                    .map((i, index) => (
                                                                        <li key={index}>
                                                                            {i.sample_type.sampleType + " " + i.material.material + " " + i.material_category.name + " " + moment(i.charge[0].date).format(`${settings.date_format} HH:mm:ss`)}
                                                                        </li>
                                                                    ))
                                                            }
                                                        </ul>
                                                    )
                                                }
                                            </TableCell>
                                            <TableCell align='left'>{item.remark}</TableCell>
                                            <TableCell align='left' sx={{ minWidth: '125px' }}>
                                                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                                    <Button size="small" variant='contained' sx={{ p: 1, minWidth: 0 }} onClick={() => handleClickMButton(item)} disabled={item.sample_type.stockSample}>M</Button>
                                                    <Button size="small" variant='contained' color="info" sx={{ p: 1, minWidth: 0, fontSize: '17px' }} onClick={() => setId(item._id) & setOpen(true)}>
                                                        <SaveAsIcon fontSize='17px' />
                                                    </Button>
                                                    <Button size="small" variant='contained' color='error' sx={{ p: 1, minWidth: 0, fontSize: '17px' }} onClick={() => handleDelete(item._id)}>
                                                        <DeleteForeverIcon fontSize='17px' />
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                    <TableCell align="center" colSpan={16}>No Data</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <React.Fragment>
                    <SwipeableDrawer
                        anchor="right"
                        open={openCertificate}
                        onClose={() => setOpenCertificate(false)}
                        onOpen={() => setOpenCertificate(true)}
                        classes={{ paper: classes.paper }}
                        sx={{ zIndex: 1000 }}
                    >
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Typography component="h2" paddingY={3} paddingX={4} borderBottom="1px solid #eee">PDF Generate</Typography>
                            <Box p={4} height="100%">
                                <Card sx={{ boxShadow: '0 0 2px 2px #eee', p: 2, height: '100%' }}>
                                    <Grid container height="100%">
                                        <Grid item md={3} xs={12} border="1px solid #eee">
                                            <Typography component="h5" p={2}>Certificate Templates</Typography>
                                            <List sx={{ borderTop: '1px solid #eee' }}>
                                                {
                                                    certificateTemplates.map((cTemp, index) => (
                                                        <ListItem
                                                            disablePadding
                                                            sx={{ borderBottom: '1px solid #eee' }}
                                                            key={index}
                                                            onClick={() => getCertificateData(cTemp)}
                                                        >
                                                            <ListItemButton>
                                                                <ListItemText primary={cTemp.name} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))
                                                }
                                            </List>
                                        </Grid>
                                        <Grid item md={9} xs={12}>
                                            {pdfData.length > 0 && (
                                                <div style={{ overflow: "auto", height: "73vh" }}>
                                                    <Button size="medium" variant='contained' color='warning' sx={{ p: 1, minWidth: 0, fontSize: '17px' }} onClick={() => createPDF(pdfData, pdfColumns)}>
                                                        Generate certificate
                                                    </Button>
                                                </div>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Box>
                            <Box width="100%" height="20px"></Box>
                        </Box>
                    </SwipeableDrawer>
                </React.Fragment>
                {
                    open && <InputLaboratoryModal
                        open={open}
                        handleClose={() => setOpen(false)}
                        handleCreate={handleCreate}
                        id={id}
                    />
                }
                {
                    openClientModal && <InputClientModal
                        open={openClientModal}
                        handleClose={() => setOpenClientModal(false)}
                        id={id}
                    />
                }
                {
                    openWeightModal && <InputWeightModal
                        open={openWeightModal}
                        handleClose={() => setOpenWeightModal(false)}
                        id={id}
                    />
                }
                {
                    openChargeModal && <InputLotNumberModal
                        open={openChargeModal}
                        handleClose={() => setOpenChargeModal(false)}
                        id={id}
                    />
                }
                {
                    openAnalysisTypeModal && <InputAnalysisTypeModal
                        open={openAnalysisTypeModal}
                        handleClose={() => setOpenAnalysisTypeModal(false)}
                        id={id}
                        rowId={rowId}
                        selected_aType={selected_aType}
                        handleSave={handleSaveAnalysisType}
                    />
                }
                {
                    openCSVModal && <InputImportCSVModal
                        open={openCSVModal}
                        handleClose={() => {
                            setOpenCSVModal(false);
                            setParsedCSVHeader([]);
                            setParsedCSVRow([]);
                            setImportedFile(null);

                            fileRef.current.value = "";
                        }}
                        parsedCSVHeader={parsedCSVHeader}
                        parsedCSVRow={parsedCSVRow}
                        handleImport={importCSV}
                    />
                }
                {
                    openStockModal && <InputStockSampleModal
                        open={openStockModal}
                        handleClose={() => setOpenStockModal(false)}
                        handleSave={handleSaveStockData}
                        id={id}
                    />
                }
            </Box>
        </Box>
    )
}

InputLaboratory.getLayout = (page) => (
    <AuthGuard>
        <AdminLayout>
            {page}
        </AdminLayout>
    </AuthGuard>
);

export default InputLaboratory;