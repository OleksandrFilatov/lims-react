import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    settings: {},
};

const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        getSettings(state, action) {
            state.settings = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getSettings } = slice.actions;