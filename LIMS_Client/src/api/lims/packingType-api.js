import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class PackingTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_packingType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_packingType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_packingType', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error('Internal server error');
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_packingType_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getUsers() {
        try {
            const res = await axiosFetch.get('/get_all_packingTypes');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const packingTypeAPI = new PackingTypeAPI();