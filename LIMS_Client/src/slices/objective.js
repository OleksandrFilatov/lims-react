import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { objectiveAPI } from '../api/lims/objective-api';
import { getUnits } from './unit';

const initialState = {
    objectives: [],
    objective: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'objective',
    initialState,
    reducers: {
        getObjectives(state, action) {
            state.objectives = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        },
        _objectives(state) {
            return state.objectives;
        },
        updateObjective(state, action) {
            state.objectives = state.objectives.map(obj => obj._id === action.payload._id ? action.payload : obj);
        },
        updateExcelData(state, action) {
            state.export_all_data = state.export_all_data.map(item => item.objective_id === action.payload.objective_id ? action.payload : item);
        }
    }
});

export const { reducer } = slice;

export const { getObjectives, _objectives } = slice.actions;

export const getObjectivesData = () => async (dispatch) => {
    try {
        const result = await objectiveAPI.getObjectives();

        const objective_list = result.objectives.map((obj) => {
            return {
                objective_id: obj.objective_id,
                objective: obj.objective,
                units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n"),
                remark: obj.remark,
                _id: obj._id
            }
        });
        let sortedData = result.objectives.sort((a, b) => {
            return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
        });
        let sortedExcelData = objective_list.sort((a, b) => {
            return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
        });
        dispatch(slice.actions.getObjectives(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));
        dispatch(getUnits(result.units))
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createObjective = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await objectiveAPI.create(data);
        } else {
            result = await objectiveAPI.update(data);
        }
        if (result) {
            toast.success('Objective successfully created');
            const objective_list = result.objectives.map((obj) => {
                return {
                    objective_id: obj.objective_id,
                    objective: obj.objective,
                    units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n"),
                    remark: obj.remark,
                    _id: obj._id
                }
            });
            let sortedData = result.objectives.sort((a, b) => {
                return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
            });
            let sortedExcelData = objective_list.sort((a, b) => {
                return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
            });
            dispatch(slice.actions.getObjectives(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
            dispatch(getUnits(result.units))
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteObjective = (id) => async (dispatch) => {
    try {
        const result = await objectiveAPI.delete(id);

        if (result) {
            toast.success('Objective successfully deleted');
            const objective_list = result.objectives.map((obj) => {
                return {
                    objective_id: obj.objective_id,
                    objective: obj.objective,
                    units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n"),
                    remark: obj.remark,
                    _id: obj._id
                }
            });
            let sortedData = result.objectives.sort((a, b) => {
                return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
            });
            let sortedExcelData = objective_list.sort((a, b) => {
                return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
            });
            dispatch(slice.actions.getObjectives(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
            dispatch(getUnits(result.units))
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await objectiveAPI.upload(data);

        const objective_list = result.objectives.map((obj) => {
            return {
                objective_id: obj.objective_id,
                objective: obj.objective,
                units: obj.units.map(unit => unit.unit).toString().replace(/,/g, "\n"),
                remark: obj.remark,
                _id: obj._id
            }
        });
        let sortedData = result.objectives.sort((a, b) => {
            return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
        });
        let sortedExcelData = objective_list.sort((a, b) => {
            return Number(a.objective_id) > Number(b.objective_id) ? 1 : -1;
        });
        dispatch(slice.actions.getObjectives(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Objective CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}

export const dragObjective = (id, source, destination) => async (dispatch) => {
    try {
        const data = await objectiveAPI.dragObjective(id, source, destination);

        dispatch(slice.actions.updateObjective(data));

        const updated_exceldata = {
            objective_id: data.objective_id,
            objective: data.objective,
            units: data.units.map(unit => unit.unit).toString().replace(/,/g, "\n"),
            remark: data.remark,
            _id: data._id
        }

        dispatch(slice.actions.updateExcelData(updated_exceldata));
    } catch (err) {
        console.log(err);
    }
}