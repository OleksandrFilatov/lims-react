import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { clientAPI } from '../api/lims/client-api';

const initialState = {
    clients: [],
    client: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        getClients(state, action) {
            state.clients = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const { getClients } = slice.actions;

export const getClientsData = () => async (dispatch) => {
    try {
        let result = await clientAPI.getClients();
        console.log(result)

        let sortedData = result.sort((a, b) => {
            return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
        });
        dispatch(slice.actions.getClients(sortedData));
        dispatch(slice.actions.getExcelData(sortedData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createClient = (data) => async (dispatch) => {
    try {
        let result;
        if (!Object(data).hasOwnProperty('id')) {
            result = await clientAPI.create(data);
        } else {
            result = await clientAPI.update(data);
        }
        if (result) {
            toast.success('Client successfully created');
            let sortedData = result.sort((a, b) => {
                return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
            });
            dispatch(slice.actions.getClients(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err)
        toast.error('Internal server error');
    }
}

export const deleteClient = (id) => async (dispatch) => {
    try {
        const result = await clientAPI.delete(id);

        if (result) {
            toast.success('Client successfully deleted');
            let sortedData = result.sort((a, b) => {
                return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
            });
            let sortedExcelData = result.sort((a, b) => {
                return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
            });
            dispatch(slice.actions.getClients(sortedData));
            dispatch(slice.actions.getExcelData(sortedExcelData));
        }
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await clientAPI.upload(data);
        console.log("Clients: ", result);
        let sortedData = result.clients.sort((a, b) => {
            return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
        });
        let sortedExcelData = result.clients.sort((a, b) => {
            return Number(a.clientId) > Number(b.clientId) ? 1 : -1;
        });
        dispatch(slice.actions.getClients(sortedData));
        dispatch(slice.actions.getExcelData(sortedExcelData));

        toast.success('Client CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}