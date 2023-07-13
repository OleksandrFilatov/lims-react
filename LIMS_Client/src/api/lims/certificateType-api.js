import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class CertificateTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_certificateType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
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
            const res = await axiosFetch.post('/delete_certificateType', { id: id })
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_certificatetype_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error(err.response.data.message);
        }

    }

    async getCertificateTypes() {
        try {
            const res = await axiosFetch.get('/get_all_certificateTypes');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const certificateTypeAPI = new CertificateTypeAPI();