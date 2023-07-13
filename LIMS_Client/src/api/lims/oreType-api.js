import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class OreTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/api/ores', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.put('/api/ores', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.delete('/api/ores/' + id)
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/api/ores/upload_oreType_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getOreTypes() {
        try {
            const res = await axiosFetch.get('/api/ores');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const oreTypeAPI = new OreTypeAPI();