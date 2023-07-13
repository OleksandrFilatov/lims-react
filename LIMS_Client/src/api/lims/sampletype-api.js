import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class SampleTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_sampleType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_sampleType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_sampleType', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_sampletype_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getSampleTypes() {
        try {
            const res = await axiosFetch.get('/get_all_sampleTypes');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const sampleTypeAPI = new SampleTypeAPI();