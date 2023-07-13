import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { unitAPI } from '../api/lims/unit-api';

const initialState = {
    units: [],
    unit: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'unit',
    initialState,
    reducers: {
        getUnits(state, action) {
            state.units = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { units } = slice.getInitialState();

export const { getUnits } = slice.actions;

export const getUnitsData = () => async (dispatch) => {
    try {
        const result = await unitAPI.getUnits();

        const unit_list = result.map((uType) => {
            return {
                unit_id: uType.unit_id,
                unit: uType.unit,
                remark: uType.remark,
                _id: uType._id
            }
        });
        let sortedData = result.sort((a, b) => {
            return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
        });
        let sortedExcelData = unit_list.sort((a, b) => {
            return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUnits(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createUnit = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await unitAPI.create(data);
        } else {
            result = await unitAPI.update(data);
        }
        if (result) {
            toast.success('Unit successfully created');
            const unit_list = result.map((uType) => {
                return {
                    unit_id: uType.unit_id,
                    unit: uType.unit,
                    remark: uType.remark,
                    _id: uType._id
                }
            });
            let sortedData = result.sort((a, b) => {
                return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
            });
            let sortedExcelData = unit_list.sort((a, b) => {
                return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUnits(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteUnit = (id) => async (dispatch) => {
    try {
        const result = await unitAPI.delete(id);

        if (result) {
            toast.success('Unit successfully deleted');
            const unit_list = result.map((u) => {
                return {
                    unit_id: u.unit_id,
                    unit: u.unit,
                    remark: u.remark,
                    _id: u._id
                }
            });
            let sortedData = result.sort((a, b) => {
                return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
            });
            let sortedExcelData = unit_list.sort((a, b) => {
                return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUnits(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await unitAPI.upload(data);

        const unit_list = result.map((u) => {
            return {
                unit_id: u.unit_id,
                unit: u.unit,
                remark: u.remark,
                _id: u._id
            }
        });
        let sortedData = result.sort((a, b) => {
            return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
        });
        let sortedExcelData = unit_list.sort((a, b) => {
            return Number(a.unit_id) > Number(b.unit_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUnits(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Unit CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}