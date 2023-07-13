import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { geologyAPI } from '../api/lims/geology-api';

const initialState = {
    geologies: [],
    export_all_data: [],
    comments: [],
    geology_lab_objectives: [],
    geology_lab_objectives_excel_data: []
};

const slice = createSlice({
    name: 'geology',
    initialState,
    reducers: {
        getGeologies(state, action) {
            state.geologies = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        },
        addGeology(state, action) {
            state.geologies = [...state.geologies, action.payload];
        },
        updateGeology(state, action) {
            state.geologies = state.geologies.map(geo => String(geo._id) === String(action.payload._id) ? action.payload : geo);
        },
        getComments(state, action) {
            state.comments = action.payload;
        },
        updateGeologies(state, action) {
            state.geologies = state.geologies.map(geo => action.payload.filter(item => item._id === geo._id).length > 0 ?
                action.payload.filter(item => item._id === geo._id)[0] :
                geo
            );
        },
        getGeologyLabObjectives(state, action) {
            state.geology_lab_objectives = action.payload;
        },
        addGeologyLabObjectives(state, action) {
            state.geology_lab_objectives = state.geology_lab_objectives.concat(action.payload);
        },
        deleteGeologyLabObjective(state, action) {
            state.geology_lab_objectives = state.geology_lab_objectives.filter(item => item._id !== action.payload);
        },
        getGeologyLabObjectiveExcelData(state, action) {
            state.geology_lab_objectives_excel_data = action.payload;
        },
        deleteGeologyLabObjectiveExcelData(state, action) {
            state.geology_lab_objectives_excel_data = state.geology_lab_objectives_excel_data.filter(item => item._id !== action.payload);
        }
    }
});

export const { reducer } = slice;

export const { getGeologies, updateGeology, updateGeologies, getExcelData } = slice.actions;

export const getGeologiesData = () => async (dispatch) => {
    try {
        let result = await geologyAPI.getGeologies();
        let sortedData = result.sort((a, b) => {
            return Number(a.geology_id) > Number(b.geology_id) ? 1 : -1;
        });

        dispatch(slice.actions.getGeologies(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createGeology = (data) => async (dispatch) => {
    try {
        let result;
        result = await geologyAPI.create(data);
        if (result) {
            toast.success('Geology successfully created');
            dispatch(slice.actions.addGeology(result));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteGeology = (id) => async (dispatch) => {
    try {
        const result = await geologyAPI.delete(id);

        if (result) {
            toast.success('Geology successfully deleted');
            dispatch(slice.actions.getGeologies(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.upload(data);

        let sortedData = result.sort((a, b) => {
            return Number(a.geology_id) > Number(b.geology_id) ? 1 : -1;
        });
        dispatch(slice.actions.getGeologies(sortedData));

        toast.success('Geology CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}

export const createGeneral = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.createGeneral(data);
        if (result) {
            dispatch(slice.actions.updateGeology(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const createMarkscheiderei = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.createMarkscheiderei(data);
        if (result) {
            dispatch(slice.actions.updateGeology(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const createLaboratory = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.createLaboratory(data);
        if (result) {
            dispatch(slice.actions.updateGeology(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const createGeoGeology = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.createGeoGeology(data);
        if (result) {
            dispatch(slice.actions.updateGeology(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const shiftGeology = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.shiftGeology(data);
        if (result) {
            dispatch(slice.actions.updateGeology(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const getGeologyComments = (id) => async (dispatch) => {
    try {
        const result = await geologyAPI.getGeologyComments(id);
        if (result) {
            dispatch(slice.actions.getComments(result));
        }
    } catch (err) {
        console.log(err);
    }
}

export const createGeologyLabObjective = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.createGeologyLabObjective(data);

        var excel_data = [];
        result.map(item => {
            excel_data.push({
                objective_id: item.objective.objective_id,
                objective: item.objective.objective + ' ' + item.unit.unit,
                remark: item.objective.remark,
                _id: item._id
            })
        })
        dispatch(slice.actions.getGeologyLabObjectives(result));
        dispatch(slice.actions.getGeologyLabObjectiveExcelData(excel_data));
    } catch (err) {
        console.log(err);
    }
}

export const getGeologyLabObjectivesData = () => async (dispatch) => {
    try {
        const result = await geologyAPI.getGeologyLabObjectives();

        var excel_data = [];
        result.map(item => {
            excel_data.push({
                objective_id: item.objective.objective_id,
                objective: item.objective.objective + ' ' + item.unit.unit,
                remark: item.objective.remark,
                _id: item._id
            })
        })
        dispatch(slice.actions.getGeologyLabObjectives(result));
        dispatch(slice.actions.getGeologyLabObjectiveExcelData(excel_data));
    } catch (err) {
        console.log(err);
    }
}

export const deleteGeologyLabObjectiveData = (id) => async (dispatch) => {
    try {
        const result = await geologyAPI.deleteGeologyLabObjective(id);
        if (result) {
            dispatch(slice.actions.deleteGeologyLabObjective(id))
            dispatch(slice.actions.deleteGeologyLabObjectiveExcelData(id));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadGeologyLabObjectives = (data) => async (dispatch) => {
    try {
        const result = await geologyAPI.uploadGeologyLabObjectives(data);

        var excel_data = [];
        result.map(item => {
            excel_data.push({
                objective_id: item.objective.objective_id,
                objective: item.objective.objective + ' ' + item.unit.unit,
                remark: item.objective.remark,
                _id: item._id
            })
        })
        dispatch(slice.actions.getGeologyLabObjectives(result));
        dispatch(slice.actions.getGeologyLabObjectiveExcelData(excel_data));
        toast.success('CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}
