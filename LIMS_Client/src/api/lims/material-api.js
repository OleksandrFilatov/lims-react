import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class MaterialAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_material', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_material', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.post('/delete_material', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            toast.error('Internal server error');
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_material_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getMaterials() {
        try {
            const res = await axiosFetch.get('/get_all_materials');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const materialAPI = new MaterialAPI();