import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { reasonAPI } from '../api/lims/reason-api';

const initialState = {
    reasons: [],
    reason: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'reason',
    initialState,
    reducers: {
        getReasons(state, action) {
            state.reasons = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getReasons } = slice.actions;

export const getReasonsData = () => async (dispatch) => {
    try {
        let result = await reasonAPI.getReasons();

        let sortedData = result.sort((a, b) => {
            return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
        });
        dispatch(slice.actions.getReasons(sortedData));
        dispatch(slice.actions.getExcelData(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createReason = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await reasonAPI.create(data);
        } else {
            result = await reasonAPI.update(data);
        }
        if (result) {
            toast.success('Reason successfully created');
            let sortedData = result.sort((a, b) => {
                return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
            });
            dispatch(slice.actions.getReasons(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteReason = (id) => async (dispatch) => {
    try {
        const result = await reasonAPI.delete(id);

        if (result) {
            toast.success('Reason successfully deleted');
            let sortedData = result.sort((a, b) => {
                return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
            });
            dispatch(slice.actions.getReasons(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await reasonAPI.upload(data);

        let sortedData = result.sort((a, b) => {
            return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
        });
        let sortedExcelData = result.sort((a, b) => {
            return Number(a.reason_id) > Number(b.reason_id) ? 1 : -1;
        });
        dispatch(slice.actions.getReasons(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Reason CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}