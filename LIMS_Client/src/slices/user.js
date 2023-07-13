import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { userAPI } from '../api/lims/user-api';
import { getUserTypes } from './userType';

const initialState = {
    users: [],
    user: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUsers(state, action) {
            state.users = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const getUsers = () => async (dispatch) => {
    try {
        let result = await userAPI.getUsers();

        const user_list = result.users.map((user) => {
            return {
                user_id: user.user_id,
                userName: user.userName,
                email: user.email,
                password: user.password_text !== undefined ? user.password_text : '',
                user_type: user.user_type,
                remark: user.remark,
                _id: user._id
            }
        });
        let sortedData = result.users.sort((a, b) => {
            return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
        });
        let sortedExcelData = user_list.sort((a, b) => {
            return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUsers(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));
        dispatch(getUserTypes(result.userTypes));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createUser = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await userAPI.create(data);
        } else {
            result = await userAPI.update(data);
        }
        if (result) {
            toast.success('UserType successfully created');
            const user_list = result.users.map((user) => {
                return {
                    user_id: user.user_id,
                    userName: user.userName,
                    email: user.email,
                    password: user.password_text !== undefined ? user.password_text : '',
                    user_type: user.user_type,
                    remark: user.remark,
                    _id: user._id
                }
            });
            let sortedData = result.users.sort((a, b) => {
                return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
            });
            let sortedExcelData = user_list.sort((a, b) => {
                return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUsers(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteUser = (id) => async (dispatch) => {
    try {
        const result = await userAPI.delete(id);

        if (result) {
            toast.success('User successfully deleted');
            var user_list = result.users.map((user) => {
                return {
                    user_id: user.user_id,
                    userName: user.userName,
                    email: user.email,
                    password: user.password_text !== undefined ? user.password_text : '',
                    user_type: user.user_type,
                    remark: user.remark,
                    _id: user._id
                };
            });

            let sortedData = result.users.sort((a, b) => {
                return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
            });
            let sortedExcelData = user_list.sort((a, b) => {
                return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
            });
            dispatch(slice.actions.getUsers(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await userAPI.upload(data);

        var user_list = result.users.map((user) => {
            return {
                user_id: user.user_id,
                userName: user.userName,
                email: user.email,
                password: user.password_text !== undefined ? user.password_text : '',
                user_type: user.user_type,
                remark: user.remark,
                _id: user._id
            };
        });

        let sortedData = result.users.sort((a, b) => {
            return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
        });
        let sortedExcelData = user_list.sort((a, b) => {
            return Number(a.user_id) > Number(b.user_id) ? 1 : -1;
        });
        dispatch(slice.actions.getUsers(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('User CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}