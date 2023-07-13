import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class CertificateTemplateAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/api/certificates', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_certificateType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.post('/del_certificate', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_certificate_template', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }

    }

    async getCertificateTemplates() {
        try {
            const res = await axiosFetch.get('/get_certificate');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async saveFreeText(data) {
        try {
            const res = await axiosFetch.post('/update_Freetext', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async saveProductData(data) {
        try {
            const res = await axiosFetch.post('/update_productdata', data);
            return res.data.certificate;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async saveTableColumns(data) {
        try {
            const res = await axiosFetch.post('/update_tabledata', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }

    async copyRow(id) {
        try {
            const res = await axiosFetch.post('/copy_productdata', { id });
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const certificateTemplateAPI = new CertificateTemplateAPI();