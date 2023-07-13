import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { oreTypeAPI } from '../api/lims/oreType-api';

const initialState = {
    oreTypes: [],
    export_all_data: []
};

const slice = createSlice({
    name: 'oreType',
    initialState,
    reducers: {
        getOreTypes(state, action) {
            state.oreTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getOreTypes } = slice.actions;

export const getOreTypesData = () => async (dispatch) => {
    try {
        let result = await oreTypeAPI.getOreTypes();

        let sortedData = result.sort((a, b) => {
            return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getOreTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createOreType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await oreTypeAPI.create(data);
        } else {
            result = await oreTypeAPI.update(data);
        }
        if (result) {
            toast.success('OreType successfully created');
            let sortedData = result.sort((a, b) => {
                return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getOreTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteOreType = (id) => async (dispatch) => {
    try {
        const result = await oreTypeAPI.delete(id);

        if (result) {
            toast.success('OreType successfully deleted');
            let sortedData = result.sort((a, b) => {
                return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getOreTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await oreTypeAPI.upload(data);

        let sortedData = result.sort((a, b) => {
            return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
        });
        let sortedExcelData = result.sort((a, b) => {
            return Number(a.oreType_id) > Number(b.oreType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getOreTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('OreType CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}