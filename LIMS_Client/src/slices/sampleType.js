import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { sampleTypeAPI } from '../api/lims/sampletype-api';

const initialState = {
    sampleTypes: [],
    sampleType: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'sampleType',
    initialState,
    reducers: {
        getSampleTypes(state, action) {
            state.sampleTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getSampleTypes } = slice.actions;

export const getSampleTypesData = () => async (dispatch) => {
    try {
        let result = await sampleTypeAPI.getSampleTypes();

        let sortedData = result.sort((a, b) => {
            return Number(a.sampleType_id) > Number(b.sampleType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getSampleTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createSampleType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await sampleTypeAPI.create(data);
        } else {
            result = await sampleTypeAPI.update(data);
        }
        if (result) {
            toast.success('SampleType successfully created');

            let sortedData = result.sort((a, b) => {
                return Number(a.sampleType_id) > Number(b.sampleType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getSampleTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
}

export const deleteSampleType = (id) => async (dispatch) => {
    try {
        const result = await sampleTypeAPI.delete(id);

        if (result) {
            toast.success('SampleType successfully deleted');
            let sortedData = result.sort((a, b) => {
                return Number(a.sampleType_id) > Number(b.sampleType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getSampleTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await sampleTypeAPI.upload(data);
        let sortedData = result.sort((a, b) => {
            return Number(a.sampleType_id) > Number(b.sampleType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getSampleTypes(sortedData));
        toast.success('SampleType CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}