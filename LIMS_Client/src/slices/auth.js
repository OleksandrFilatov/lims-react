import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth-api';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
    isAuthenticated: false,
    user: {},
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        getUser(state, action) {
            state.user = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { setAuthenticated, getUser } = slice.actions;

export const setUser = (data) => async (dispatch) => {
    dispatch(slice.actions.setAuthenticated(true));
    dispatch(slice.actions.getUser(data));
}

export const login = (username, password, router) => async (dispatch) => {
    try {
        const result = await authApi.login(username, password);

        if (result?.success) {
            const accessToken = result.token;
            const user = await authApi.me(accessToken);

            setAuthToken(accessToken);
            localStorage.setItem('accessToken', accessToken);

            dispatch(slice.actions.setAuthenticated(true));
            dispatch(slice.actions.getUser(user));

            const returnUrl = '/input/laboratory'; //router.query.returnUrl || '/dashboard';
            router.push(returnUrl);
        }
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const logout = () => dispatch => {
    dispatch(slice.actions.setAuthenticated(false));
    dispatch(slice.actions.getUser({}));
    localStorage.removeItem('accessToken');
    window.location.href = '/authentication/login';
}
