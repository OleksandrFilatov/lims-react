import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import moment from 'moment';
import { store } from '../store';
import { laboratoryAPI } from '../api/lims/laboratory-api';
import { getAnalysisTypes } from './analysisType';
import { getCertificateTypes } from './certificateType';
import { getClients } from './client';
import { getMaterials } from './material';
import { getPackingTypes } from './packingType';
import { getSampleTypes } from './sampleType';
import { getSettings } from './setting';
import { getUnits } from './unit';
import { getObjectives } from './objective';
import { getCertificateTemplates } from './certificateTemplate';

const initialState = {
    laboratories: [],
    laboratory: {},
    export_all_data: []
};

const slice = createSlice({
    name: 'laboratory',
    initialState,
    reducers: {
        getLaboratories(state, action) {
            state.laboratories = action.payload;
        },
        getExcelData(state, action) {
            state.export_all_data = action.payload;
        }
    }
});

export const { reducer } = slice;

export const getInputLaboratoryData = () => async (dispatch) => {
    try {
        let result = await laboratoryAPI.getLaboratories();
        console.log(result)
        const excellData = result.inputLabs.map(data => {
            return {
                _id: data._id,
                due_date: moment(data.due_date).format(`${result.settings.date_format} HH:mm:ss`),
                sample_type: data.sample_type.sampleType,
                material: data.material.material,
                material_category: data.material_category.name,
                client: data.client.name,
                packing_type: data.packing_type.length > 0 ? data.packing_type[0].packingType : '',
                a_types: data.a_types.map(aType => aType.analysisType).join('\n'),
                c_types: data.c_types.map(cType => cType.certificateType).join('\n'),
                sending_date: moment(data.sending_date).format(`${result.settings.date_format} HH:mm:ss`),
                sample_date: moment(data.sample_date).format(`${result.settings.date_format} HH:mm:ss`),
                distributor: data.distributor,
                geo_locaion: data.geo_locaion,
                remark: data.remark,
                weight: data.weight,
                weight_comment: data.weight_comment,
                material_left: data.material_left,
                lot_number: data.charge.map(ch => moment(ch.date).format(`${result.settings.date_format} HH:mm:ss`) + ',' + ch.comment).join('\n'),
                stock_sample: data.charge.length > 0 ? (data.sample_type.stockSample === false ? result.inputLabs.filter(d => d.sample_type.stockSample === true)
                    .filter(data1 =>
                        data1.material._id === data.material._id &&
                        data1.charge.length > 0 && data.charge.filter(i => i.date === data1.charge[0].date).length > 0
                    ).map(i => i.sample_type.sampleType + " " + i.material.material + " " + i.material_category.name + " " + moment(i.charge[0].date).format(`${result.settings.date_format} HH:mm:ss`)).join('\n') : ''
                ) : '',
                aT_validate: data.aT_validate.map(aT => aT.isValid + "," + aT.aType).join('\n'),
                stock_specValues: data.stock_specValues.map(val => val.histId + "," + val.value + "," + val.obj + "," + val.stock + "," + val.client + "," + val.aType + "," + val.isValid).join('\n'),
                stock_weights: data.stock_weights.map(w => w.weight + "," + w.stock).join('\n'),
                delivering_address_name1: data.delivery.name1,
                delivering_address_name2: data.delivery.name2,
                delivering_address_name3: data.delivery.name3,
                delivering_address_title: data.delivery.title,
                delivering_address_country: data.delivery.country,
                delivering_address_street: data.delivery.street,
                delivering_address_place: data.delivery.place,
                delivering_address_zip: data.delivery.zipcode,
                delivering_customer_product_code: data.delivery.productCode,
                delivering_email_address: data.delivery.email,
                delivering_fetch_date: moment(data.delivery.fetch_date).format(`${result.settings.date_format} HH:mm:ss`),
                delivering_order_id: data.delivery.orderId,
                delivering_customer_order_id: data.delivery.customer_orderId,
                delivering_pos_id: data.delivery.posId,
                delivering_w_target: data.delivery.w_target,
                deliveryId: data.delivery._id
            }
        })
        dispatch(getMaterials(result.materials));
        dispatch(getSampleTypes(result.sampleTypes));
        dispatch(getPackingTypes(result.packingTypes));
        dispatch(getAnalysisTypes(result.analysisTypes));
        dispatch(getCertificateTypes(result.certificateTypes));
        dispatch(getClients(result.clients));
        dispatch(getSettings({
            date_format: Object(result.settings).hasOwnProperty('date_format') ? result.settings.date_format : 'DD.MM.YYYY'
        }));
        dispatch(slice.actions.getLaboratories(result.inputLabs));
        dispatch(slice.actions.getExcelData(excellData));
    } catch (err) {
        console.log(err)
        toast.error('Server internal error');
    }
};

export const createLaboratory = (data) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.create(data);
        toast.success('Laboratory successfully created');
        const date_format = store.getState().setting.settings.date_format;
        const excellData = result.map(item => {
            return {
                _id: item._id,
                due_date: moment(item.due_date).format(`${date_format} HH:mm:ss`),
                sample_type: item.sample_type.sampleType,
                material: item.material.material,
                material_category: item.material_category.name,
                client: item.client.name,
                packing_type: item.packing_type.length > 0 ? item.packing_type[0].packingType : '',
                a_types: item.a_types.map(aType => aType.analysisType).join('\n'),
                c_types: item.c_types.map(cType => cType.certificateType).join('\n'),
                sending_date: moment(item.sending_date).format(`${date_format} HH:mm:ss`),
                sample_date: moment(item.sample_date).format(`${date_format} HH:mm:ss`),
                distributor: item.distributor,
                geo_locaion: item.geo_locaion,
                remark: item.remark,
                weight: item.weight,
                weight_comment: item.weight_comment,
                material_left: item.material_left,
                lot_number: item.charge.map(ch => moment(ch.date).format(`${date_format} HH:mm:ss`) + ',' + ch.comment).join('\n'),
                // stock_sample: item.charge.length > 0 ? (item.sample_type.stockSample === false ? result.inputLabs.filter(d => d.sample_type.stockSample === true)
                //     .filter(data1 =>
                //         data1.material._id === item.material._id &&
                //         data1.charge.length > 0 && item.charge.filter(i => i.date === data1.charge[0].date).length > 0
                //     ).map(i => i.sample_type.sampleType + " " + i.material.material + " " + i.material_category.name + " " + moment(i.charge[0].date).format(`${date_format} HH:mm:ss`)) : ''
                // ) : '',
                aT_validate: item.aT_validate.map(aT => aT.isValid + "," + aT.aType).join('\n'),
                stock_specValues: item.stock_specValues.map(val => val.histId + "," + val.value + "," + val.obj + "," + val.stock + "," + val.client + "," + val.aType + "," + val.isValid).join('\n'),
                stock_weights: item.stock_weights.map(w => w.weight + "," + w.stock).join('\n'),
                delivering_address_name1: item.delivery.name1,
                delivering_address_name2: item.delivery.name2,
                delivering_address_name3: item.delivery.name3,
                delivering_address_title: item.delivery.title,
                delivering_address_country: item.delivery.country,
                delivering_address_street: item.delivery.street,
                delivering_address_place: item.delivery.place,
                delivering_address_zip: item.delivery.zipcode,
                delivering_customer_product_code: item.delivery.productCode,
                delivering_email_address: item.delivery.email,
                delivering_fetch_date: moment(item.delivery.fetch_date).format(`${date_format} HH:mm:ss`),
                delivering_order_id: item.delivery.orderId,
                delivering_customer_order_id: item.delivery.customer_orderId,
                delivering_pos_id: item.delivery.posId,
                delivering_w_target: item.delivery.w_target,
                deliveryId: item.delivery._id
            }
        })
        dispatch(slice.actions.getLaboratories(result));
        dispatch(slice.actions.getExcelData(excellData));
    } catch (err) {
        console.log(err)
        toast.error('Error');
    }
}

export const deleteLaboratory = (id) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.delete(id);

        const date_format = store.getState().setting.settings.date_format;

        const excellData = result.map(data => {
            return {
                _id: data._id,
                due_date: moment(data.due_date).format(`${date_format} HH:mm:ss`),
                sample_type: data.sample_type.sampleType,
                material: data.material.material,
                material_category: data.material_category.name,
                client: data.client.name,
                packing_type: data.packing_type.length > 0 ? data.packing_type[0].packingType : '',
                a_types: data.a_types.map(aType => aType.analysisType).join('\n'),
                c_types: data.c_types.map(cType => cType.certificateType).join('\n'),
                sending_date: moment(data.sending_date).format(`${date_format} HH:mm:ss`),
                sample_date: moment(data.sample_date).format(`${date_format} HH:mm:ss`),
                distributor: data.distributor,
                geo_locaion: data.geo_locaion,
                remark: data.remark,
                weight: data.weight,
                weight_comment: data.weight_comment,
                material_left: data.material_left,
                lot_number: data.charge.map(ch => moment(ch.date).format(`${date_format} HH:mm:ss`) + ',' + ch.comment).join('\n'),
                // stock_sample: data.charge.length > 0 ? (data.sample_type.stockSample === false ? result.inputLabs.filter(d => d.sample_type.stockSample === true)
                //     .filter(data1 =>
                //         data1.material._id === data.material._id &&
                //         // data1.material_left > 0 && data1.charge.length > 0 &&
                //         data1.charge.length > 0 && data.charge.filter(i => i.date === data1.charge[0].date).length > 0
                //     ).map(i => i.sample_type.sampleType + " " + i.material.material + " " + i.material_category.name + " " + moment(i.charge[0].date).format(`${date_format} HH:mm:ss`)) : ''
                // ) : '',
                aT_validate: data.aT_validate.map(aT => aT.isValid + "," + aT.aType).join('\n'),
                stock_specValues: data.stock_specValues.map(val => val.histId + "," + val.value + "," + val.obj + "," + val.stock + "," + val.client + "," + val.aType + "," + val.isValid).join('\n'),
                stock_weights: data.stock_weights.map(w => w.weight + "," + w.stock).join('\n'),
                delivering_address_name1: data.delivery.name1,
                delivering_address_name2: data.delivery.name2,
                delivering_address_name3: data.delivery.name3,
                delivering_address_title: data.delivery.title,
                delivering_address_country: data.delivery.country,
                delivering_address_street: data.delivery.street,
                delivering_address_place: data.delivery.place,
                delivering_address_zip: data.delivery.zipcode,
                delivering_customer_product_code: data.delivery.productCode,
                delivering_email_address: data.delivery.email,
                delivering_fetch_date: moment(data.delivery.fetch_date).format(`${date_format} HH:mm:ss`),
                delivering_order_id: data.delivery.orderId,
                delivering_customer_order_id: data.delivery.customer_orderId,
                delivering_pos_id: data.delivery.posId,
                delivering_w_target: data.delivery.w_target,
                deliveryId: data.delivery._id
            }
        })
        dispatch(slice.actions.getLaboratories(result));
        dispatch(slice.actions.getExcelData(excellData));
        toast.success('Laboratory successfully deleted');
    } catch (err) {
        console.log(err);
    }
}

export const handleSaveWeight = (data) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.saveWeight(data);

        const allData = store.getState().laboratory.laboratories;
        toast.success('Weight data successfully saved')
        const updatedData = allData.map(d => d._id === result._id ? result : d);
        dispatch(slice.actions.getLaboratories(updatedData));
    } catch (err) {
        console.log(err)
    }
}

export const handleSaveCharge = data => async (dispatch) => {
    try {
        const result = await laboratoryAPI.saveChargeDate(data);

        toast.success('Lot number successfully saved')

        const allData = store.getState().laboratory.laboratories;
        const updatedData = allData.map(d => d._id === result._id ? result : d)
        dispatch(slice.actions.getLaboratories(updatedData));
    } catch (err) {
        console.log(err)
    }
}

export const saveAnalysisType = (data) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.saveAnalaysisType(data);
        dispatch(slice.actions.getLaboratories(result));
    } catch (err) {
        console.log(err);
    }
}

export const getCertificateTemplateList = () => async (dispatch) => {
    try {
        const result = await laboratoryAPI.getCertificateTemplates();
        dispatch(getCertificateTemplates(result.certTemplates));
        dispatch(getUnits(result.units));
        dispatch(getObjectives(result.objectives));
    } catch (err) {
        console.log(err);
    }
}

export const saveStockData = (data) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.saveStockData(data);
        dispatch(slice.actions.getLaboratories(result));
    } catch (err) {
        console.log(err);
    }
}

export const uploadFile = (data) => async (dispatch) => {
    try {
        const result = await laboratoryAPI.uploadFile(data);
        if (result) {
            toast.success("Upload success");
            getInputLaboratoryData();
        }
    } catch (err) {
        console.log(err);
    }
}