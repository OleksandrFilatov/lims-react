import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { userTypeAPI } from '../api/lims/usertype-api';

const initialState = {
    userTypes: [],
    userType: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'userType',
    initialState,
    reducers: {
        getUserTypes(state, action) {
            state.userTypes = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getUserTypes } = slice.actions;

export const getUserTypesData = () => async (dispatch) => {
    try {
        let result = await userTypeAPI.getUserTypes();

        let sortedData = result.sort((a, b) => {
            return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUserTypes(sortedData));
        dispatch(slice.actions.getExcelData(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createUserType = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await userTypeAPI.create(data);
        } else {
            result = await userTypeAPI.update(data);
        }
        if (result) {
            toast.success('UserType successfully created');
            const usertype_list = result.map((usertype) => {
                return {
                    "userType_id": usertype.userType_id,
                    "userType": usertype.userType,
                    "labInput": usertype.labInput,
                    "labAnalysis": usertype.labAnalysis,
                    "labAdmin": usertype.labAdmin,
                    "stockUser": usertype.stockUser,
                    "stockAdmin": usertype.stockAdmin,
                    "hsImport": usertype.hsImport,
                    "hsExport": usertype.hsExport,
                    "hsAdmin": usertype.hsAdmin,
                    "geologyImport": usertype.geologyImport,
                    "geologyExport": usertype.geologyExport,
                    "geologyAdmin": usertype.geologyAdmin,
                    "remark": usertype.remark,
                    "_id": usertype._id
                }
            });
            let sortedData = result.sort((a, b) => {
                return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
            });
            let sortedExcelData = usertype_list.sort((a, b) => {
                return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUserTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
}

export const deleteUserType = (id) => async (dispatch) => {
    try {
        const result = await userTypeAPI.delete(id);

        if (result) {
            toast.success('UserType successfully deleted');
            var usertype_list = result.map((usertype) => {
                return {
                    "userType_id": usertype.userType_id,
                    "userType": usertype.userType,
                    "labInput": usertype.labInput,
                    "labAnalysis": usertype.labAnalysis,
                    "labAdmin": usertype.labAdmin,
                    "stockUser": usertype.stockUser,
                    "stockAdmin": usertype.stockAdmin,
                    "hsImport": usertype.hsImport,
                    "hsExport": usertype.hsExport,
                    "hsAdmin": usertype.hsAdmin,
                    "geologyImport": usertype.geologyImport,
                    "geologyExport": usertype.geologyExport,
                    "geologyAdmin": usertype.geologyAdmin,
                    "remark": usertype.remark,
                    "_id": usertype._id
                };
            });

            let sortedData = result.sort((a, b) => {
                return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
            });
            let sortedExcelData = usertype_list.sort((a, b) => {
                return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUserTypes(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await userTypeAPI.upload(data);
        let sortedData = result.sort((a, b) => {
            return Number(a.userType_id) > Number(b.userType_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUserTypes(sortedData));
        toast.success('UserType CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}