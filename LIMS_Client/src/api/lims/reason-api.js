import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class ReasonAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_reason', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_reason', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            const res = await axiosFetch.post('/delete_reason', { id: id })
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_reason_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getReasons() {
        try {
            const res = await axiosFetch.get('/get_all_reason');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const reasonAPI = new ReasonAPI();