import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { certificateTemplateAPI } from '../api/lims/certificateTemplate-api';

const initialState = {
    certificateTemplates: [],
    export_all_data: []
};

const slice = createSlice({
    name: 'certificateTemplate',
    initialState,
    reducers: {
        getCertificateTemplates(state, action) {
            state.certificateTemplates = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        },
        addCertificateTemplate(state, action) {
            state.certificateTemplates = [...state.certificateTemplates, action.payload];
        },
        addExcelData(state, action) {
            state.export_all_data = [...state.export_all_data, action.payload];
        },
        deleteCertificateTemplate(state, action) {
            state.certificateTemplates = state.certificateTemplates.filter(item => item._id !== action.payload);
        },
        deleteExcelData(state, action) {
            state.export_all_data = state.export_all_data.filter(item => item.id !== action.payload)
        },
        updateCertificateTemplate(state, action) {
            state.certificateTemplates = state.certificateTemplates.map(item => item._id !== action.payload._id ? item : action.payload);
        },
        updateExcelData(state, action) {
            state.export_all_data = state.export_all_data.map(item => item.id !== action.payload.id ? item : action.payload);
        }
    }
});

export const { reducer } = slice;

export const { getCertificateTemplates } = slice.actions;

export const getCertificateTemplatesData = () => async (dispatch) => {
    try {
        let result = await certificateTemplateAPI.getCertificateTemplates();

        const export_data = result.map(data => {
            return {
                name: data.name,
                certificatetitle: data.certificatetitle,
                company: data.company,
                logo: data.logo_filename,
                place: data.place,
                date_format: data.date_format,
                productTitle: data.productdata.productTitle,
                productdata: data.productdata.productData
                    .filter(pData => pData.name !== '')
                    .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
                tablecolumns: data.tablecol
                    .filter(col => col.name !== "")
                    .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
                freetext: data.freetext,
                footer: data.footer_filename,
                logoUid: data.logoUid,
                footerUid: data.footerUid,
                id: data._id
            }
        })

        dispatch(slice.actions.getCertificateTemplates(result));
        dispatch(slice.actions.getExcelData(export_data));
    } catch (err) {
        console.log(err)
        // toast.error('Server internal error');
    }
};

export const createCertificateTemplate = (data) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.create(data);
        if (result) {
            toast.success(data.rowid ? "Successfully updated" : "Successfully added");
            let result = await certificateTemplateAPI.getCertificateTemplates();

            const export_data = result.map(data => {
                return {
                    name: data.name,
                    certificatetitle: data.certificatetitle,
                    company: data.company,
                    logo: data.logo_filename,
                    place: data.place,
                    date_format: data.date_format,
                    productTitle: data.productdata.productTitle,
                    productdata: data.productdata.productData
                        .filter(pData => pData.name !== '')
                        .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
                    tablecolumns: data.tablecol
                        .filter(col => col.name !== "")
                        .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
                    freetext: data.freetext,
                    footer: data.footer_filename,
                    logoUid: data.logoUid,
                    footerUid: data.footerUid,
                    id: data._id
                }
            })

            dispatch(slice.actions.getCertificateTemplates(result));
            dispatch(slice.actions.getExcelData(export_data));
        }
    } catch (err) {
        console.log(err)
        // toast.error('Internal server error');
    }
}

export const deleteCertificateTemplate = (id) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.delete(id);

        if (result) {
            toast.success('Successfully deleted');
            dispatch(slice.actions.deleteCertificateTemplate(id));
            dispatch(slice.actions.deleteExcelData(id));
        }
    } catch (err) {
        console.log(err);
    }
}

export const saveFreeText = (data) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.saveFreeText(data);
        toast.success("Free Text saved successfully");
        const updated_excelData = {
            name: result.name,
            certificatetitle: result.certificatetitle,
            company: result.company,
            logo: result.logo_filename,
            place: result.place,
            date_format: result.date_format,
            productTitle: result.productdata.productTitle,
            productdata: result.productdata.productData
                .filter(pData => pData.name !== '')
                .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
            tablecolumns: result.tablecol
                .filter(col => col.name !== "")
                .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
            freetext: result.freetext,
            footer: result.footer_filename,
            logoUid: result.logoUid,
            footerUid: result.footerUid,
            id: result._id
        }
        dispatch(slice.actions.updateCertificateTemplate(result));
        dispatch(slice.actions.updateExcelData(updated_excelData));
    } catch (err) {

    }
}

export const saveProductData = (data) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.saveProductData(data);
        toast.success("Product Data saved successfully");

        const updated_excelData = {
            name: result.name,
            certificatetitle: result.certificatetitle,
            company: result.company,
            logo: result.logo_filename,
            place: result.place,
            date_format: result.date_format,
            productTitle: result.productdata.productTitle,
            productdata: result.productdata.productData
                .filter(pData => pData.name !== '')
                .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
            tablecolumns: result.tablecol
                .filter(col => col.name !== "")
                .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
            freetext: result.freetext,
            footer: result.footer_filename,
            logoUid: result.logoUid,
            footerUid: result.footerUid,
            id: result._id
        }
        dispatch(slice.actions.updateCertificateTemplate(result));
        dispatch(slice.actions.updateExcelData(updated_excelData));
    } catch (err) {
        console.log(err)
    }
}

export const saveTableColumns = (data) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.saveTableColumns(data);
        toast.success("Table columns saved successfully");

        const updated_excelData = {
            name: result.name,
            certificatetitle: result.certificatetitle,
            company: result.company,
            logo: result.logo_filename,
            place: result.place,
            date_format: result.date_format,
            productTitle: result.productdata.productTitle,
            productdata: result.productdata.productData
                .filter(pData => pData.name !== '')
                .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
            tablecolumns: result.tablecol
                .filter(col => col.name !== "")
                .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
            freetext: result.freetext,
            footer: result.footer_filename,
            logoUid: result.logoUid,
            footerUid: result.footerUid,
            id: result._id
        }
        dispatch(slice.actions.updateCertificateTemplate(result));
        dispatch(slice.actions.updateExcelData(updated_excelData));
    } catch (err) {
        console.log(err);
        toast.error("Save Failed");
    }
}

export const copyRow = (id) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.copyRow(id);
        toast.success("Copy success");

        const export_data = result.map(data => {
            return {
                name: data.name,
                certificatetitle: data.certificatetitle,
                company: data.company,
                logo: data.logo_filename,
                place: data.place,
                date_format: data.date_format,
                productTitle: data.productdata.productTitle,
                productdata: data.productdata.productData
                    .filter(pData => pData.name !== '')
                    .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
                tablecolumns: data.tablecol
                    .filter(col => col.name !== "")
                    .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
                freetext: data.freetext,
                footer: data.footer_filename,
                logoUid: data.logoUid,
                footerUid: data.footerUid,
                id: data._id
            }
        })

        dispatch(slice.actions.getCertificateTemplates(result));
        dispatch(slice.actions.getExcelData(export_data));
    } catch (err) {
        console.log(err)
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await certificateTemplateAPI.upload(data);

        const export_data = result.map(data => {
            return {
                name: data.name,
                certificatetitle: data.certificatetitle,
                company: data.company,
                logo: data.logo_filename,
                place: data.place,
                date_format: data.date_format,
                productTitle: data.productdata.productTitle,
                productdata: data.productdata.productData
                    .filter(pData => pData.name !== '')
                    .map(pData => pData.name + "@@@" + pData.pagename + "@@@" + pData.fieldname + "\n").toString().replace(/\,/g, ""),
                tablecolumns: data.tablecol
                    .filter(col => col.name !== "")
                    .map(col => col.name + "@@@" + col.fieldname + "\n").toString().replace(/\,/g, ""),
                freetext: data.freetext,
                footer: data.footer_filename,
                logoUid: data.logoUid,
                footerUid: data.footerUid,
                id: data._id
            }
        })

        dispatch(slice.actions.getCertificateTemplates(result));
        dispatch(slice.actions.getExcelData(export_data));
        toast.success('CSV file successfully imported');
    } catch (err) {
        console.log(err)
    }
}