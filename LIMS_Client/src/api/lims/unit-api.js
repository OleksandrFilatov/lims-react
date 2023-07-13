import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class UnitAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_unit', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_unit', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_unit', { id: id })
            return res.data;
        } catch (err) {
            console.log(err.response.data)
            if (err.response.status === 400) {
                toast.error(err.response.data.message);
            }
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_unit_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getUnits() {
        try {
            const res = await axiosFetch.get('/get_all_units');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const unitAPI = new UnitAPI();