import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { analysisTypeAPI } from '../api/lims/analysisType-api';
import { getUnits } from './unit';
import { getObjectives } from './objective';

const initialState = {
    analysisTypes: [],
    analysisType: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'analysisType',
    initialState,
    reducers: {
        getAnalysisTypes(state, action) {
            state.analysisTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        },
        updateAnalysisType(state, action) {
            state.analysisTypes = state.analysisTypes.map(aType => aType._id === action.payload._id ? action.payload : aType);
        },
        updateExcelData(state, action) {
            state.export_all_data = state.export_all_data.map(item => item.analysisType_id === action.payload.analysisType_id ? action.payload : item);
        }
    }
});

export const { reducer } = slice;

export const { analysisTypes } = slice.getInitialState();

export const { getAnalysisTypes } = slice.actions;

export const getAnalysisTypesData = () => async (dispatch) => {
    try {
        const result = await analysisTypeAPI.getAnalysisTypes();
        // console.log(result);
        const analysisType_list = result.analysisTypes.map((analysistype) => {
            let objectiveHistory_data = '';
            analysistype.objectives.map(obj => {
                objectiveHistory_data += result.objectives.filter(o => o._id === obj.id)[0].objective + " " + result.units.filter(u => u._id === obj.unit)[0].unit + "\n"
            });
            return {
                analysisType_id: analysistype.analysisType_id,
                analysisType: analysistype.analysisType,
                norm: analysistype.norm,
                objectives: objectiveHistory_data,
                remark: analysistype.remark,
                _id: analysistype._id
            }
        });
        let sortedData = result.analysisTypes.sort((a, b) => {
            return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
        });
        let sortedExcelData = analysisType_list.sort((a, b) => {
            return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getAnalysisTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));
        dispatch(getUnits(result.units));
        dispatch(getObjectives(result.objectives));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createAnalysisType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await analysisTypeAPI.create(data);
        } else {
            result = await analysisTypeAPI.update(data);
        }
        if (result) {
            toast.success('Analysis Type successfully created');
            const analysisType_list = result.analysisTypes.map((analysistype) => {
                return {
                    analysisType_id: analysistype.analysisType_id,
                    analysisType: analysistype.analysisType,
                    norm: analysistype.norm,
                    objectives: analysistype.objectives,
                    remark: analysistype.remark,
                    _id: analysistype._id
                }
            });
            let sortedData = result.analysisTypes.sort((a, b) => {
                return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
            });
            let sortedExcelData = analysisType_list.sort((a, b) => {
                return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getAnalysisTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
            dispatch(getUnits(result.units));
            dispatch(getObjectives(result.objectives));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteAnalysisType = (id) => async (dispatch) => {
    try {
        const result = await analysisTypeAPI.delete(id);

        if (result) {
            toast.success('Analysis Type successfully deleted');
            const analysisType_list = result.analysisTypes.map((analysistype) => {
                return {
                    analysisType_id: analysistype.analysisType_id,
                    analysisType: analysistype.analysisType,
                    norm: analysistype.norm,
                    objectives: analysistype.objectives,
                    remark: analysistype.remark,
                    _id: analysistype._id
                }
            });
            let sortedData = result.analysisTypes.sort((a, b) => {
                return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
            });
            let sortedExcelData = analysisType_list.sort((a, b) => {
                return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getAnalysisTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
            dispatch(getUnits(result.units));
            dispatch(getObjectives(result.objectives));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await analysisTypeAPI.upload(data);

        const analysisType_list = result.analysisTypes.map((analysistype) => {
            return {
                analysisType_id: analysistype.analysisType_id,
                analysisType: analysistype.analysisType,
                norm: analysistype.norm,
                objectives: analysistype.objectives,
                remark: analysistype.remark,
                _id: analysistype._id
            }
        });
        let sortedData = result.analysisTypes.sort((a, b) => {
            return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
        });
        let sortedExcelData = analysisType_list.sort((a, b) => {
            return Number(a.analysisType_id) > Number(b.analysisType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getAnalysisTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Analysis Type CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}

export const dragAnalysisType = (id, source, destination) => async (dispatch) => {
    try {
        const data = await analysisTypeAPI.dragAnalysisType(id, source, destination);

        dispatch(slice.actions.updateAnalysisType(data.aType));

        let objectiveHistory_data = '';
        data.aType.objectives.map(obj => {
            objectiveHistory_data += data.objectives.filter(o => o._id === obj.id)[0].objective + " " + data.units.filter(u => u._id === obj.unit)[0].unit + "\n"
        });
        const updated_exceldata = {
            analysisType_id: data.aType.analysisType_id,
            analysisType: data.aType.analysisType,
            norm: data.aType.norm,
            objectives: objectiveHistory_data,
            remark: data.aType.remark,
            _id: data.aType._id
        }

        dispatch(slice.actions.updateExcelData(updated_exceldata));
    } catch (err) {
        console.log(err);
    }
}