import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { packingTypeAPI } from '../api/lims/packingType-api';

const initialState = {
    packingTypes: [],
    packingType: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'packingType',
    initialState,
    reducers: {
        getPackingTypes(state, action) {
            state.packingTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getPackingTypes } = slice.actions;

export const getPackingTypesData = () => async (dispatch) => {
    try {
        const result = await packingTypeAPI.getUsers();

        const packingtype_list = result.map((packingType) => {
            return {
                packingType_id: packingType.packingType_id,
                packingType: packingType.packingType,
                remark: packingType.remark,
                _id: packingType._id
            }
        });
        let sortedData = result.sort((a, b) => {
            return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
        });
        let sortedExcelData = packingtype_list.sort((a, b) => {
            return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getPackingTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createPackingType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await packingTypeAPI.create(data);
        } else {
            result = await packingTypeAPI.update(data);
        }
        if (result) {
            toast.success('PackingType successfully created');
            const packingtype_list = result.map((packingType) => {
                return {
                    packingType_id: packingType.packingType_id,
                    packingType: packingType.packingType,
                    remark: packingType.remark,
                    _id: packingType._id
                }
            });
            let sortedData = result.sort((a, b) => {
                return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
            });
            let sortedExcelData = packingtype_list.sort((a, b) => {
                return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getPackingTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deletePackingType = (id) => async (dispatch) => {
    try {
        const result = await packingTypeAPI.delete(id);

        if (result) {
            toast.success('PackingType successfully deleted');
            const packingtype_list = result.map((packingType) => {
                return {
                    packingType_id: packingType.packingType_id,
                    packingType: packingType.packingType,
                    remark: packingType.remark,
                    _id: packingType._id
                }
            });
            let sortedData = result.sort((a, b) => {
                return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
            });
            let sortedExcelData = packingtype_list.sort((a, b) => {
                return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getPackingTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await packingTypeAPI.upload(data);

        const packingtype_list = result.map((packingType) => {
            return {
                packingType_id: packingType.packingType_id,
                packingType: packingType.packingType,
                remark: packingType.remark,
                _id: packingType._id
            }
        });
        let sortedData = result.sort((a, b) => {
            return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
        });
        let sortedExcelData = packingtype_list.sort((a, b) => {
            return Number(a.packingType_id) > Number(b.packingType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getPackingTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('PackingType CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}