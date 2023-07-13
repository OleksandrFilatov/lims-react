import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { materialAPI } from '../api/lims/material-api';
import { getObjectives } from './objective';
import { getAnalysisTypes } from './analysisType';
import { getClients } from './client';
import { getUnits } from './unit';
import { store } from '../store';

const initialState = {
    materials: [],
    material: {},
    objOptions: [],
    clientOptions: [],
    export_all_data: []
};

const slice = createSlice({
    name: 'material',
    initialState,
    reducers: {
        getMaterials(state, action) {
            state.materials = action.payload;
        },
        getObjectiveOptions(state, action) {
            state.objOptions = action.payload
        },
        getClientOptions(state, action) {
            state.clientOptions = action.payload
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getMaterials } = slice.actions;

export const getMaterialsData = () => async (dispatch) => {
    try {
        let result = await materialAPI.getMaterials();
        const data = result.clients.filter(c => c.name !== 'Default')
            .sort((a, b) => { return a.clientId - b.clientId })
            .map(client => {
                return {
                    label: client.name,
                    value: client._id
                }
            })

        let sortedData = result.materials.sort((a, b) => {
            return Number(a.material_id) > Number(b.material_id) ? 1 : -1;
        });

        dispatch(getObjectives(result.objectives));
        dispatch(getUnits(result.units));
        dispatch(getClients(result.clients));
        dispatch(getAnalysisTypes(result.analysisTypes));
        dispatch(slice.actions.getMaterials(sortedData));
        dispatch(slice.actions.getObjectiveOptions(result.obj_units));
        dispatch(slice.actions.getClientOptions(data));

        var material_list = [];
        Object.keys(result.materials).length > 0 && result.materials.map((material) => {
            var client_list = 'Default\n';
            var combination_list = '';
            combination_list += getTooltip(material, result.clients.filter(c => c.name === 'Default')[0]._id) + '\n';
            material.clients.map((client) => {
                client_list += client.name + '\n';
                combination_list += getTooltip(material, client._id) + '\n';
            });
            material_list.push({
                'material_id': material.material_id,
                "material": material.material,
                "client": client_list,
                "combination": combination_list,
                "remark": material.remark,
                '_id': material._id
            })
        });
        dispatch(slice.actions.getExcelData(material_list));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const getTooltip = (item, client) => {
    var count = 0;
    var ret = "";

    const objData = store.getState().objective.objectives;
    const analyData = store.getState().analysisType.analysisTypes;
    const unitData = store.getState().unit.units;
    item.objectiveValues.map((item0) => {
        if (item0.client !== client) return false;
        var name = objData.filter(obj => obj._id === item0.id).length ? objData.filter(obj => obj._id === item0.id)[0].objective : ''; //this.getObjectiveName(item0.id);
        var unit = unitData.filter(d => d._id === item0.unit).length ? unitData.filter(d => d._id === item0.unit)[0].unit : '';
        var analysis = analyData.filter(d => String(d._id) === String(item0.analysis)).length > 0 ? analyData.filter(d => d._id === item0.analysis)[0].analysisType : '';
        if (name !== "" && unit !== "") {
            ret =
                ret +
                analysis +
                "-" +
                name +
                " " +
                unit +
                ": " +
                "[" +
                item0.min +
                "-" +
                item0.max +
                "]" +
                ", ";
            count++;
        }

        return true;
    });

    return count === 0 ? "No Objectives" : ret;
}


export const createMaterial = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await materialAPI.create(data);
        } else {
            result = await materialAPI.update(data);
        }
        if (result) {
            toast.success('Material successfully created');

            let sortedData = result.materials.sort((a, b) => {
                return Number(a.material_id) > Number(b.material_id) ? 1 : -1;
            });
            dispatch(slice.actions.getMaterials(sortedData));

            var material_list = [];
            Object.keys(result.materials).length > 0 && result.materials.map((material) => {
                var client_list = 'Default\n';
                var combination_list = '';
                combination_list += getTooltip(material, result.clients.filter(c => c.name === 'Default')[0]._id) + '\n';
                material.clients.map((client) => {
                    client_list += client.name + '\n';
                    combination_list += getTooltip(material, client._id) + '\n';
                });
                material_list.push({
                    'material_id': material.material_id,
                    "material": material.material,
                    "client": client_list,
                    "combination": combination_list,
                    "remark": material.remark,
                    '_id': material._id
                })
            });
            let sortedExcelData = material_list.sort((a, b) => {
                return a.material_id > b.material_id ? 1 : -1;
            });
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteMaterial = (id) => async (dispatch) => {
    try {
        const result = await materialAPI.delete(id);

        if (result) {
            toast.success('Material successfully deleted');

            let sortedData = result.materials.sort((a, b) => {
                return Number(a.material_id) > Number(b.material_id) ? 1 : -1;
            });
            dispatch(slice.actions.getMaterials(sortedData));

            var material_list = [];
            Object.keys(result.materials).length > 0 && result.materials.map((material) => {
                var client_list = 'Default\n';
                var combination_list = '';
                combination_list += getTooltip(material, result.clients.filter(c => c.name === 'Default')[0]._id) + '\n';
                material.clients.map((client) => {
                    client_list += client.name + '\n';
                    combination_list += getTooltip(material, client._id) + '\n';
                });
                material_list.push({
                    'material_id': material.material_id,
                    "material": material.material,
                    "client": client_list,
                    "combination": combination_list,
                    "remark": material.remark,
                    '_id': material._id
                })
            });
            let sortedExcelData = material_list.sort((a, b) => {
                return a.material_id > b.material_id ? 1 : -1;
            });
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await materialAPI.upload(data);

        let sortedData = result.materials.sort((a, b) => {
            return Number(a.material_id) > Number(b.material_id) ? 1 : -1;
        });
        dispatch(slice.actions.getMaterials(sortedData));

        var material_list = [];
        Object.keys(result.materials).length > 0 && result.materials.map((material) => {
            var client_list = 'Default\n';
            var combination_list = '';
            combination_list += getTooltip(material, result.clients.filter(c => c.name === 'Default')[0]._id) + '\n';
            material.clients.map((client) => {
                client_list += client.name + '\n';
                combination_list += getTooltip(material, client._id) + '\n';
            });
            material_list.push({
                'material_id': material.material_id,
                "material": material.material,
                "client": client_list,
                "combination": combination_list,
                "remark": material.remark,
                '_id': material._id
            })
        });
        let sortedExcelData = material_list.sort((a, b) => {
            return a.material_id > b.material_id ? 1 : -1;
        });
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Material CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}