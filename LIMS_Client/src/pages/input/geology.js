import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from "react-csv";
import moment from 'moment';

import { AuthGuard } from '../../components/authentication/auth-guard';
import { AdminLayout } from '../../components/admin/admin-layout'
import GeologyGeneralModal from '../../components/lims-modals/GeologyGeneralModal';
import {
    createGeology,
    deleteGeology,
    getGeologiesData,
    createGeneral,
    createMarkscheiderei,
    createLaboratory,
    createGeoGeology,
    shiftGeology,
    updateGeology,
    updateGeologies,
    getExcelData,
    getGeologyLabObjectivesData
} from '../../slices/geology';
import axiosFetch from '../../utils/axiosFetch';
import GeologyMarkscheidereiModal from '../../components/lims-modals/GeologyMarkscheidereiModal';
import GeologyLaboratoryModal from '../../components/lims-modals/GeologyLaboratoryModal';
import GeologyGeologyModal from '../../components/lims-modals/GeologyGeologyModal';
import { getOreTypesData } from '../../slices/oreType';
import GeologyCard from '../../components/card/GeologyCard';
import { getUsers } from '../../slices/user';
import { getReasonsData } from '../../slices/reason';
import GeologyReasonModal from '../../components/lims-modals/GeologyReasonModal';
import GeologyCommentHistoryModal from '../../components/lims-modals/GeologyCommentHistoryModal';
import { GeologyHeader } from '../../utils/tableHeaders';
import { getAnalysisTypesData } from '../../slices/analysisType';

const Geology = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const csvLink = useRef();

    const [openGeneral, setOpenGeneral] = useState(false);
    const [openMarkscheiderei, setOpenMarkscheiderei] = useState(false);
    const [openLaboratory, setOpenLaboratory] = useState(false);
    const [openGeology, setOpenGeology] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [not_show_closed, setNotShowClosed] = useState(false);
    const [date_format, setDateFormat] = useState('MM.DD.YYYY');
    const [id, setID] = useState('');
    const [step, setStep] = useState(0);
    const [openReason, setOpenReason] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [excelHeader, setExcelHeader] = useState(GeologyHeader(t));

    const { geologies, geology_lab_objectives, export_all_data } = useSelector(state => state.geology);
    const { oreTypes } = useSelector(state => state.oreType);
    const { isAuthenticated, user } = useSelector(state => state.auth);

    useEffect(() => {
        if (geology_lab_objectives.length > 0) {
            geology_lab_objectives.map(obj => {
                if (excelHeader.filter(item => item.key === obj.objective.objective + ' ' + obj.unit.unit).length === 0) {
                    setExcelHeader(prev => [...prev, {
                        key: obj.objective.objective + ' ' + obj.unit.unit,
                        label: obj.objective.objective + ' ' + obj.unit.unit,
                        align: 'right'
                    }]);
                }
            })
        }
    }, [geology_lab_objectives]);

    useEffect(() => {
        if (isAuthenticated) {
            axiosFetch.get("/api/settings/date_format")
                .then(res => {
                    setDateFormat(res.data.date_format);
                    dispatch(getUsers())
                    dispatch(getReasonsData());
                    dispatch(getOreTypesData());
                    dispatch(getGeologyLabObjectivesData());
                    dispatch(getAnalysisTypesData());
                    dispatch(getGeologiesData());
                }).catch(err => {
                    console.log(err.response.data)
                })
        }
    }, [dispatch, isAuthenticated]);

    const handleCreate = () => {
        dispatch(createGeology());
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure to delete this item?')) {
            dispatch(deleteGeology(id))
        }
    }

    const onCreateGeneral = (data) => {
        dispatch(createGeneral(data));
    }

    const onCreateMarkscheiderei = (data) => {
        dispatch(createMarkscheiderei(data));
    }

    const onCreateLaboratory = (data) => {
        dispatch(createLaboratory(data));
    }

    const onCreateGeology = (data) => {
        dispatch(createGeoGeology(data))
    }

    const onShift = async (id, to) => {
        try {
            const geology = geologies.filter(geo => geo._id === id)[0];
            if (geology.general && geology.markscheiderei && geology.laboratory && geology.geology) {
                if (to === 2 && !user.geologyAdmin) {
                    toast.error("Only Geology admin can shift here");
                    return;
                }
                if (to === 3) {
                    const res = await axiosFetch.post('/api/geology/exported/' + id);
                    dispatch(updateGeology(res.data));

                    const exported_data = {
                        geology_id: res.data.geology_id,
                        hole_id: res.data.general_data[0].hole_id.value,
                        materialType: res.data.general_data[0].materialType.value,
                        east: res.data.markscheiderei_data[0].east.value,
                        north: res.data.markscheiderei_data[0].north.value,
                        elev: res.data.markscheiderei_data[0].elev.value,
                        length: res.data.markscheiderei_data[0].length.value,
                        category: res.data.markscheiderei_data[0].category.value,
                        to: res.data.markscheiderei_data[0].to.value,
                        azimut: res.data.markscheiderei_data[0].azimut.value,
                        dip: res.data.markscheiderei_data[0].dip.value,
                        date: moment(res.data.laboratory_data.date.value).format(date_format),
                        level: res.data.laboratory_data.level.value,
                        subset: res.data.laboratory_data.subset.value,
                        thickness: res.data.laboratory_data.thickness.value,
                        distance: res.data.laboratory_data.distance.value,
                        weight: res.data.laboratory_data.weight.value,
                        sample: res.data.geology_data[0].sample.value,
                        from: res.data.geology_data[0].from.value,
                        geo_to: res.data.geology_data[0].to.value,
                        thk: res.data.geology_data[0].thk.value,
                        ore: oreTypes.filter(oT => oT._id === res.data.geology_data[0].oreType.value)[0].oreType,
                        rxqual: res.data.geology_data[0].rxqual.value,
                        fest: res.data.geology_data[0].fest.value,
                        locker: res.data.geology_data[0].locker.value,
                        sanding: res.data.geology_data[0].sanding.value,
                        drills: res.data.geology_data[0].drills.value,
                        _id: res.data._id
                    }
                    res.data.laboratory_data.objective_values.map(obj => exported_data[obj.obj.objective.objective + ' ' + obj.obj.unit.unit] = obj.value);

                    dispatch(getExcelData([exported_data]));
                    setTimeout(() => {
                        csvLink.current.link.click();
                    }, [1000]);
                }
                if (to < 3) {
                    setID(id);
                    setStep(to);
                    setOpenReason(true);
                }
            } else {
                toast.error("Please input all data.");
            }
        } catch (err) {
            toast.error(err);
        }
    }

    const confirmShift = (data) => {
        dispatch(shiftGeology({ ...data, id: id, step: step }));
    }

    const handleExport = async () => {
        try {
            const res = await axiosFetch.post('/api/geology/exported');
            if (res.data.length > 0) {
                dispatch(updateGeologies(res.data));

                const exported_data = res.data
                    .map((data) => {
                        var row = {
                            geology_id: data.geology_id,
                            hole_id: data.general_data[0].hole_id.value,
                            materialType: data.general_data[0].materialType.value,
                            east: data.markscheiderei_data[0].east.value,
                            north: data.markscheiderei_data[0].north.value,
                            elev: data.markscheiderei_data[0].elev.value,
                            length: data.markscheiderei_data[0].length.value,
                            category: data.markscheiderei_data[0].category.value,
                            to: data.markscheiderei_data[0].to.value,
                            azimut: data.markscheiderei_data[0].azimut.value,
                            dip: data.markscheiderei_data[0].dip.value,
                            date: moment(data.laboratory_data.date.value).format(date_format),
                            level: data.laboratory_data.level.value,
                            subset: data.laboratory_data.subset.value,
                            thickness: data.laboratory_data.thickness.value,
                            distance: data.laboratory_data.distance.value,
                            weight: data.laboratory_data.weight.value,
                            sample: data.geology_data[0].sample.value,
                            from: data.geology_data[0].from.value,
                            geo_to: data.geology_data[0].to.value,
                            thk: data.geology_data[0].thk.value,
                            ore: oreTypes.filter(oT => oT._id === data.geology_data[0].oreType.value)[0].oreType,
                            rxqual: data.geology_data[0].rxqual.value,
                            fest: data.geology_data[0].fest.value,
                            locker: data.geology_data[0].locker.value,
                            sanding: data.geology_data[0].sanding.value,
                            drills: data.geology_data[0].drills.value,
                            _id: data._id
                        }
                        data.laboratory_data.objective_values.map(obj => row[obj.obj.objective.objective + ' ' + obj.obj.unit.unit] = obj.value);
                        return row;
                    })
                dispatch(getExcelData(exported_data));
                setTimeout(() => {
                    csvLink.current.link.click();
                }, [1000]);
                toast.success("Export success");
            } else {
                toast.error('No items to export');
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Box>
            <Head>
                <title>
                    Geology | Laboratory
                </title>
            </Head>
            <Box p={2} sx={{ backgroundColor: 'white' }}>
                <Box display="flex" justifyContent="space-between" borderBottom="1px solid #ddd" py={1}>
                    <Box display="flex" alignItems="center">
                        <FormGroup sx={{ mx: 2, minWidth: '235px' }}>
                            <FormControlLabel
                                control={<Checkbox checked={not_show_closed} onChange={() => setNotShowClosed(!not_show_closed)} />}
                                label={t("Don't show closed items")}
                            />
                        </FormGroup>
                        <TextField variant='outlined' label='Search field' size="small" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
                    </Box>
                    <Box>
                        <Button size='small' variant='contained' sx={{ mx: 2 }} onClick={handleExport}>
                            <DownloadIcon />&nbsp;{t('Export')}
                        </Button>
                        <Button
                            size='small'
                            variant='contained'
                            onClick={handleCreate}
                        ><AddIcon />&nbsp;{t('Create New')}</Button>
                        <CSVLink
                            headers={excelHeader}
                            filename="Export-Geology.csv"
                            data={export_all_data}
                            ref={csvLink}
                        ></CSVLink>
                    </Box>
                </Box>
                <Box>
                    <Grid container sx={{ borderBottom: "1px solid #ddd", backgroundColor: '#eee' }}>
                        <Grid item xs={3} sx={{ py: 2, textAlign: 'center' }}>{t("Input Required")}</Grid>
                        <Grid item xs={3} sx={{ py: 2, textAlign: 'center' }}>{t("Check")}</Grid>
                        <Grid item xs={3} sx={{ py: 2, textAlign: 'center' }}>{t("Checked / To be Exported")}</Grid>
                        <Grid item xs={3} sx={{ py: 2, textAlign: 'center' }}>{t("Export Finished")}</Grid>
                    </Grid>
                    {
                        geologies.length > 0 && geologies
                            .filter(geo => not_show_closed ? geo.check_status !== 3 : 1 === 1)
                            .filter(geo => searchKey !== '' ?
                                (geo.general && String(geo.general_data[0].hole_id.value).toLowerCase().includes(searchKey.toLowerCase())) ||
                                (geo.geology && String(geo.geology_data[0].sample.value).toLowerCase().includes(searchKey.toLowerCase())) ||
                                (geo.laboratory && String(moment(geo.laboratory_data.date.value).format(date_format)).toLowerCase().includes(searchKey.toLowerCase())) :
                                1 === 1
                            )
                            .map((geology, index) => (
                                <Grid container key={index} sx={{ borderBottom: "1px solid #ddd" }}>
                                    <Grid item xs={3}>
                                        {
                                            geology.check_status === 0 && (
                                                <GeologyCard
                                                    geology={geology}
                                                    handleDelete={handleDelete}
                                                    handleShift={onShift}
                                                    handleViewComments={(id) => setID(id) & setOpenComments(true)}
                                                    setID={setID}
                                                    setOpenGeneral={setOpenGeneral}
                                                    setOpenMarkscheiderei={setOpenMarkscheiderei}
                                                    setOpenLaboratory={setOpenLaboratory}
                                                    setOpenGeology={setOpenGeology}
                                                    date_format={date_format}
                                                />
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={3}>
                                        {
                                            geology.check_status === 1 && (
                                                <GeologyCard
                                                    geology={geology}
                                                    handleDelete={handleDelete}
                                                    handleShift={onShift}
                                                    handleViewComments={(id) => setID(id) & setOpenComments(true)}
                                                    setID={setID}
                                                    setOpenGeneral={setOpenGeneral}
                                                    setOpenMarkscheiderei={setOpenMarkscheiderei}
                                                    setOpenLaboratory={setOpenLaboratory}
                                                    setOpenGeology={setOpenGeology}
                                                    date_format={date_format}
                                                />
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={3}>
                                        {
                                            geology.check_status === 2 && (
                                                <GeologyCard
                                                    geology={geology}
                                                    handleDelete={handleDelete}
                                                    handleShift={onShift}
                                                    handleViewComments={(id) => setID(id) & setOpenComments(true)}
                                                    setID={setID}
                                                    setOpenGeneral={setOpenGeneral}
                                                    setOpenMarkscheiderei={setOpenMarkscheiderei}
                                                    setOpenLaboratory={setOpenLaboratory}
                                                    setOpenGeology={setOpenGeology}
                                                    date_format={date_format}
                                                />
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs={3}>
                                        {
                                            geology.check_status === 3 && (
                                                <GeologyCard
                                                    geology={geology}
                                                    handleDelete={handleDelete}
                                                    handleShift={onShift}
                                                    handleViewComments={(id) => setID(id) & setOpenComments(true)}
                                                    setID={setID}
                                                    setOpenGeneral={setOpenGeneral}
                                                    setOpenMarkscheiderei={setOpenMarkscheiderei}
                                                    setOpenLaboratory={setOpenLaboratory}
                                                    setOpenGeology={setOpenGeology}
                                                    date_format={date_format}
                                                />
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            ))
                    }

                </Box>
            </Box>
            {
                openGeneral && <GeologyGeneralModal
                    open={openGeneral}
                    handleClose={() => setOpenGeneral(false)}
                    selectedId={id}
                    handleCreate={onCreateGeneral}
                    date_format={date_format}
                />
            }
            {
                openMarkscheiderei && <GeologyMarkscheidereiModal
                    open={openMarkscheiderei}
                    handleClose={() => setOpenMarkscheiderei(false)}
                    selectedId={id}
                    handleCreate={onCreateMarkscheiderei}
                    date_format={date_format}
                />
            }
            {
                openLaboratory && <GeologyLaboratoryModal
                    open={openLaboratory}
                    handleClose={() => setOpenLaboratory(false)}
                    selectedId={id}
                    handleCreate={onCreateLaboratory}
                    date_format={date_format}
                />
            }
            {
                openGeology && <GeologyGeologyModal
                    open={openGeology}
                    handleClose={() => setOpenGeology(false)}
                    selectedId={id}
                    handleCreate={onCreateGeology}
                    date_format={date_format}
                />
            }
            {
                openReason && <GeologyReasonModal
                    open={openReason}
                    handleClose={() => setOpenReason(false)}
                    handleCreate={confirmShift}
                />
            }
            {
                openComments && <GeologyCommentHistoryModal
                    open={openComments}
                    handleClose={() => setOpenComments(false)}
                    id={id}
                    date_format={date_format}
                />
            }
        </Box>
    )
}

Geology.getLayout = (page) => (
    <AuthGuard>
        <AdminLayout>
            {page}
        </AdminLayout>
    </AuthGuard>
);

export default Geology;