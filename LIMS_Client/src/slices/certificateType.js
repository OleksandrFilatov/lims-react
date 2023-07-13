import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { certificateTypeAPI } from '../api/lims/certificateType-api';
import { getAnalysisTypes } from './analysisType';
import { getClients } from './client';
import { getMaterials } from './material';
import { getObjectives } from './objective';
import { getPackingTypes } from './packingType';
import { getUnits } from './unit';
import { store } from '../store';

const initialState = {
    certificateTypes: [],
    certificateType: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'certificateType',
    initialState,
    reducers: {
        getCertificateTypes(state, action) {
            state.certificateTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getCertificateTypes } = slice.actions;

export const getCertificateTypesData = () => async (dispatch) => {
    try {
        let result = await certificateTypeAPI.getCertificateTypes();

        dispatch(getClients(result.all_clients));
        dispatch(getAnalysisTypes(result.analysises));
        dispatch(getMaterials(result.materials));
        dispatch(getObjectives(result.objectives));
        dispatch(getUnits(result.units));
        dispatch(getPackingTypes(result.packings));

        let sortedData = result.certificateTypes.sort((a, b) => {
            return Number(a.certificateType_id) > Number(b.certificateType_id) ? 1 : -1;
        });

        var certificate_list = [];
        result.certificateTypes.map((certificate) => {
            var analysis_data = getAnalysises(certificate.analysises, certificate.material, certificate.client)
            certificate_list.push({
                '_id': certificate._id,
                'certificateType_id': certificate.certificateType_id,
                'material': result.materials.filter(item => item._id === certificate.material)[0].material + '-' + result.clients.filter(item => item._id === certificate.client)[0].name,
                'certificateType': certificate.certificateType,
                'analysises': analysis_data.trim(),
                'remark': certificate.remark
            });
        });
        dispatch(slice.actions.getCertificateTypes(sortedData));
        dispatch(slice.actions.getExcelData(certificate_list));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const getAnalysises = (analysises, material, client) => {
    if (analysises === "" || analysises === undefined) return "";

    const analysisTypes = store.getState().analysisType.analysisTypes;
    const objectives = store.getState().objective.objectives;
    const units = store.getState().unit.units;

    var returnVal = "";
    analysises.map(item => {
        var label = analysisTypes.filter(aType => aType._id === item.id)[0].analysisType;
        if (label !== '') {
            item.objectives.map((item0) => {
                var subLabel = objectives.filter(obj => obj._id === item0.id)[0].objective;
                var subUnit = units.filter(unit => unit._id === item0.unit)[0].unit;

                if (subLabel !== '' && subUnit !== '')
                    returnVal = returnVal + label + ' - ' + subLabel + ' ' + subUnit + ' ' + getMaterialMinMax(material, item0.id, item0.unit, client) + '\n';
                return true;
            });
        }
        return true;
    });
    return returnVal;
}

export const getMaterialMinMax = (id, objective, unit, client) => {
    const materials = store.getState().material.materials;

    for (var i in materials) {
        var material = materials[i];
        if (material._id === id) {
            for (var j in material.objectiveValues) {
                var item = material.objectiveValues[j];
                if (
                    item.id === objective &&
                    item.unit === unit &&
                    item.client === client
                ) {
                    return "[" + item.min + "-" + item.max + "]";
                }
            }
            break;
        }
    }
    return "[]";
}

export const createCertificateType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await certificateTypeAPI.create(data);
        } else {
            result = await certificateTypeAPI.update(data);
        }
        if (result) {
            toast.success('CertificateType successfully created');

            dispatch(getClients(result.all_clients));
            dispatch(getAnalysisTypes(result.analysises));
            dispatch(getMaterials(result.materials));
            dispatch(getObjectives(result.objectives));
            dispatch(getUnits(result.units));
            dispatch(getPackingTypes(result.packings));

            let sortedData = result.certificateTypes.sort((a, b) => {
                return Number(a.certificateType_id) > Number(b.certificateType_id) ? 1 : -1;
            });

            var certificate_list = [];
            result.certificateTypes.map((certificate) => {
                var analysis_data = getAnalysises(certificate.analysises, certificate.material, certificate.client)
                certificate_list.push({
                    '_id': certificate._id,
                    'certificateType_id': certificate.certificateType_id,
                    'material': result.materials.filter(item => item._id === certificate.material)[0].material + '-' + result.clients.filter(item => item._id === certificate.client)[0].name,
                    'certificateType': certificate.certificateType,
                    'analysises': analysis_data.trim(),
                    'remark': certificate.remark
                });
            });
            dispatch(slice.actions.getCertificateTypes(sortedData));
            dispatch(slice.actions.getExcelData(certificate_list));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteCertificateType = (id) => async (dispatch) => {
    try {
        const result = await certificateTypeAPI.delete(id);

        if (result) {
            toast.success('CertificateType successfully deleted');
            dispatch(getClients(result.all_clients));
            dispatch(getAnalysisTypes(result.analysises));
            dispatch(getMaterials(result.materials));
            dispatch(getObjectives(result.objectives));
            dispatch(getUnits(result.units));
            dispatch(getPackingTypes(result.packings));

            let sortedData = result.certificateTypes.sort((a, b) => {
                return Number(a.certificateType_id) > Number(b.certificateType_id) ? 1 : -1;
            });

            var certificate_list = [];
            result.certificateTypes.map((certificate) => {
                var analysis_data = getAnalysises(certificate.analysises, certificate.material, certificate.client)
                certificate_list.push({
                    '_id': certificate._id,
                    'certificateType_id': certificate.certificateType_id,
                    'material': result.materials.filter(item => item._id === certificate.material)[0].material + '-' + result.clients.filter(item => item._id === certificate.client)[0].name,
                    'certificateType': certificate.certificateType,
                    'analysises': analysis_data.trim(),
                    'remark': certificate.remark
                });
            });
            dispatch(slice.actions.getCertificateTypes(sortedData));
            dispatch(slice.actions.getExcelData(certificate_list));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await certificateTypeAPI.upload(data);

        dispatch(getClients(result.all_clients));
        dispatch(getAnalysisTypes(result.analysises));
        dispatch(getMaterials(result.materials));
        dispatch(getObjectives(result.objectives));
        dispatch(getUnits(result.units));
        dispatch(getPackingTypes(result.packings));

        let sortedData = result.certificateTypes.sort((a, b) => {
            return Number(a.certificateType_id) > Number(b.certificateType_id) ? 1 : -1;
        });

        var certificate_list = [];
        result.certificateTypes.map((certificate) => {
            var analysis_data = getAnalysises(certificate.analysises, certificate.material, certificate.client)
            certificate_list.push({
                '_id': certificate._id,
                'certificateType_id': certificate.certificateType_id,
                'material': result.materials.filter(item => item._id === certificate.material)[0].material + '-' + result.clients.filter(item => item._id === certificate.client)[0].name,
                'certificateType': certificate.certificateType,
                'analysises': analysis_data.trim(),
                'remark': certificate.remark
            });
        });
        dispatch(slice.actions.getCertificateTypes(sortedData));
        dispatch(slice.actions.getExcelData(certificate_list));

        toast.success('CertificateType CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}