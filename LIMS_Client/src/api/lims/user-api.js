import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class UserAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_user', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_user', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_user', { id: id })
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_user_csv', {
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
            const res = await axiosFetch.get('/get_all_users');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const userAPI = new UserAPI();