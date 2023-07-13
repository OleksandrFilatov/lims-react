import toast from "react-hot-toast";
import axiosFetch from "../../utils/axiosFetch";

class UserTypeAPI {
    async create(data) {
        try {
            const res = await axiosFetch.post('/create_userType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async update(data) {
        try {
            const res = await axiosFetch.post('/update_userType', data);
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Server internal error');
        }
    }

    async delete(id) {
        try {
            console.log(id);
            const res = await axiosFetch.post('/delete_userType', { id: id })
            return res.data;
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    async upload(data) {
        try {
            const res = await axiosFetch.post('/upload_usertype_csv', {
                data: data
            });
            return res.data;
        } catch (err) {
            console.log(err.response.data);
            toast.error('Internal server error');
        }

    }

    async getUserTypes() {
        try {
            const res = await axiosFetch.get('/get_all_userTypes');
            return res.data;
        } catch (err) {
            console.log(err.response.data)
        }
    }
}

export const userTypeAPI = new UserTypeAPI();